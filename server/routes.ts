import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { db, UserRecord } from './db';

export const apiRouter = Router();

// Ensure public uploads directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Custom request interface with authenticated user
export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

// Middleware: Authenticate user from Bearer token
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.substring(7).trim();
  if (!token) return next();

  const user = db.findUserByToken(token);
  if (user) {
    req.user = user;
  }
  next();
}

// Middleware: Require authentication
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Debes iniciar sesión para realizar esta acción comunitaria.' });
  }
  next();
}

// Helper: Hash password
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Helper: Sanitize public user profile
function toPublicUser(u: UserRecord) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    province: u.province,
    sector: u.sector,
    role: u.role,
    isVerified: u.isVerified,
    verificationType: u.verificationType,
    avatar: u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=059669`,
    bio: u.bio || `Ciudadano(a) comprometido(a) con la mejora y acción comunitaria en ${u.province}.`,
    createdAt: u.createdAt,
    reportsSubmitted: u.reportsSubmitted || 0,
    campaignsJoined: u.campaignsJoined || 0,
    ideasProposed: u.ideasProposed || 0
  };
}

// Apply authentication middleware across all API routes
apiRouter.use(authenticateToken);

// ==========================================
// 1. AUTHENTICATION & USERS
// ==========================================

// Register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, province, sector, requestedRole, bio } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Por favor ingresa un nombre válido.' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Por favor ingresa un correo electrónico válido.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    if (!province || typeof province !== 'string') {
      return res.status(400).json({ error: 'Por favor selecciona una provincia de República Dominicana.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con este correo electrónico.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const userId = crypto.randomUUID();

    // STRICT SCOPE: New registered users are NEVER automatically verified.
    // 'verified: true' defect is completely eradicated here.
    const isVerified = false;
    const verificationType: 'none' = 'none';
    const role: UserRecord['role'] = requestedRole && ['verified_org', 'verified_company', 'moderator'].includes(requestedRole)
      ? 'user' // Downgraded to standard user until verified manually by administrator
      : 'user';

    const newUser: UserRecord = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      salt,
      province: province.trim(),
      sector: (sector || 'Comunidad general').trim(),
      role,
      isVerified,
      verificationType,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=059669`,
      bio: bio && typeof bio === 'string' ? bio.trim() : `Ciudadano(a) comprometido(a) en ${province}.`,
      createdAt: new Date().toISOString(),
      reportsSubmitted: 0,
      campaignsJoined: 0,
      ideasProposed: 0
    };

    db.createUser(newUser);
    const token = db.createToken(userId);

    return res.status(201).json({
      user: toPublicUser(newUser),
      token,
      message: 'Cuenta creada exitosamente en EcoAcción.'
    });
  } catch (error) {
    console.error('Error in /auth/register:', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor al registrar el usuario.' });
  }
});

// Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Debes proporcionar correo electrónico y contraseña.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos. Verifica tus datos o crea una cuenta.' });
    }

    const checkHash = hashPassword(password, user.salt);
    if (!crypto.timingSafeEqual(Buffer.from(checkHash), Buffer.from(user.passwordHash))) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos. Verifica tus datos o crea una cuenta.' });
    }

    const token = db.createToken(user.id);
    return res.json({
      user: toPublicUser(user),
      token,
      message: `¡Bienvenido/a de nuevo, ${user.name}!`
    });
  } catch (error) {
    console.error('Error in /auth/login:', error);
    return res.status(500).json({ error: 'Error del servidor al iniciar sesión.' });
  }
});

// Current User Session Check
apiRouter.get('/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado o sesión expirada.' });
  }
  return res.json({ user: toPublicUser(req.user) });
});

// Logout
apiRouter.post('/auth/logout', (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    db.removeToken(token);
  }
  return res.json({ message: 'Sesión cerrada correctamente.' });
});

// ==========================================
// 2. REPORTS (ECOALERTAS)
// ==========================================

