import { EcoReport, CommunityIdea, Campaign, CommunityMember, UserProfile, Comment } from '../types';

const TOKEN_KEY = 'ecoaccion_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error('Failed to access localStorage for token:', e);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Ocurrió un error en la solicitud.');
  }

  return data as T;
}

// Format ISO date to friendly human-readable Spanish relative time
export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'Reciente';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours === 1) return 'Hace 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return 'Reciente';
  }
}

export const api = {
  // Auth
  auth: {
    async register(data: {
      name: string;
      email: string;
      password: string;
      province: string;
      sector?: string;
      requestedRole?: string;
      bio?: string;
    }): Promise<{ user: UserProfile; token: string }> {
      const res = await request<{ user: UserProfile; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setStoredToken(res.token);
      return res;
    },

    async login(data: { email: string; password: string }): Promise<{ user: UserProfile; token: string }> {
      const res = await request<{ user: UserProfile; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setStoredToken(res.token);
      return res;
    },

    async getMe(): Promise<UserProfile | null> {
      const token = getStoredToken();
      if (!token) return null;
      try {
        const res = await request<{ user: UserProfile }>('/auth/me');
        return res.user;
      } catch {
        setStoredToken(null);
        return null;
      }
    },

    async logout(): Promise<void> {
      try {
        await request('/auth/logout', { method: 'POST' });
      } finally {
        setStoredToken(null);
      }
    }
  },

  // Reports (EcoAlertas)
  reports: {
    async getAll(): Promise<EcoReport[]> {
      return request<EcoReport[]>('/reports');
    },

    async create(data: {
      title: string;
      category: string;
      province: string;
      sector: string;
      addressDetails?: string;
      imageUrl?: string;
      problemDescription: string;
      proposedSolution: string;
    }): Promise<EcoReport> {
      return request<EcoReport>('/reports', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    async toggleSupport(reportId: string): Promise<{ supported: boolean; supportsCount: number }> {
      return request<{ supported: boolean; supportsCount: number }>(`/reports/${reportId}/support`, {
        method: 'POST'
      });
    },

    async addComment(reportId: string, content: string, isSolution: boolean): Promise<{ comments: Comment[]; status: string }> {
      return request<{ comments: Comment[]; status: string }>(`/reports/${reportId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, isSolution })
      });
    },

    async flag(reportId: string, reason: string, details?: string): Promise<{ message: string }> {
      return request<{ message: string }>(`/reports/${reportId}/flag`, {
        method: 'POST',
        body: JSON.stringify({ reason, details })
      });
    }
  },

  // Ideas & Proposals
  ideas: {
    async getAll(): Promise<CommunityIdea[]> {
      return request<CommunityIdea[]>('/ideas');
    },

    async create(data: {
      title: string;
      description: string;
      province: string;
      sector?: string;
      category: string;
    }): Promise<CommunityIdea> {
      return request<CommunityIdea>('/ideas', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    async toggleVote(ideaId: string): Promise<{ voted: boolean; votesCount: number }> {
      return request<{ voted: boolean; votesCount: number }>(`/ideas/${ideaId}/vote`, {
        method: 'POST'
      });
    },

    async addComment(ideaId: string, content: string): Promise<{ comments: Comment[]; commentsCount: number }> {
      return request<{ comments: Comment[]; commentsCount: number }>(`/ideas/${ideaId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
    }
  },

  // Campaigns
  campaigns: {
    async getAll(): Promise<Campaign[]> {
      return request<Campaign[]>('/campaigns');
    },

    async create(data: Partial<Campaign>): Promise<Campaign> {
      return request<Campaign>('/campaigns', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    async toggleParticipate(campaignId: string): Promise<{ isUserRegistered: boolean; registeredVolunteers: number }> {
      return request<{ isUserRegistered: boolean; registeredVolunteers: number }>(`/campaigns/${campaignId}/participate`, {
        method: 'POST'
      });
    }
  },

  // Members Directory & Connections
  members: {
    async getAll(): Promise<CommunityMember[]> {
      return request<CommunityMember[]>('/members');
    },

    async getConnections(): Promise<string[]> {
      const token = getStoredToken();
      if (!token) return [];
      try {
        return await request<string[]>('/members/connections');
      } catch {
        return [];
      }
    },

    async toggleConnect(targetUserId: string): Promise<{ connected: boolean; connections: string[] }> {
      return request<{ connected: boolean; connections: string[] }>('/members/connect', {
        method: 'POST',
        body: JSON.stringify({ targetUserId })
      });
    }
  },

  // File Upload (Direct to server public /uploads directory)
  upload: {
    async uploadPhoto(file: File): Promise<string> {
      // Validate file format
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Formato no válido. Solo se permiten imágenes JPG, PNG o WebP.');
      }

      // Max size: 4MB
      if (file.size > 4 * 1024 * 1024) {
        throw new Error('La imagen excede el límite de 4MB. Por favor selecciona una imagen más liviana.');
      }

      // Convert to Base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const res = await request<{ url: string }>('/upload', {
        method: 'POST',
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: file.type
        })
      });

      return res.url;
    }
  }
};
