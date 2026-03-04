import React, { useState, useRef, useEffect } from 'react';
import Auth from './pages/Auth';
import { Camera, DollarSign, Gavel, Users, Bell, ShoppingCart, Video, Play, Pause, X, Search, UserPlus, UserCheck, Plus, PlusCircle, Home, User, Heart, Send, Clock, TrendingUp, Image } from 'lucide-react';

const LiveShoppingApp = () => {
  // Estados principales
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
    // Función para manejar login/registro desde Auth
    const handleAuth = (user) => {
      setCurrentUser(user);
      setUserType(user.type);
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
  
  // Posts de LiveSell
  const [livePosts, setLivePosts] = useState([
    {
      id: 1,
      username: 'modasanard',
      name: 'Moda Sanard',
      location: 'Santo Domingo',
      avatar: '👗',
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800'],
      description: '✨ Nueva colección verano 2025 — vestidos, blusas y conjuntos importados. Precios especiales solo durante el live 🔥',
      interested: 248,
      countdown: 1847,
      currentSlide: 0
    },
    {
      id: 2,
      username: 'styledr_oficial',
      name: 'Style DR',
      location: 'Santiago',
      avatar: '👠',
      images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800'],
      description: 'Calzados importados colección 2025 👠 Sandalias, tacones, sneakers y más. ¡Stock limitado!',
      interested: 134,
      countdown: 723,
      currentSlide: 0
    },
    {
      id: 3,
      username: 'glamrd_beauty',
      name: 'Glam RD Beauty',
      location: 'Santo Domingo',
      avatar: '💄',
      images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'],
      description: 'Maquillaje profesional importado ✨ Sets completos, polvos, labiales y bases. Envío gratis en compras +RD$1,000 🇩🇴',
      interested: 89,
      countdown: 3601,
      currentSlide: 0
    },
    {
      id: 4,
      username: 'bolsasrd_store',
      name: 'Bolsas RD',
      location: 'La Romana',
      avatar: '👜',
      images: ['https://images.unsplash.com/photo-1591561954555-607968cc0777?w=800', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
      description: 'Bolsos y carteras importadas 👜 Marcas reconocidas a precios de RD. Envíos a todo el país, pregunta por combos 🛒',
      interested: 412,
      countdown: 290,
      currentSlide: 0
    }
  ]);
  const [interestedPosts, setInterestedPosts] = useState(new Set());
  
  // Estados para publicar piezas
  const [promoteImages, setPromoteImages] = useState([]);
  const [promoteLiveDate, setPromoteLiveDate] = useState('');
  const [promoteDescription, setPromoteDescription] = useState('');
  const [promoteMinPrice, setPromoteMinPrice] = useState('');
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const auctionTimerRef = useRef(null);
  const storyInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Simular usuarios conectados
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);
  
  // Countdown para posts
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePosts(prev => prev.map(post => ({
        ...post,
        countdown: Math.max(0, post.countdown - 1)
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Auto-eliminar posts cuando llega la hora del live
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePosts(prev => {
        const now = Date.now();
        // Filtrar posts cuyo tiempo programado ya pasó
        return prev.filter(post => {
          if (post.scheduledTime && now >= post.scheduledTime) {
            // Mostrar notificación de que el live comenzó
            console.log(`🔴 El live de ${post.username} ha comenzado!`);
            return false; // Eliminar el post
          }
          return true; // Mantener el post
        });
      });
    }, 5000); // Revisar cada 5 segundos
    return () => clearInterval(interval);
  }, []);
  
  const formatCountdown = (seconds) => {
    if (seconds <= 0) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${String(h).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
  };
  
  const nextSlide = (postId) => {
    setLivePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, currentSlide: (post.currentSlide + 1) % post.images.length };
      }
      return post;
    }));
  };
  
  const prevSlide = (postId) => {
    setLivePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, currentSlide: (post.currentSlide - 1 + post.images.length) % post.images.length };
      }
      return post;
    }));
  };
  
  const toggleInterested = (postId) => {
    setInterestedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    
    setLivePosts(prev => prev.map(post => {
      if (post.id === postId && !interestedPosts.has(postId)) {
        return { ...post, interested: post.interested + 1 };
      }
      return post;
    }));
  };
  
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

  // Funciones para promocionar piezas
  const handleImageSelect = (e, source) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPromoteImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: reader.result,
          source
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePromoteImage = (imageId) => {
    setPromoteImages(prev => prev.filter(img => img.id !== imageId));
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Mínimo 30 minutos desde ahora
    return now.toISOString().slice(0, 16);
  };

  const getMaxDateTime = () => {
    const max = new Date();
    max.setHours(max.getHours() + 24);
    return max.toISOString().slice(0, 16);
  };

  const publishPromotePost = () => {
    if (promoteImages.length === 0) {
      alert('Agrega al menos una imagen');
      return;
    }
    if (!promoteLiveDate) {
      alert('Selecciona la fecha y hora del live');
      return;
    }
    if (!promoteDescription.trim()) {
      alert('Agrega una descripción');
      return;
    }
    if (!promoteMinPrice || parseFloat(promoteMinPrice) <= 0) {
      alert('Ingresa un precio mínimo válido');
      return;
    }

    const liveDateTime = new Date(promoteLiveDate);
    const countdown = Math.floor((liveDateTime - new Date()) / 1000);

    const newPost = {
      id: Date.now(),
      username: currentUser?.username || 'usuario',
      name: currentUser?.name || 'Usuario',
      location: 'Santo Domingo',
      avatar: currentUser?.username[0].toUpperCase() || '👤',
      images: promoteImages.map(img => img.url),
      description: promoteDescription,
      minPrice: parseFloat(promoteMinPrice),
      interested: 0,
      countdown: countdown,
      currentSlide: 0,
      scheduledTime: liveDateTime.getTime()
    };

    setLivePosts(prev => [newPost, ...prev]);
    
    // Limpiar formulario
    setPromoteImages([]);
    setPromoteLiveDate('');
    setPromoteDescription('');
    setPromoteMinPrice('');
    
    // Volver al home
    setActiveTab('home');
    
    alert('¡Publicación creada exitosamente! 🎉');
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
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-1.5">
                <span className="bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 rounded-lg text-white font-bold uppercase tracking-wider transform -skew-x-6 shadow-lg" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                  LIVE
                </span>
                <span className="italic" style={{ fontFamily: "'Playfair Display', serif" }}>ShoppingRD</span>
              </h1>
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
        <div className="min-h-screen bg-black pb-20">
          {/* Header */}
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-1">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 px-2.5 py-0.5 rounded-lg text-white font-bold uppercase tracking-wider transform -skew-x-6 shadow-lg text-base" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                    LIVE
                  </span>
                  <span className="text-white italic" style={{ fontFamily: "'Playfair Display', serif" }}>ShoppingRD</span>
                </h1>
                <Bell className="w-6 h-6 text-gray-300" />
              </div>
              
              {/* Stories */}
              {followedWithStories.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
                  {followedWithStories.map(user => (
                    <button
                      key={user.id}
                      onClick={() => viewStories(user)}
                      className="flex-shrink-0 flex flex-col items-center gap-2"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 p-[3px]">
                        <div className="w-full h-full bg-black rounded-full p-[3px]">
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-gray-700">
                            {user.username[0].toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-300 max-w-[72px] truncate">{user.username}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Posts de LiveSell */}
          <div className="space-y-0">
            {livePosts.map(post => (
              <article key={post.id} className="border-b border-white/10">
                {/* Header del post */}
                <div className="flex items-center gap-3 p-4 pb-3">
                  <div className="w-12 h-12 rounded-full p-[2.5px] bg-gradient-to-tr from-red-500 to-orange-500 shadow-lg shadow-red-500/30 flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-black p-[2.5px]">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-2xl border-2 border-black">
                        {post.avatar}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-white text-sm truncate">{post.username}</div>
                    <div className="text-[10px] text-gray-600 mt-0.5">{post.location}</div>
                  </div>
                  <div className="flex items-center gap-2 bg-red-500/10 backdrop-blur-sm border border-red-500/40 rounded-xl px-3 py-1.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500 animate-pulse" />
                    <span className="text-[9px] font-black text-red-500 tracking-widest">LIVESELL</span>
                    <div className="w-px h-4 bg-red-500/30" />
                    <span className={`text-[13px] font-black tracking-wider ${post.countdown <= 120 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {formatCountdown(post.countdown)}
                    </span>
                  </div>
                </div>
                
                {/* Carousel de imágenes */}
                <div className="relative bg-gray-900 aspect-square">
                  <div className="absolute inset-0 overflow-hidden">
                    <div 
                      className="flex h-full transition-transform duration-300 ease-out"
                      style={{ transform: `translateX(-${post.currentSlide * 100}%)` }}
                    >
                      {post.images.map((img, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0 relative">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Dots  indicadores */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {post.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === post.currentSlide 
                            ? 'w-5 bg-white' 
                            : 'w-1.5 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Flechas de navegación */}
                  {post.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevSlide(post.id)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition-all z-10"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => nextSlide(post.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition-all z-10"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
                
                {/* Descripción */}
                <div className="px-4 py-3 text-sm text-gray-300 leading-relaxed">
                  <span className="font-extrabold text-white">{post.username}</span> {post.description}
                </div>
                
                {/* Footer con acciones */}
                <div className="flex items-center justify-between px-4 pb-4 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                    <span className="text-base">🛍️</span>
                    {post.interested} interesados
                  </div>
                  <button
                    onClick={() => toggleInterested(post.id)}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 px-5 py-2.5 rounded-full text-white text-sm font-black shadow-lg shadow-red-500/40 hover:scale-95 active:scale-90 transition-transform relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent rounded-full" />
                    <span className="text-base relative z-10">{interestedPosts.has(post.id) ? '❤️' : '🤍'}</span>
                    <span className="relative z-10">Lo Quiero</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          
          {/* Mensaje si no sigue a nadie - solo si no hay posts */}
          {livePosts.length === 0 && following.length === 0 && (
            <div className="p-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg font-bold text-white mb-2">¡Descubre vendedores!</h3>
                <p className="text-gray-400 text-sm mb-4">Busca y sigue vendedores para ver sus lives y stories</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
                >
                  Explorar
                </button>
              </div>
            </div>
          )}
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 safe-bottom">
            <div className="grid grid-cols-5 gap-1 p-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'home' ? 'text-pink-500' : 'text-gray-500'
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Inicio</span>
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'search' ? 'text-pink-500' : 'text-gray-500'
                }`}
              >
                <Search className="w-6 h-6" />
                <span className="text-xs font-medium">Buscar</span>
              </button>
              <button
                onClick={() => setActiveTab('promote')}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'promote' ? 'text-pink-500' : 'text-gray-500'
                }`}
              >
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Promocionar</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-3 rounded-xl flex flex-col items-center gap-1 relative transition-colors ${
                  activeTab === 'notifications' ? 'text-pink-500' : 'text-gray-500'
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
                className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                  activeTab === 'profile' ? 'text-pink-500' : 'text-gray-500'
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
        <div className="min-h-screen bg-black pb-20">
          {/* Header con búsqueda */}
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vendedores..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:bg-white/15 transition-all"
                autoFocus
              />
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No se encontraron vendedores</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      user.stories.length > 0 
                        ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-[2px]' 
                        : 'bg-gradient-to-br from-gray-700 to-gray-800'
                    }`}>
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${
                        user.stories.length > 0 ? 'bg-gray-900' : ''
                      }`}>
                        {user.username[0].toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.followers.toLocaleString()} seguidores</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`px-5 py-2 rounded-xl font-medium transition-all ${
                      user.isFollowing
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    }`}
                  >
                    {user.isFollowing ? 'Siguiendo' : 'Seguir'}
                  </button>
                </div>
              ))
            )}
          </div>
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 safe-bottom">
            <div className="grid grid-cols-5 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Inicio</span>
              </button>
              <button onClick={() => setActiveTab('search')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-pink-500">
                <Search className="w-6 h-6" />
                <span className="text-xs font-medium">Buscar</span>
              </button>
              <button onClick={() => setActiveTab('promote')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Promocionar</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <Bell className="w-6 h-6" />
                <span className="text-xs font-medium">Alertas</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
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
            <div className="grid grid-cols-5 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Inicio</span>
              </button>
              <button onClick={() => setActiveTab('search')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-purple-500">
                <Search className="w-6 h-6" />
                <span className="text-xs font-medium">Buscar</span>
              </button>
              <button onClick={() => setActiveTab('promote')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Promocionar</span>
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
    
    // Tab Promote - Promocionar piezas
    if (activeTab === 'promote') {
      return (
        <div className="min-h-screen bg-black pb-20">
          {/* Header */}
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Promocionar Piezas</h1>
              <button
                onClick={() => setActiveTab('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-4 space-y-6">
            {/* Agregar Imágenes */}
            <div className="space-y-3">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Imágenes del Producto
              </h2>
              
              {/* Vista previa de imágenes */}
              {promoteImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {promoteImages.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                      <img 
                        src={img.url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePromoteImage(img.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                        {img.source === 'camera' ? '📷' : '🖼️'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Botones para agregar imágenes */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleImageSelect(e, 'camera')}
                  className="hidden"
                />
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  Cámara
                </button>
                
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageSelect(e, 'gallery')}
                  className="hidden"
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Galería
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                {promoteImages.length}/10 imágenes
              </p>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-white font-semibold flex items-center gap-2">
                <Send className="w-5 h-5" />
                Descripción del Producto
              </label>
              <textarea
                value={promoteDescription}
                onChange={(e) => setPromoteDescription(e.target.value)}
                placeholder="Describe tu producto... Ej: Nueva colección primavera 2025, vestidos importados, tallas S-XL 🌸"
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 text-right">
                {promoteDescription.length}/500 caracteres
              </p>
            </div>

            {/* Hora del Live */}
            <div className="space-y-2">
              <label className="text-white font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Fecha y Hora del Live
              </label>
              <input
                type="datetime-local"
                value={promoteLiveDate}
                onChange={(e) => setPromoteLiveDate(e.target.value)}
                min={getMinDateTime()}
                max={getMaxDateTime()}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400">
                Selecciona cuándo comenzará tu transmisión en vivo (dentro de las próximas 24 horas)
              </p>
              {promoteLiveDate && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <p className="text-purple-400 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Las imágenes se eliminarán automáticamente cuando inicie el live
                  </p>
                </div>
              )}
            </div>

            {/* Precio Mínimo */}
            <div className="space-y-2">
              <label className="text-white font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Precio Mínimo de Puja
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold">
                  RD$
                </span>
                <input
                  type="number"
                  value={promoteMinPrice}
                  onChange={(e) => setPromoteMinPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="50"
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl p-4 pl-16 text-lg font-semibold focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400">
                Este será el precio inicial en la subasta durante el live
              </p>
            </div>

            {/* Botón de Publicar */}
            <button
              onClick={publishPromotePost}
              disabled={promoteImages.length === 0 || !promoteLiveDate || !promoteDescription.trim() || !promoteMinPrice}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-6 h-6" />
              Publicar Promoción
            </button>

            {/* Vista previa */}
            {promoteImages.length > 0 && promoteLiveDate && promoteDescription && (
              <div className="mt-6 space-y-2">
                <h3 className="text-white font-semibold text-sm">Vista Previa:</h3>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {currentUser?.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{currentUser?.username}</p>
                      <p className="text-gray-400 text-xs">Santo Domingo</p>
                    </div>
                  </div>
                  <img 
                    src={promoteImages[0].url} 
                    alt="Preview" 
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                  />
                  <p className="text-white text-sm mb-2">{promoteDescription}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-pink-500 font-semibold">Precio mínimo: RD${promoteMinPrice}</span>
                    <span className="text-gray-400">
                      Live: {new Date(promoteLiveDate).toLocaleString('es-DO', { 
                        day: '2-digit', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 safe-bottom">
            <div className="grid grid-cols-5 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Inicio</span>
              </button>
              <button onClick={() => setActiveTab('search')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <Search className="w-6 h-6" />
                <span className="text-xs font-medium">Buscar</span>
              </button>
              <button onClick={() => setActiveTab('promote')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-pink-500">
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Promocionar</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <Bell className="w-6 h-6" />
                <span className="text-xs font-medium">Alertas</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
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
        <div className="min-h-screen bg-black pb-20">
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {currentUser?.username[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentUser?.username}</h2>
                <p className="text-gray-400">{currentUser?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{following.length}</p>
                <p className="text-sm text-gray-400">Siguiendo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{reservations.length}</p>
                <p className="text-sm text-gray-400">Compras</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-gray-400">Guardados</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsRegistered(false)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/15 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 safe-bottom">
            <div className="grid grid-cols-5 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <Home className="w-6 h-6" />
                <span className="text-xs font-medium">Inicio</span>
              </button>
              <button onClick={() => setActiveTab('search')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <Search className="w-6 h-6" />
                <span className="text-xs font-medium">Buscar</span>
              </button>
              <button onClick={() => setActiveTab('promote')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Promocionar</span>
              </button>
              <button onClick={() => setActiveTab('notifications')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-500">
                <Bell className="w-6 h-6" />
                <span className="text-xs font-medium">Alertas</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-pink-500">
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
        <div className="min-h-screen bg-black pb-20">
          {/* Header */}
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10">
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
            <div className="grid grid-cols-4 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-purple-500">
                <Video className="w-6 h-6" />
                <span className="text-xs font-medium">Live</span>
              </button>
              <button onClick={() => setActiveTab('promote')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Promocionar</span>
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
    
    if (activeTab === 'promote') {
      return (
        <div className="min-h-screen bg-gray-50 pb-20">
          {/* Header */}
          <div className="bg-white border-b sticky top-0 z-10 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">Promocionar Piezas</h1>
              <button
                onClick={() => setActiveTab('home')}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-4 space-y-6">
            {/* Agregar Imágenes */}
            <div className="space-y-3">
              <h2 className="text-gray-800 font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-500" />
                Imágenes del Producto
              </h2>
              
              {/* Vista previa de imágenes */}
              {promoteImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {promoteImages.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <img 
                        src={img.url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePromoteImage(img.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                        {img.source === 'camera' ? '📷' : '🖼️'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Botones para agregar imágenes */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleImageSelect(e, 'camera')}
                  className="hidden"
                />
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                >
                  <Camera className="w-5 h-5" />
                  Cámara
                </button>
                
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageSelect(e, 'gallery')}
                  className="hidden"
                />
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Galería
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {promoteImages.length}/10 imágenes agregadas
              </p>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-gray-800 font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-500" />
                Descripción del Producto
              </label>
              <textarea
                value={promoteDescription}
                onChange={(e) => setPromoteDescription(e.target.value)}
                placeholder="Describe tu producto... Ej: Nueva colección primavera 2025, vestidos importados, tallas S-XL 🌸"
                className="w-full bg-white border-2 border-gray-200 text-gray-800 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">
                {promoteDescription.length}/500 caracteres
              </p>
            </div>

            {/* Hora del Live */}
            <div className="space-y-2">
              <label className="text-gray-800 font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Fecha y Hora del Live
              </label>
              <input
                type="datetime-local"
                value={promoteLiveDate}
                onChange={(e) => setPromoteLiveDate(e.target.value)}
                min={getMinDateTime()}
                max={getMaxDateTime()}
                className="w-full bg-white border-2 border-gray-200 text-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500">
                📅 Selecciona cuándo comenzará tu transmisión en vivo (dentro de las próximas 24 horas)
              </p>
              {promoteLiveDate && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-700 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    ⚠️ Las imágenes se eliminarán automáticamente cuando inicie el live
                  </p>
                </div>
              )}
            </div>

            {/* Precio Mínimo */}
            <div className="space-y-2">
              <label className="text-gray-800 font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-500" />
                Precio Mínimo de Puja
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
                  RD$
                </span>
                <input
                  type="number"
                  value={promoteMinPrice}
                  onChange={(e) => setPromoteMinPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="50"
                  className="w-full bg-white border-2 border-gray-200 text-gray-800 rounded-xl p-4 pl-16 text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                💰 Este será el precio inicial en la subasta durante el live
              </p>
            </div>

            {/* Botón de Publicar */}
            <button
              onClick={publishPromotePost}
              disabled={promoteImages.length === 0 || !promoteLiveDate || !promoteDescription.trim() || !promoteMinPrice}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-6 h-6" />
              Publicar Promoción
            </button>

            {/* Vista previa */}
            {promoteImages.length > 0 && promoteLiveDate && promoteDescription && (
              <div className="mt-6 space-y-2">
                <h3 className="text-gray-800 font-semibold text-sm">Vista Previa:</h3>
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {currentUser?.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-800 text-sm font-semibold">{currentUser?.username}</p>
                      <p className="text-gray-500 text-xs">Santo Domingo</p>
                    </div>
                  </div>
                  <img 
                    src={promoteImages[0].url} 
                    alt="Preview" 
                    className="w-full aspect-square object-cover rounded-lg mb-2 border border-gray-200"
                  />
                  <p className="text-gray-700 text-sm mb-2">{promoteDescription}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-600 font-semibold">💵 Precio mínimo: RD${promoteMinPrice}</span>
                    <span className="text-gray-500">
                      🔴 {new Date(promoteLiveDate).toLocaleString('es-DO', { 
                        day: '2-digit', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom shadow-lg">
            <div className="grid grid-cols-4 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Video className="w-6 h-6" />
                <span className="text-xs font-medium">Live</span>
              </button>
              <button onClick={() => setActiveTab('promote')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-purple-500">
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Promocionar</span>
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
            <div className="grid grid-cols-4 gap-1 p-2">
              <button onClick={() => setActiveTab('home')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <Video className="w-6 h-6" />
                <span className="text-xs font-medium">Live</span>
              </button>
              <button onClick={() => setActiveTab('promote')} className="py-3 rounded-xl flex flex-col items-center gap-1 text-gray-400">
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Promocionar</span>
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