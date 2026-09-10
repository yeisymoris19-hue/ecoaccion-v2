import React, { useState, useEffect } from 'react';
import { X, Camera, Sparkles, MapPin, Upload, Trash2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { CategoryType, ProvinceRD, EcoReport, UserProfile } from '../types';
import { DOMINICAN_PROVINCES } from '../data/initialData';
import { api } from '../services/api';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: Omit<EcoReport, 'id' | 'createdAt' | 'supportsCount' | 'userSupported' | 'comments'>) => void;
  currentUser?: UserProfile | null;
}

const CATEGORY_OPTIONS: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'basura', label: 'Basura y Desechos', icon: '🗑️' },
  { id: 'calles', label: 'Calles y Carreteras dañadas', icon: '🚧' },
  { id: 'drenaje', label: 'Drenaje y Agua potable', icon: '💧' },
  { id: 'alumbrado', label: 'Alumbrado público', icon: '💡' },
  { id: 'contaminacion', label: 'Contaminación ambiental', icon: '🏭' },
  { id: 'infraestructura', label: 'Infraestructura en riesgo', icon: '🏚️' },
  { id: 'animales', label: 'Animales abandonados / fauna', icon: '🐾' },
  { id: 'servicios', label: 'Servicios básicos', icon: '⚡' },
  { id: 'otro', label: 'Otro problema comunitario', icon: '⚠️' },
];

export const NewReportModal: React.FC<NewReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('basura');
  const [province, setProvince] = useState<ProvinceRD>(currentUser?.province || 'Distrito Nacional');
  const [sector, setSector] = useState(currentUser?.sector || '');
  const [addressDetails, setAddressDetails] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || 'Ciudadano Activo');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setAuthorName(currentUser.name);
      setProvince(currentUser.province);
      if (currentUser.sector) setSector(currentUser.sector);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problemDescription.trim() || !proposedSolution.trim()) {
      alert('Por favor completa el título, la descripción del problema y tu propuesta de solución.');
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      province,
      sector: sector.trim() || 'Sector Comunitario',
      addressDetails: addressDetails.trim(),
      problemDescription: problemDescription.trim(),
      proposedSolution: proposedSolution.trim(),
      authorName: authorName.trim() || currentUser?.name || 'Ciudadano EcoAcción',
      authorAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName.trim())}&backgroundColor=059669`,
      status: 'reportado',
      imageUrl: imageUrl.trim() || undefined
    });

    onClose();
  };

  const processFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (JPG, PNG o WebP).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const serverUrl = await api.upload.uploadPhoto(file);
      setImageUrl(serverUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir la fotografía al servidor central.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-emerald-700 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-black/20 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-1.5">
              <span>🚨 EcoAlerta Ciudadana</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Nuevo Reporte Comunitario</h2>
            <p className="text-emerald-50 text-xs sm:text-sm mt-0.5">
              Tu voz informa con precisión y propone una solución para tu comunidad en RD.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-colors cursor-pointer"
            id="close-new-report-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Título breve del reporte *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Acumulación de plásticos en canal de drenaje"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium outline-hidden"
              id="report-input-title"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipo de problemática comunitaria *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base shrink-0">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ubicación en RD */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Provincia / Municipio *
              </label>
              <div className="relative">
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value as ProvinceRD)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium outline-hidden bg-white"
                  id="report-input-province"
                >
                  {DOMINICAN_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Sector o Barrio *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Los Mina, Gurabo, San Carlos..."
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium outline-hidden"
                id="report-input-sector"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dirección o punto de referencia exacto
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Ej: Calle Principal próx. al Colmado Hermanos Cruz, frente al parque"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-hidden"
              />
            </div>
          </div>

          {/* LAS DOS PREGUNTAS CLAVE DE ECOACCIÓN */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-2 text-amber-900">
              <Sparkles size={18} className="text-amber-600 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                El corazón de EcoAcción: Queja ➔ Propuesta
              </span>
            </div>

            {/* Pregunta 1 */}
            <div>
              <label className="block text-xs font-extrabold text-slate-900 mb-1">
                1. ¿Cuál es el problema? *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe qué ocurre, cómo afecta a los vecinos, desde cuándo sucede y la gravedad del asunto..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
                id="report-input-problem"
              />
            </div>

            {/* Pregunta 2 */}
            <div>
              <label className="block text-xs font-extrabold text-emerald-950 mb-1">
                2. ¿Qué solución propones? *
              </label>
              <textarea
                required
                rows={3}
                placeholder="¿Cómo sugieres resolverlo? (Ej: Jornada vecinal de limpieza, solicitar contenedores, coordinar con la junta de vecinos, reforestar...)"
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-hidden bg-white"
                id="report-input-solution"
              />
            </div>
          </div>

          {/* Fotografía o Evidencia Real Centralizada */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Fotografía de evidencia (Se almacena en el servidor central de EcoAcción)
            </label>

            {uploadError && (
              <div className="mb-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
            )}

            {isUploading ? (
              <div className="border-2 border-dashed border-emerald-500 rounded-2xl p-8 text-center bg-emerald-50/50 flex flex-col items-center justify-center gap-2">
                <Loader2 size={28} className="animate-spin text-emerald-700" />
                <p className="text-xs font-bold text-emerald-950">Subiendo fotografía al servidor central...</p>
                <p className="text-[11px] text-emerald-700">Guardando archivo permanentemente para que todos los usuarios puedan verla</p>
              </div>
            ) : imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-100 max-h-56">
                <img 
                  src={imageUrl} 
                  alt="Evidencia seleccionada" 
                  className="w-full h-48 object-cover" 
                />
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer"
                    title="Eliminar foto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>Foto guardada en el servidor</span>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50'
                }`}
              >
                <Camera size={32} className="mx-auto text-emerald-700 mb-2" />
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Arrastra tu fotografía aquí o selecciónala de tu galería
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Formatos JPG, PNG, WEBP (foto de la calle, basura, drenaje, avería o animal)
                </p>
                <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
                  <Upload size={14} className="text-emerald-700" />
                  <span>Tomar o Elegir Foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            )}
          </div>

          {/* Nombre del autor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tu Nombre o Seudónimo Ciudadano
            </label>
            <input
              type="text"
              placeholder="Ej: Lic. Altagracia Rosario"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm font-medium outline-hidden"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              id="submit-new-report-btn"
            >
              Publicar Reporte y Propuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