// Get all reports
apiRouter.get('/reports', (req: AuthenticatedRequest, res: Response) => {
  try {
    const reports = db.getAllReports();
    const userId = req.user?.id;

    const populated = reports.map(r => {
      const supportsCount = db.getReportSupportsCount(r.id);
      const userSupported = userId ? db.hasUserSupportedReport(r.id, userId) : false;
      const comments = db.getReportComments(r.id);

      return {
        ...r,
        supportsCount,
        userSupported,
        comments
      };
    });

    return res.json(populated);
  } catch (error) {
    console.error('Error in GET /reports:', error);
    return res.status(500).json({ error: 'Error al obtener los reportes comunitarios.' });
  }
});

// Create report (Requires Auth)
apiRouter.post('/reports', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { title, category, province, sector, addressDetails, imageUrl, problemDescription, proposedSolution } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return res.status(400).json({ error: 'El título del reporte debe tener al menos 5 caracteres.' });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Debes seleccionar una categoría comunitaria.' });
    }
    if (!province || typeof province !== 'string') {
      return res.status(400).json({ error: 'Debes indicar la provincia de República Dominicana.' });
    }
    if (!sector || typeof sector !== 'string') {
      return res.status(400).json({ error: 'Debes especificar el sector o barrio.' });
    }
    if (!problemDescription || typeof problemDescription !== 'string' || problemDescription.trim().length < 10) {
      return res.status(400).json({ error: 'La descripción del problema debe ser detallada (mínimo 10 caracteres).' });
    }
    if (!proposedSolution || typeof proposedSolution !== 'string' || proposedSolution.trim().length < 10) {
      return res.status(400).json({ error: 'La propuesta ciudadana de solución es obligatoria en EcoAcción (mínimo 10 caracteres).' });
    }

    const reportId = crypto.randomUUID();
    const newReport = {
      id: reportId,
      title: title.trim(),
      category: category.trim(),
      province: province.trim(),
      sector: sector.trim(),
      addressDetails: addressDetails && typeof addressDetails === 'string' ? addressDetails.trim() : undefined,
      imageUrl: imageUrl && typeof imageUrl === 'string' ? imageUrl.trim() : undefined,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      problemDescription: problemDescription.trim(),
      proposedSolution: proposedSolution.trim(),
      status: 'reportado' as const,
      createdAt: new Date().toISOString()
    };

    db.createReport(newReport);

    return res.status(201).json({
      ...newReport,
      supportsCount: 0,
      userSupported: false,
      comments: []
    });
  } catch (error) {
    console.error('Error in POST /reports:', error);
    return res.status(500).json({ error: 'Error al registrar el reporte comunitario.' });
  }
});

// Toggle report support (Requires Auth)
apiRouter.post('/reports/:id/support', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const reportId = req.params.id;
    const report = db.findReportById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Reporte no encontrado.' });
    }

    const { supported, count } = db.toggleReportSupport(reportId, req.user!.id);
    return res.json({ supported, supportsCount: count });
  } catch (error) {
    console.error('Error in POST /reports/:id/support:', error);
    return res.status(500).json({ error: 'Error al procesar el apoyo al reporte.' });
  }
});

// Add comment to report (Requires Auth)
apiRouter.post('/reports/:id/comments', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const reportId = req.params.id;
    const report = db.findReportById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Reporte no encontrado.' });
    }

    const { content, isSolution } = req.body;
    if (!content || typeof content !== 'string' || content.trim().length < 3) {
      return res.status(400).json({ error: 'El comentario debe contener al menos 3 caracteres.' });
    }

    const user = req.user!;
    const newComment = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role === 'user' ? (isSolution ? 'Propuesta ciudadana' : 'Vecino activo') : user.role,
      authorAvatar: user.avatar,
      content: content.trim(),
      isSolution: Boolean(isSolution),
      createdAt: new Date().toISOString()
    };

    const updatedComments = db.addReportComment(reportId, newComment);
    const updatedReport = db.findReportById(reportId);

    return res.status(201).json({
      comments: updatedComments,
      status: updatedReport?.status || report.status
    });
  } catch (error) {
    console.error('Error in POST /reports/:id/comments:', error);
    return res.status(500).json({ error: 'Error al publicar el comentario.' });
  }
});

