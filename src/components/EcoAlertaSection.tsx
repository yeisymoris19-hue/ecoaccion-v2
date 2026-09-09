import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Flag,
  ArrowUpRight
} from 'lucide-react';
import { EcoReport, CategoryType, ProvinceRD, ReportStatus } from '../types';
import { DOMINICAN_PROVINCES } from '../data/initialData';

interface EcoAlertaSectionProps {
  reports: EcoReport[];
  onOpenNewReport: () => void;
  onSelectReport: (report: EcoReport) => void;
  onToggleSupport: (reportId: string, e: React.MouseEvent) => void;
  onViewCampaign?: (campaignId: string) => void;
}

const CATEGORY_CHIPS: { id: CategoryType | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Todas las problemáticas', icon: '🌐' },
  { id: 'basura', label: 'Basura y Desechos', icon: '🗑️' },
  { id: 'calles', label: 'Calles y Baches', icon: '🚧' },
  { id: 'drenaje', label: 'Drenaje y Agua', icon: '💧' },
  { id: 'alumbrado', label: 'Alumbrado', icon: '💡' },
  { id: 'animales', label: 'Protección Animal', icon: '🐾' },
  { id: 'contaminacion', label: 'Contaminación', icon: '🏭' },
  { id: 'infraestructura', label: 'Infraestructura', icon: '🏚️' },
];

export const EcoAlertaSection: React.FC<EcoAlertaSectionProps> = ({
  reports,
  onOpenNewReport,
  onSelectReport,
  onToggleSupport,
  onViewCampaign,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchProvince = selectedProvince === 'all' || r.province === selectedProvince;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchSearch = 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.problemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.proposedSolution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.province.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchProvince && matchStatus && matchSearch;
    });
  }, [reports, selectedCategory, selectedProvince, statusFilter, searchQuery]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      {/* Hero Banner for EcoAlerta */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-3">
            <AlertTriangle size={14} />
            <span>Módulo Ciudadano EcoAlerta</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Reporta problemas y propone soluciones para tu comunidad en RD
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2.5 leading-relaxed">
            No te quedes en la queja. En EcoAlerta, cada voz identifica una necesidad ciudadana y aporta una idea constructiva para transformarla en una campaña organizada.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onOpenNewReport}
              id="btn-hero-new-report"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Crear Nuevo Reporte con Propuesta</span>
            </button>
            <div className="text-xs text-emerald-200 bg-emerald-800/60 px-3 py-2 rounded-xl border border-emerald-700/50">
              💡 <strong>Regla de oro:</strong> Todo reporte responde a <em>¿Cuál es el problema?</em> y <em>¿Qué solución propones?</em>
            </div>
          </div>
        </div>

        <div className="absolute right-4 -bottom-10 opacity-15 hidden md:block pointer-events-none">
          <AlertTriangle size={240} className="text-amber-400" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3.5">
        {/* Search & Location Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por problema, solución, barrio o calle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm outline-hidden"
              id="search-reports-input"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-emerald-600 outline-hidden bg-white"
              id="select-filter-province"
            >
              <option value="all">📍 Todas las provincias de RD</option>
              {DOMINICAN_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-emerald-600 outline-hidden bg-white"
            >
              <option value="all">⚡ Todos los estados</option>
              <option value="reportado">Reportado</option>
              <option value="en_discusion">En Discusión</option>
              <option value="con_propuesta">Con Propuesta</option>
              <option value="en_campana">En Campaña Activa</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Listing */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>Reportes ciudadanos</span>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
              {filteredReports.length} {filteredReports.length === 1 ? 'reporte' : 'reportes'}
            </span>
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Haz clic en cualquier reporte para ver los detalles, comentar o apoyarlo
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-emerald-200 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-emerald-100">
              <AlertTriangle size={28} className="text-amber-500" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">La plataforma está lista</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              No hay reportes falsos ni pruebas inventadas. Sé el primer dominicano en registrar una problemática en tu comunidad y proponer una solución.
            </p>
            <button
              onClick={onOpenNewReport}
              className="mt-5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Publicar el Primer Reporte</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReports.map((report) => {
              return (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/70 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
                  id={`card-report-${report.id}`}
                >
                  {/* Card Image */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    {report.imageUrl ? (
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-emerald-800">
                        <div className="text-center p-3">
                          <span className="text-3xl block mb-1">📢</span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-white/80 px-2 py-0.5 rounded-md">
                            {report.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                        {report.province}
                      </span>
                    </div>

                    {report.status === 'en_campana' && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-extrabold px-2 py-1 rounded-md bg-emerald-600 text-white shadow-md flex items-center gap-1">
                          <Flag size={10} />
                          En Campaña
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location & Time */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                        <span className="font-semibold text-emerald-800 flex items-center gap-1 truncate max-w-[70%]">
                          <MapPin size={12} className="shrink-0" />
                          {report.sector}
                        </span>
                        <span>{report.createdAt}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2 mb-3">
                        {report.title}
                      </h3>

                      {/* Problem and Solution Snippets */}
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60">
                          <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider mb-0.5">
                            Problema:
                          </span>
                          <p className="text-slate-700 line-clamp-2 leading-relaxed">
                            {report.problemDescription}
                          </p>
                        </div>

                        <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60">
                          <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider mb-0.5">
                            Solución propuesta:
                          </span>
                          <p className="text-emerald-950 font-medium line-clamp-2 leading-relaxed">
                            {report.proposedSolution}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      {/* Author */}
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <img
                          src={report.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                          alt={report.authorName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="truncate max-w-[100px]">{report.authorName}</span>
                      </div>

                      {/* Supports and comments */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => onToggleSupport(report.id, e)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                            report.userSupported
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                          }`}
                          title="Apoyar este reporte"
                        >
                          <ThumbsUp size={12} className={report.userSupported ? 'fill-white' : ''} />
                          <span>{report.supportsCount}</span>
                        </button>

                        <div className="flex items-center gap-1 text-slate-500 text-[11px] px-2 py-1">
                          <MessageSquare size={12} />
                          <span>{report.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
