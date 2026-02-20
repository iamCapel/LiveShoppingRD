import React, { useState, useRef, useEffect } from 'react';
import Auth from './pages/Auth';
import { Camera, DollarSign, Gavel, Users, Bell, ShoppingCart, Video, Play, Pause, X, Search, UserPlus, UserCheck, Plus, Home, User, Heart, Send, Clock, TrendingUp } from 'lucide-react';

const LiveShoppingApp = () => {
  // Estados principales
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
    // Función para manejar login/registro desde Auth
    const handleAuth = (user) => {
      setCurrentUser(user);
      setIsRegistered(true);
    };
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'search', 'notifications', 'profile'
  const [userType, setUserType] = useState(null);
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regType, setRegType] = useState('');
  
  // Estados de transmisión
  const [isLive, setIsLive] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [saleType, setSaleType] = useState('fixed');
  const [price, setPrice] = useState('');
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 50) + 10);
  const [reservations, setReservations] = useState([]);
  const [auctionTime, setAuctionTime] = useState(10);
  const [auctionActive, setAuctionActive] = useState(false);
  const [highestBidder, setHighestBidder] = useState(null);
  
  // Sistema de usuarios y social
  const [allUsers, setAllUsers] = useState([
    { id: 1, username: 'fashionista_rd', name: 'María González', type: 'seller', followers: 1250, following: 340, isFollowing: false, isLive: false, stories: [
      { id: 1, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400', timestamp: Date.now() - 2 * 60 * 60 * 1000, text: '¡Nuevas piezas llegando! 🔥' }
    ]},
    { id: 2, username: 'vintage_lover', name: 'Carlos Pérez', type: 'seller', followers: 890, following: 200, isFollowing: false, isLive: true, stories: [
      { id: 2, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400', timestamp: Date.now() - 5 * 60 * 60 * 1000, text: 'Live en 2 horas ⏰' }
    ]},
    { id: 3, username: 'streetwear_santo', name: 'Ana Jiménez', type: 'seller', followers: 2100, following: 150, isFollowing: false, isLive: false, stories: [] },
    { id: 4, username: 'luxury_finds', name: 'Roberto Martínez', type: 'seller', followers: 3400, following: 89, isFollowing: false, isLive: true, stories: [
      { id: 3, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400', timestamp: Date.now() - 1 * 60 * 60 * 1000, text: 'Colección especial 💎' }
    ]},
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [following, setFollowing] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryUser, setCurrentStoryUser] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showAddStory, setShowAddStory] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [viewingLive, setViewingLive] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const auctionTimerRef = useRef(null);
  const storyInputRef = useRef(null);

  // Simular usuarios conectados
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);
  // Mostrar la página de autenticación si no está registrado
  if (!isRegistered) {
    return <Auth onAuth={handleAuth} />;
  }

  const registerUser = (username, name, type) => {
    const newUser = {
      id: Date.now(),
      username,
      name,
      type,
      followers: 0,
      following: 0,
      isFollowing: false,
      isLive: false,
      stories: []
    };
    setCurrentUser(newUser);
    setUserType(type);
    setIsRegistered(true);
    
    if (type === 'seller') {
      setAllUsers(prev => [...prev, newUser]);
    }
  };

  const toggleFollow = (userId) => {
    setAllUsers(prev => {
      const newUsers = prev.map(user => {
        if (user.id === userId) {
          const newIsFollowing = !user.isFollowing;
          return {
            ...user,
            isFollowing: newIsFollowing,
            followers: user.followers + (newIsFollowing ? 1 : -1)
          };
        }
        return user;
      });
      
      // Actualizar following basado en el nuevo estado
      const updatedUser = newUsers.find(u => u.id === userId);
      if (updatedUser) {
        if (updatedUser.isFollowing) {
          setFollowing(prev => [...prev, updatedUser]);
        } else {
          setFollowing(prev => prev.filter(u => u.id !== userId));
        }
      }
      
      return newUsers;
    });
  };

  const addStory = (imageUrl) => {
    const newStory = {
      id: Date.now(),
      image: imageUrl,
      timestamp: Date.now(),
      text: storyText
    };
    
    setMyStories(prev => [...prev, newStory]);
    
    if (currentUser) {
      setAllUsers(prev => prev.map(user => 
        user.id === currentUser.id 
          ? { ...user, stories: [...user.stories, newStory] }
          : user
      ));
    }
    
    setStoryText('');
    setShowAddStory(false);
  };

  const viewStories = (user) => {
    setCurrentStoryUser(user);
    setCurrentStoryIndex(0);
    setShowStoryViewer(true);
  };

  const nextStory = () => {
    if (currentStoryUser && currentStoryIndex < currentStoryUser.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      setShowStoryViewer(false);
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  const getTimeAgo = (timestamp) => {
    const hours = Math.floor((Date.now() - timestamp) / (60 * 60 * 1000));
    if (hours < 1) return 'ahora';
    if (hours === 1) return '1h';
    return `${hours}h`;
  };

  const startLiveStream = async () => {
    // Guard para entornos sin navegador
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      alert('La cámara no está disponible en este entorno');
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsLive(true);
      
      if (currentUser) {
        setAllUsers(prev => prev.map(user => 
          user.id === currentUser.id ? { ...user, isLive: true } : user
        ));
      }
    } catch (err) {
      alert('No se pudo acceder a la cámara');
    }
  };

  const stopLiveStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsLive(false);
    setCurrentItem(null);
    
    if (currentUser) {
      setAllUsers(prev => prev.map(user => 
        user.id === currentUser.id ? { ...user, isLive: false } : user
      ));
    }
  };

  const captureScreenshot = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Guard para entornos sin navegador
    if (!canvas || !video || typeof canvas.getContext !== 'function') {
      return null;
    }
    
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL('image/png');
    }
    return null;
  };

  const showNewItem = () => {
    const itemNumber = (reservations.length + 1);
    setCurrentItem({
      id: Date.now(),
      name: `Pieza #${itemNumber}`,
      number: itemNumber
    });
    setPrice('');
    setCurrentBid(0);
    setSaleType('fixed');
    setAuctionActive(false);
    setAuctionTime(10);
    setHighestBidder(null);
  };

  const setItemPrice = () => {
    if (!price || parseFloat(price) <= 0) {
      alert('Ingresa un precio válido');
      return;
    }
    
    if (saleType === 'auction') {
      setCurrentBid(parseFloat(price));
      setAuctionActive(true);
      setAuctionTime(10);
    }
  };

  const placeBid = () => {
    if (!auctionActive) {
      alert('La subasta no está activa');
      return;
    }
    
    if (!bidAmount || parseFloat(bidAmount) <= currentBid) {
      alert(`La puja debe ser mayor a $${currentBid.toFixed(2)}`);
      return;
    }
    
    const bidderName = currentUser?.username || 'Comprador';
    setCurrentBid(parseFloat(bidAmount));
    setHighestBidder(bidderName);
    setAuctionTime(10);
    setBidAmount('');
    
    const notification = {
      id: Date.now(),
      type: 'bid',
      user: bidderName,
      amount: parseFloat(bidAmount),
      item: currentItem?.name,
      time: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const reserveItem = () => {
    const screenshot = captureScreenshot();
    const reservation = {
      id: Date.now(),
      user: currentUser?.username || 'Comprador',
      item: currentItem?.name || 'Pieza actual',
      price: saleType === 'auction' ? currentBid : parseFloat(price),
      screenshot: screenshot,
      time: new Date().toLocaleTimeString()
    };
    
    setReservations(prev => [...prev, reservation]);
    
    const notification = {
      id: Date.now(),
      type: 'reservation',
      user: reservation.user,
      item: reservation.item,
      price: reservation.price,
      screenshot: screenshot,
      time: reservation.time
    };
    setNotifications(prev => [notification, ...prev]);
    
    alert('¡Reserva realizada! 🎉');
  };

  // PANTALLA DE REGISTRO
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-500 to-pink-500 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                <ShoppingCart className="w-10 h-10 text-purple-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">ShopLive</h1>
              <p className="text-purple-100">Compra y vende en vivo</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="@tunombre"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de cuenta</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRegType('seller')}
                    className={`py-4 rounded-xl font-medium transition-all ${
                      regType === 'seller' 
                        ? 'bg-purple-500 text-white shadow-lg scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Video className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">Vendedor</span>
                  </button>
                  <button
                    onClick={() => setRegType('buyer')}
                    className={`py-4 rounded-xl font-medium transition-all ${
                      regType === 'buyer' 
                        ? 'bg-pink-500 text-white shadow-lg scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ShoppingCart className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">Comprador</span>
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (!regUsername || !regName || !regType) {
                    alert('Completa todos los campos');
                    return;
                  }
                  registerUser(regUsername, regName, regType);
                  setRegUsername('');
                  setRegName('');
                  setRegType('');
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Comenzar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISOR DE STORIES
  if (showStoryViewer && currentStoryUser) {
    const currentStory = currentStoryUser.stories[currentStoryIndex];
    
    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="h-full flex items-center justify-center">
          <button
            onClick={() => setShowStoryViewer(false)}
            className="absolute top-4 right-4 text-white z-20 bg-black/30 p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Barras de progreso */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
            {currentStoryUser.stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all duration-300 ${
                    idx === currentStoryIndex ? 'w-full' : idx < currentStoryIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
          
          {/* Info del usuario */}
          <div className="absolute top-8 left-4 z-20 flex items-center gap-3 mt-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentStoryUser.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{currentStoryUser.username}</p>
              <p className="text-white/80 text-xs">{getTimeAgo(currentStory.timestamp)}</p>
            </div>
          </div>
          
          {/* Imagen de la story */}
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${currentStory.image})` }}
          >
            <button onClick={prevStory} className="absolute left-0 top-0 bottom-0 w-1/3 z-10" />
            <button onClick={nextStory} className="absolute right-0 top-0 bottom-0 w-2/3 z-10" />
            
            {currentStory.text && (
              <div className="absolute bottom-20 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-white">{currentStory.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MODAL AGREGAR STORY
  if (showAddStory) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Nueva Story</h3>
              <button onClick={() => setShowAddStory(false)} className="text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de imagen</label>
              <input
                ref={storyInputRef}
                type="text"
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="¿Qué mostrarás en tu próximo live?"
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 bg-gray-50 resize-none"
              />
            </div>
            
            <button
              onClick={() => {
                const url = storyInputRef.current?.value;
                if (url) {
                  addStory(url);
                } else {
                  alert('Ingresa una URL');
                }
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold shadow-lg"
            >
              Publicar Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VISTA PRINCIPAL - COMPRADOR
  if (userType === 'buyer') {
    // Tab Home - Feed principal
    if (activeTab === 'home') {
      const liveUsers = allUsers.filter(u => u.isLive && u.isFollowing);
      const followedWithStories = following.filter(u => u.stories && u.stories.length > 0);
      
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Header */}
          <div className="bg-white border-b sticky top-0 z-10">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">ShopLive</h1>
                <Bell className="w-6 h-6 text-gray-600" />
              </div>
              
              {/* Stories */}
              {followedWithStories.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
                  {followedWithStories.map(user => (
                    <button
                      key={user.id}
                      onClick={() => viewStories(user)}
                      className="flex-shrink-0 flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
                        <div className="w-full h-full bg-white rounded-full p-0.5">
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            {user.username[0].toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 max-w-[64px] truncate">{user.username}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Lives activos */}
          {liveUsers.length > 0 && (
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                En vivo ahora
              </h2>
              <div className="space-y-3">
                {liveUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setViewingLive(user)}
                    className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative">
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        EN VIVO
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {Math.floor(Math.random() * 100) + 50}
                      </div>
                    </div>
                    <div className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-800">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Mensaje si no sigue a nadie */}
          {following.length === 0 && (
            <div className="p-4">
              <div className="bg-white rounded-2xl p-8 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">¡Descubre vendedores!</h3>
                <p className="text-gray-600 text-sm mb-4">Busca y sigue vendedores para ver sus lives y stories</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="bg-purple-500 text-white px-6 py-3 rounded-xl font-medium"
                >
                  Explorar
                </button>
              </div>
            </div>
          )}
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom">
            <div className="grid grid-cols-4 gap-1 p-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 ${
                  activeTab === 'home' ? 'text-purple-500' : 'text-gray-400'
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Inicio</span>
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 ${
                  activeTab === 'search' ? 'text-purple-500' : 'text-gray-400'
                }`}
              >
                <Search className="w-6 h-6" />
                <span className="text-xs font-medium">Buscar</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 relative ${
                  activeTab === 'notifications' ? 'text-purple-500' : 'text-gray-400'
                }`}
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <div className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
                )}
                <span className="text-xs font-medium">Alertas</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 ${
                  activeTab === 'profile' ? 'text-purple-500' : 'text-gray-400'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Tab Search - Búsqueda
    if (activeTab === 'search') {
      const filteredUsers = allUsers.filter(user => 
        user.type === 'seller' && 
        (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
         user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Header con búsqueda */}
          <div className="bg-white border-b sticky top-0 z-10 p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vendedores..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No se encontraron vendedores</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      user.stories.length > 0 
                        ? 'bg-gradient-to-br from-purple-400 to-pink-500 p-0.5' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${
                        user.stories.length > 0 ? 'bg-white text-purple-500' : ''
                      }`}>
                        {user.username[0].toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.followers.toLocaleString()} seguidores</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`px-5 py-2 rounded-xl font-medium transition-all ${
                      user.isFollowing
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {user.isFollowing ? 'Siguiendo' : 'Seguir'}
                  </button>
                </div>
              ))
            )}
          </div>
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom">
            <div className="grid grid-cols-4 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Inicio</span>
              </button>
              <button onClick={() => setActiveTab('search')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-purple-500">
                <Search className="w-6 h-6" />
                <span className="text-xs font-medium">Buscar</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Bell className="w-6 h-6" />
                <span className="text-xs font-medium">Alertas</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Tab Profile
    if (activeTab === 'profile') {
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          <div className="bg-white border-b p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {currentUser?.username[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{currentUser?.username}</h2>
                <p className="text-gray-600">{currentUser?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{following.length}</p>
                <p className="text-sm text-gray-600">Siguiendo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{reservations.length}</p>
                <p className="text-sm text-gray-600">Compras</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">0</p>
                <p className="text-sm text-gray-600">Guardados</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsRegistered(false)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom">
            <div className="grid grid-cols-4 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Inicio</span>
              </button>
              <button onClick={() => setActiveTab('search')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Search className="w-6 h-6" />
                <span className="text-xs font-medium">Buscar</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Bell className="w-6 h-6" />
                <span className="text-xs font-medium">Alertas</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-purple-500">
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // VISTA VENDEDOR
  if (userType === 'seller') {
    if (activeTab === 'home') {
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Header */}
          <div className="bg-white border-b">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {currentUser?.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">{currentUser?.username}</h2>
                    <p className="text-xs text-gray-500">{currentUser?.followers} seguidores</p>
                  </div>
                </div>
                {!isLive && (
                  <button
                    onClick={startLiveStream}
                    className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    En vivo
                  </button>
                )}
              </div>
              
              {/* Stories */}
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
                <button
                  onClick={() => setShowAddStory(true)}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-600">Tu Story</span>
                </button>
                
                {myStories.length > 0 && (
                  <button
                    onClick={() => viewStories({ ...currentUser, stories: myStories })}
                    className="flex-shrink-0 flex flex-col items-center gap-2"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
                      <div 
                        className="w-full h-full rounded-full bg-cover bg-center border-2 border-white"
                        style={{ backgroundImage: `url(${myStories[myStories.length - 1].image})` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{myStories.length} story</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Panel de control de live */}
          {isLive && (
            <div className="p-4 space-y-4">
              {/* Video */}
              <div className="bg-black rounded-2xl overflow-hidden relative aspect-video shadow-xl">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  EN VIVO
                </div>
                <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {viewers}
                </div>
              </div>
              
              {/* Controles */}
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={showNewItem}
                    className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                  >
                    Nueva Pieza
                  </button>
                  <button
                    onClick={stopLiveStream}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Detener
                  </button>
                </div>
                
                {currentItem && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-gray-800">{currentItem.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSaleType('fixed')}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          saleType === 'fixed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
                        }`}
                      >
                        Precio fijo
                      </button>
                      <button
                        onClick={() => setSaleType('auction')}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          saleType === 'auction' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
                        }`}
                      >
                        Subasta
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={saleType === 'auction' ? 'Puja inicial' : 'Precio'}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={setItemPrice}
                        className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                      >
                        OK
                      </button>
                    </div>
                    
                    {saleType === 'auction' && currentBid > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-yellow-700">Puja actual</p>
                            <p className="text-xl font-bold text-yellow-600">${currentBid.toFixed(2)}</p>
                            {highestBidder && (
                              <p className="text-xs text-yellow-600">Por: {highestBidder}</p>
                            )}
                          </div>
                          {auctionActive && (
                            <div className="text-center">
                              <p className="text-xs text-yellow-700">Cierra en</p>
                              <p className={`text-3xl font-bold ${auctionTime <= 3 ? 'text-red-500 animate-pulse' : 'text-yellow-600'}`}>
                                {auctionTime}s
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Notificaciones */}
              {notifications.length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-3">Actividad reciente</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {notifications.slice(0, 5).map(notif => (
                      <div key={notif.id} className="bg-gray-50 rounded-xl p-3 text-sm">
                        <p className="font-semibold text-gray-800">{notif.user}</p>
                        <p className="text-gray-600">
                          {notif.type === 'reservation' ? '¡Reservó!' : 
                           notif.type === 'bid' ? `Pujó $${notif.amount}` : 
                           'Actividad'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!isLive && (
            <div className="p-4">
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Comienza tu transmisión</h3>
                <p className="text-gray-600 text-sm mb-4">Muestra tus productos en vivo y vende en tiempo real</p>
                <button
                  onClick={startLiveStream}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Ir en vivo ahora
                </button>
              </div>
            </div>
          )}
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom">
            <div className="grid grid-cols-3 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-purple-500">
                <Video className="w-6 h-6" />
                <span className="text-xs font-medium">Live</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400 relative">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <div className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
                )}
                <span className="text-xs font-medium">Alertas</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'profile') {
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          <div className="bg-white border-b p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {currentUser?.username[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{currentUser?.username}</h2>
                <p className="text-gray-600">{currentUser?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{currentUser?.followers || 0}</p>
                <p className="text-sm text-gray-600">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{reservations.length}</p>
                <p className="text-sm text-gray-600">Ventas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{myStories.length}</p>
                <p className="text-sm text-gray-600">Stories</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsRegistered(false)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom">
            <div className="grid grid-cols-3 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Video className="w-6 h-6" />
                <span className="text-xs font-medium">Live</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Bell className="w-6 h-6" />
                <span className="text-xs font-medium">Alertas</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-purple-500">
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default LiveShoppingApp;