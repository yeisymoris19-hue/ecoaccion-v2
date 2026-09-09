import React, { useState, useEffect } from 'react';
import { 
  INITIAL_REPORTS, 
  INITIAL_IDEAS, 
  INITIAL_CAMPAIGNS, 
  COMMUNITY_MEMBERS 
} from './data/initialData';
import { EcoReport, CommunityIdea, Campaign, CommunityMember, UserProfile } from './types';
import { Navbar, ActiveTab } from './components/Navbar';
import { EcoAlertaSection } from './components/EcoAlertaSection';
import { IdeasSection } from './components/IdeasSection';
import { EcoAyudaSection } from './components/EcoAyudaSection';
import { CampanasSection } from './components/CampanasSection';
import { ComunidadSection } from './components/ComunidadSection';
import { BusinessModelSection } from './components/BusinessModelSection';
import { NewReportModal } from './components/NewReportModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { NewCampaignModal } from './components/NewCampaignModal';
import { AboutPhilosophyModal } from './components/AboutPhilosophyModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { LegalModal, LegalModalType } from './components/LegalModals';
import { BeeLogo } from './components/BeeLogo';
import { 
  CheckCircle2, 
  Heart, 
  Flag, 
  AlertTriangle, 
  Sprout, 
  Sparkles,
  ArrowUp,
  X,
  LogIn
} from 'lucide-react';

