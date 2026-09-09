import React from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2, Award, Sparkles } from 'lucide-react';

export type LegalModalType = 'terms' | 'privacy' | null;

interface LegalModalProps {
  type: LegalModalType;
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, isOpen, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white flex items-start justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-amber-300 shrink-0">
              {type === 'terms' ? <FileText size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck size={12} />
                <span>Marco Jurídico y Normativo</span>
              </div>
              <h2 id="legal-modal-title" className="text-xl sm:text-2xl font-black text-white leading-tight">
                {type === 'terms' ? 'Términos y Condiciones de Uso' : 'Política de Privacidad y Tratamiento de Datos'}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                EcoAcción RD • República Dominicana • Vigente 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body with Scroll */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Declaración de Titularidad y Autoría */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-950">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
              <Award size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xs sm:text-sm text-amber-900">
                Aviso de Autoría y Titularidad de la Plataforma
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                La plataforma digital <strong>EcoAcción RD</strong>, su concepto metodológico («de la queja a la propuesta, y de la propuesta a la acción»), su arquitectura de software, diseño de interfaz y contenidos originales han sido conceptualizados, desarrollados y son de la exclusiva <strong>autoría y titularidad intelectual de Yeisy Jazmel Moris</strong>.
              </p>
            </div>
          </div>

          {type === 'terms' ? (
            /* Términos y Condiciones */
            <div className="space-y-5">
              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Propósito y Misión de la Plataforma</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  EcoAcción RD es una plataforma cívica y ambiental concebida para la República Dominicana con la finalidad de empoderar a los ciudadanos para identificar problemáticas barriales (acumulación de residuos, calles averiadas, drenaje obstruido, alumbrado público, protección animal) y canalizar soluciones constructivas y campañas de voluntariado organizado.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <span>Navegación Abierta y Participación Responsable</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  Cualquier ciudadano puede explorar libremente la información comunitaria, las guías de reciclaje y el mapa de puntos limpios sin registrarse. No obstante, para publicar reportes, sugerir propuestas, votar o inscribirse en campañas de voluntariado, el usuario debe ingresar su correo electrónico y validar su perfil cívico.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">3</span>
                  <span>Autenticidad de Reportes y Fotografías Reales</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  Queda estrictamente prohibida la inserción de reportes falsos, pruebas ficticias o imágenes engañosas. Cada usuario se compromete a adjuntar fotografías reales y describir problemáticas verificables en su entorno o comunidad, siempre acompañadas de una propuesta concreta de solución.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">4</span>
                  <span>Código de Convivencia y Respeto Ciudadano</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  No se tolera contenido difamatorio, lenguaje de odio, publicidad no autorizada (spam) ni ataques personales contra vecinos, líderes o instituciones. EcoAcción RD se reserva el derecho de moderar o remover cualquier publicación que vulnere el espíritu constructivo y ambiental del proyecto.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">5</span>
                  <span>Propiedad Intelectual y Derechos Reservados</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  Todos los derechos sobre el software, diseño, logotipos, emblema de la abeja («El por qué de la Abeja») y denominación «EcoAcción RD» son propiedad de <strong>Yeisy Jazmel Moris</strong>. Queda prohibida la reproducción, copia o explotación comercial no autorizada sin el consentimiento expreso por escrito de su autora.
                </p>
              </section>
            </div>
          ) : (
            /* Política de Privacidad */
            <div className="space-y-5">
              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Datos que Recopilamos</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  Para permitir la participación activa en EcoAcción RD, solicitamos únicamente la información necesaria: nombre o seudónimo cívico, correo electrónico para autenticación, provincia/sector de residencia en República Dominicana y rol comunitario. Si el usuario lo desea, puede adjuntar una foto de perfil y una breve descripción de su compromiso comunitario.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <span>Finalidad del Tratamiento de Datos</span>
                </h3>
                <div className="text-slate-600 pl-8 space-y-1">
                  <p>La información recopilada se utiliza con los siguientes fines exclusivos:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>Verificar la identidad cívica del participante al crear reportes, ideas o campañas.</li>
                    <li>Asignar la autoría legítima a las propuestas ciudadanas planteadas en su sector.</li>
                    <li>Coordinar la asistencia a jornadas de voluntariado y campañas ambientales comunitarias.</li>
                    <li>Garantizar que no existan cuentas o perfiles automatizados (bots) ni pruebas falsas.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">3</span>
                  <span>No Comercialización de Datos Personales</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  EcoAcción RD no vende, no alquila y no comercializa los correos electrónicos ni los datos personales de sus usuarios con terceros ni con agencias publicitarias. La plataforma está orientada exclusivamente al impacto social y ecológico dominicano.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">4</span>
                  <span>Almacenamiento Seguro y Control del Usuario</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  El usuario mantiene pleno control de su perfil y puede cerrar sesión o actualizar sus datos en cualquier momento. Los datos de sesión se almacenan de manera local y segura en el dispositivo del usuario.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">5</span>
                  <span>Responsable del Tratamiento</span>
                </h3>
                <p className="text-slate-600 pl-8">
                  La administración y supervisión del tratamiento de datos en EcoAcción RD está a cargo de su creadora y titular, <strong>Yeisy Jazmel Moris</strong>, bajo las directrices éticas y legales vigentes para la protección de datos personales.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span className="hidden sm:inline">Compromiso de transparencia y acción ciudadana</span>
            <span className="sm:hidden">EcoAcción RD</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
