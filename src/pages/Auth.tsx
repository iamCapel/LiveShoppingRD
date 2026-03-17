import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/liveshopping-logo.png';
import livesellPattern from '../assets/livesell-pattern.jpg';
import livesellLogo from '../assets/livesell-logo.png';
import { FaGoogle, FaFacebookF, FaPhone } from 'react-icons/fa';

interface AuthProps {
  onAuth: (user: { email: string; name: string; username: string; token: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

  // Si la URL trae token (después del callback OAuth), iniciar sesión automáticamente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    // Guardar y limpiar URL
    localStorage.setItem('liveShoppingAuth', JSON.stringify({ token }));
    params.delete('token');
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);

    // Solicitar datos del usuario al backend
    fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (!res.ok) throw new Error('Token inválido');
        return res.json();
      })
      .then(data => {
        onAuth({
          email: data.email,
          name: data.name,
          username: data.username,
          token,
        });
      })
      .catch(() => {
        localStorage.removeItem('liveShoppingAuth');
      });
  }, [API_URL, onAuth]);

  // Efecto 3D de movimiento del fondo con mouse y giroscopio
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        // beta: inclinación adelante-atrás (-180 a 180)
        // gamma: inclinación izquierda-derecha (-90 a 90)
        const x = (e.gamma / 90) * 20;
        const y = (e.beta / 180) * 20;
        setMousePosition({ x, y });
      }
    };

    // Detectar si es dispositivo móvil y usar giroscopio, sino usar mouse
    if (window.DeviceOrientationEvent && /Mobi|Android/i.test(navigator.userAgent)) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const validate = () => {
    if (!email.match(/^\S+@\S+\.\S+$/)) return 'Correo inválido';
    if (!isLogin && name.trim().length < 2) return 'Nombre completo muy corto';
    if (!isLogin && username.trim().length < 3) return 'Nombre de usuario muy corto';
    // El teléfono es opcional; si se ingresa, debe ser válido (10-15 dígitos).
    if (!isLogin && phone && !phone.match(/^\d{10,15}$/)) return 'Teléfono inválido';
    if (password.length < 6) return 'Contraseña muy corta';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);

    try {
      const body = isLogin
        ? { email, password }
        : { email, password, username, name, type: 'buyer' };

      const response = await fetch(`${API_URL}/api/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // Puede fallar si el servidor retorna un HTML/Texto en vez de JSON.
      }

      if (!response.ok) {
        const message = data?.detail || data?.message || response.statusText || `Error ${response.status}`;
        throw new Error(message);
      }

      setSuccess(isLogin ? '¡Sesión iniciada!' : '¡Cuenta creada exitosamente!');

      // Guardar sesión en localStorage para persistencia
      localStorage.setItem('liveShoppingAuth', JSON.stringify(data));

      onAuth({
        email: data.email,
        name: data.name,
        username: data.username,
        type: data.type,
        token: data.token,
      });

      setEmail('');
      setPassword('');
      setName('');
      setUsername('');
      setPhone('');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Fondo de patrón LiveSell con efecto 3D */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url(${livesellPattern})`,
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
          filter: 'brightness(0.85)',
        }}
      />
      
      {/* Overlay oscuro para mejor legibilidad */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Contenido del formulario */}
      <div className="relative z-10 bg-white/5 p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-3 space-y-4">
          <div className="bg-white/10 p-2 rounded-full">
            <img src={logo} alt="LiveSell Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            <img src={livesellLogo} alt="LiveSell" className="w-96 h-auto" />
          </h1>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>
        {/* Botones de registro social */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => (window.location.href = `${API_URL}/auth/google`)}
            className="bg-white/10 rounded-full p-3 hover:bg-white/20 transition-all hover:scale-110"
          >
            <FaGoogle className="w-5 h-5 text-white drop-shadow" />
          </button>
          <button type="button" className="bg-white/10 rounded-full p-3 hover:bg-white/20 transition-all hover:scale-110">
            <FaPhone className="w-5 h-5 text-white drop-shadow" />
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = `${API_URL}/auth/facebook`)}
            className="bg-white/10 rounded-full p-3 hover:bg-white/20 transition-all hover:scale-110"
          >
            <FaFacebookF className="w-5 h-5 text-white drop-shadow" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
                required
              />
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
                required
              />
              <input
                type="tel"
                placeholder="Número de teléfono (opcional)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-3 rounded-lg hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all hover:scale-105 flex items-center justify-center font-semibold"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
            ) : null}
            {isLogin ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
        {error && <div className="mt-2 text-red-300 bg-red-500/20 rounded-lg p-2 text-center text-sm">{error}</div>}
        {success && <div className="mt-2 text-green-300 bg-green-500/20 rounded-lg p-2 text-center text-sm">{success}</div>}
        <div className="mt-4 text-center">
          <button
            className="text-white hover:text-pink-300 transition-colors font-medium drop-shadow"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
          >
            {isLogin ? '¿No tienes cuenta? Crear una' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