// Flag/Report content for moderation (Requires Auth)
apiRouter.post('/reports/:id/flag', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const reportId = req.params.id;
    const { reason, details } = req.body;
    if (!reason || typeof reason !== 'string') {
      return res.status(400).json({ error: 'Debes seleccionar un motivo para la denuncia.' });
    }

    db.createFlag({
      targetType: 'report',
      targetId: reportId,
      reportedByUserId: req.user!.id,
      reason: reason.trim(),
      details: details && typeof details === 'string' ? details.trim() : undefined
    });

    return res.json({ message: 'Gracias. El reporte ha sido recibido por el equipo de moderación comunitaria.' });
  } catch (error) {
    console.error('Error in POST /reports/:id/flag:', error);
    return res.status(500).json({ error: 'Error al denunciar el contenido.' });
  }
});

// ==========================================
// 3. IDEAS Y PROPUESTAS
// ==========================================

// Get all ideas
apiRouter.get('/ideas', (req: AuthenticatedRequest, res: Response) => {
  try {
    const ideas = db.getAllIdeas();
    const userId = req.user?.id;

    const populated = ideas.map(idea => {
      const votesCount = db.getIdeaVotesCount(idea.id);
      const userVoted = userId ? db.hasUserVotedIdea(idea.id, userId) : false;
      const comments = db.getIdeaComments(idea.id);

      return {
        ...idea,
        votesCount,
        userVoted,
        commentsCount: comments.length,
        comments
      };
    });

    return res.json(populated);
  } catch (error) {
    console.error('Error in GET /ideas:', error);
    return res.status(500).json({ error: 'Error al obtener las propuestas ciudadanas.' });
  }
});

// Create idea (Requires Auth)
apiRouter.post('/ideas', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { title, description, province, sector, category } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return res.status(400).json({ error: 'El título de la propuesta debe tener al menos 5 caracteres.' });
    }
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({ error: 'La descripción de la propuesta debe ser clara (mínimo 10 caracteres).' });
    }
    if (!province || typeof province !== 'string') {
      return res.status(400).json({ error: 'Debes indicar la provincia.' });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Debes seleccionar una categoría para la idea.' });
    }

    const ideaId = crypto.randomUUID();
    const newIdea = {
      id: ideaId,
      title: title.trim(),
      description: description.trim(),
      authorId: user.id,
      proposedBy: user.name,
      avatar: user.avatar,
      province: province.trim(),
      sector: (sector || 'Comunidad').trim(),
      category: category.trim(),
      createdAt: new Date().toISOString()
    };

    db.createIdea(newIdea);

    return res.status(201).json({
      ...newIdea,
      votesCount: 0,
      userVoted: false,
      commentsCount: 0,
      comments: []
    });
  } catch (error) {
    console.error('Error in POST /ideas:', error);
    return res.status(500).json({ error: 'Error al compartir la propuesta.' });
  }
});

// Toggle vote on idea (Requires Auth)
apiRouter.post('/ideas/:id/vote', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const ideaId = req.params.id;
    const idea = db.findIdeaById(ideaId);
    if (!idea) {
      return res.status(404).json({ error: 'Propuesta no encontrada.' });
    }

    const { voted, count } = db.toggleIdeaVote(ideaId, req.user!.id);
    return res.json({ voted, votesCount: count });
  } catch (error) {
    console.error('Error in POST /ideas/:id/vote:', error);
    return res.status(500).json({ error: 'Error al procesar el voto.' });
  }
});

