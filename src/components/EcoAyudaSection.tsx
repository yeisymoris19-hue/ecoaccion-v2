import React, { useState } from 'react';
import { 
  Sprout, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  MapPin, 
  Phone, 
  Clock, 
  Layers, 
  Search, 
  Flag,
  ArrowRight,
  BookOpen,
  Recycle,
  Sparkles,
  TreePine,
  Waves
} from 'lucide-react';
import { RECYCLING_MATERIALS, CLEAN_POINTS_RD } from '../data/initialData';
import { RecyclingMaterial, CleanPointRD } from '../types';

interface EcoAyudaSectionProps {
  onGoToCampaigns: (categoryFilter?: string) => void;
  onOpenNewCampaignModal: (presetCategory?: string) => void;
}

export const EcoAyudaSection: React.FC<EcoAyudaSectionProps> = ({
  onGoToCampaigns,
  onOpenNewCampaignModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'guia' | 'puntos' | 'actividades'>('guia');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(RECYCLING_MATERIALS[0].id);
  const [searchCleanPoints, setSearchCleanPoints] = useState('');
  const [cleanPointProvince, setCleanPointProvince] = useState('all');

  const selectedMaterial = RECYCLING_MATERIALS.find((m) => m.id === selectedMaterialId) || RECYCLING_MATERIALS[0];

  const filteredCleanPoints = CLEAN_POINTS_RD.filter((cp) => {
    const matchProvince = cleanPointProvince === 'all' || cp.province === cleanPointProvince;
    const matchSearch = 
      cp.name.toLowerCase().includes(searchCleanPoints.toLowerCase()) ||
      cp.address.toLowerCase().includes(searchCleanPoints.toLowerCase()) ||
      cp.materialsAccepted.some(m => m.toLowerCase().includes(searchCleanPoints.toLowerCase()));
    return matchProvince && matchSearch;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      {/* EcoAyuda Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-400/30">
            <Sprout size={14} />
            <span>Módulo Educativo y de Acción Ambiental</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            EcoAyuda: Aprende, Recicla y Protege la Naturaleza Dominicana
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2.5 leading-relaxed">
            Aprende a separar correctamente los residuos (plástico, papel, vidrio, metal y electrónicos), localiza centros de acopio en el país y súmate a jornadas de reforestación, limpieza de costas y ríos.
          </p>

          {/* Quick Stats or Highlights */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <div className="bg-emerald-950/70 border border-emerald-600/50 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Guía adaptada al contexto dominicano</span>
            </div>
            <div className="bg-emerald-950/70 border border-emerald-600/50 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Directorio de Puntos Limpios en RD</span>
            </div>
          </div>
        </div>

        <div className="absolute right-2 -bottom-10 opacity-15 hidden md:block pointer-events-none">
          <Sprout size={260} className="text-emerald-300" />
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('guia')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'guia'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          id="tab-ecoayuda-guia"
        >
          <BookOpen size={16} />
          <span>Guía de Reciclaje y Separación</span>
        </button>

        <button
          onClick={() => setActiveSubTab('puntos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'puntos'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          id="tab-ecoayuda-puntos"
        >
          <MapPin size={16} />
          <span>Puntos Limpios y Acopio en RD</span>
        </button>

        <button
          onClick={() => setActiveSubTab('actividades')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'actividades'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          id="tab-ecoayuda-actividades"
        >
          <Sparkles size={16} />
          <span>Actividades de Impacto Ambiental</span>
        </button>
      </div>

      {/* SUBTAB 1: GUÍA DE RECICLAJE */}
      {activeSubTab === 'guia' && (
        <div className="space-y-6">
          {/* Material selector pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {RECYCLING_MATERIALS.map((mat) => {
              const isSelected = selectedMaterial.id === mat.id;
              return (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterialId(mat.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white/80 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: mat.color }} 
                    />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {mat.badge}
                    </span>
                  </div>
                  <span className={`text-xs sm:text-sm font-extrabold line-clamp-1 ${
                    isSelected ? 'text-emerald-950' : 'text-slate-800'
                  }`}>
                    {mat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Guide View for Selected Material */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold mb-1.5 text-white" style={{ backgroundColor: selectedMaterial.color }}>
                  <span>{selectedMaterial.badge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedMaterial.name}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {selectedMaterial.description}
                </p>
              </div>
            </div>

            {/* Contexto Dominicano */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 flex items-start gap-3">
              <span className="text-xl shrink-0">🇩🇴</span>
              <div>
                <strong className="text-amber-950 block font-bold mb-0.5">Realidad en la República Dominicana:</strong>
                <p className="leading-relaxed">{selectedMaterial.rdContextNote}</p>
              </div>
            </div>

            {/* What is allowed vs Not allowed */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Allowed */}
              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/80">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm mb-3">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>¿Qué SÍ se puede reciclar?</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {selectedMaterial.allowedItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Allowed */}
              <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-200/80">
                <div className="flex items-center gap-2 text-rose-950 font-extrabold text-sm mb-3">
                  <XCircle size={18} className="text-rose-600" />
                  <span>¿Qué NO se debe mezclar?</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {selectedMaterial.notAllowedItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Preparation tips */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-sm mb-2.5 flex items-center gap-2">
                <Recycle size={17} className="text-emerald-700" />
                <span>Pasos de preparación antes de llevar al punto limpio:</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
                {selectedMaterial.preparationTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PUNTOS LIMPIOS Y CENTROS DE ACOPIO */}
      {activeSubTab === 'puntos' && (
        <div className="space-y-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar punto limpio por sector, material o nombre..."
                value={searchCleanPoints}
                onChange={(e) => setSearchCleanPoints(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden"
              />
            </div>
            <select
              value={cleanPointProvince}
              onChange={(e) => setCleanPointProvince(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden bg-white"
            >
              <option value="all">Todas las provincias</option>
              <option value="Distrito Nacional">Distrito Nacional</option>
              <option value="Santo Domingo Este">Santo Domingo Este</option>
              <option value="Santiago de los Caballeros">Santiago de los Caballeros</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredCleanPoints.map((cp) => (
              <div key={cp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {cp.province}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">
                    {cp.name}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span>{cp.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-600 shrink-0" />
                    <span>{cp.schedule}</span>
                  </div>
                  {cp.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-slate-500 shrink-0" />
                      <span>{cp.phone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Materiales recibidos:</span>
                  <div className="flex flex-wrap gap-1">
                    {cp.materialsAccepted.map((mat, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-medium">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  Gestionado por: {cp.managedBy}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: ACTIVIDADES AMBIENTALES */}
      {activeSubTab === 'actividades' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Limpieza de Playas */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-blue-200 rounded-3xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center">
                <Waves size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Limpieza de Playas y Costas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jornadas en Playa Montesinos, Güibia, Boca Chica y costas de RD para frenar el plástico que asfixia nuestros arrecifes y tortugas marinas.
              </p>
              <button
                onClick={() => onGoToCampaigns('limpieza_playa')}
                className="w-full py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Ver Campañas Costeras
              </button>
            </div>

            {/* Reforestación */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                <TreePine size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Reforestación y Cuencas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Siembra de especies nativas (Caoba criolla, Samán, Cigua Blanca) en cuencas de los ríos Yaque del Norte, Ozama e Isabela.
              </p>
              <button
                onClick={() => onGoToCampaigns('reforestacion')}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Ver Jornadas de Siembra
              </button>
            </div>

            {/* Protección Animal */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center">
                <span className="text-lg">🐾</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Protección y Adopción Animal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rescate comunitario, atención veterinaria solidaria y campañas de adopción responsable de animales en situación de calle.
              </p>
              <button
                onClick={() => onGoToCampaigns('proteccion_animal')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Ver Campañas de Rescate
              </button>
            </div>
          </div>

          {/* Banner to create an environmental campaign */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black">
                ¿Deseas organizar una jornada ecológica en tu municipio?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                En EcoAcción te ayudamos a convocar voluntarios, encontrar empresas patrocinadoras de refrigerios y coordinar con ONGs.
              </p>
            </div>
            <button
              onClick={() => onOpenNewCampaignModal()}
              className="shrink-0 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              Crear Campaña Ecológica
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
