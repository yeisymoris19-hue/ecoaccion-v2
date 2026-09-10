import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  province: string;
  sector: string;
  role: 'user' | 'moderator' | 'admin' | 'verified_org' | 'verified_company';
  isVerified: boolean; // Must NEVER be set to true automatically upon registration
  verificationType: 'none' | 'citizen' | 'org' | 'company';
  avatar?: string;
  bio?: string;
  createdAt: string; // ISO 8601
  reportsSubmitted: number;
  campaignsJoined: number;
  ideasProposed: number;
}

export interface SessionToken {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface CommentRecord {
  id: string;
  authorId: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string; // ISO 8601
  isSolution?: boolean;
}

export interface ReportRecord {
  id: string;
  title: string;
  category: string;
  province: string;
  sector: string;
  addressDetails?: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  problemDescription: string;
  proposedSolution: string;
  status: 'reportado' | 'en_discusion' | 'con_propuesta' | 'en_campana' | 'resuelto';
  createdAt: string; // ISO 8601
  associatedCampaignId?: string;
}

export interface IdeaRecord {
  id: string;
  title: string;
  description: string;
  authorId: string;
  proposedBy: string;
  avatar?: string;
  province: string;
  sector: string;
  category: string;
  createdAt: string; // ISO 8601
  associatedCampaignId?: string;
}

export interface CampaignRecord {
  id: string;
  title: string;
  tagline: string;
  category: string;
  province: string;
  locationName: string;
  meetingPoint: string;
  date: string;
  time: string;
  objective: string;
  description: string;
  targetVolunteers: number;
  imageUrl: string;
  organizerId: string;
  organizer: {
    name: string;
    type: 'comunidad' | 'ong' | 'junta_vecinos' | 'estudiante' | 'empresa';
    verified: boolean;
    contact?: string;
  };
  collaboratingOrgs: string[];
  sponsors: {
    name: string;
    logo?: string;
    contribution: string;
  }[];
  originReportId?: string;
  status: 'activa' | 'en_progreso' | 'completada';
  createdAt: string; // ISO 8601
}

export interface SupportRecord {
  reportId: string;
  userId: string;
  createdAt: string;
}

export interface IdeaVoteRecord {
  ideaId: string;
  userId: string;
  createdAt: string;
}

export interface CampaignParticipantRecord {
  campaignId: string;
  userId: string;
  registeredAt: string;
}

export interface ConnectionRecord {
  userId: string;
  targetUserId: string;
  createdAt: string;
}

export interface FlagRecord {
  id: string;
  targetType: 'report' | 'idea' | 'comment' | 'campaign';
  targetId: string;
  reportedByUserId: string;
  reason: string;
  details?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export interface DatabaseSchema {
  users: UserRecord[];
  tokens: SessionToken[];
  reports: ReportRecord[];
  reportSupports: SupportRecord[];
  reportComments: Record<string, CommentRecord[]>; // reportId -> CommentRecord[]
  ideas: IdeaRecord[];
  ideaVotes: IdeaVoteRecord[];
  ideaComments: Record<string, CommentRecord[]>; // ideaId -> CommentRecord[]
  campaigns: CampaignRecord[];
  campaignParticipants: CampaignParticipantRecord[];
  connections: ConnectionRecord[];
  flags: FlagRecord[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'ecoaccion_db.json');

const INITIAL_EMPTY_DB: DatabaseSchema = {
  users: [],
  tokens: [],
  reports: [],
  reportSupports: [],
  reportComments: {},
  ideas: [],
  ideaVotes: [],
  ideaComments: {},
  campaigns: [],
  campaignParticipants: [],
  connections: [],
  flags: []
};

class CentralDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: Array.isArray(parsed.users) ? parsed.users : [],
          tokens: Array.isArray(parsed.tokens) ? parsed.tokens : [],
          reports: Array.isArray(parsed.reports) ? parsed.reports : [],
          reportSupports: Array.isArray(parsed.reportSupports) ? parsed.reportSupports : [],
          reportComments: parsed.reportComments && typeof parsed.reportComments === 'object' ? parsed.reportComments : {},
          ideas: Array.isArray(parsed.ideas) ? parsed.ideas : [],
          ideaVotes: Array.isArray(parsed.ideaVotes) ? parsed.ideaVotes : [],
          ideaComments: parsed.ideaComments && typeof parsed.ideaComments === 'object' ? parsed.ideaComments : {},
          campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : [],
          campaignParticipants: Array.isArray(parsed.campaignParticipants) ? parsed.campaignParticipants : [],
          connections: Array.isArray(parsed.connections) ? parsed.connections : [],
          flags: Array.isArray(parsed.flags) ? parsed.flags : []
        };
      }
    } catch (e) {
      console.error('Failed to load database file, initializing clean state:', e);
    }

    this.saveDirect(INITIAL_EMPTY_DB);
    return JSON.parse(JSON.stringify(INITIAL_EMPTY_DB));
  }

  private saveDirect(data: DatabaseSchema): void {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  private persist(): void {
    this.saveDirect(this.data);
  }

  // --- USERS & AUTH ---
  findUserByEmail(email: string): UserRecord | undefined {
    const normalized = email.trim().toLowerCase();
    return this.data.users.find(u => u.email.toLowerCase() === normalized);
  }

  findUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  createUser(user: UserRecord): void {
    this.data.users.push(user);
    this.persist();
  }

  updateUserStats(userId: string, stats: Partial<{ reportsSubmitted: number; campaignsJoined: number; ideasProposed: number }>): void {
    const user = this.findUserById(userId);
    if (user) {
      if (typeof stats.reportsSubmitted === 'number') user.reportsSubmitted = stats.reportsSubmitted;
      if (typeof stats.campaignsJoined === 'number') user.campaignsJoined = stats.campaignsJoined;
      if (typeof stats.ideasProposed === 'number') user.ideasProposed = stats.ideasProposed;
      this.persist();
    }
  }

  getAllUsersPublic(): Array<Omit<UserRecord, 'passwordHash' | 'salt'>> {
    return this.data.users.map(({ passwordHash, salt, ...rest }) => rest);
  }

  // --- SESSIONS ---
  createToken(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    this.data.tokens.push({
      token,
      userId,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString()
    });
    this.persist();
    return token;
  }

  findUserByToken(token: string): UserRecord | undefined {
    const session = this.data.tokens.find(t => t.token === token);
    if (!session) return undefined;
    if (new Date(session.expiresAt) < new Date()) {
      // Expired token
      this.data.tokens = this.data.tokens.filter(t => t.token !== token);
      this.persist();
      return undefined;
    }
    return this.findUserById(session.userId);
  }

  removeToken(token: string): void {
    this.data.tokens = this.data.tokens.filter(t => t.token !== token);
    this.persist();
  }

  // --- REPORTS ---
  getAllReports(): ReportRecord[] {
    return [...this.data.reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findReportById(id: string): ReportRecord | undefined {
    return this.data.reports.find(r => r.id === id);
  }

  createReport(report: ReportRecord): void {
    this.data.reports.unshift(report);
    // Increment user's reportsSubmitted stat
    const author = this.findUserById(report.authorId);
    if (author) {
      author.reportsSubmitted = (author.reportsSubmitted || 0) + 1;
    }
    this.persist();
  }

  updateReportStatus(reportId: string, status: ReportRecord['status'], associatedCampaignId?: string): void {
    const report = this.findReportById(reportId);
    if (report) {
      report.status = status;
      if (associatedCampaignId) {
        report.associatedCampaignId = associatedCampaignId;
      }
      this.persist();
    }
  }

  // --- REPORT SUPPORTS ---
  getReportSupportsCount(reportId: string): number {
    return this.data.reportSupports.filter(s => s.reportId === reportId).length;
  }

  hasUserSupportedReport(reportId: string, userId: string): boolean {
    return this.data.reportSupports.some(s => s.reportId === reportId && s.userId === userId);
  }

  toggleReportSupport(reportId: string, userId: string): { supported: boolean; count: number } {
    const index = this.data.reportSupports.findIndex(s => s.reportId === reportId && s.userId === userId);
    let supported = false;
    if (index >= 0) {
      this.data.reportSupports.splice(index, 1);
      supported = false;
    } else {
      this.data.reportSupports.push({
        reportId,
        userId,
        createdAt: new Date().toISOString()
      });
      supported = true;
    }
    this.persist();
    const count = this.getReportSupportsCount(reportId);
    return { supported, count };
  }

  // --- REPORT COMMENTS ---
  getReportComments(reportId: string): CommentRecord[] {
    return this.data.reportComments[reportId] || [];
  }

  addReportComment(reportId: string, comment: CommentRecord): CommentRecord[] {
    if (!this.data.reportComments[reportId]) {
      this.data.reportComments[reportId] = [];
    }
    this.data.reportComments[reportId].push(comment);

    // If it's a solution and report is in 'reportado', advance status
    if (comment.isSolution) {
      const report = this.findReportById(reportId);
      if (report && report.status === 'reportado') {
        report.status = 'con_propuesta';
      }
    }
    this.persist();
    return this.data.reportComments[reportId];
  }

  // --- IDEAS ---
  getAllIdeas(): IdeaRecord[] {
    return [...this.data.ideas].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findIdeaById(id: string): IdeaRecord | undefined {
    return this.data.ideas.find(i => i.id === id);
  }

  createIdea(idea: IdeaRecord): void {
    this.data.ideas.unshift(idea);
    const author = this.findUserById(idea.authorId);
    if (author) {
      author.ideasProposed = (author.ideasProposed || 0) + 1;
    }
    this.persist();
  }

  getIdeaVotesCount(ideaId: string): number {
    return this.data.ideaVotes.filter(v => v.ideaId === ideaId).length;
  }

  hasUserVotedIdea(ideaId: string, userId: string): boolean {
    return this.data.ideaVotes.some(v => v.ideaId === ideaId && v.userId === userId);
  }

  toggleIdeaVote(ideaId: string, userId: string): { voted: boolean; count: number } {
    const index = this.data.ideaVotes.findIndex(v => v.ideaId === ideaId && v.userId === userId);
    let voted = false;
    if (index >= 0) {
      this.data.ideaVotes.splice(index, 1);
      voted = false;
    } else {
      this.data.ideaVotes.push({
        ideaId,
        userId,
        createdAt: new Date().toISOString()
      });
      voted = true;
    }
    this.persist();
    const count = this.getIdeaVotesCount(ideaId);
    return { voted, count };
  }

  getIdeaComments(ideaId: string): CommentRecord[] {
    return this.data.ideaComments[ideaId] || [];
  }

  addIdeaComment(ideaId: string, comment: CommentRecord): CommentRecord[] {
    if (!this.data.ideaComments[ideaId]) {
      this.data.ideaComments[ideaId] = [];
    }
    this.data.ideaComments[ideaId].push(comment);
    this.persist();
    return this.data.ideaComments[ideaId];
  }

  // --- CAMPAIGNS ---
  getAllCampaigns(): CampaignRecord[] {
    return [...this.data.campaigns].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findCampaignById(id: string): CampaignRecord | undefined {
    return this.data.campaigns.find(c => c.id === id);
  }

  createCampaign(campaign: CampaignRecord): void {
    this.data.campaigns.unshift(campaign);
    if (campaign.originReportId) {
      this.updateReportStatus(campaign.originReportId, 'en_campana', campaign.id);
    }
    this.persist();
  }

  getCampaignParticipantsCount(campaignId: string): number {
    return this.data.campaignParticipants.filter(p => p.campaignId === campaignId).length;
  }

  isUserParticipating(campaignId: string, userId: string): boolean {
    return this.data.campaignParticipants.some(p => p.campaignId === campaignId && p.userId === userId);
  }

  toggleCampaignParticipation(campaignId: string, userId: string): { participating: boolean; count: number } {
    const index = this.data.campaignParticipants.findIndex(p => p.campaignId === campaignId && p.userId === userId);
    let participating = false;
    const user = this.findUserById(userId);

    if (index >= 0) {
      this.data.campaignParticipants.splice(index, 1);
      participating = false;
      if (user) {
        user.campaignsJoined = Math.max(0, (user.campaignsJoined || 1) - 1);
      }
    } else {
      this.data.campaignParticipants.push({
        campaignId,
        userId,
        registeredAt: new Date().toISOString()
      });
      participating = true;
      if (user) {
        user.campaignsJoined = (user.campaignsJoined || 0) + 1;
      }
    }
    this.persist();
    const count = this.getCampaignParticipantsCount(campaignId);
    return { participating, count };
  }

  // --- CONNECTIONS ---
  getUserConnections(userId: string): string[] {
    return this.data.connections
      .filter(c => c.userId === userId)
      .map(c => c.targetUserId);
  }

  toggleConnection(userId: string, targetUserId: string): { connected: boolean; connections: string[] } {
    const index = this.data.connections.findIndex(c => c.userId === userId && c.targetUserId === targetUserId);
    let connected = false;
    if (index >= 0) {
      this.data.connections.splice(index, 1);
      connected = false;
    } else {
      this.data.connections.push({
        userId,
        targetUserId,
        createdAt: new Date().toISOString()
      });
      connected = true;
    }
    this.persist();
    return { connected, connections: this.getUserConnections(userId) };
  }

  // --- ABUSE & CONTENT REPORTING (FLAGS) ---
  createFlag(flag: Omit<FlagRecord, 'id' | 'createdAt' | 'status'>): FlagRecord {
    const record: FlagRecord = {
      ...flag,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    this.data.flags.push(record);
    this.persist();
    return record;
  }
}

export const db = new CentralDatabase();