// Add comment to idea (Requires Auth)
apiRouter.post('/ideas/:id/comments', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const ideaId = req.params.id;
    const idea = db.findIdeaById(ideaId);
    if (!idea) {
      return res.status(404).json({ error: 'Propuesta no encontrada.' });
    }

    const { content } = req.body;
    if (!content || typeof content !== 'string' || content.trim().length < 3) {
      return res.status(400).json({ error: 'El comentario debe contener al menos 3 caracteres.' });
    }

    const user = req.user!;
    const newComment = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedComments = db.addIdeaComment(ideaId, newComment);
    return res.status(201).json({
      comments: updatedComments,
      commentsCount: updatedComments.length
    });
  } catch (error) {
    console.error('Error in POST /ideas/:id/comments:', error);
    return res.status(500).json({ error: 'Error al agregar el comentario a la propuesta.' });
  }
});

// ==========================================
// 4. CAMPAIGNS (CAMPANAS COMUNITARIAS)
// ==========================================

// Get all campaigns
apiRouter.get('/campaigns', (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaigns = db.getAllCampaigns();
    const userId = req.user?.id;

    const populated = campaigns.map(c => {
      const registeredVolunteers = db.getCampaignParticipantsCount(c.id);
      const isUserRegistered = userId ? db.isUserParticipating(c.id, userId) : false;

      return {
        ...c,
        registeredVolunteers,
        isUserRegistered
      };
    });

    return res.json(populated);
  } catch (error) {
    console.error('Error in GET /campaigns:', error);
    return res.status(500).json({ error: 'Error al obtener las campañas comunitarias.' });
  }
});

// Create campaign (Requires Auth)
apiRouter.post('/campaigns', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      title, tagline, category, province, locationName, meetingPoint,
      date, time, objective, description, targetVolunteers, imageUrl,
      collaboratingOrgs, sponsors, originReportId
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return res.status(400).json({ error: 'El título de la campaña debe tener al menos 5 caracteres.' });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Selecciona una categoría para la campaña.' });
    }
    if (!province || typeof province !== 'string') {
      return res.status(400).json({ error: 'Indica la provincia de la jornada.' });
    }
    if (!meetingPoint || typeof meetingPoint !== 'string') {
      return res.status(400).json({ error: 'Especifica el punto de encuentro exacto.' });
    }
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Indica la fecha de la campaña.' });
    }
    if (!time || typeof time !== 'string') {
      return res.status(400).json({ error: 'Indica la hora de encuentro.' });
    }

    const campaignId = crypto.randomUUID();
    const newCampaign = {
      id: campaignId,
      title: title.trim(),
      tagline: (tagline || '').trim(),
      category: category.trim(),
      province: province.trim(),
      locationName: (locationName || meetingPoint).trim(),
      meetingPoint: meetingPoint.trim(),
      date: date.trim(),
      time: time.trim(),
      objective: (objective || '').trim(),
      description: (description || objective || '').trim(),
      targetVolunteers: Number(targetVolunteers) || 20,
      imageUrl: imageUrl && typeof imageUrl === 'string' ? imageUrl.trim() : 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
      organizerId: user.id,
      organizer: {
        name: user.name,
        type: (user.role === 'verified_org' ? 'ong' : 'comunidad') as any,
        verified: Boolean(user.isVerified),
        contact: user.email
      },
      collaboratingOrgs: Array.isArray(collaboratingOrgs) ? collaboratingOrgs : [],
      sponsors: Array.isArray(sponsors) ? sponsors : [],
      originReportId: originReportId && typeof originReportId === 'string' ? originReportId.trim() : undefined,
      status: 'activa' as const,
      createdAt: new Date().toISOString()
    };

    db.createCampaign(newCampaign);

    return res.status(201).json({
      ...newCampaign,
      registeredVolunteers: 0,
      isUserRegistered: false
    });
  } catch (error) {
    console.error('Error in POST /campaigns:', error);
    return res.status(500).json({ error: 'Error al registrar la campaña comunitaria.' });
  }
});

