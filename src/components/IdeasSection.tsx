import React, { useState } from 'react';
import { 
  Lightbulb, 
  ThumbsUp, 
  MessageSquare, 
  PlusCircle, 
  MapPin, 
  Flag, 
  Flame, 
  Send, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { CommunityIdea, ProvinceRD } from '../types';
import { DOMINICAN_PROVINCES } from '../data/initialData';

interface IdeasSectionProps {
  ideas: CommunityIdea[];
  onVoteIdea: (ideaId: string) => void;
  onAddIdea: (idea: Omit<CommunityIdea, 'id' | 'createdAt' | 'votesCount' | 'userVoted' | 'commentsCount' | 'comments'>) => void;
  onAddCommentToIdea: (ideaId: string, text: string) => void;
  onConvertIdeaToCampaign: (idea: CommunityIdea) => void;
  onViewCampaign?: (campaignId: string) => void;
}

export const IdeasSection: React.FC<IdeasSectionProps> = ({
  ideas,
  onVoteIdea,
  onAddIdea,
  onAddCommentToIdea,
  onConvertIdeaToCampaign,
  onViewCampaign
}) => {
  const [filterMode, setFilterMode] = useState<'top' | 'recent'>('top');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCommentIdeaId, setActiveCommentIdeaId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [province, setProvince] = useState<ProvinceRD>('Distrito Nacional');
  const [sector, setSector] = useState('');
  const [category, setCategory] = useState<CommunityIdea['category']>('reciclaje');
  const [proposedBy, setProposedBy] = useState('Ciudadano Innovador');

  const sortedIdeas = [...ideas].sort((a, b) => {
    if (filterMode === 'top') {
      return b.votesCount - a.votesCount;
    }
    return 0; // maintain original order as recent
  });

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddIdea({
      title: title.trim(),
      description: description.trim(),
      province,
      sector: sector.trim() || 'Sector no especificado',
      category,
      proposedBy: proposedBy.trim() || 'Vecino Dominicano',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });

    setTitle('');
    setDescription('');
    setSector('');
    setIsModalOpen(false);
  };

  const handleSendComment = (ideaId: string) => {
    if (!commentInput.trim()) return;
    onAddCommentToIdea(ideaId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-700 text-white p-6 sm:p-8 shadow-lg border border-amber-400/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold mb-2.5">
            <Lightbulb size={14} className="text-amber-200" />
            <span>Banco Ciudadano de Ideas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Propuestas para transformar nuestras comunidades
          </h1>
          <p className="text-amber-50 text-sm mt-2 leading-relaxed">
            ¿Tienes una idea para mejorar tu barrio o cuidar el medio ambiente? Compártela, recibe el respaldo de otros dominicanos y conviértela en una campaña de impacto.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          id="btn-open-idea-modal"
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm hover:bg-amber-50 shadow-md shadow-black/10 active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle size={18} className="text-amber-600" />
          <span>Proponer Nueva Idea</span>
        </button>
      </div>

      {/* Sorting Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('top')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterMode === 'top'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flame size={15} className="text-amber-600" />
            <span>Más Apoyadas (Destacadas)</span>
          </button>
          <button
            onClick={() => setFilterMode('recent')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterMode === 'recent'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Más Recientes
          </button>
        </div>
        <span className="text-xs text-slate-500">
          Las ideas con mayor respaldo reciben apoyo para ser elevadas a <strong>Campaña Oficial</strong>
        </span>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {sortedIdeas.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-amber-200 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <Lightbulb size={28} className="text-amber-600" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">Espacio de Propuestas Abierto</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              No hay ideas de prueba ni propuestas falsas. Si tienes una solución innovadora o un proyecto para tu barrio o el medio ambiente en RD, compártelo aquí.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>Proponer la Primera Idea</span>
            </button>
          </div>
        ) : (
          sortedIdeas.map((idea) => {
          const isCommentsOpen = activeCommentIdeaId === idea.id;
          return (
            <div
              key={idea.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:border-amber-300 transition-all shadow-xs space-y-4"
              id={`idea-card-${idea.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {idea.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin size={12} className="text-emerald-700" />
                      {idea.sector}, {idea.province}
                    </span>
                    <span>•</span>
                    <span>{idea.createdAt}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {idea.title}
                  </h3>
                </div>

                {/* Vote Button */}
                <button
                  onClick={() => onVoteIdea(idea.id)}
                  className={`flex flex-col items-center justify-center min-w-14 px-3 py-2 rounded-xl transition-all font-bold cursor-pointer shrink-0 border ${
                    idea.userVoted
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300'
                  }`}
                  title="Votar y apoyar esta propuesta"
                  id={`btn-vote-idea-${idea.id}`}
                >
                  <ThumbsUp size={16} className={idea.userVoted ? 'fill-white' : ''} />
                  <span className="text-sm mt-0.5">{idea.votesCount}</span>
                  <span className="text-[9px] uppercase font-semibold">Votos</span>
                </button>
              </div>

              {/* Description */}
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {idea.description}
              </p>

              {/* Proposer Info and Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <img
                    src={idea.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                    alt={idea.proposedBy}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>Propuesta por <strong>{idea.proposedBy}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCommentIdeaId(isCommentsOpen ? null : idea.id)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>{idea.comments.length} aportes</span>
                  </button>

                  {idea.associatedCampaignId ? (
                    <button
                      onClick={() => onViewCampaign?.(idea.associatedCampaignId!)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      <Flag size={13} />
                      <span>Ver Campaña Asociada</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onConvertIdeaToCampaign(idea)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                      title="Organizar una campaña comunitaria a partir de esta idea"
                    >
                      <Flag size={13} />
                      <span>Llevar a Campaña</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Discussion Drawer */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50/70 p-4 rounded-xl">
                  <span className="text-xs font-bold text-slate-800 block">Comentarios y colaboraciones:</span>
                  {idea.comments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Sé el primero en aportar a esta propuesta.</p>
                  ) : (
                    <div className="space-y-2">
                      {idea.comments.map((c) => (
                        <div key={c.id} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between text-slate-500 mb-0.5">
                            <span className="font-bold text-slate-800">{c.authorName}</span>
                            <span>{c.createdAt}</span>
                          </div>
                          <p className="text-slate-700">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe tu sugerencia o apoyo para esta idea..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(idea.id)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-amber-600 outline-hidden bg-white"
                    />
                    <button
                      onClick={() => handleSendComment(idea.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Send size={12} />
                      Aportar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }))}
      </div>

      {/* Modal to Submit New Idea */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-amber-700">
                <Lightbulb size={20} />
                <h3 className="font-extrabold text-slate-900 text-lg">Compartir Propuesta Ciudadana</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Título de la propuesta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Colocar contenedores de reciclaje en el Parque Mirador"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Provincia *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value as ProvinceRD)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden bg-white"
                  >
                    {DOMINICAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Sector / Barrio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Gazcue, Piantini, Bella Vista"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden bg-white"
                >
                  <option value="reciclaje">♻️ Reciclaje y separación de desechos</option>
                  <option value="espacios_verdes">🌳 Parques y áreas verdes</option>
                  <option value="limpieza">🧹 Jornadas de limpieza comunitaria</option>
                  <option value="educacion">📚 Educación ambiental vecinal</option>
                  <option value="infraestructura">🏗️ Infraestructura y bacheo</option>
                  <option value="animales">🐾 Bienestar y protección animal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Descripción y cómo implementarla *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explica qué beneficio aportará a la comunidad y cómo los vecinos o patrocinadores pueden colaborar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-amber-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={proposedBy}
                  onChange={(e) => setProposedBy(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Publicar Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
