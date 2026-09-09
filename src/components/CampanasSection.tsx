import React, { useState } from 'react';
import { 
  Flag, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Building, 
  PlusCircle, 
  HeartHandshake, 
  Sparkles,
  Search,
  Share2,
  ExternalLink
} from 'lucide-react';
import { Campaign, ProvinceRD } from '../types';
import { DOMINICAN_PROVINCES } from '../data/initialData';

interface CampanasSectionProps {
  campaigns: Campaign[];
  onToggleParticipate: (campaignId: string) => void;
  onOpenNewCampaignModal: () => void;
  filterCategory?: string;
  onViewReport?: (reportId: string) => void;
}

export const CampanasSection: React.FC<CampanasSectionProps> = ({
  campaigns,
  onToggleParticipate,
  onOpenNewCampaignModal,
  filterCategory,
  onViewReport
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaignForDetail, setSelectedCampaignForDetail] = useState<Campaign | null>(null);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchCategory = !filterCategory || filterCategory === 'all' || c.category === filterCategory;
    const matchProvince = selectedProvince === 'all' || c.province === selectedProvince;
    const matchSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchProvince && matchSearch;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2.5 border border-emerald-400/30">
            <Flag size={14} />
            <span>Acción Directa Colectiva</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Campañas Comunitarias y Ambientales
          </h1>
          <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
            Convertimos las alertas e ideas en acciones organizadas con fecha, punto de encuentro y metas de voluntarios. Participa como voluntario o patrocina una iniciativa.
          </p>
        </div>

        <button
          onClick={onOpenNewCampaignModal}
          id="btn-open-new-campaign-modal"
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-extrabold text-sm shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle size={18} />
          <span>Crear Nueva Campaña</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar campaña por nombre, playa, parque o barrio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden focus:border-emerald-600"
          />
        </div>

        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden bg-white"
        >
          <option value="all">📍 Todas las provincias</option>
          {DOMINICAN_PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Campaigns Grid */}
      <div>
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-emerald-200 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-emerald-100">
              <Flag size={28} className="text-emerald-700" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">Módulo de Campañas Listo</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              No hay convocatorias falsas ni pruebas inventadas. Las campañas se organizan a partir de los reportes e ideas ciudadanas que los vecinos apoyan. ¡Sé el primero en organizar una acción colectiva!
            </p>
            <button
              onClick={onOpenNewCampaignModal}
              className="mt-5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>Convocar Nueva Campaña</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map((camp) => {
              const progressPercent = Math.min(
                100, 
                Math.round((camp.registeredVolunteers / camp.targetVolunteers) * 100)
              );

          return (
            <div
              key={camp.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              id={`campaign-card-${camp.id}`}
            >
              <div>
                {/* Header Image & Status */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={camp.imageUrl}
                    alt={camp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-white/95 text-slate-900 shadow-xs">
                      {camp.province}
                    </span>
                    {camp.status === 'activa' && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                        Convocatoria Abierta
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg sm:text-xl font-black leading-snug drop-shadow-sm">
                      {camp.title}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-slate-600 text-xs sm:text-sm italic">
                    "{camp.tagline}"
                  </p>

                  {/* Date, Time and Meeting Point */}
                  <div className="grid sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar size={15} className="text-emerald-700 shrink-0" />
                      <span className="font-semibold">{camp.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={15} className="text-amber-600 shrink-0" />
                      <span>{camp.time}</span>
                    </div>
                    <div className="sm:col-span-2 flex items-start gap-2 text-slate-700 pt-1 border-t border-slate-200/60 mt-1">
                      <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Punto de encuentro:</strong> {camp.meetingPoint}</span>
                    </div>
                  </div>

                  {/* Objective */}
                  <div className="text-xs space-y-1">
                    <strong className="text-slate-900 font-bold block">Objetivo de la actividad:</strong>
                    <p className="text-slate-700 leading-relaxed">{camp.objective}</p>
                  </div>

                  {/* Volunteer Progress Meter */}
                  <div className="space-y-1.5 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-950 flex items-center gap-1.5">
                        <Users size={14} className="text-emerald-700" />
                        Participantes inscritos:
                      </span>
                      <span className="text-emerald-900">
                        {camp.registeredVolunteers} de {camp.targetVolunteers} voluntarios ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-emerald-200/70 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Collaborating Organizations and Sponsors */}
                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building size={13} className="text-slate-400 shrink-0" />
                      <span>Organizado por: <strong>{camp.organizer.name}</strong></span>
                      {camp.organizer.verified && (
                        <CheckCircle2 size={13} className="text-emerald-600" title="Verificado" />
                      )}
                    </div>

                    {camp.sponsors.length > 0 && (
                      <div className="flex items-start gap-1.5 text-slate-600">
                        <HeartHandshake size={13} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-700">Patrocinado por: </span>
                          <span>
                            {camp.sponsors.map(s => `${s.name} (${s.contribution})`).join(', ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedCampaignForDetail(camp)}
                  className="text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  Ver detalles completos
                </button>

                <button
                  onClick={() => onToggleParticipate(camp.id)}
                  id={`btn-participate-${camp.id}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
                    camp.isUserRegistered
                      ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white'
                  }`}
                >
                  {camp.isUserRegistered ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>¡Inscrito! (Cancelar cupo)</span>
                    </>
                  ) : (
                    <>
                      <Users size={16} />
                      <span>«Quiero participar»</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
          </div>
        )}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaignForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs overflow-y-auto">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-emerald-100 p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                  {selectedCampaignForDetail.province}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {selectedCampaignForDetail.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCampaignForDetail(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {selectedCampaignForDetail.description}
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-emerald-700" />
                <span><strong>Fecha:</strong> {selectedCampaignForDetail.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-600" />
                <span><strong>Horario:</strong> {selectedCampaignForDetail.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-red-500" />
                <span><strong>Punto de encuentro:</strong> {selectedCampaignForDetail.meetingPoint}</span>
              </div>
            </div>

            {selectedCampaignForDetail.originReportId && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                <span>Esta campaña nació de un reporte en EcoAlerta.</span>
                <button
                  onClick={() => {
                    const rId = selectedCampaignForDetail.originReportId!;
                    setSelectedCampaignForDetail(null);
                    onViewReport?.(rId);
                  }}
                  className="font-bold text-amber-900 underline cursor-pointer"
                >
                  Ver reporte de origen
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCampaignForDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onToggleParticipate(selectedCampaignForDetail.id);
                  setSelectedCampaignForDetail(null);
                }}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl"
              >
                {selectedCampaignForDetail.isUserRegistered ? 'Cancelar inscripción' : 'Confirmar que «Quiero participar»'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