// Purge legacy mock data or fake test items from browser's localStorage
if (typeof window !== 'undefined') {
  try {
    const legacyPurgeKey = 'ecoaccion_clean_zero_data_v2';
    if (!localStorage.getItem(legacyPurgeKey)) {
      const savedReports = localStorage.getItem('ecoaccion_reports');
      if (savedReports && (savedReports.includes('rep-1') || savedReports.includes('Marino') || savedReports.includes('Vertedero') || savedReports.includes('"supportsCount":38'))) {
        localStorage.removeItem('ecoaccion_reports');
      }
      const savedIdeas = localStorage.getItem('ecoaccion_ideas');
      if (savedIdeas && (savedIdeas.includes('idea-1') || savedIdeas.includes('idea-2') || savedIdeas.includes('"votesCount":24'))) {
        localStorage.removeItem('ecoaccion_ideas');
      }
      const savedCampaigns = localStorage.getItem('ecoaccion_campaigns');
      if (savedCampaigns && (savedCampaigns.includes('camp-1') || savedCampaigns.includes('camp-2') || savedCampaigns.includes('Montesinos'))) {
        localStorage.removeItem('ecoaccion_campaigns');
      }
      const savedMembers = localStorage.getItem('ecoaccion_members');
      if (savedMembers && (savedMembers.includes('mem-1') || savedMembers.includes('Marino'))) {
        localStorage.removeItem('ecoaccion_members');
      }
      localStorage.setItem(legacyPurgeKey, 'true');
    }
  } catch (e) {
    console.error('Storage purge check notice:', e);
  }
}

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ecoaccion_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dismissedGuestBanner, setDismissedGuestBanner] = useState(false);

  // Persistence via localStorage with clean start (empty array [])
  const [reports, setReports] = useState<EcoReport[]>(() => {
    try {
      const saved = localStorage.getItem('ecoaccion_reports');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // Clean out any legacy mock reports if they linger
      return parsed.filter((r) => 
        r && r.id && 
        !['rep-1', 'rep-2', 'rep-3', 'rep-4'].includes(r.id) &&
        !['Lic. Marino Peralta', 'María Altagracia Rosario', 'Ing. Ramón Castillo', 'Dra. Carmen Paulino'].includes(r.authorName)
      );
    } catch {
      return [];
    }
  });

  const [ideas, setIdeas] = useState<CommunityIdea[]>(() => {
    try {
      const saved = localStorage.getItem('ecoaccion_ideas');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((i) => i && i.id && !['idea-1', 'idea-2', 'idea-3', 'idea-4'].includes(i.id));
    } catch {
      return [];
    }
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem('ecoaccion_campaigns');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((c) => c && c.id && !['camp-1', 'camp-2', 'camp-3', 'camp-4'].includes(c.id));
    } catch {
      return [];
    }
  });

  const [members, setMembers] = useState<CommunityMember[]>(() => {
    try {
      const saved = localStorage.getItem('ecoaccion_members');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((m) => m && m.id && !['mem-1', 'mem-2', 'mem-3', 'mem-4', 'mem-5'].includes(m.id));
    } catch {
      return [];
    }
  });

  const [connectedMemberIds, setConnectedMemberIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ecoaccion_connections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('ecoalerta');
  const [selectedReport, setSelectedReport] = useState<EcoReport | null>(null);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [newCampaignPreset, setNewCampaignPreset] = useState<Partial<Campaign> | undefined>(undefined);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);
  const [campaignCategoryFilter, setCampaignCategoryFilter] = useState<string | undefined>(undefined);

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ecoaccion_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('ecoaccion_current_user');
      }
    } catch (err) {
      console.error('Error saving current user to storage', err);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('ecoaccion_reports', JSON.stringify(reports));
    } catch (err) {
      console.error('Error saving reports to storage', err);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('ecoaccion_ideas', JSON.stringify(ideas));
    } catch (err) {
      console.error('Error saving ideas to storage', err);
    }
  }, [ideas]);

  useEffect(() => {
    try {
      localStorage.setItem('ecoaccion_campaigns', JSON.stringify(campaigns));
    } catch (err) {
      console.error('Error saving campaigns to storage', err);
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem('ecoaccion_members', JSON.stringify(members));
    } catch (err) {
      console.error('Error saving members to storage', err);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem('ecoaccion_connections', JSON.stringify(connectedMemberIds));
    } catch (err) {
      console.error('Error saving connections to storage', err);
    }
  }, [connectedMemberIds]);

  // Handle User Login / Register
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`¡Bienvenido/a a EcoAcción, ${user.name}!`);

    // Add user as verified member of community directory if not already added
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === user.id || m.name.toLowerCase() === user.name.toLowerCase());
      if (exists) return prev;
      const newMember: CommunityMember = {
        id: user.id,
        name: user.name,
        role: user.role,
        province: user.province,
        bio: user.bio || `Ciudadano(a) comprometido(a) con la mejora y acción comunitaria en ${user.province}.`,
        verified: true,
        avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=059669`,
        badges: ['Ciudadano Registrado'],
        campaignsJoined: 0,
        reportsSubmitted: 0,
      };
      return [newMember, ...prev];
    });

    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => action(), 100);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Has cerrado sesión correctamente.');
  };

  // Protected Action Checker: opens auth modal if user is guest
  const requireAuth = (action: () => void, reason: string) => {
    if (!currentUser) {
      setAuthModalReason(reason);
      setPendingAction(() => action);
      setIsAuthModalOpen(true);
      return false;
    }
    action();
    return true;
  };

  // Handler: Open New Report with Auth Check
  const handleOpenNewReport = () => {
    requireAuth(
      () => setIsNewReportOpen(true),
      'Para registrar un reporte con fotografías y proponer tu solución ciudadana, por favor ingresa con tu correo.'
    );
  };

  // Handler: Toggle Support for a Report
  const handleToggleReportSupport = (reportId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const proceed = requireAuth(() => {
      setReports((prev) =>
        prev.map((r) => {
          if (r.id === reportId) {
            const isSupported = !r.userSupported;
            const nextCount = isSupported ? r.supportsCount + 1 : Math.max(0, r.supportsCount - 1);
            if (isSupported) {
              showToast('¡Has apoyado este reporte comunitario!');
            }
            return {
              ...r,
              userSupported: isSupported,
              supportsCount: nextCount,
            };
          }
          return r;
        })
      );

      // Keep selectedReport synchronized if open
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport((prev) =>
          prev
            ? {
                ...prev,
                userSupported: !prev.userSupported,
                supportsCount: !prev.userSupported ? prev.supportsCount + 1 : Math.max(0, prev.supportsCount - 1),
              }
            : null
        );
      }
    }, 'Para respaldar y apoyar reportes comunitarios, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Add Comment to Report
  const handleAddReportComment = (reportId: string, content: string, isSolution: boolean) => {
    const proceed = requireAuth(() => {
      const authorName = currentUser?.name || 'Vecino Dominicano';
      const authorRole = currentUser?.role || (isSolution ? 'Propuesta ciudadana' : 'Comunidad');

      const newComment = {
        id: `c-${Date.now()}`,
        authorName,
        authorRole,
        content,
        createdAt: 'Justo ahora',
        isSolution,
      };

      setReports((prev) =>
        prev.map((r) => {
          if (r.id === reportId) {
            const updatedComments = [...r.comments, newComment];
            const updatedStatus = isSolution && r.status === 'reportado' ? 'con_propuesta' : r.status;
            return {
              ...r,
              comments: updatedComments,
              status: updatedStatus,
            };
          }
          return r;
        })
      );

      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport((prev) =>
          prev
            ? {
                ...prev,
                comments: [...prev.comments, newComment],
                status: isSolution && prev.status === 'reportado' ? 'con_propuesta' : prev.status,
              }
            : null
        );
      }

      showToast('Aporte publicado correctamente.');
    }, 'Para aportar propuestas de solución o comentarios a este reporte, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Create New Report
  const handleCreateReport = (
    reportData: Omit<EcoReport, 'id' | 'createdAt' | 'supportsCount' | 'userSupported' | 'comments'>
  ) => {
    const authorName = currentUser ? currentUser.name : reportData.authorName;
    const authorAvatar = currentUser?.avatar || reportData.authorAvatar;

    const newReport: EcoReport = {
      ...reportData,
      authorName,
      authorAvatar,
      id: `rep-${Date.now()}`,
      createdAt: 'Hace un momento',
      supportsCount: 0,
      userSupported: false,
      comments: [],
    };

    setReports((prev) => [newReport, ...prev]);
    setActiveTab('ecoalerta');
    showToast('¡Reporte publicado en EcoAlerta con tu propuesta de solución!');

    if (currentUser) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === currentUser.id ? { ...m, reportsSubmitted: m.reportsSubmitted + 1 } : m
        )
      );
    }
  };

  // Handler: Vote for Idea
  const handleVoteIdea = (ideaId: string) => {
    const proceed = requireAuth(() => {
      setIdeas((prev) =>
        prev.map((idea) => {
          if (idea.id === ideaId) {
            const isVoted = !idea.userVoted;
            const nextVotes = isVoted ? idea.votesCount + 1 : Math.max(0, idea.votesCount - 1);
            if (isVoted) {
              showToast('¡Voto registrado para esta propuesta!');
            }
            return {
              ...idea,
              userVoted: isVoted,
              votesCount: nextVotes,
            };
          }
          return idea;
        })
      );
    }, 'Para votar por propuestas e iniciativas vecinales, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Add New Idea
  const handleAddIdea = (
    ideaData: Omit<CommunityIdea, 'id' | 'createdAt' | 'votesCount' | 'userVoted' | 'commentsCount' | 'comments'>
  ) => {
    const proceed = requireAuth(() => {
      const newIdea: CommunityIdea = {
        ...ideaData,
        id: `idea-${Date.now()}`,
        createdAt: 'Justo ahora',
        votesCount: 0,
        userVoted: false,
        commentsCount: 0,
        comments: [],
        proposedBy: currentUser?.name || ideaData.proposedBy,
      };

      setIdeas((prev) => [newIdea, ...prev]);
      showToast('¡Propuesta ciudadana compartida con éxito!');
    }, 'Para compartir una idea o propuesta comunitaria, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Add Comment to Idea
  const handleAddCommentToIdea = (ideaId: string, text: string) => {
    const proceed = requireAuth(() => {
      const newComment = {
        id: `ci-${Date.now()}`,
        authorName: currentUser?.name || 'Vecino Dominicano',
        content: text,
        createdAt: 'Hace un momento',
      };

      setIdeas((prev) =>
        prev.map((idea) => {
          if (idea.id === ideaId) {
            return {
              ...idea,
              commentsCount: idea.commentsCount + 1,
              comments: [...idea.comments, newComment],
            };
          }
          return idea;
        })
      );
      showToast('Aporte añadido a la propuesta.');
    }, 'Para comentar en esta propuesta, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Participate / Leave Campaign
  const handleToggleParticipateCampaign = (campaignId: string) => {
    const proceed = requireAuth(() => {
      setCampaigns((prev) =>
        prev.map((camp) => {
          if (camp.id === campaignId) {
            const isRegistered = !camp.isUserRegistered;
            const nextCount = isRegistered
              ? camp.registeredVolunteers + 1
              : Math.max(0, camp.registeredVolunteers - 1);

            showToast(
              isRegistered
                ? '¡Te has inscrito con éxito en la campaña! Gracias por tu compromiso.'
                : 'Has cancelado tu inscripción en la campaña.'
            );

            if (currentUser) {
              setMembers((mPrev) =>
                mPrev.map((m) =>
                  m.id === currentUser.id
                    ? {
                        ...m,
                        campaignsJoined: isRegistered
                          ? m.campaignsJoined + 1
                          : Math.max(0, m.campaignsJoined - 1),
                      }
                    : m
                )
              );
            }

            return {
              ...camp,
              isUserRegistered: isRegistered,
              registeredVolunteers: nextCount,
            };
          }
          return camp;
        })
      );
    }, 'Para inscribirte y participar en esta campaña comunitaria, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Open New Campaign
  const handleOpenNewCampaignModal = (preset?: Partial<Campaign>) => {
    requireAuth(() => {
      setNewCampaignPreset(preset);
      setIsNewCampaignOpen(true);
    }, 'Para convocar a una campaña ciudadana de impacto, ingresa con tu correo.');
  };

  // Handler: Create Campaign
  const handleCreateCampaign = (
    campaignData: Omit<Campaign, 'id' | 'registeredVolunteers' | 'isUserRegistered' | 'status'>
  ) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      registeredVolunteers: 0,
      isUserRegistered: false,
      status: 'activa',
    };

    setCampaigns((prev) => [newCamp, ...prev]);

    // If originated from a report, update the report status and associated campaign id
    if (campaignData.originReportId) {
      setReports((prev) =>
        prev.map((r) => {
          if (r.id === campaignData.originReportId) {
            return {
              ...r,
              status: 'en_campana',
              associatedCampaignId: newCamp.id,
            };
          }
          return r;
        })
      );
    }

    setActiveTab('campanas');
    showToast('¡Campaña comunitaria creada y abierta para voluntarios!');
  };

  // Convert Report to Campaign
  const handleConvertReportToCampaign = (report: EcoReport) => {
    requireAuth(() => {
      setSelectedReport(null);
      setNewCampaignPreset({
        title: `«Acción Comunitaria: ${report.title}»`,
        tagline: `Unidos para resolver: ${report.proposedSolution.slice(0, 70)}...`,
        province: report.province,
        locationName: `${report.sector}, ${report.province}`,
        meetingPoint: report.addressDetails || report.sector,
        objective: report.proposedSolution,
        description: `Esta campaña nace a partir de la alerta ciudadana en ${report.sector}.\nProblema identificado: ${report.problemDescription}\nSolución a ejecutar: ${report.proposedSolution}`,
        targetVolunteers: 25,
        originReportId: report.id,
        category: report.category === 'calles' 
          ? 'bacheo_comunitario' 
          : report.category === 'animales'
          ? 'proteccion_animal'
          : 'recuperacion_parque',
      });
      setIsNewCampaignOpen(true);
    }, 'Para convertir este reporte en una campaña de acción colectiva, ingresa con tu correo.');
  };

  // Convert Idea to Campaign
  const handleConvertIdeaToCampaign = (idea: CommunityIdea) => {
    requireAuth(() => {
      setNewCampaignPreset({
        title: `«${idea.title}»`,
        tagline: idea.description.slice(0, 80) + '...',
        province: idea.province,
        locationName: `${idea.sector}, ${idea.province}`,
        meetingPoint: idea.sector,
        objective: idea.description,
        description: `Iniciativa comunitaria propuesta por ${idea.proposedBy} en EcoAcción.\n${idea.description}`,
        targetVolunteers: 30,
        category: idea.category === 'reciclaje' ? 'reciclaje' : 'recuperacion_parque',
      });
      setIsNewCampaignOpen(true);
    }, 'Para transformar esta propuesta en una campaña comunitaria, ingresa con tu correo.');
  };

  // Handler: Connect with Community Member
  const handleConnectWithMember = (memberId: string) => {
    requireAuth(() => {
      setConnectedMemberIds((prev) => {
        const isAlready = prev.includes(memberId);
        if (isAlready) {
          showToast('Conexión retirada.');
          return prev.filter((id) => id !== memberId);
        } else {
          showToast('¡Conectado exitosamente en la red ciudadana!');
          return [...prev, memberId];
        }
      });
    }, 'Para conectar e interactuar con otros miembros dominicanos, ingresa con tu correo.');
  };

  const handleGoToCampaignsWithFilter = (catFilter?: string) => {
    setCampaignCategoryFilter(catFilter);
    setActiveTab('campanas');
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#1a2e26] flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNewReport={handleOpenNewReport}
        onOpenAbout={() => setIsAboutOpen(true)}
        totalReportsCount={reports.length}
        totalCampaignsCount={campaigns.filter((c) => c.status === 'activa').length}
        currentUser={currentUser}
        onOpenAuthModal={(reason) => {
          const sanitizedReason = typeof reason === 'string' && reason.trim() ? reason : undefined;
          setAuthModalReason(sanitizedReason);
          setPendingAction(null);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Exploratory Guest Banner: Non-intrusive reminder of free browsing vs participation */}
        {!currentUser && !dismissedGuestBanner && (
          <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-3 text-emerald-950">
              <div className="p-2 bg-emerald-100/80 text-emerald-800 rounded-xl shrink-0">
                <Sparkles size={16} className="text-emerald-700" />
              </div>
              <div>
                <span className="font-extrabold text-emerald-950">Navegación libre:</span>
                <span className="text-emerald-900 ml-1 leading-relaxed">
                  Puedes explorar libremente todas las secciones, reportes y guías de reciclaje. Para participar reportando con fotografías, votando o inscribiéndote en campañas, sólo ingresa con tu correo.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => {
                  setAuthModalReason('Ingresa con tu correo para participar activamente en EcoAcción');
                  setPendingAction(null);
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <LogIn size={13} />
                <span>Ingresar con mi correo</span>
              </button>
              <button
                onClick={() => setDismissedGuestBanner(true)}
                className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                title="Cerrar aviso"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ecoalerta' && (
          <EcoAlertaSection
            reports={reports}
            onOpenNewReport={handleOpenNewReport}
            onSelectReport={(r) => setSelectedReport(r)}
            onToggleSupport={handleToggleReportSupport}
            onViewCampaign={(campId) => {
              setActiveTab('campanas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasSection
            ideas={ideas}
            onVoteIdea={handleVoteIdea}
            onAddIdea={handleAddIdea}
            onAddCommentToIdea={handleAddCommentToIdea}
            onConvertIdeaToCampaign={handleConvertIdeaToCampaign}
            onViewCampaign={() => setActiveTab('campanas')}
          />
        )}

        {activeTab === 'ecoayuda' && (
          <EcoAyudaSection
            onGoToCampaigns={handleGoToCampaignsWithFilter}
            onOpenNewCampaignModal={(cat) => {
              handleOpenNewCampaignModal(cat ? { category: cat as any } : undefined);
            }}
          />
        )}

        {activeTab === 'campanas' && (
          <CampanasSection
            campaigns={campaigns}
            onToggleParticipate={handleToggleParticipateCampaign}
            onOpenNewCampaignModal={() => {
              handleOpenNewCampaignModal(undefined);
            }}
            filterCategory={campaignCategoryFilter}
            onViewReport={(rId) => {
              const rep = reports.find((r) => r.id === rId);
              if (rep) setSelectedReport(rep);
            }}
          />
        )}

        {activeTab === 'comunidad' && (
          <ComunidadSection
            members={members}
            onConnectWithMember={handleConnectWithMember}
            connectedMemberIds={connectedMemberIds}
          />
        )}

        {activeTab === 'negocio' && <BusinessModelSection />}
      </main>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold leading-tight">{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <NewReportModal
        isOpen={isNewReportOpen}
        onClose={() => setIsNewReportOpen(false)}
        onSubmit={handleCreateReport}
        currentUser={currentUser}
      />

      <ReportDetailModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onToggleSupport={handleToggleReportSupport}
        onAddComment={handleAddReportComment}
        onConvertToCampaign={handleConvertReportToCampaign}
        onViewCampaign={() => {
          setSelectedReport(null);
          setActiveTab('campanas');
        }}
      />

      <NewCampaignModal
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
        onSubmit={handleCreateCampaign}
        initialValues={newCampaignPreset}
      />

      <AboutPhilosophyModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        actionReason={authModalReason}
      />

      {/* Professional Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenPrivacy={() => setLegalModalType('privacy')}
      />

      {/* Legal Modals: Términos y Condiciones / Política de Privacidad */}
      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
