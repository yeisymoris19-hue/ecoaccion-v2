import React from 'react';
import { BeeLogo } from './BeeLogo';
import { 
  AlertTriangle, 
  Lightbulb, 
  Sprout, 
  Flag, 
  Users, 
  Briefcase, 
  PlusCircle, 
  Info,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

export type ActiveTab = 'ecoalerta' | 'ideas' | 'ecoayuda' | 'campanas' | 'comunidad' | 'negocio';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewReport: () => void;
  onOpenAbout: () => void;
  totalReportsCount: number;
  totalCampaignsCount: number;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewReport,
  onOpenAbout,
  totalReportsCount,
  totalCampaignsCount,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const navItems = [
    {
      id: 'ecoalerta' as ActiveTab,
      label: 'EcoAlerta',
      icon: AlertTriangle,
      badge: totalReportsCount > 0 ? `${totalReportsCount}` : undefined,
      description: 'Reportes y soluciones',
    },
    {
      id: 'ideas' as ActiveTab,
      label: 'Ideas y Propuestas',
      icon: Lightbulb,
      description: 'Iniciativas ciudadanas',
    },
    {
      id: 'ecoayuda' as ActiveTab,
      label: 'EcoAyuda',
      icon: Sprout,
      description: 'Reciclaje y medio ambiente',
    },
    {
      id: 'campanas' as ActiveTab,
      label: 'Campañas',
      icon: Flag,
      badge: totalCampaignsCount > 0 ? `${totalCampaignsCount} activas` : undefined,
      description: 'Acciones organizadas',
    },
    {
      id: 'comunidad' as ActiveTab,
      label: 'Comunidad',
      icon: Users,
      description: 'Red ciudadana y ONGs',
    },
    {
      id: 'negocio' as ActiveTab,
      label: 'Patrocinios',
      icon: Briefcase,
      description: 'Modelo de sostenibilidad',
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Upper Slogan & Country Ribbon */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-emerald-100">
              «Tu voz informa, nuestras acciones transforman.»
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-emerald-200">
            <span className="hidden md:inline">🇩🇴 República Dominicana</span>
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1 hover:text-white transition-colors underline cursor-pointer"
            >
              <Info size={13} />
              ¿Por qué la abeja? Misión & Filosofía
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button 
            onClick={() => handleSelectTab('ecoalerta')}
            className="flex items-center text-left focus:outline-none group cursor-pointer"
            id="brand-logo-btn"
          >
            <BeeLogo size={42} showText={true} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 shadow-xs border border-emerald-200/60'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-emerald-700' : 'text-slate-500'} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                      isActive ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* User Login/Profile status */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-950 transition-colors cursor-pointer"
                  id="user-profile-menu-btn"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-300"
                  />
                  <div className="hidden md:block text-left">
                    <div className="line-clamp-1 max-w-[110px] leading-tight">{currentUser.name}</div>
                    <div className="text-[10px] font-normal text-emerald-700">{currentUser.role}</div>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-100 text-xs">
                    <div className="p-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="mt-1 text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md inline-block">
                        📍 {currentUser.sector}, {currentUser.province}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium mt-1 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 text-xs font-bold transition-all cursor-pointer"
                id="btn-login-header"
              >
                <LogIn size={15} className="text-emerald-700" />
                <span className="hidden sm:inline">Iniciar Sesión /</span> Registrarse
              </button>
            )}

            <button
              onClick={onOpenNewReport}
              id="cta-report-header"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl shadow-xs shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Reportar en</span> EcoAlerta
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              id="mobile-menu-toggle-btn"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          {currentUser ? (
            <div className="p-3 mb-2 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-400"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-50"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="p-3 mb-2 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="text-xs text-slate-600">
                ¿Deseas participar activamente?
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
              >
                Ingresar con mi correo
              </button>
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-tab-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={18} className={isActive ? 'text-emerald-700' : 'text-slate-500'} />
                  <div className="text-left">
                    <div>{item.label}</div>
                    <div className="text-[11px] font-normal text-slate-500">{item.description}</div>
                  </div>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50/70 rounded-xl"
            >
              <Info size={15} />
              ¿Por qué la abeja? Misión, Visión y Valores
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
