import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Heart, Sparkles, Quote } from 'lucide-react';
import { BeeLogo } from './BeeLogo';

interface AboutPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutPhilosophyModal: React.FC<AboutPhilosophyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 rounded-t-3xl overflow-hidden">
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
            <BeeLogo size={200} />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            id="close-about-modal-btn"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <BeeLogo size={48} />
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">
                Emprendimiento Socioambiental Dominicano
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                EcoAcción Dominicana
              </h2>
            </div>
          </div>
          <p className="text-emerald-100 text-base sm:text-lg font-medium italic">
            «Tu voz informa, nuestras acciones transforman.»
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 text-slate-700">
          {/* El por qué de la Abeja */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-2 text-amber-900">
              <Sparkles className="text-amber-600" size={22} />
              <h3 className="text-lg font-bold">¿Por qué elegimos la abeja en nuestro logo?</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              La abeja simboliza el <strong>trabajo en equipo</strong>. Al igual que las abejas trabajan juntas en la colmena para construir, proteger y cuidar su entorno, EcoAcción busca unir a los ciudadanos dominicanos para comunicar los problemas de sus comunidades y tomar acciones colectivas.
            </p>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base mt-2.5">
              Además, la abeja mantiene una estrecha relación vital con la naturaleza y el equilibrio ambiental a través de la polinización, lo que también representa el compromiso firme de nuestra plataforma con el <strong>reciclaje</strong> y la protección de los recursos naturales de la República Dominicana.
            </p>
          </div>

          {/* Carta de la Creadora */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-emerald-700/60">
            <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 text-emerald-600/15 pointer-events-none">
              <Quote size={130} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-3">
                <Quote size={16} className="text-amber-400" />
                <span>Carta de la Creadora</span>
              </div>

              <blockquote className="text-base sm:text-lg font-medium text-emerald-50 leading-relaxed italic mb-6">
                «Aislar los problemas no sirve de nada si no nos unimos para resolverlos. Diseñé esta app para darle una herramienta a cada ciudadano que quiera convertir nuestro en algo mejor. Pasemos de la queja a la propuesta y de la propuesta a la acción.»
              </blockquote>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-emerald-700/70">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-200 p-0.5 shadow-md">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-300 font-black text-sm">
                      YM
                    </div>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-base leading-tight">
                      Yeisy Jazmel Moris
                    </h5>
                    <p className="text-xs text-emerald-300 font-medium">
                      Creadora, Diseñadora y Fundadora de EcoAcción RD
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/70 text-xs font-semibold text-emerald-200">
                  <span>🇩🇴</span>
                  <span>República Dominicana</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nuestra Filosofía y el Flujo */}
          <div>
            <div className="flex items-center gap-2 text-emerald-900 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="text-lg font-bold">Nuestra Filosofía: De la queja a la acción</h3>
            </div>
            <p className="text-slate-600 text-sm sm:text-base mb-4">
              Tenemos una premisa muy clara: <strong>pasar de la queja a la propuesta, y de la propuesta a la acción</strong>. No nos quedamos en señalar lo que está mal; cada reporte ciudadano en EcoAcción responde a dos preguntas fundamentales:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pregunta 1</span>
                <p className="font-bold text-slate-900 text-base mt-0.5">¿Cuál es el problema?</p>
                <p className="text-xs text-slate-500 mt-1">Identificar con precisión la necesidad comunitaria o ambiental.</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Pregunta 2</span>
                <p className="font-bold text-emerald-950 text-base mt-0.5">¿Qué solución propones?</p>
                <p className="text-xs text-emerald-700/80 mt-1">Transformar la inquietud en una propuesta constructiva y colaborativa.</p>
              </div>
            </div>

            {/* Diagram Flow */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block mb-2">
                El proceso transformador de EcoAcción:
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
                <span className="bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-200">
                  Problema
                </span>
                <ArrowRight size={14} className="text-emerald-400 shrink-0" />
                <span className="bg-amber-950/80 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 rounded-lg">
                  EcoAlerta
                </span>
                <ArrowRight size={14} className="text-emerald-400 shrink-0" />
                <span className="bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-200">
                  Comunidad
                </span>
                <ArrowRight size={14} className="text-emerald-400 shrink-0" />
                <span className="bg-teal-950/80 border border-teal-500/40 text-teal-300 px-2.5 py-1.5 rounded-lg">
                  Solución
                </span>
                <ArrowRight size={14} className="text-emerald-400 shrink-0" />
                <span className="bg-emerald-900 border border-emerald-400 text-emerald-200 px-2.5 py-1.5 rounded-lg">
                  Campaña
                </span>
                <ArrowRight size={14} className="text-emerald-400 shrink-0" />
                <span className="bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg font-bold shadow-sm">
                  ¡Acción!
                </span>
              </div>
            </div>
          </div>

          {/* Misión, Visión y Valores */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
              <h4 className="text-sm font-extrabold text-emerald-900 uppercase tracking-wider mb-1.5">
                Misión
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                Desarrollar y posicionar a <strong>EcoAcción</strong> como una herramienta digital accesible para todos los ciudadanos en la República Dominicana, facilitando que podamos reportar problemas locales y organizarnos en comunidad para promover la participación activa y el cuidado ambiental a través de soluciones prácticas y colaborativas.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
              <h4 className="text-sm font-extrabold text-emerald-900 uppercase tracking-wider mb-1.5">
                Visión
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                Aspiramos a convertir a <strong>EcoAcción</strong> en el referente tecnológico socioambiental confiable y colaborativo en el país, logrando que poco a poco cada comunidad cuente con una red activa capaz de organizarse para resolver sus problemas más notorios en RD.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3">
              Valores Fundamentales
            </h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70">
                <CheckCircle2 className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Trabajo en equipo</h5>
                  <p className="text-xs text-slate-600 mt-0.5">La unión de vecinos, jóvenes y organizaciones multiplica el impacto de cada solución.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/70">
                <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Sostenibilidad</h5>
                  <p className="text-xs text-slate-600 mt-0.5">Cuidado ambiental, reciclaje consciente y un modelo de financiamiento transparente.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/70">
                <Heart className="text-rose-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Empatía</h5>
                  <p className="text-xs text-slate-600 mt-0.5">Escucha activa a las necesidades de cada barrio, sector y ser vivo de nuestro entorno.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm"
          >
            Entendido, volver a la aplicación
          </button>
        </div>
      </div>
    </div>
  );
};
