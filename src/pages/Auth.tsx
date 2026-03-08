import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/liveshopping-logo.png';
import livesellPattern from '../assets/livesell-pattern.jpg';
import livesellLogo from '../assets/livesell-logo.png';
import { FaGoogle, FaFacebookF, FaPhone } from 'react-icons/fa';

interface AuthProps {
  onAuth: (user: { email: string; name: string; username: string; type: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (!isLogin && !userType) return 'Selecciona si vas a vender o comprar';
    if (!isLogin && !phone.match(/^\d{10,15}$/)) return 'Teléfono inválido';
    if (password.length < 6) return 'Contraseña muy corta';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(isLogin ? '¡Sesión iniciada!' : '¡Cuenta creada exitosamente!');
      onAuth({ 
        email, 
        name: isLogin ? 'Usuario' : name,
        username: isLogin ? email.split('@')[0] : username,
        type: userType || 'buyer'
      });
      setEmail('');
      setPassword('');
      setName('');
    }, 1200);
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
          <button type="button" className="bg-white/10 rounded-full p-3 hover:bg-white/20 transition-all hover:scale-110">
            <FaGoogle className="w-5 h-5 text-white drop-shadow" />
          </button>
          <button type="button" className="bg-white/10 rounded-full p-3 hover:bg-white/20 transition-all hover:scale-110">
            <FaPhone className="w-5 h-5 text-white drop-shadow" />
          </button>
          <button type="button" className="bg-white/10 rounded-full p-3 hover:bg-white/20 transition-all hover:scale-110">
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
              <select
                value={userType}
                onChange={e => setUserType(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
                required
              >
                <option value="" className="bg-gray-800">¿Vas a vender o comprar?</option>
                <option value="seller" className="bg-gray-800">Vender</option>
                <option value="buyer" className="bg-gray-800">Comprar</option>
              </select>
              <input
                type="tel"
                placeholder="Número de teléfono"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
                required
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
