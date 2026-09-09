import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  Flag, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Send,
  Calendar,
  Share2,
  ExternalLink
} from 'lucide-react';
import { EcoReport, Comment } from '../types';

interface ReportDetailModalProps {
  report: EcoReport | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSupport: (reportId: string) => void;
  onAddComment: (reportId: string, commentText: string, isSolution: boolean) => void;
  onConvertToCampaign: (report: EcoReport) => void;
  onViewCampaign?: (campaignId: string) => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  basura: 'Acumulación de Basura',
  calles: 'Calles y Carreteras Dañadas',
  drenaje: 'Drenaje y Agua Potable',
  alumbrado: 'Alumbrado Público',
  contaminacion: 'Contaminación Ambiental',
  infraestructura: 'Infraestructura Deteriorada',
  animales: 'Protección y Rescate Animal',
  servicios: 'Averías en Servicios Básicos',
  otro: 'Problemática Comunitaria'
};

const STATUS_CONFIG = {
  reportado: { label: 'Reportado', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
  en_discusion: { label: 'En Discusión Ciudadana', bg: 'bg-blue-100 text-blue-900 border-blue-300' },
  con_propuesta: { label: 'Con Propuesta Viable', bg: 'bg-teal-100 text-teal-900 border-teal-300' },
  en_campana: { label: '¡Convertido en Campaña!', bg: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold' },
  resuelto: { label: 'Problema Resuelto ✓', bg: 'bg-slate-100 text-slate-800 border-slate-300' },
};

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen,
  onClose,
  onToggleSupport,
  onAddComment,
  onConvertToCampaign,
  onViewCampaign
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [isSolutionProposal, setIsSolutionProposal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(report.id, newCommentText.trim(), isSolutionProposal);
    setNewCommentText('');
    setIsSolutionProposal(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusInfo = STATUS_CONFIG[report.status] || STATUS_CONFIG.reportado;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
              {CATEGORY_NAMES[report.category] || report.category}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Compartir reporte"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              id="close-report-detail-btn"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Title & Meta */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {report.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
              <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                <MapPin size={14} />
                <span>{report.sector}, {report.province}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <img 
                  src={report.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} 
                  alt={report.authorName} 
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>Por <strong>{report.authorName}</strong></span>
              </div>
              <span>•</span>
              <span>{report.createdAt}</span>
            </div>
            {report.addressDetails && (
              <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                Punto de referencia: {report.addressDetails}
              </p>
            )}
          </div>

          {/* Report Image */}
          {report.imageUrl && (
            <div className="rounded-2xl overflow-hidden max-h-72 w-full bg-slate-100 border border-slate-200 shadow-xs">
              <img 
                src={report.imageUrl} 
                alt={report.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* LAS DOS PREGUNTAS FUNDAMENTALES */}
          <div className="space-y-4">
            {/* Problema */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-1.5">
                <AlertCircle size={17} className="text-amber-600" />
                <span>¿Cuál es el problema identificado?</span>
              </div>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                {report.problemDescription}
              </p>
            </div>

            {/* Solución Propuesta */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm mb-1.5">
                <Sparkles size={17} className="text-emerald-700" />
                <span>¿Qué solución propone el ciudadano?</span>
              </div>
              <p className="text-emerald-950 text-sm leading-relaxed whitespace-pre-line font-medium">
                {report.proposedSolution}
              </p>
            </div>
          </div>

          {/* Action Row: Support & Convert into Campaign */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onToggleSupport(report.id)}
                id="btn-support-report-modal"
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  report.userSupported
                    ? 'bg-emerald-700 text-white shadow-xs shadow-emerald-700/20'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
                }`}
              >
                <ThumbsUp size={16} className={report.userSupported ? 'fill-white' : ''} />
                <span>{report.userSupported ? 'Apoyado' : 'Apoyar reporte'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/10">
                  {report.supportsCount}
                </span>
              </button>
            </div>

            {report.associatedCampaignId ? (
              <button
                onClick={() => onViewCampaign?.(report.associatedCampaignId!)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
              >
                <Flag size={16} />
                <span>Ver Campaña Comunitaria Activa</span>
                <ExternalLink size={14} />
              </button>
            ) : (
              <button
                onClick={() => onConvertToCampaign(report)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm transition-all cursor-pointer shadow-md shadow-amber-500/20"
                id="btn-convert-campaign-modal"
              >
                <Flag size={16} />
                <span>¡Convertir en Campaña Comunitaria!</span>
              </button>
            )}
          </div>

          {/* Comunidad y Comentarios / Soluciones adicionales */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare size={16} className="text-slate-600" />
                Aportes y propuestas de la comunidad ({report.comments.length})
              </h3>
            </div>

            {/* Comment list */}
            <div className="space-y-3 mb-4">
              {report.comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
                  Aún no hay comentarios. Sé el primero en aportar una idea o coordinar una acción.
                </p>
              ) : (
                report.comments.map((c) => (
                  <div 
                    key={c.id} 
                    className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      c.isSolution 
                        ? 'bg-emerald-50/80 border border-emerald-200' 
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{c.authorName}</span>
                        {c.authorRole && (
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-medium">
                            {c.authorRole}
                          </span>
                        )}
                        {c.isSolution && (
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded-full">
                            Propuesta de solución
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment input form */}
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <textarea
                rows={2}
                placeholder="Añade un comentario, ofrece ayuda o sugiere otra solución..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs outline-hidden"
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSolutionProposal}
                    onChange={(e) => setIsSolutionProposal(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Marcar como <strong>propuesta de solución</strong></span>
                </label>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send size={13} />
                  Enviar aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
