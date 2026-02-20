import React, { useState } from 'react';
import logo from '../assets/liveshopping-logo.png';
import { FaGoogle, FaFacebookF, FaPhone } from 'react-icons/fa';

interface AuthProps {
  onAuth: (user: { email: string; name: string }) => void;
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
      onAuth({ email, name: isLogin ? 'Usuario' : name });
      setEmail('');
      setPassword('');
      setName('');
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="LiveShoppingRD Logo" className="w-24 h-24 mb-2" />
          <span className="text-lg font-semibold text-gray-700">LiveShoppingRD</span>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h2>
        {/* Botones de registro social */}
        <div className="flex justify-center gap-4 mb-4">
          <button type="button" className="bg-white border border-gray-300 rounded-full p-3 shadow hover:bg-gray-100 transition">
            <FaGoogle className="w-5 h-5 text-red-500" />
          </button>
          <button type="button" className="bg-white border border-gray-300 rounded-full p-3 shadow hover:bg-gray-100 transition">
            <FaPhone className="w-5 h-5 text-green-500" />
          </button>
          <button type="button" className="bg-white border border-gray-300 rounded-full p-3 shadow hover:bg-gray-100 transition">
            <FaFacebookF className="w-5 h-5 text-blue-600" />
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
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <select
                value={userType}
                onChange={e => setUserType(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">¿Vas a vender o comprar?</option>
                <option value="seller">Vender</option>
                <option value="buyer">Comprar</option>
              </select>
              <input
                type="tel"
                placeholder="Número de teléfono"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-blue-600 rounded-full inline-block"></span>
            ) : null}
            {isLogin ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
        {error && <div className="mt-2 text-red-600 text-center text-sm">{error}</div>}
        {success && <div className="mt-2 text-green-600 text-center text-sm">{success}</div>}
        <div className="mt-4 text-center">
          <button
            className="text-blue-600 hover:underline"
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
