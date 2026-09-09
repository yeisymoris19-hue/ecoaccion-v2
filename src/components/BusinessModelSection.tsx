import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  HeartHandshake, 
  TrendingUp, 
  Building2, 
  HelpCircle, 
  AlertOctagon, 
  DollarSign, 
  Sparkles,
  Send,
  Lock
} from 'lucide-react';

export const BusinessModelSection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'patrocinio' | 'pro' | 'destacada'>('patrocinio');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactEmail.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setCompanyName('');
      setContactEmail('');
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2.5 border border-amber-400/30">
            <Briefcase size={14} />
            <span>Modelo de Negocio y Sostenibilidad</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            ¿Cómo se sostiene EcoAcción?
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Una plataforma <strong>100% gratuita para los ciudadanos dominicanos</strong>, financiada de manera responsable y transparente a través de patrocinios empresariales de Responsabilidad Social Corporativa (RSC) y servicios profesionales para organizaciones.
          </p>
        </div>

        <div className="bg-emerald-950/90 border border-emerald-500/40 p-4 rounded-2xl text-xs space-y-2 shrink-0 max-w-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <CheckCircle2 size={16} />
            <span>Gratis para el ciudadano</span>
          </div>
          <p className="text-emerald-100 text-[11px] leading-relaxed">
            Reportar problemas, proponer soluciones y unirse a campañas jamás tendrá costo para las comunidades.
          </p>
        </div>
      </div>

      {/* The 4-Pillar Economic Cycle */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="max-w-xl">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Ciclo Sostenible y Virtuoso
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            El funcionamiento de EcoAcción como emprendimiento
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Uso Ciudadano Gratuito</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los ciudadanos y vecinos utilizan la aplicación sin costo para mapear necesidades y organizarse.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h3 className="font-bold text-emerald-950 text-sm">Comunidades Activas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Surgen iniciativas concretas: limpiezas de playas, recuperación de parques, bacheo y reciclaje.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h3 className="font-bold text-amber-950 text-sm">Patrocinios de Empresas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empresas y marcas financian insumos (guantes, fundas, herramientas, hidratación) a cambio de visibilidad positiva.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
            <span className="w-7 h-7 rounded-xl bg-teal-700 text-white font-bold flex items-center justify-center text-xs">
              4
            </span>
            <h3 className="font-bold text-teal-950 text-sm">Sostenibilidad Tecnológica</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              EcoAcción cubre servidores, mejoras constantes y equipo para expandir el impacto en más provincias de RD.
            </p>
          </div>
        </div>
      </div>

      {/* CLÁUSULA DE TRANSPARENCIA Y ÉTICA ABSOLUTA */}
      <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-rose-200/80 space-y-3">
        <div className="flex items-center gap-2.5 text-rose-900">
          <ShieldCheck size={24} className="text-rose-600 shrink-0" />
          <h3 className="text-lg sm:text-xl font-black">
            Regla de Oro de Transparencia y Confianza Ciudadana
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Para garantizar que EcoAcción se mantenga como un espacio legítimo y confiable para el pueblo dominicano:
        </p>
        <div className="bg-white/90 p-4 rounded-2xl border border-rose-200 text-xs sm:text-sm font-medium text-slate-800 space-y-2">
          <div className="flex items-start gap-2">
            <Lock size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <p>
              <strong>Ninguna empresa, entidad o patrocinador podrá pagar para eliminar, ocultar, moderar o alterar un reporte ciudadano</strong> que señale una problemática legítima que le involucre.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <p>
              En cualquier campaña patrocinada o financiada, se desglosará de manera 100% pública cuánto recurso va directamente a la acción comunitaria y qué porcentaje cubre la gestión tecnológica.
            </p>
          </div>
        </div>
      </div>

      {/* Planes y Servicios para Empresas / Organizaciones */}
      <div>
        <div className="mb-5 text-center sm:text-left">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Servicios para el Sector Privado y ONGs
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Formas de colaborar como Empresa o Institución
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Card 1: Patrocinio de Campaña */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-amber-400 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                <HeartHandshake size={20} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Patrocinio de Campaña</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ideal para empresas locales, ferreterías, marcas de agua o alimentos que deseen respaldar una jornada barrial concreta.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">✓ Logotipo en banner de la campaña</li>
                <li className="flex items-center gap-1.5">✓ Aporte de hidratación, guantes o herramientas</li>
                <li className="flex items-center gap-1.5">✓ Reconocimiento en agradecimientos a voluntarios</li>
                <li className="flex items-center gap-1.5">✓ Mención en redes sociales comunitarias</li>
              </ul>
            </div>
            <button
              onClick={() => setSelectedPlan('patrocinio')}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Consultar Patrocinio
            </button>
          </div>

          {/* Card 2: Plan Profesional ONG & Empresas */}
          <div className="bg-white rounded-3xl border-2 border-emerald-600 p-6 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3 right-5 bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Más Solicitado
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Building2 size={20} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Plan Corporativo RSC</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Para empresas comprometidas con metas ESG y ONGs que gestionan múltiples proyectos ambientales en el país.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">✓ Perfil institucional verificado con insignia</li>
                <li className="flex items-center gap-1.5">✓ Creación ilimitada de campañas oficiales</li>
                <li className="flex items-center gap-1.5">✓ Panel de métricas de impacto (kg plástico, árboles)</li>
                <li className="flex items-center gap-1.5">✓ Reportes certificados para memorias de sostenibilidad</li>
              </ul>
            </div>
            <button
              onClick={() => setSelectedPlan('pro')}
              className="mt-6 w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Solicitar Plan Corporativo
            </button>
          </div>

          {/* Card 3: Difusión y Campaña Destacada */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-teal-400 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Campañas Destacadas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Impulso publicitario ético para que una causa comunitaria gane visibilidad preferente en el feed de la aplicación.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">✓ Destacado en carrusel principal por 14 días</li>
                <li className="flex items-center gap-1.5">✓ Notificación push voluntaria a vecinos del sector</li>
                <li className="flex items-center gap-1.5">✓ Mayor captación de voluntarios inscritos</li>
                <li className="flex items-center gap-1.5">✓ Soporte de moderación y coordinación técnica</li>
              </ul>
            </div>
            <button
              onClick={() => setSelectedPlan('destacada')}
              className="mt-6 w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Destacar una Causa
            </button>
          </div>
        </div>
      </div>

      {/* Simulator / Contact Form for Companies */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
        <div className="max-w-xl mb-5">
          <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
            <Sparkles size={13} />
            <span>Alianzas Estratégicas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Únete como Empresa o Institución Aliada
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Contribuye al desarrollo comunitario y el cuidado del medio ambiente en la República Dominicana.
          </p>
        </div>

        {inquirySent ? (
          <div className="p-6 bg-emerald-900/60 border border-emerald-500 rounded-2xl text-center space-y-2">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-base">¡Solicitud recibida correctamente!</h4>
            <p className="text-xs text-emerald-200">
              El equipo de alianzas socioambientales de EcoAcción se pondrá en contacto en breve con las opciones de patrocinio.
            </p>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Nombre de la Empresa u Organización
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Distribuidora Nacional / Ferretería"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Correo Electrónico de Contacto
              </label>
              <input
                type="email"
                required
                placeholder="contacto@empresa.com.do"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send size={14} />
                <span>Contactar con EcoAcción</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
