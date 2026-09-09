import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Sparkles, 
  MessageCircle, 
  UserPlus, 
  Search, 
  Share2,
  CheckCircle2,
  Building,
  GraduationCap,
  PawPrint,
  TreePine
} from 'lucide-react';
import { CommunityMember, ProvinceRD } from '../types';
import { DOMINICAN_PROVINCES } from '../data/initialData';

interface ComunidadSectionProps {
  members: CommunityMember[];
  onConnectWithMember: (memberId: string) => void;
  connectedMemberIds: string[];
}

const ROLE_FILTERS = [
  { id: 'all', label: 'Todos los perfiles' },
  { id: 'Ambientalista', label: '🌱 Ambientalistas' },
  { id: 'Líder Comunitario', label: '📢 Líderes Comunitarios' },
  { id: 'Estudiante Voluntario', label: '🎓 Estudiantes' },
  { id: 'Rescatista Animal', label: '🐾 Rescatistas Animales' },
  { id: 'Organización Verificada', label: '🏛️ ONGs & Organizaciones' },
];

export const ComunidadSection: React.FC<ComunidadSectionProps> = ({
  members,
  onConnectWithMember,
  connectedMemberIds,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactedMember, setContactedMember] = useState<CommunityMember | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const filteredMembers = members.filter((m) => {
    const matchRole = selectedRole === 'all' || m.role === selectedRole;
    const matchProvince = selectedProvince === 'all' || m.province === selectedProvince;
    const matchSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchProvince && matchSearch;
  });

  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setContactedMember(null);
      setContactMessage('');
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-950 text-white p-6 sm:p-8 shadow-lg border border-teal-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-2.5 border border-teal-400/30">
            <Users size={14} />
            <span>Red Ciudadana y Organizaciones de RD</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Comunidad Digital EcoAcción
          </h1>
          <p className="text-teal-100 text-sm mt-2 leading-relaxed">
            Conecta con ambientalistas, estudiantes, juntas de vecinos, rescatistas y organizaciones verificadas con vocación de servicio en la República Dominicana.
          </p>
        </div>

        <div className="bg-teal-950/80 border border-teal-600/50 p-4 rounded-2xl text-xs space-y-1.5 shrink-0 max-w-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldCheck size={16} />
            <span>Perfiles Verificados</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            ONGs e influencers usan su alcance para dar difusión masiva a las campañas vecinales.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, biografía o causa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden"
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

        {/* Roles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {ROLE_FILTERS.map((rf) => (
            <button
              key={rf.id}
              onClick={() => setSelectedRole(rf.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedRole === rf.id
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {rf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Member Directory Grid */}
      <div className="space-y-4">
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-teal-200 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-teal-50 text-teal-800 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border border-teal-100">
              <Users size={28} className="text-teal-600" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">Directorio Comunitario Listo</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              No hay usuarios falsos ni perfiles inventados. A medida que los ciudadanos y líderes comunitarios de República Dominicana se registren con su correo, aparecerán en esta red colaborativa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMembers.map((member) => {
              const isConnected = connectedMemberIds.includes(member.id);

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-4"
                  id={`member-card-${member.id}`}
                >
                  <div>
                    {/* Header Profile */}
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                        {member.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs" title="Perfil Verificado">
                            <CheckCircle2 size={13} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                            {member.name}
                          </h3>
                        </div>
                        <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                          {member.role}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                          <MapPin size={11} className="text-slate-400" />
                          <span>{member.province}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {member.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-1"
                        >
                          <Sparkles size={9} className="text-amber-600" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-500">
                      <span><strong>{member.campaignsJoined}</strong> campañas</span>
                      <span className="mx-1">•</span>
                      <span><strong>{member.reportsSubmitted}</strong> reportes</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setContactedMember(member)}
                        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Enviar mensaje o solicitud de apoyo"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        onClick={() => onConnectWithMember(member.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isConnected
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <UserPlus size={13} />
                        <span>{isConnected ? 'Conectado' : 'Conectar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message / Contact Modal */}
      {contactedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img 
                  src={contactedMember.avatar} 
                  alt={contactedMember.name} 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{contactedMember.name}</h3>
                  <span className="text-[10px] text-emerald-800">{contactedMember.role}</span>
                </div>
              </div>
              <button 
                onClick={() => setContactedMember(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {sentSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-slate-500">
                  {contactedMember.name} recibirá tu propuesta de colaboración en su bandeja de entrada de EcoAcción.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendDirectMessage} className="space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Coordina acciones, solicita difusión para una campaña barrial o invita a <strong>{contactedMember.name}</strong> a sumarse a una iniciativa.
                </p>
                <textarea
                  required
                  rows={4}
                  placeholder={`Hola ${contactedMember.name}, te escribo porque en mi comunidad estamos organizando...`}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setContactedMember(null)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                  >
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
