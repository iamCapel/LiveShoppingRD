import React, { useState, useRef, useEffect } from 'react';
import Auth from './pages/Auth';
import LiveStreamWindow from './pages/LiveStreamWindow';
import BottomNav from './components/BottomNav';
import { Camera, DollarSign, Gavel, Users, Bell, ShoppingCart, Video, Play, Pause, X, Search, UserPlus, UserCheck, Plus, PlusCircle, Home, User, Heart, Send, Clock, TrendingUp, Image } from 'lucide-react';

const LiveShoppingApp = () => {
  // Estados principales
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'search', 'notifications', 'profile'
  const [userType, setUserType] = useState(null);
  
  // Estados de transmisión
  const [isLive, setIsLive] = useState(false);
  const [isPreLive, setIsPreLive] = useState(false);
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
  
  // Sistema de suscripción y límites
  const [isPremium, setIsPremium] = useState(false);
  const [livesUsed, setLivesUsed] = useState(0);
  const [liveStartTime, setLiveStartTime] = useState(null);
  const [liveTimeRemaining, setLiveTimeRemaining] = useState(3600); // 1 hora = 3600 segundos
  const FREE_LIVES_LIMIT = 3;
  const FREE_LIVE_DURATION = 3600; // 1 hora en segundos
  
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
      pieces: [
        { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', description: 'Vestido de verano floral, talla M', minPrice: 850 },
        { url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800', description: 'Blusa elegante color blanco, talla S-L', minPrice: 550 },
        { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800', description: 'Conjunto casual de 2 piezas', minPrice: 1200 }
      ],
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
      pieces: [
        { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', description: 'Tacones elegantes talla 37-39', minPrice: 1500 },
        { url: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800', description: 'Sandalias de verano multicolor', minPrice: 950 },
        { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800', description: 'Sneakers deportivos unisex', minPrice: 1800 }
      ],
      description: 'Calzados importados colección 2025 👠 Sandalias, tacones, sneakers y más. ¡Stock limitado!',
      interested: 134,
      countdown: 180, // 3 minutos - URGENTE
      currentSlide: 0
    },
    {
      id: 3,
      username: 'glamrd_beauty',
      name: 'Glam RD Beauty',
      location: 'Santo Domingo',
      avatar: '💄',
      images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'],
      pieces: [
        { url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800', description: 'Set completo de maquillaje profesional', minPrice: 2500 },
        { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800', description: 'Paleta de sombras y rubores', minPrice: 1200 },
        { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800', description: 'Base líquida acabado mate', minPrice: 800 }
      ],
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
      pieces: [
        { url: 'https://images.unsplash.com/photo-1591561954555-607968cc0777?w=800', description: 'Bolso de mano elegante cuero sintético', minPrice: 1600 },
        { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', description: 'Cartera crossbody multi-compartimentos', minPrice: 1100 },
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', description: 'Mochila casual urbana', minPrice: 1400 }
      ],
      description: 'Bolsos y carteras importadas 👜 Marcas reconocidas a precios de RD. Envíos a todo el país, pregunta por combos 🛒',
      interested: 412,
      countdown: 290,
      currentSlide: 0
    }
  ]);
  const [interestedPosts, setInterestedPosts] = useState(new Set());
  
  // Estados para publicar piezas
  const [promoteImages, setPromoteImages] = useState([]); // Cada imagen tendrá: { id, url, source, description, minPrice }
  const [promoteLiveDate, setPromoteLiveDate] = useState('');
  const [editingPiece, setEditingPiece] = useState(null); // Pieza que se está editando
  const [showPieceEditor, setShowPieceEditor] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false); // Interfaz de captura estilo Snapchat
  const [showLiveSellPrep, setShowLiveSellPrep] = useState(false); // Vista de preparación de LiveSell
  const [returnToLiveSellPrep, setReturnToLiveSellPrep] = useState(false); // Flag para volver a LiveSellPrep después de capturar
  
  // Estados para transmisión en vivo
  const [currentLivePost, setCurrentLivePost] = useState(null); // Post que se está transmitiendo
  const [currentPieceIndex, setCurrentPieceIndex] = useState(null); // Índice de pieza seleccionada
  const [showPieceModal, setShowPieceModal] = useState(false); // Modal de confirmación de venta
  const [saleCountdown, setSaleCountdown] = useState(0); // Conteo regresivo de 10 segundos
  const [currentBids, setCurrentBids] = useState([]); // Pujas actuales
  const [pieceStatus, setPieceStatus] = useState(null); // 'selling', 'sold', 'unsold'
  const [soldPieces, setSoldPieces] = useState([]); // Piezas ya vendidas
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const auctionTimerRef = useRef(null);
  const storyInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const captureVideoRef = useRef(null); // Video para captura de fotos
  const captureStreamRef = useRef(null); // Stream para captura de fotos

  // Cargar contador de lives desde localStorage al iniciar
  useEffect(() => {
    const savedLivesUsed = localStorage.getItem('livesUsed');
    const savedIsPremium = localStorage.getItem('isPremium');
    
    if (savedLivesUsed) {
      setLivesUsed(parseInt(savedLivesUsed, 10));
    }
    if (savedIsPremium === 'true') {
      setIsPremium(true);
    }
  }, []);
  
  // Guardar contador de lives en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('livesUsed', livesUsed.toString());
  }, [livesUsed]);
  
  // Guardar estado premium en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('isPremium', isPremium.toString());
  }, [isPremium]);

  // Abrir cámara cuando se activa preparación de LiveSell
  useEffect(() => {
    if (showLiveSellPrep) {
      const openCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' }, 
            audio: true 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch (err) {
          console.error('Error al acceder a la cámara:', err);
          alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
          setShowLiveSellPrep(false);
        }
      };
      openCamera();
    } else {
      // Cerrar cámara cuando se desactiva LiveSellPrep
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [showLiveSellPrep]);

  // Simular usuarios conectados
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);
  
  // Contador de tiempo del live (1 hora para usuarios gratuitos)
  useEffect(() => {
    if (isLive && !isPremium) {
      const interval = setInterval(() => {
        setLiveTimeRemaining(prev => {
          // Alerta cuando quedan 5 minutos
          if (prev === 300) {
            alert('⏰ Quedan 5 minutos de transmisión. Prepárate para cerrar tu live.');
          }
          
          if (prev <= 1) {
            clearInterval(interval);
            // Terminar live automáticamente
            alert('⏱️ Tu hora de transmisión ha terminado. ¡Suscríbete para lives sin límite!');
            stopLiveStream();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLive, isPremium]);
  
  // Countdown para posts (permite contar hasta -3600 para ventana de 1 hora)
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePosts(prev => prev.map(post => {
        const newCountdown = post.countdown - 1;
        // Permitir que cuente negativo hasta -3600 (1 hora)
        // pero no menos que eso para evitar números muy negativos
        return {
          ...post,
          countdown: Math.max(-3600, newCountdown)
        };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Auto-eliminar posts 1 hora después de que llegue la hora programada (excepto si está transmitiendo)
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePosts(prev => {
        const now = Date.now();
        // Filtrar posts cuyo tiempo programado ya pasó MÁS de 1 hora
        return prev.filter(post => {
          // No eliminar el post del usuario actual si está en pre-transmisión o transmitiendo
          if (post.username === currentUser?.username && (isPreLive || isLive)) {
            return true; // Mantener el post
          }
          
          // Mantener el post del usuario actual durante 1 hora después de la hora programada
          if (post.username === currentUser?.username && post.scheduledTime) {
            const oneHourAfterScheduled = post.scheduledTime + (3600 * 1000); // 1 hora en milisegundos
            if (now < oneHourAfterScheduled) {
              return true; // Mantener el post durante 1 hora
            }
          }
          
          // Eliminar posts de otros usuarios cuando llega su hora
          if (post.scheduledTime && now >= post.scheduledTime) {
            // Solo si no es el usuario actual
            if (post.username !== currentUser?.username) {
              console.log(`🔴 El live de ${post.username} ha comenzado!`);
              return false; // Eliminar el post
            }
          }
          
          return true; // Mantener el post
        });
      });
    }, 5000); // Revisar cada 5 segundos
    return () => clearInterval(interval);
  }, [currentUser, isPreLive, isLive]);
  
  // ====================================================================
  // FUNCIONES HELPER
  // ====================================================================
  
  // Función para manejar login/registro desde Auth
  const handleAuth = (user) => {
    setCurrentUser(user);
    setUserType(user.type);
    setIsRegistered(true);
  };
  
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
        const newPiece = {
          id: Date.now() + Math.random(),
          url: reader.result,
          source,
          description: '',
          minPrice: ''
        };
        setPromoteImages(prev => [...prev, newPiece]);
        // Abrir editor para esta pieza
        setEditingPiece(newPiece);
        setShowPieceEditor(true);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePromoteImage = (imageId) => {
    setPromoteImages(prev => prev.filter(img => img.id !== imageId));
  };

  const editPiece = (piece) => {
    setEditingPiece(piece);
    setShowPieceEditor(true);
  };

  const savePieceDetails = (pieceId, description, minPrice) => {
    setPromoteImages(prev => prev.map(img => 
      img.id === pieceId 
        ? { ...img, description, minPrice }
        : img
    ));
    setShowPieceEditor(false);
    setEditingPiece(null);
    
    // Si venimos de LiveSellPrep, volver a esa vista
    if (returnToLiveSellPrep) {
      setShowLiveSellPrep(true);
      setReturnToLiveSellPrep(false);
    }
  };

  // Funciones para captura de fotos estilo Snapchat
  const openCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } }, 
        audio: false 
      });
      if (captureVideoRef.current) {
        captureVideoRef.current.srcObject = stream;
        captureStreamRef.current = stream;
      }
      setShowCameraCapture(true);
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      
      let mensaje = '🎥 No se pudo acceder a la cámara\n\n';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        mensaje += '❌ Permiso denegado\n\n';
        mensaje += '📋 Solución:\n';
        mensaje += '1. Haz clic en el ícono del candado/cámara en la barra de direcciones\n';
        mensaje += '2. Permite el acceso a la cámara\n';
        mensaje += '3. Recarga la página e intenta de nuevo';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        mensaje += '❌ No se encontró ninguna cámara\n\n';
        mensaje += '📋 Verifica que tu dispositivo tenga una cámara instalada';
      } else {
        mensaje += '❌ Error desconocido\n\n';
        mensaje += '📋 Verifica los permisos de la cámara en tu navegador';
      }
      
      alert(mensaje);
    }
  };

  const capturePhoto = () => {
    const video = captureVideoRef.current;
    const canvas = document.createElement('canvas');
    
    if (!video) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    // Crear nueva pieza con la foto capturada
    const newPiece = {
      id: Date.now() + Math.random(),
      url: imageUrl,
      source: 'camera',
      description: '',
      minPrice: ''
    };
    
    setPromoteImages(prev => [...prev, newPiece]);
    
    // Cerrar la cámara
    closeCameraCapture();
    
    // Abrir editor para agregar descripción y precio
    setEditingPiece(newPiece);
    setShowPieceEditor(true);
  };

  const closeCameraCapture = () => {
    if (captureStreamRef.current) {
      captureStreamRef.current.getTracks().forEach(track => track.stop());
      captureStreamRef.current = null;
    }
    if (captureVideoRef.current) {
      captureVideoRef.current.srcObject = null;
    }
    setShowCameraCapture(false);
    
    // Si venimos de LiveSellPrep, volver a esa vista
    if (returnToLiveSellPrep) {
      setShowLiveSellPrep(true);
      setReturnToLiveSellPrep(false);
    }
  };

  const cancelPieceEdit = () => {
    // Si la pieza no tiene descripción ni precio, la eliminamos
    if (editingPiece && !editingPiece.description && !editingPiece.minPrice) {
      removePromoteImage(editingPiece.id);
    }
    setShowPieceEditor(false);
    setEditingPiece(null);
    
    // Si venimos de LiveSellPrep, volver a esa vista
    if (returnToLiveSellPrep) {
      setShowLiveSellPrep(true);
      setReturnToLiveSellPrep(false);
    }
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
    
    // Validar que todas las piezas tengan descripción y precio
    const incompletePieces = promoteImages.filter(img => !img.description.trim() || !img.minPrice || parseFloat(img.minPrice) <= 0);
    if (incompletePieces.length > 0) {
      alert('Todas las piezas deben tener descripción y precio mínimo');
      return;
    }
    
    if (!promoteLiveDate) {
      alert('Selecciona la fecha y hora del live');
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
      pieces: promoteImages.map(img => ({
        url: img.url,
        description: img.description,
        minPrice: parseFloat(img.minPrice)
      })),
      description: `${promoteImages.length} pieza${promoteImages.length > 1 ? 's' : ''} disponible${promoteImages.length > 1 ? 's' : ''} - Precios desde RD$${Math.min(...promoteImages.map(img => parseFloat(img.minPrice)))}`,
      interested: 0,
      countdown: countdown,
      currentSlide: 0,
      scheduledTime: liveDateTime.getTime()
    };

    setLivePosts(prev => [newPost, ...prev]);
    
    // Limpiar formulario
    setPromoteImages([]);
    setPromoteLiveDate('');
    
    // Volver al home
    setActiveTab('home');
    
    alert('¡Publicación creada exitosamente! 🎉');
  };

  const startPreLive = async () => {
    // Validar límite de lives gratuitos
    if (!isPremium && livesUsed >= FREE_LIVES_LIMIT) {
      alert(`🚫 Has alcanzado el límite de ${FREE_LIVES_LIMIT} lives gratuitos. ¡Suscríbete para lives ilimitados!`);
      return;
    }
    
    // Buscar el post programado del usuario actual que ya llegó a 0
    const myPost = livePosts.find(post => post.username === currentUser?.username && post.countdown <= 0);
    
    if (!myPost) {
      alert('Aún no es hora de transmitir');
      return;
    }
    
    // Establecer el post actual y resetear estados
    setCurrentLivePost(myPost);
    setCurrentPieceIndex(null);
    setSoldPieces([]);
    setCurrentBids([]);
    setPieceStatus(null);
    
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
      setIsPreLive(true); // Activar PRE-transmisión
      setActiveTab('home'); // Cambiar al tab principal
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      
      let mensaje = '🎥 No se pudo acceder a la cámara\n\n';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        mensaje += '❌ Permiso denegado\n\n';
        mensaje += '📋 Solución:\n';
        mensaje += '1. Haz clic en el ícono del candado/cámara en la barra de direcciones\n';
        mensaje += '2. Permite el acceso a la cámara y micrófono\n';
        mensaje += '3. Recarga la página e intenta de nuevo';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        mensaje += '❌ No se encontró ninguna cámara\n\n';
        mensaje += '📋 Verifica que:\n';
        mensaje += '• Tu dispositivo tenga una cámara instalada\n';
        mensaje += '• La cámara esté conectada correctamente\n';
        mensaje += '• Los drivers estén actualizados';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        mensaje += '❌ La cámara está siendo usada por otra aplicación\n\n';
        mensaje += '📋 Solución:\n';
        mensaje += '• Cierra otras aplicaciones que usen la cámara\n';
        mensaje += '• Cierra otras pestañas del navegador que puedan estar usándola\n';
        mensaje += '• Reinicia el navegador';
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        mensaje += '❌ Tu cámara no cumple con los requisitos\n\n';
        mensaje += '📋 Intenta usar una cámara diferente';
      } else if (err.name === 'TypeError') {
        mensaje += '❌ Error de configuración\n\n';
        mensaje += '📋 Solución:\n';
        mensaje += '• Asegúrate de estar usando un navegador moderno\n';
        mensaje += '• Intenta con Chrome, Firefox o Edge actualizado';
      } else {
        mensaje += `❌ Error: ${err.name || 'Desconocido'}\n\n`;
        mensaje += '📋 Solución:\n';
        mensaje += '• Verifica los permisos de la cámara en tu navegador\n';
        mensaje += '• Asegúrate de estar en una conexión segura (https o localhost)\n';
        mensaje += '• Intenta con otro navegador\n';
        mensaje += '• Reinicia tu dispositivo si el problema persiste';
      }
      
      alert(mensaje);
    }
  };

  const startLiveStream = () => {
    // Iniciar transmisión real desde la pre-transmisión
    setIsPreLive(false);
    setIsLive(true);
    setLiveStartTime(Date.now());
    setLiveTimeRemaining(FREE_LIVE_DURATION); // Reset a 1 hora
    
    // Incrementar contador de lives usados (solo para usuarios gratuitos)
    if (!isPremium) {
      setLivesUsed(prev => prev + 1);
    }
    
    if (currentUser) {
      setAllUsers(prev => prev.map(user => 
        user.id === currentUser.id ? { ...user, isLive: true } : user
      ));
    }
  };

  const stopLiveStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Eliminar el post del live que acaba de terminar
    if (currentLivePost && currentUser) {
      setLivePosts(prev => prev.filter(post => 
        !(post.username === currentUser.username && post.id === currentLivePost.id)
      ));
    }
    
    setIsLive(false);
    setIsPreLive(false);
    setCurrentItem(null);
    setCurrentLivePost(null);
    setCurrentPieceIndex(null);
    setSaleCountdown(0);
    setCurrentBids([]);
    setPieceStatus(null);
    setSoldPieces([]);
    setLiveStartTime(null);
    setLiveTimeRemaining(FREE_LIVE_DURATION);
    
    if (currentUser) {
      setAllUsers(prev => prev.map(user => 
        user.id === currentUser.id ? { ...user, isLive: false } : user
      ));
    }
  };

  // Funciones para sistema de venta en vivo
  const selectPiece = (index) => {
    setCurrentPieceIndex(index);
    setShowPieceModal(true);
    setPieceStatus(null);
    setCurrentBids([]);
  };

  const startPieceSale = () => {
    setShowPieceModal(false);
    setPieceStatus('selling');
    setSaleCountdown(10);
    
    // Simular pujas aleatorias
    const bidInterval = setInterval(() => {
      const chance = Math.random();
      if (chance > 0.4) { // 60% de probabilidad de recibir puja
        const piece = currentLivePost.pieces[currentPieceIndex];
        const minPrice = parseFloat(piece.minPrice) || 100;
        const maxBid = currentBids.length > 0 ? Math.max(...currentBids.map(b => b.amount)) : minPrice;
        const newBid = maxBid + Math.floor(Math.random() * 50) + 10;
        
        const bidders = ['Ana M.', 'Carlos R.', 'María G.', 'José L.', 'Laura P.', 'Pedro S.', 'Sofia V.'];
        const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
        
        setCurrentBids(prev => [...prev, {
          id: Date.now(),
          user: randomBidder,
          amount: newBid,
          timestamp: Date.now()
        }]);
      }
    }, 1500);
    
    // Countdown
    const countInterval = setInterval(() => {
      setSaleCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          clearInterval(bidInterval);
          finalizePieceSale();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finalizePieceSale = () => {
    if (currentBids.length > 0) {
      // Hay pujas - pieza vendida
      const winner = currentBids[currentBids.length - 1];
      setPieceStatus('sold');
      setSoldPieces(prev => [...prev, {
        pieceIndex: currentPieceIndex,
        winner: winner.user,
        amount: winner.amount
      }]);
      
      // Mostrar animación de felicitaciones por 3 segundos
      setTimeout(() => {
        setPieceStatus(null);
        setCurrentPieceIndex(null);
        setCurrentBids([]);
      }, 3000);
    } else {
      // No hay pujas - para la próxima
      setPieceStatus('unsold');
      
      // Mostrar mensaje por 2 segundos
      setTimeout(() => {
        setPieceStatus(null);
        setCurrentPieceIndex(null);
        setCurrentBids([]);
      }, 2000);
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

  // ====================================================================
  // LÓGICA DE RENDERIZADO
  // ====================================================================

  // Mostrar pantalla de autenticación si no está registrado
  if (!isRegistered) {
    return <Auth onAuth={handleAuth} />;
  }

  // VISOR DE STORIES
  if (showStoryViewer && currentStoryUser) {
    const currentStory = currentStoryUser.stories[currentStoryIndex];
    
    return (
      <div className="fixed inset-0 bg-black z-50 w-full h-full overflow-hidden">
        <div className="h-full w-full flex items-center justify-center">
          <button
            onClick={() => setShowStoryViewer(false)}
            className="absolute top-4 right-4 text-white z-20 bg-black/30 p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Barras de progreso */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-20 max-w-full px-4">
            {currentStoryUser.stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden min-w-0">
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
      <div className="fixed inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 w-full h-full overflow-hidden">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-full sm:max-w-md max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 sm:p-6 pb-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Nueva Story</h3>
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

  // ══════════════════════════════════════════════════════════
  // PÁGINA DE PRE-TRANSMISIÓN
  // ══════════════════════════════════════════════════════════
  if (isPreLive && currentLivePost) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-hidden">
        {/* Video de vista previa */}
        <div className="absolute inset-0">
          <video 
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        </div>

        {/* Contenido */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 z-10">
          {/* Header */}
          <div className="w-full max-w-md">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {currentUser?.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">{currentUser?.username}</p>
                  <p className="text-gray-300 text-sm">{currentLivePost.description}</p>
                </div>
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-3 mb-3">
                <p className="text-yellow-400 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Prepárate para iniciar tu transmisión en vivo
                </p>
              </div>
              
              {/* Información de límites */}
              {!isPremium && (
                <div className="bg-purple-500/20 border border-purple-500/40 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 text-xs font-semibold">Lives gratuitos:</span>
                    <span className="text-white font-bold text-sm">
                      {FREE_LIVES_LIMIT - livesUsed} de {FREE_LIVES_LIMIT} restantes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 text-xs font-semibold">Duración:</span>
                    <span className="text-white font-bold text-sm">1 hora máximo</span>
                  </div>
                  {livesUsed >= FREE_LIVES_LIMIT - 1 && (
                    <p className="text-yellow-400 text-xs pt-2 border-t border-purple-500/30">
                      ⚠️ Este es tu último live gratuito
                    </p>
                  )}
                </div>
              )}
              
              {isPremium && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-xl p-3">
                  <p className="text-yellow-400 text-sm font-bold flex items-center gap-2">
                    👑 Premium: Lives ilimitados sin restricciones
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Centro - Resumen de piezas */}
          <div className="w-full max-w-md">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-pink-500" />
                Tus Piezas
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                {currentLivePost.pieces.map((piece, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 rounded-xl p-3 flex items-center gap-3 border border-white/10"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                      <img 
                        src={piece.url} 
                        alt={piece.description}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm line-clamp-1">{piece.description}</p>
                      <p className="text-pink-400 font-bold text-sm">RD${piece.minPrice}</p>
                    </div>
                    <div className="bg-purple-500 rounded-full px-3 py-1">
                      <span className="text-white text-xs font-bold">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-gray-400 text-sm text-center">
                  {currentLivePost.pieces.length} pieza{currentLivePost.pieces.length !== 1 ? 's' : ''} lista{currentLivePost.pieces.length !== 1 ? 's' : ''} para vender
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="w-full max-w-md space-y-3">
            {/* Botón principal - Iniciar Live */}
            <button
              onClick={startLiveStream}
              className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 animate-pulse"
            >
              <Video className="w-7 h-7" />
              INICIAR TRANSMISIÓN EN VIVO
            </button>

            {/* Botón secundario - Cancelar */}
            <button
              onClick={stopLiveStream}
              className="w-full bg-gray-700/80 backdrop-blur-md border border-white/20 text-white py-4 rounded-2xl font-semibold hover:bg-gray-600/80 transition-all"
            >
              Cancelar
            </button>

            {/* Indicador */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <p className="text-gray-400 text-xs text-center">
                📹 Tu cámara está lista • Verifica que todo se vea bien antes de iniciar
              </p>
            </div>
          </div>
        </div>

        {/* Canvas oculto */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // INTERFAZ DE TRANSMISIÓN EN VIVO
  // ══════════════════════════════════════════════════════════
  if (isLive && currentLivePost) {
    return (
      <LiveStreamWindow 
        videoRef={videoRef}
        livePost={currentLivePost}
        viewers={viewers}
        liveTimeRemaining={liveTimeRemaining}
        onEndLive={stopLiveStream}
      />
    );
  }

  // Verificar si hay lives urgentes programados (para todos los tipos de usuario)
  // Notificación vigente por 1 hora desde que countdown llegó a 0
  const urgentLive = livePosts.find(post => 
    post.username === currentUser?.username && 
    post.countdown <= 0 && // Cuando llega a 0
    post.countdown >= -3600 // Vigente por 1 hora (-3600 segundos)
  );

  // VISTA PRINCIPAL - TODOS LOS USUARIOS
  if (userType === 'buyer' || userType === 'seller') {

    // Tab Home - Feed principal
    if (activeTab === 'home') {
      const liveUsers = allUsers.filter(u => u.isLive && u.isFollowing);
      const followedWithStories = following.filter(u => u.stories && u.stories.length > 0);
      
      return (
        <div className="min-h-screen w-full bg-black pb-20 overflow-x-hidden">
          {/* Notificación flotante de live urgente - visible durante 1 hora */}
          {urgentLive && !isLive && !isPreLive && (
            <div className="fixed top-4 left-4 right-4 z-50 animate-fade-in max-w-full px-2">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 animate-pulse" />
                  </div>
                  <div className="flex-1 text-white min-w-0">
                    <p className="font-bold text-lg">¡Es hora de transmitir!</p>
                    <p className="text-sm opacity-90">
                      {urgentLive.countdown <= 0 && urgentLive.countdown > -3600
                        ? `Ventana disponible: ${Math.floor(Math.abs(urgentLive.countdown) / 60)}m ${Math.abs(urgentLive.countdown) % 60}s restantes`
                        : 'Tu live programado ya está listo'
                      }
                    </p>
                  </div>
                  <button
                    onClick={startPreLive}
                    className="bg-white text-red-500 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
                  >
                    Comenzar
                  </button>
                </div>
              </div>
            </div>
          )}

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
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
                  {followedWithStories.map(user => (
                    <button
                      key={user.id}
                      onClick={() => viewStories(user)}
                      className="flex-shrink-0 flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 p-[3px]">
                        <div className="w-full h-full bg-black rounded-full p-[3px]">
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg border-2 border-gray-700">
                            {user.username[0].toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-300 max-w-[60px] sm:max-w-[72px] truncate">{user.username}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Posts de LiveSell */}
          <div className="space-y-0 w-full overflow-x-hidden">
            {livePosts.map(post => (
              <article key={post.id} className="border-b border-white/10 w-full">
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
                <div className="relative bg-gray-900 w-full overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <div 
                      className="flex h-full transition-transform duration-300 ease-out"
                      style={{ transform: `translateX(-${post.currentSlide * 100}%)` }}
                    >
                      {post.images.map((img, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0 relative">
                          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
                        </div>
                      ))}
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

                  {/* Botón "Lo Quiero" integrado */}
                  <button
                    onClick={(e) => {
                      const btn = e.currentTarget;
                      if (btn.classList.contains('clicked')) return;
                      
                      // Ripple effect
                      const rect = btn.getBoundingClientRect();
                      const size = Math.max(rect.width, rect.height);
                      const x = e.clientX - rect.left - size / 2;
                      const y = e.clientY - rect.top - size / 2;
                      const ripple = document.createElement('span');
                      ripple.className = 'ripple-effect';
                      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;position:absolute;border-radius:50%;background:rgba(255,255,255,0.35);transform:scale(0);animation:ripple-anim 0.5s ease-out forwards;pointer-events:none`;
                      btn.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 600);
                      
                      // Cambio de estado
                      btn.classList.add('clicked');
                      toggleInterested(post.id);
                    }}
                    className={`w-full border-none cursor-pointer overflow-hidden font-inherit p-0 relative h-14 transition-all duration-400 ${
                      interestedPosts.has(post.id) 
                        ? 'bg-gray-700 clicked' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}
                    style={{ fontFamily: "'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
                  >
                    {/* Estado normal */}
                    <span className={`absolute inset-0 flex items-center justify-center gap-2 text-white text-base font-extrabold transition-all duration-250 ${
                      interestedPosts.has(post.id) ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                    }`}>
                      <svg width="22" height="22" viewBox="0 0 100 110" fill="none" className="flex-shrink-0">
                        <rect x="10" y="30" width="80" height="70" rx="4" stroke="white" strokeWidth="7" fill="none"/>
                        <path d="M32 30 Q32 10 50 10 Q68 10 68 30" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round"/>
                        <path d="M10 68 Q18 60 28 63 Q36 65 40 72" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 68 Q6 75 10 80" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
                        <path d="M28 63 Q30 55 35 57" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M33 62 Q35 54 40 56" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M38 63 Q40 56 45 58" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M90 68 Q82 60 72 63 Q64 65 60 72" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M90 68 Q94 75 90 80" stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
                        <path d="M72 63 Q70 55 65 57" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M67 62 Q65 54 60 56" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M62 63 Q60 56 55 58" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                      </svg>
                      ¡Lo quiero!
                    </span>

                    {/* Estado añadido */}
                    <span className={`absolute inset-0 flex items-center justify-center gap-2 text-white/70 text-sm font-bold tracking-wide transition-all duration-300 ${
                      interestedPosts.has(post.id) ? 'opacity-100 scale-100 delay-150' : 'opacity-0 scale-80'
                    }`}>
                      <svg width="22" height="22" viewBox="0 0 100 110" fill="none" className="flex-shrink-0 icon-added">
                        <rect x="10" y="30" width="80" height="70" rx="4" stroke="rgba(255,255,255,0.6)" strokeWidth="7" fill="none"/>
                        <path d="M32 30 Q32 10 50 10 Q68 10 68 30" stroke="rgba(255,255,255,0.6)" strokeWidth="7" fill="none" strokeLinecap="round"/>
                        <path d="M10 68 Q18 60 28 63 Q36 65 40 72" stroke="rgba(255,255,255,0.6)" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 68 Q6 75 10 80" stroke="rgba(255,255,255,0.6)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
                        <path d="M28 63 Q30 55 35 57" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M33 62 Q35 54 40 56" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M38 63 Q40 56 45 58" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M90 68 Q82 60 72 63 Q64 65 60 72" stroke="rgba(255,255,255,0.6)" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M90 68 Q94 75 90 80" stroke="rgba(255,255,255,0.6)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
                        <path d="M72 63 Q70 55 65 57" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M67 62 Q65 54 60 56" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                        <path d="M62 63 Q60 56 55 58" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                      </svg>
                      AGREGADO
                    </span>
                  </button>
                </div>
                
                {/* Descripción */}
                <div className="px-4 py-3 text-sm text-gray-300 leading-relaxed">
                  <span className="font-extrabold text-white">{post.username}</span> {post.description}
                </div>
                
                {/* Footer con estadísticas */}
                <div className="flex items-center px-4 pb-4 gap-2 text-sm text-gray-400 font-semibold">
                  <span className="text-base">🛍️</span>
                  {post.interested} interesados
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
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            urgentLive={urgentLive}
            onLiveSellClick={() => setShowLiveSellPrep(true)}
          />
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
        <div className="min-h-screen w-full bg-black pb-20 overflow-x-hidden">
          {/* Header con búsqueda */}
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 p-3 sm:p-4 w-full">
            <div className="relative max-w-full">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vendedores..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:bg-white/15 transition-all text-sm sm:text-base"
                autoFocus
              />
            </div>
          </div>
          
          <div className="p-3 sm:p-4 space-y-3 w-full overflow-x-hidden">
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
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            urgentLive={urgentLive}
            onLiveSellClick={() => setShowLiveSellPrep(true)}
          />
        </div>
      );
      
      return (
        <div className="min-h-screen w-full bg-gray-50 pb-20 overflow-x-hidden">
          {/* Header con búsqueda */}
          <div className="bg-white border-b sticky top-0 z-10 p-3 sm:p-4 w-full">
            <div className="relative max-w-full">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
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
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            urgentLive={urgentLive}
            onLiveSellClick={() => setShowLiveSellPrep(true)}
          />
        </div>
      );
    }
    
    // Tab Promote - Promocionar piezas
    if (activeTab === 'promote') {
      return (
        <div className="min-h-screen w-full bg-black pb-20 overflow-x-hidden">
          {/* Header */}
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 p-3 sm:p-4 w-full">
            <div className="flex items-center justify-between">
              <h1 className="text-lg sm:text-xl font-bold text-white">Promocionar Piezas</h1>
              <button
                onClick={() => setActiveTab('home')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Modal Editor de Pieza */}
          {showPieceEditor && editingPiece && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">Detalles de la Pieza</h3>
                  <button
                    onClick={cancelPieceEdit}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Imagen */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                    <img 
                      src={editingPiece.url} 
                      alt="Pieza" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-sm flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Descripción de esta pieza
                    </label>
                    <textarea
                      value={editingPiece.description}
                      onChange={(e) => setEditingPiece({ ...editingPiece, description: e.target.value })}
                      placeholder="Ej: Vestido floral talla M, 100% algodón 🌸"
                      className="w-full bg-gray-800 text-white border border-gray-600 rounded-xl p-3 min-h-[100px] focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-400 text-right">
                      {editingPiece.description.length}/200
                    </p>
                  </div>

                  {/* Precio Mínimo */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Precio Mínimo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                        RD$
                      </span>
                      <input
                        type="number"
                        value={editingPiece.minPrice}
                        onChange={(e) => setEditingPiece({ ...editingPiece, minPrice: e.target.value })}
                        placeholder="0.00"
                        min="0"
                        step="50"
                        className="w-full bg-gray-800 text-white border border-gray-600 rounded-xl p-3 pl-14 font-semibold focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={cancelPieceEdit}
                      className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => savePieceDetails(editingPiece.id, editingPiece.description, editingPiece.minPrice)}
                      disabled={!editingPiece.description.trim() || !editingPiece.minPrice || parseFloat(editingPiece.minPrice) <= 0}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <div className="p-4 space-y-6">
            {/* Agregar Imágenes */}
            <div className="space-y-3">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Image className="w-5 h-5" />
                Piezas a Promocionar
              </h2>
              
              {/* Vista previa de imágenes con detalles */}
              {promoteImages.length > 0 && (
                <div className="space-y-3 mb-3">
                  {promoteImages.map((piece, index) => (
                    <div key={piece.id} className="bg-gray-800 rounded-xl p-3 border border-gray-700">
                      <div className="flex gap-3">
                        {/* Imagen */}
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                          <img 
                            src={piece.url} 
                            alt={`Pieza ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 left-1 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded">
                            {piece.source === 'camera' ? '📷' : '🖼️'}
                          </div>
                        </div>

                        {/* Detalles */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-white font-semibold text-sm">Pieza #{index + 1}</h3>
                            <button
                              onClick={() => removePromoteImage(piece.id)}
                              className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {piece.description && piece.minPrice ? (
                            <div className="space-y-1">
                              <p className="text-gray-300 text-xs line-clamp-2">{piece.description}</p>
                              <p className="text-pink-500 font-bold text-sm">RD${piece.minPrice}</p>
                              <button
                                onClick={() => editPiece(piece)}
                                className="text-purple-400 text-xs hover:text-purple-300 transition-colors"
                              >
                                ✏️ Editar detalles
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => editPiece(piece)}
                              className="text-yellow-400 text-xs bg-yellow-400/10 px-3 py-2 rounded-lg hover:bg-yellow-400/20 transition-colors"
                            >
                              ⚠️ Agregar descripción y precio
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Botones para agregar imágenes */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openCameraCapture}
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
                {promoteImages.length}/10 piezas agregadas
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

            {/* Botón de Publicar */}
            <button
              onClick={publishPromotePost}
              disabled={promoteImages.length === 0 || !promoteLiveDate || promoteImages.some(img => !img.description || !img.minPrice)}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-6 h-6" />
              Publicar {promoteImages.length} {promoteImages.length === 1 ? 'Pieza' : 'Piezas'}
            </button>

            {/* Vista previa */}
            {promoteImages.length > 0 && promoteLiveDate && promoteImages.every(img => img.description && img.minPrice) && (
              <div className="mt-6 space-y-2">
                <h3 className="text-white font-semibold text-sm">Vista Previa:</h3>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {currentUser?.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{currentUser?.username}</p>
                      <p className="text-gray-400 text-xs">Santo Domingo</p>
                    </div>
                  </div>
                  
                  {/* Carrusel de imágenes preview */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {promoteImages.slice(0, 4).map((piece, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                        <img 
                          src={piece.url} 
                          alt={`Pieza ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 3 && promoteImages.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">+{promoteImages.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-white text-sm mb-2">
                    {promoteImages.length} pieza{promoteImages.length > 1 ? 's' : ''} disponible{promoteImages.length > 1 ? 's' : ''} - Desde RD${Math.min(...promoteImages.map(p => parseFloat(p.minPrice)))}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-700">
                    <span className="text-pink-500 font-semibold">💰 {promoteImages.length} piezas en subasta</span>
                    <span className="text-gray-400">
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
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            urgentLive={urgentLive}
            onLiveSellClick={() => setShowLiveSellPrep(true)}
          />
        </div>
      );
    }
    
    // Tab Notifications - Alertas
    if (activeTab === 'notifications') {
      // Mis lives programados próximos (incluye los que tienen countdown entre 0 y -3600, es decir, 1 hora después de llegar a 0)
      const myUpcomingLives = livePosts.filter(post => {
        return post.username === currentUser?.username && post.countdown >= -3600; // Vigente por 1 hora después de llegar a 0
      }).sort((a, b) => a.countdown - b.countdown);

      // Publicaciones recientes de personas seguidas
      const followedPosts = livePosts.filter(post => {
        const seller = allUsers.find(u => u.username === post.username);
        return seller && seller.isFollowing;
      }).slice(0, 10);

      return (
        <div className="min-h-screen w-full bg-black pb-20 overflow-x-hidden">
          {/* Header */}
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 p-3 sm:p-4 w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" />
              Alertas
            </h1>
          </div>

          <div className="p-3 sm:p-4 space-y-6 w-full overflow-x-hidden">
            {/* Mis Lives Programados */}
            <div className="space-y-3 w-full">
              <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                Mis Lives Programados
              </h2>
              
              {myUpcomingLives.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
                  <Clock className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm mb-2">No tienes lives programados</p>
                  <p className="text-gray-500 text-xs mb-4">📝 Crea un post promocional para ver tus lives aquí</p>
                  <button
                    onClick={() => setActiveTab('promote')}
                    className="text-pink-400 text-sm font-semibold hover:text-pink-300 transition-colors"
                  >
                    Promocionar piezas →
                  </button>
                </div>
              ) : (
                myUpcomingLives.map(post => {
                  const timeRemaining = post.countdown;
                  const hours = Math.floor(Math.abs(timeRemaining) / 3600);
                  const minutes = Math.floor((Math.abs(timeRemaining) % 3600) / 60);
                  const seconds = Math.abs(timeRemaining) % 60;
                  const isUrgent = timeRemaining <= 0 && timeRemaining >= -3600; // Urgente durante 1 hora después de llegar a 0

                  return (
                    <div 
                      key={post.id} 
                      className={`bg-gradient-to-r ${
                        isUrgent 
                          ? 'from-red-500/20 to-pink-500/20 border-red-500/50 animate-pulse' 
                          : 'from-purple-500/10 to-pink-500/10 border-purple-500/30'
                      } backdrop-blur-md border rounded-xl p-4 hover:scale-[1.02] transition-transform`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={post.images[0]} 
                            alt={post.username}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          {isUrgent && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                              <Bell className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            {isUrgent ? '🔴 ¡ES HORA DE TRANSMITIR!' : 'Mi Live Programado'}
                          </p>
                          <p className="text-gray-300 text-sm line-clamp-1">{post.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`${
                              isUrgent ? 'text-red-400' : 'text-pink-400'
                            } text-sm font-bold flex items-center gap-1`}>
                              <Clock className="w-4 h-4" />
                              {isUrgent 
                                ? `¡Ahora! (${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s restantes)`
                                : `${hours > 0 ? `${hours}h ` : ''}${minutes}m`
                              }
                            </div>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-400 text-xs">{post.interested} interesados</span>
                          </div>
                        </div>

                        {isUrgent ? (
                          <button
                            onClick={startPreLive}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-6 py-3 rounded-full hover:from-red-600 hover:to-pink-600 transition-all shadow-lg animate-bounce"
                          >
                            Comenzar
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveTab('promote')}
                            className="bg-purple-500/20 text-purple-300 text-xs font-bold px-4 py-2 rounded-full hover:bg-purple-500/30 transition-colors"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Publicaciones de personas seguidas */}
            <div className="space-y-3">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Siguiendo
              </h2>
              
              {followedPosts.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
                  <UserPlus className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm mb-2">No sigues a ningún vendedor aún</p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="text-pink-500 text-sm font-semibold hover:text-pink-400 transition-colors"
                  >
                    Buscar vendedores →
                  </button>
                </div>
              ) : (
                followedPosts.map(post => (
                  <div 
                    key={post.id}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => setActiveTab('home')}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{post.username}</p>
                        <p className="text-gray-400 text-xs">{post.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-pink-500 text-xs font-semibold">
                          {formatCountdown(post.countdown)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {post.images.slice(0, 3).map((img, idx) => (
                        <img 
                          key={idx}
                          src={img}
                          alt={`Producto ${idx + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-300 text-sm line-clamp-2 mb-2">{post.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-pink-500 font-semibold">{post.interested} interesados</span>
                      <span className="text-gray-400">Live: {formatCountdown(post.countdown)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            urgentLive={urgentLive}
            onLiveSellClick={() => setShowLiveSellPrep(true)}
          />
        </div>
      );
    }
    
    // Tab Profile
    if (activeTab === 'profile') {
      return (
        <div className="min-h-screen w-full bg-black pb-20 overflow-x-hidden">
          <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 p-4 sm:p-6 w-full">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg flex-shrink-0">
                {currentUser?.username[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">{currentUser?.username}</h2>
                <p className="text-sm sm:text-base text-gray-400 truncate">{currentUser?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 border-t border-white/10">
              <div className="text-center min-w-0">
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
            
            {/* Sección de Suscripción */}
            {userType === 'seller' && (
              <div className="mt-4 space-y-3">
                {isPremium ? (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👑</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-yellow-400 font-black text-lg">Premium Activo</p>
                        <p className="text-yellow-300 text-sm">Lives ilimitados sin restricciones</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-black/30 rounded-xl p-3">
                        <p className="text-white text-2xl font-bold">∞</p>
                        <p className="text-gray-300 text-xs">Lives</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-3">
                        <p className="text-white text-2xl font-bold">∞</p>
                        <p className="text-gray-300 text-xs">Horas</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white font-bold text-lg">Plan Gratuito</p>
                        <p className="text-gray-400 text-sm">Límite de lives y duración</p>
                      </div>
                      <Video className="w-8 h-8 text-gray-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-black/30 rounded-xl p-3 text-center">
                        <p className="text-white text-2xl font-bold">
                          {FREE_LIVES_LIMIT - livesUsed}
                        </p>
                        <p className="text-gray-300 text-xs">Lives restantes</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-3 text-center">
                        <p className="text-white text-2xl font-bold">1h</p>
                        <p className="text-gray-300 text-xs">Por live</p>
                      </div>
                    </div>
                    
                    {livesUsed >= FREE_LIVES_LIMIT && (
                      <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 mb-3">
                        <p className="text-red-400 text-sm font-semibold">
                          ⚠️ Has agotado tus lives gratuitos
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setIsPremium(true)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">👑</span>
                      Obtener Premium
                    </button>
                    
                    <div className="mt-3 space-y-1">
                      <p className="text-gray-400 text-xs text-center">Beneficios Premium:</p>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <span>✓ Lives ilimitados</span>
                        <span>✓ Sin límite de tiempo</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setIsRegistered(false)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/15 transition-colors mt-4"
            >
              Cerrar Sesión
            </button>
          </div>
          
          {/* Bottom Navigation */}
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            urgentLive={urgentLive}
            onLiveSellClick={() => setShowLiveSellPrep(true)}
          />
        </div>
      );
    }
  }

  // Vista de preparación para LiveSell
  if (showLiveSellPrep) {
    return (
      <div className="fixed inset-0 z-50 bg-black w-full h-full overflow-hidden">
        {/* Video preview full screen */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay con controles */}
        <div className="absolute inset-0 flex flex-col w-full h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <button
              onClick={() => setShowLiveSellPrep(false)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-white font-bold text-lg flex items-center gap-2">
              <Video className="w-6 h-6 text-pink-500" />
              Preparar LiveSell
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Área central con instrucciones y galería */}
          <div className="flex-1 overflow-y-auto p-4 pb-40">
            <div className="max-w-md mx-auto space-y-4">
              {/* Instrucciones */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-pink-500" />
                  Selecciona tus piezas
                </h2>
                <p className="text-gray-300 text-sm mb-4">
                  Escoge las piezas que vas a mostrar en tu transmisión en vivo
                </p>
                
                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setReturnToLiveSellPrep(true);
                      setShowCameraCapture(true);
                      setShowLiveSellPrep(false);
                    }}
                    className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Tomar Foto
                  </button>
                  <button
                    onClick={() => {
                      setReturnToLiveSellPrep(true);
                      imageInputRef.current?.click();
                    }}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Image className="w-5 h-5" />
                    Galería
                  </button>
                </div>
              </div>

              {/* Lista de piezas agregadas */}
              {promoteImages.length > 0 ? (
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-pink-500" />
                    Piezas seleccionadas ({promoteImages.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {promoteImages.map((piece) => (
                      <div key={piece.id} className="relative group">
                        <img 
                          src={piece.url} 
                          alt={piece.description}
                          className="w-full aspect-square object-cover rounded-lg border border-white/20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-white text-xs font-medium truncate">
                            {piece.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 border-dashed text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    Aún no has agregado piezas
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Agrega al menos una pieza para iniciar
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botón de iniciar transmisión fijo en la parte inferior */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/80 to-transparent">
            <button
              onClick={() => {
                if (promoteImages.length === 0) {
                  alert('Debes agregar al menos una pieza antes de iniciar la transmisión');
                  return;
                }
                // Preparar para iniciar el live
                setShowLiveSellPrep(false);
                startPreLive();
              }}
              disabled={promoteImages.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                promoteImages.length > 0
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50 hover:shadow-xl hover:shadow-pink-500/70 hover:scale-[1.02]'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Video className="w-6 h-6" />
              {promoteImages.length > 0 
                ? `Iniciar Live con ${promoteImages.length} pieza${promoteImages.length > 1 ? 's' : ''}`
                : 'Agrega piezas para continuar'
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interfaz de captura de fotos estilo Snapchat
  if (showCameraCapture) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Video preview full screen */}
        <video
          ref={captureVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay con controles */}
        <div className="absolute inset-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
            <button
              onClick={closeCameraCapture}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-white font-bold text-lg">
              Capturar Pieza
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Instrucciones centrales */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 text-center max-w-sm">
              <Camera className="w-12 h-12 text-white mx-auto mb-3" />
              <p className="text-white font-semibold text-lg mb-2">
                Captura la pieza
              </p>
              <p className="text-gray-300 text-sm">
                Asegúrate de que la pieza esté bien iluminada y centrada
              </p>
            </div>
          </div>

          {/* Botón de captura */}
          <div className="pb-10 flex flex-col items-center gap-4">
            <button
              onClick={capturePhoto}
              className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-white group-active:scale-90 transition-transform"></div>
            </button>
            <p className="text-white text-sm font-medium">
              Toca para capturar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default LiveShoppingApp;
