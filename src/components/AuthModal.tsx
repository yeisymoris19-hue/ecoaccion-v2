import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  User, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock,
  Upload, 
  Camera,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { UserProfile, ProvinceRD } from '../types';
import { DOMINICAN_PROVINCES } from '../data/initialData';
import { BeeLogo } from './BeeLogo';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  actionReason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  actionReason
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState<ProvinceRD>('Distrito Nacional');
  const [sector, setSector] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('Vecino Activo');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [bio, setBio] = useState('');

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local image upload for profile avatar
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        setErrorMessage(null);
        const url = await api.upload.uploadPhoto(file);
        setAvatarUrl(url);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error al subir la fotografía.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.login({
        email: loginEmail.trim(),
        password: loginPassword
      });
      onLogin(res.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Por favor completa los campos obligatorios (*).');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres por seguridad.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        province,
        sector: sector.trim() || 'Comunidad general',
        requestedRole: role === 'Organización Verificada' ? 'verified_org' : 'user',
        bio: bio.trim() || `Ciudadano(a) comprometido(a) con la mejora comunitaria en ${province}.`
      });

      onLogin(res.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al registrar la cuenta. Intenta con otro correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full my-auto shadow-2xl border border-emerald-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <BeeLogo size={36} showText={false} />
            <div>
              <h2 className="text-lg sm:text-xl font-black">EcoAcción Dominicana</h2>
              <p className="text-emerald-200 text-xs mt-0.5">
                «Tu voz informa, nuestras acciones transforman.»
              </p>
            </div>
          </div>

          {typeof actionReason === 'string' && actionReason.trim().length > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-800/80 border border-emerald-600/50 text-xs text-emerald-100 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-300 shrink-0" />
              <span>{actionReason}</span>
            </div>
          )}
        </div>

        {/* Free exploration notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 text-[11px] text-amber-900 flex items-start gap-2">
          <span className="font-bold text-amber-950">Nota:</span>
          <span>
            Navegar y explorar la aplicación es 100% libre sin registro. Solo necesitas ingresar si deseas <strong>participar activamente</strong> (reportar, enviar fotos, proponer o unirte a campañas).
          </span>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(null); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              mode === 'register'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Crear Usuario (Registrarme)
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(null); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-b-2 ${
              mode === 'login'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ya tengo cuenta (Ingresar)
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh]">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez / María Gómez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                  Correo Electrónico * <span className="text-slate-400 font-normal">(Para tu cuenta)</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="tu.correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                  Contraseña Segura * <span className="text-slate-400 font-normal">(Mínimo 6 caracteres)</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                    Provincia / Municipio *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value as ProvinceRD)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden bg-white"
                  >
                    {DOMINICAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                    Sector o Barrio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Los Mina, Bella Vista, etc."
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                  ¿Cómo deseas participar? (Rol)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden bg-white"
                >
                  <option value="Vecino Activo">🤝 Vecino Activo (Comunidad)</option>
                  <option value="Ambientalista">🌱 Ambientalista / Amigo del Reciclaje</option>
                  <option value="Líder Comunitario">📢 Líder Comunitario / Junta de Vecinos</option>
                  <option value="Estudiante Voluntario">🎓 Estudiante / Joven Voluntario</option>
                  <option value="Rescatista Animal">🐾 Rescatista Animal</option>
                  <option value="Organización Verificada">🏛️ Organización / ONG / Colectivo (Sujeto a verificación)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  * Nota: Las cuentas se registran como ciudadanos regulares. Las insignias de verificación oficial (ONG, empresa o líder) requieren comprobación por administración.
                </p>
              </div>

              {/* Photo Upload for Profile */}
              <div>
                <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                  Foto de perfil (Opcional)
                </label>
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                      <Camera size={20} />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold cursor-pointer text-slate-700">
                    <Upload size={14} />
                    <span>Seleccionar foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creando cuenta en el servidor...</span>
                  </>
                ) : (
                  <>
                    <span>Crear mi Cuenta y Continuar</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
              <p className="text-slate-600 text-xs">
                Ingresa con tu correo y contraseña registrados para participar en la plataforma.
              </p>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                  Tu Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="tu.correo@ejemplo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] uppercase mb-1">
                  Tu Contraseña *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar a EcoAcción</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(null); }}
                  className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  ¿No tienes usuario aún? Regístrate aquí
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
