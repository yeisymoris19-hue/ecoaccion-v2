import React from 'react';
import { BeeLogo } from './BeeLogo';
import { ActiveTab } from './Navbar';
import { Sparkles, ShieldCheck, Heart, FileText, Lock } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAbout: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenAbout,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Slogan */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <BeeLogo size={32} />
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  ECO<span className="text-emerald-400">ACCIÓN</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    RD
                  </span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">
                  Plataforma Cívica y Ambiental Dominicana
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              <strong>EcoAcción RD</strong> es una iniciativa tecnológica de impacto social y ambiental creada para unir a los ciudadanos de la República Dominicana en la transformación constructiva de sus comunidades.
            </p>

            <div className="text-xs font-bold text-amber-400 italic flex items-center gap-1.5">
              <span>«Tu voz informa, nuestras acciones transforman.»</span>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs">
                <span className="text-emerald-400 font-bold">Autora y Creadora:</span>
                <span className="text-white font-semibold">Yeisy Jazmel Moris</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-200 uppercase tracking-wider text-[11px]">
              Módulos Ciudadanos
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('ecoalerta');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  EcoAlerta (Reportes de problemáticas)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('ideas');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Ideas y Propuestas Vecinales
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('ecoayuda');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  EcoAyuda (Guía y Puntos Limpios RD)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('campanas');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Campañas Comunitarias de Acción
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('comunidad');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Red y Directorio Ciudadano
                </button>
              </li>
            </ul>
          </div>

          {/* Legal and Philosophy */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-200 uppercase tracking-wider text-[11px]">
              Marco Institucional y Legal
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="inline-flex items-center gap-1.5 hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  <Sparkles size={13} className="text-amber-400" />
                  <span>El por qué de la Abeja (Misión y Valores)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  id="btn-footer-terms"
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer text-left font-medium text-slate-300"
                >
                  <FileText size={13} className="text-emerald-400" />
                  <span>Términos y Condiciones</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  id="btn-footer-privacy"
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer text-left font-medium text-slate-300"
                >
                  <Lock size={13} className="text-emerald-400" />
                  <span>Política de Privacidad</span>
                </button>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
              <span className="text-emerald-400 font-semibold block mb-0.5">Filosofía Central:</span>
              <p>Pasar de la queja a la propuesta, y de la propuesta a la acción colectiva.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Legal Notice */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="text-center md:text-left">
            <p className="font-semibold text-slate-300">
              © 2026 EcoAcción RD. Todos los derechos reservados. Desarrollado y creado por Yeisy Jazmel Moris.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Titularidad intelectual y tecnológica de Yeisy Jazmel Moris • República Dominicana
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <button
              type="button"
              id="btn-footer-terms-bottom"
              onClick={onOpenTerms}
              className="hover:text-emerald-400 transition-colors cursor-pointer underline underline-offset-2"
            >
              Términos y Condiciones
            </button>
            <span>•</span>
            <button
              type="button"
              id="btn-footer-privacy-bottom"
              onClick={onOpenPrivacy}
              className="hover:text-emerald-400 transition-colors cursor-pointer underline underline-offset-2"
            >
              Política de Privacidad
            </button>
            <span>•</span>
            <span className="text-slate-500 flex items-center gap-1">
              <span>🇩🇴 Hecho para la República Dominicana</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
