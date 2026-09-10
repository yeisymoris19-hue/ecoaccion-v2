export type CategoryType = 
  | 'calles' 
  | 'alumbrado' 
  | 'servicios' 
  | 'drenaje' 
  | 'infraestructura' 
  | 'basura' 
  | 'contaminacion' 
  | 'animales' 
  | 'otro';

export type ReportStatus = 'reportado' | 'en_discusion' | 'con_propuesta' | 'en_campana' | 'resuelto';

export type ProvinceRD = 
  | 'Distrito Nacional'
  | 'Santo Domingo Este'
  | 'Santo Domingo Norte'
  | 'Santo Domingo Oeste'
  | 'Santiago de los Caballeros'
  | 'San Cristóbal'
  | 'La Vega'
  | 'Puerto Plata'
  | 'San Pedro de Macorís'
  | 'La Romana'
  | 'Samaná'
  | 'Barahona'
  | 'Duarte (San Fco. de Macorís)'
  | 'Espaillat (Moca)'
  | 'Otra provincia';

export interface Comment {
  id: string;
  authorId?: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  isSolution?: boolean;
}

export interface EcoReport {
  id: string;
  title: string;
  category: CategoryType;
  province: ProvinceRD;
  sector: string;
  addressDetails?: string;
  imageUrl?: string;
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  // The two core questions
  problemDescription: string;
  proposedSolution: string;
  status: ReportStatus;
  supportsCount: number;
  userSupported?: boolean;
  comments: Comment[];
  associatedCampaignId?: string;
}

export interface CommunityIdea {
  id: string;
  title: string;
  description: string;
  authorId?: string;
  proposedBy: string;
  avatar?: string;
  province: ProvinceRD;
  sector: string;
  category: 'reciclaje' | 'espacios_verdes' | 'limpieza' | 'educacion' | 'infraestructura' | 'animales';
  createdAt: string;
  votesCount: number;
  userVoted?: boolean;
  commentsCount: number;
  comments: Comment[];
  associatedCampaignId?: string;
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  category: 'limpieza_playa' | 'recuperacion_parque' | 'limpieza_rio' | 'reforestacion' | 'bacheo_comunitario' | 'reciclaje' | 'proteccion_animal';
  province: ProvinceRD;
  locationName: string;
  meetingPoint: string;
  date: string;
  time: string;
  objective: string;
  description: string;
  targetVolunteers: number;
  registeredVolunteers: number;
  isUserRegistered?: boolean;
  imageUrl: string;
  organizerId?: string;
  organizer: {
    name: string;
    type: 'comunidad' | 'ong' | 'junta_vecinos' | 'estudiante';
    verified: boolean;
    contact?: string;
  };
  collaboratingOrgs: string[];
  sponsors: {
    name: string;
    logo?: string;
    contribution: string; // e.g. "Bolsas biodegradables y refrigerios", "Herramientas de siembra"
  }[];
  originReportId?: string;
  status: 'activa' | 'en_progreso' | 'completada';
}

export interface RecyclingMaterial {
  id: string;
  name: string;
  iconName: string;
  color: string;
  badge: string;
  description: string;
  allowedItems: string[];
  notAllowedItems: string[];
  preparationTips: string[];
  rdContextNote: string;
}

export interface CleanPointRD {
  id: string;
  name: string;
  province: ProvinceRD;
  address: string;
  schedule: string;
  materialsAccepted: string[];
  managedBy: string;
  phone?: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  email?: string;
  role: 'Ambientalista' | 'Líder Comunitario' | 'Estudiante Voluntario' | 'Rescatista Animal' | 'Vecino Activo' | 'Organización Verificada';
  province: ProvinceRD;
  sector?: string;
  bio: string;
  avatar: string;
  verified?: boolean;
  campaignsJoined: number;
  reportsSubmitted: number;
  badges: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  province: ProvinceRD;
  sector: string;
  role: 'Vecino Activo' | 'Ambientalista' | 'Líder Comunitario' | 'Estudiante Voluntario' | 'Rescatista Animal' | 'Organización Verificada';
  avatar?: string;
  bio?: string;
  createdAt: string;
  reportsSubmitted: number;
  campaignsJoined: number;
  ideasProposed: number;
}

