import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, Flag, Sparkles, Building2 } from 'lucide-react';
import { Campaign, ProvinceRD } from '../types';
import { DOMINICAN_PROVINCES } from '../data/initialData';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: Omit<Campaign, 'id' | 'registeredVolunteers' | 'isUserRegistered' | 'status'>) => void;
  initialValues?: Partial<Campaign>;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [tagline, setTagline] = useState(initialValues?.tagline || '');
  const [category, setCategory] = useState<Campaign['category']>(initialValues?.category || 'recuperacion_parque');
  const [province, setProvince] = useState<ProvinceRD>(initialValues?.province || 'Distrito Nacional');
  const [locationName, setLocationName] = useState(initialValues?.locationName || '');
  const [meetingPoint, setMeetingPoint] = useState(initialValues?.meetingPoint || '');
  const [date, setDate] = useState(initialValues?.date || 'Sábado, 26 de Septiembre 2026');
  const [time, setTime] = useState(initialValues?.time || '8:00 AM - 12:00 PM');
  const [objective, setObjective] = useState(initialValues?.objective || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [targetVolunteers, setTargetVolunteers] = useState<number>(initialValues?.targetVolunteers || 30);
  const [organizerName, setOrganizerName] = useState(initialValues?.organizer?.name || 'Comunidad Organizada');
  const [collaboratingOrgs, setCollaboratingOrgs] = useState(initialValues?.collaboratingOrgs?.join(', ') || 'Junta de Vecinos, Voluntarios EcoAcción');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorContribution, setSponsorContribution] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !objective.trim()) {
      alert('Por favor completa el nombre de la campaña, la ubicación y el objetivo.');
      return;
    }

    const sponsorsList = sponsorName.trim() 
      ? [{ name: sponsorName.trim(), contribution: sponsorContribution.trim() || 'Aporte en logística e hidratación' }]
      : [];

    onSubmit({
      title: title.trim(),
      tagline: tagline.trim() || 'Unidos por el bienestar de nuestra comunidad',
      category,
      province,
      locationName: locationName.trim(),
      meetingPoint: meetingPoint.trim() || locationName.trim(),
      date,
      time,
      objective: objective.trim(),
      description: description.trim() || objective.trim(),
      targetVolunteers: Number(targetVolunteers) || 25,
      imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
      organizer: {
        name: organizerName.trim() || 'Comité Ciudadano',
        type: 'comunidad',
        verified: true
      },
      collaboratingOrgs: collaboratingOrgs.split(',').map(s => s.trim()).filter(Boolean),
      sponsors: sponsorsList,
      originReportId: initialValues?.originReportId
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
              <Flag size={12} />
              <span>Acción Comunitaria</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Crear Campaña Organizada</h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
              Pasa de la queja a la acción: convoca voluntarios, fija lugar y fecha, y transforma tu comunidad.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
              Nombre de la Campaña *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: «Recuperemos nuestro parque Los Mina»"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
              Lema / Frase motivadora
            </label>
            <input
              type="text"
              placeholder="Ej: Transformando un vertedero en un espacio verde para nuestros niños."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Tipo de Campaña
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden bg-white"
              >
                <option value="recuperacion_parque">🌳 Recuperación de Parque / Espacio Público</option>
                <option value="limpieza_playa">🏖️ Limpieza de Playa o Costa</option>
                <option value="limpieza_rio">💧 Limpieza y Protección de Ríos</option>
                <option value="reforestacion">🌱 Siembra y Cuidado de Árboles</option>
                <option value="bacheo_comunitario">🚧 Bacheo y Arreglo Comunitario</option>
                <option value="reciclaje">♻️ Jornada y Campaña de Reciclaje</option>
                <option value="proteccion_animal">🐾 Rescate y Adopción Animal</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Provincia de RD *
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value as ProvinceRD)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden bg-white"
              >
                {DOMINICAN_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Lugar de la actividad *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Parque Enriquillo, Av. Duarte"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Punto exacto de encuentro *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Frente a la glorieta central"
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Fecha
              </label>
              <input
                type="text"
                placeholder="Ej: Sábado, 28 de Septiembre 2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Horario
              </label>
              <input
                type="text"
                placeholder="Ej: 8:00 AM - 12:30 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                Meta de Voluntarios
              </label>
              <input
                type="number"
                min={5}
                max={500}
                value={targetVolunteers}
                onChange={(e) => setTargetVolunteers(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
              Objetivo de la actividad *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Retirar 2 toneladas de desechos e instalar puntos de reciclaje fijos."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
              Descripción de lo que se desea realizar
            </label>
            <textarea
              rows={3}
              placeholder="Explica detalladamente qué actividades se llevarán a cabo, qué deben llevar los participantes (gorra, calzado cómodo) y el cronograma..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
            />
          </div>

          {/* Collaborators and Sponsors */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 text-xs block">
              Alianzas y Patrocinios comunitarios:
            </span>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Organización o Colectivo convocante
                </label>
                <input
                  type="text"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 outline-hidden bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Entidades colaboradoras (separadas por coma)
                </label>
                <input
                  type="text"
                  value={collaboratingOrgs}
                  onChange={(e) => setCollaboratingOrgs(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 outline-hidden bg-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Empresa patrocinadora (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Ferretería El Sol"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 outline-hidden bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Aporte del patrocinador
                </label>
                <input
                  type="text"
                  placeholder="Ej: Fundas industriales y guantes"
                  value={sponsorContribution}
                  onChange={(e) => setSponsorContribution(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 outline-hidden bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Lanzar Campaña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