// Toggle participation in campaign (Requires Auth)
apiRouter.post('/campaigns/:id/participate', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaignId = req.params.id;
    const campaign = db.findCampaignById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaña no encontrada.' });
    }

    const { participating, count } = db.toggleCampaignParticipation(campaignId, req.user!.id);
    return res.json({ isUserRegistered: participating, registeredVolunteers: count });
  } catch (error) {
    console.error('Error in POST /campaigns/:id/participate:', error);
    return res.status(500).json({ error: 'Error al actualizar tu participación en la campaña.' });
  }
});

// ==========================================
// 5. COMMUNITY DIRECTORY & CONNECTIONS
// ==========================================

// Get real registered members directory (Public info only)
apiRouter.get('/members', (req: Request, res: Response) => {
  try {
    const publicUsers = db.getAllUsersPublic();
    const members = publicUsers.map(u => ({
      id: u.id,
      name: u.name,
      role: u.role === 'admin' ? 'Líder Comunitario' : u.role === 'moderator' ? 'Líder Comunitario' : 'Vecino Activo',
      province: u.province,
      sector: u.sector,
      bio: u.bio || `Ciudadano(a) activo(a) en ${u.province}`,
      avatar: u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=059669`,
      verified: Boolean(u.isVerified),
      campaignsJoined: u.campaignsJoined || 0,
      reportsSubmitted: u.reportsSubmitted || 0,
      badges: u.isVerified ? ['Miembro Verificado'] : ['Ciudadano Registrado']
    }));

    return res.json(members);
  } catch (error) {
    console.error('Error in GET /members:', error);
    return res.status(500).json({ error: 'Error al cargar el directorio de miembros.' });
  }
});

// Get user connections
apiRouter.get('/members/connections', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const connections = db.getUserConnections(req.user!.id);
    return res.json(connections);
  } catch (error) {
    console.error('Error in GET /members/connections:', error);
    return res.status(500).json({ error: 'Error al obtener conexiones del usuario.' });
  }
});

// Toggle connect with member (Requires Auth)
apiRouter.post('/members/connect', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId || typeof targetUserId !== 'string') {
      return res.status(400).json({ error: 'ID de miembro no válido.' });
    }
    if (targetUserId === req.user!.id) {
      return res.status(400).json({ error: 'No puedes conectarte contigo mismo.' });
    }

    const { connected, connections } = db.toggleConnection(req.user!.id, targetUserId);
    return res.json({ connected, connections });
  } catch (error) {
    console.error('Error in POST /members/connect:', error);
    return res.status(500).json({ error: 'Error al gestionar la conexión con el miembro.' });
  }
});

// ==========================================
// 6. PHOTO STORAGE & UPLOAD
// ==========================================

// Upload report photo (Requires Auth)
apiRouter.post('/upload', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'No se envió ninguna imagen.' });
    }

    // Supported image types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    let cleanMime = mimeType;
    let base64Data = imageBase64;

    // Check if it's a data URL (e.g. data:image/jpeg;base64,...)
    if (imageBase64.startsWith('data:')) {
      const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        cleanMime = matches[1].toLowerCase();
        base64Data = matches[2];
      }
    }

    if (!cleanMime || !allowedMimeTypes.includes(cleanMime)) {
      return res.status(400).json({ error: 'Formato de imagen no permitido. Solo se aceptan JPEG, PNG y WebP.' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    // Max file size: 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'La fotografía no debe superar 5MB de tamaño.' });
    }

    const extension = cleanMime === 'image/png' ? 'png' : cleanMime === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return res.status(201).json({ url: publicUrl });
  } catch (error) {
    console.error('Error in POST /upload:', error);
    return res.status(500).json({ error: 'Error al guardar la fotografía en el servidor.' });
  }
});
