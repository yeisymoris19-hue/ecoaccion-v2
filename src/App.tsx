import React, { useState, useEffect, useCallback } from 'react';
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
import { api } from './services/api';
import { 
  CheckCircle2, 
  Sparkles,
  X,
  LogIn
} from 'lucide-react';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dismissedGuestBanner, setDismissedGuestBanner] = useState(false);

  // Central Database collections - Starts empty as specified by user instructions
  const [reports, setReports] = useState<EcoReport[]>([]);
  const [ideas, setIdeas] = useState<CommunityIdea[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [connectedMemberIds, setConnectedMemberIds] = useState<string[]>([]);

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

  // Fetch all central database collections
  const loadDatabaseData = useCallback(async () => {
    try {
      const [allReports, allIdeas, allCampaigns, allMembers] = await Promise.allSettled([
        api.reports.getAll(),
        api.ideas.getAll(),
        api.campaigns.getAll(),
        api.members.getAll()
      ]);

      if (allReports.status === 'fulfilled') setReports(allReports.value);
      if (allIdeas.status === 'fulfilled') setIdeas(allIdeas.value);
      if (allCampaigns.status === 'fulfilled') setCampaigns(allCampaigns.value);
      if (allMembers.status === 'fulfilled') setMembers(allMembers.value);
    } catch (err) {
      console.error('Error loading database data:', err);
    }
  }, []);

  // Initial user session restoration & database load
  useEffect(() => {
    async function initApp() {
      try {
        const user = await api.auth.getMe();
        if (user) {
          setCurrentUser(user);
          const connections = await api.members.getConnections();
          setConnectedMemberIds(connections);
        }
      } catch (err) {
        console.error('Session verify error:', err);
      }
      await loadDatabaseData();
    }

    initApp();
  }, [loadDatabaseData]);

  // Handle User Login / Register
  const handleLogin = async (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`¡Bienvenido/a a EcoAcción, ${user.name}!`);

    // Reload data with user-specific flags (userSupported, userVoted, isUserRegistered)
    await loadDatabaseData();
    const connections = await api.members.getConnections();
    setConnectedMemberIds(connections);

    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => action(), 100);
    }
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setCurrentUser(null);
    setConnectedMemberIds([]);
    showToast('Has cerrado sesión correctamente.');
    await loadDatabaseData();
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

  // Handler: Toggle Support for a Report (Stored in central database)
  const handleToggleReportSupport = (reportId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const proceed = requireAuth(async () => {
      try {
        const result = await api.reports.toggleSupport(reportId);
        
        setReports((prev) =>
          prev.map((r) => {
            if (r.id === reportId) {
              return {
                ...r,
                userSupported: result.supported,
                supportsCount: result.supportsCount,
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
                  userSupported: result.supported,
                  supportsCount: result.supportsCount,
                }
              : null
          );
        }

        showToast(result.supported ? '¡Has apoyado este reporte comunitario!' : 'Has retirado tu apoyo.');
      } catch (err: any) {
        showToast(err.message || 'Error al procesar el apoyo.');
      }
    }, 'Para respaldar y apoyar reportes comunitarios, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Add Comment to Report (Central database)
  const handleAddReportComment = (reportId: string, content: string, isSolution: boolean) => {
    const proceed = requireAuth(async () => {
      try {
        const result = await api.reports.addComment(reportId, content, isSolution);

        setReports((prev) =>
          prev.map((r) => {
            if (r.id === reportId) {
              return {
                ...r,
                comments: result.comments,
                status: (result.status as any) || r.status,
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
                  comments: result.comments,
                  status: (result.status as any) || prev.status,
                }
              : null
          );
        }

        showToast('Aporte publicado correctamente en el servidor.');
      } catch (err: any) {
        showToast(err.message || 'Error al enviar el comentario.');
      }
    }, 'Para aportar propuestas de solución o comentarios a este reporte, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Flag / Report content for moderation
  const handleFlagReport = (reportId: string) => {
    const proceed = requireAuth(async () => {
      try {
        await api.reports.flag(reportId, 'Contenido inapropiado o reportado');
        showToast('Gracias. El reporte ha sido enviado al equipo de moderación.');
      } catch (err: any) {
        showToast(err.message || 'Error al enviar la denuncia.');
      }
    }, 'Para reportar contenido a moderación, ingresa con tu cuenta.');

    if (!proceed) return;
  };

  // Handler: Create New Report in Central Database
  const handleCreateReport = async (
    reportData: Omit<EcoReport, 'id' | 'createdAt' | 'supportsCount' | 'userSupported' | 'comments'>
  ) => {
    try {
      const created = await api.reports.create({
        title: reportData.title,
        category: reportData.category,
        province: reportData.province,
        sector: reportData.sector,
        addressDetails: reportData.addressDetails,
        imageUrl: reportData.imageUrl,
        problemDescription: reportData.problemDescription,
        proposedSolution: reportData.proposedSolution,
      });

      setReports((prev) => [created, ...prev]);
      setActiveTab('ecoalerta');
      showToast('¡Reporte registrado en la base de datos comunitaria!');
      await loadDatabaseData();
    } catch (err: any) {
      showToast(err.message || 'Error al publicar el reporte.');
    }
  };

  // Handler: Vote for Idea in Central Database
  const handleVoteIdea = (ideaId: string) => {
    const proceed = requireAuth(async () => {
      try {
        const result = await api.ideas.toggleVote(ideaId);

        setIdeas((prev) =>
          prev.map((idea) => {
            if (idea.id === ideaId) {
              return {
                ...idea,
                userVoted: result.voted,
                votesCount: result.votesCount,
              };
            }
            return idea;
          })
        );

        showToast(result.voted ? '¡Voto registrado para esta propuesta!' : 'Has retirado tu voto.');
      } catch (err: any) {
        showToast(err.message || 'Error al procesar el voto.');
      }
    }, 'Para votar por propuestas e iniciativas vecinales, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Add New Idea in Central Database
  const handleAddIdea = (
    ideaData: Omit<CommunityIdea, 'id' | 'createdAt' | 'votesCount' | 'userVoted' | 'commentsCount' | 'comments'>
  ) => {
    const proceed = requireAuth(async () => {
      try {
        const created = await api.ideas.create({
          title: ideaData.title,
          description: ideaData.description,
          province: ideaData.province,
          sector: ideaData.sector,
          category: ideaData.category,
        });

        setIdeas((prev) => [created, ...prev]);
        showToast('¡Propuesta ciudadana guardada en la base de datos!');
        await loadDatabaseData();
      } catch (err: any) {
        showToast(err.message || 'Error al compartir la propuesta.');
      }
    }, 'Para compartir una idea o propuesta comunitaria, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Add Comment to Idea in Central Database
  const handleAddCommentToIdea = (ideaId: string, text: string) => {
    const proceed = requireAuth(async () => {
      try {
        const result = await api.ideas.addComment(ideaId, text);

        setIdeas((prev) =>
          prev.map((idea) => {
            if (idea.id === ideaId) {
              return {
                ...idea,
                commentsCount: result.commentsCount,
                comments: result.comments,
              };
            }
            return idea;
          })
        );
        showToast('Aporte añadido a la propuesta.');
      } catch (err: any) {
        showToast(err.message || 'Error al publicar comentario.');
      }
    }, 'Para comentar en esta propuesta, ingresa con tu correo.');

    if (!proceed) return;
  };

  // Handler: Participate / Leave Campaign in Central Database
  const handleToggleParticipateCampaign = (campaignId: string) => {
    const proceed = requireAuth(async () => {
      try {
        const result = await api.campaigns.toggleParticipate(campaignId);

        setCampaigns((prev) =>
          prev.map((camp) => {
            if (camp.id === campaignId) {
              return {
                ...camp,
                isUserRegistered: result.isUserRegistered,
                registeredVolunteers: result.registeredVolunteers,
              };
            }
            return camp;
          })
        );

        showToast(
          result.isUserRegistered
            ? '¡Te has inscrito con éxito en la campaña! Gracias por tu compromiso.'
            : 'Has cancelado tu inscripción en la campaña.'
        );

        await loadDatabaseData();
      } catch (err: any) {
        showToast(err.message || 'Error al procesar la inscripción.');
      }
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

  // Handler: Create Campaign in Central Database
  const handleCreateCampaign = async (
    campaignData: Omit<Campaign, 'id' | 'registeredVolunteers' | 'isUserRegistered' | 'status'>
  ) => {
    try {
      const created = await api.campaigns.create(campaignData);
      setCampaigns((prev) => [created, ...prev]);

      // If originated from a report, update the report status and associated campaign id
      if (campaignData.originReportId) {
        setReports((prev) =>
          prev.map((r) => {
            if (r.id === campaignData.originReportId) {
              return {
                ...r,
                status: 'en_campana',
                associatedCampaignId: created.id,
              };
            }
            return r;
          })
        );
      }

      setActiveTab('campanas');
      showToast('¡Campaña comunitaria creada en el servidor y abierta para voluntarios!');
      await loadDatabaseData();
    } catch (err: any) {
      showToast(err.message || 'Error al crear la campaña comunitaria.');
    }
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

  // Handler: Connect with Community Member in Central Database
  const handleConnectWithMember = (memberId: string) => {
    requireAuth(async () => {
      try {
        const result = await api.members.toggleConnect(memberId);
        setConnectedMemberIds(result.connections);
        showToast(result.connected ? '¡Conectado exitosamente en la red ciudadana!' : 'Conexión retirada.');
      } catch (err: any) {
        showToast(err.message || 'Error al conectar con el miembro.');
      }
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
        onFlagReport={handleFlagReport}
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
