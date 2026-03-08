import { useState, useEffect, useRef } from "react";

export default function LiveStreamWindow({ 
  videoRef, 
  livePost, 
  viewers = 1247, 
  liveTimeRemaining = 3600,
  onEndLive 
}) {
  const [bid, setBid] = useState(45);
  const [count, setCount] = useState(14);
  const [secs, setSecs] = useState(10);
  const [running, setRunning] = useState(false); // Cambiado a false para iniciar solo al vender
  const [viewersCount, setViewersCount] = useState(viewers);
  const [bidFeed, setBidFeed] = useState([]);
  const [leaderName, setLeaderName] = useState('ModaMx');
  const [showFlash, setShowFlash] = useState(false);
  const [flashNumber, setFlashNumber] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [currentAuctionPiece, setCurrentAuctionPiece] = useState(null);
  const [soldPieces, setSoldPieces] = useState(new Set());

  const CIRC = 2 * Math.PI * 24;

  const users = [
    {n:'ModaMx',c:'#B03020'},{n:'VivianaR',c:'#6C3483'},{n:'FashionK',c:'#1A5276'},
    {n:'LunaStyle',c:'#9A6B00'},{n:'CarlaB',c:'#1A7A40'},{n:'PaulaM',c:'#A04000'},
    {n:'Rebeca_F',c:'#8B2018'},{n:'Daniela',c:'#0E6655'},{n:'SofiaM',c:'#5B2C6F'},
    {n:'NataR',c:'#154360'},
  ];

  // Auto-bid simulation
  useEffect(() => {
    if (!running) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.65 && secs > 3) return;
      
      const u = users[Math.floor(Math.random() * users.length)];
      setBid(prev => prev + 5);
      setCount(prev => prev + 1);
      setLeaderName(u.n);
      setSecs(10);
      
      // Add bubble to feed
      addBubble(u, bid + 5);
    }, 1300);

    return () => clearInterval(interval);
  }, [running, secs, bid]);

  // Countdown timer
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSecs(prev => {
        if (prev <= 3 && prev > 0) {
          doFlash(prev);
        }
        if (prev === 0) {
          endRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  // Viewers fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(prev => prev + Math.floor(Math.random() * 80 - 25));
    }, 3500);

    setTimeout(() => addBubble(users[0], bid), 700);

    return () => clearInterval(interval);
  }, []);

  const addBubble = (u, amount) => {
    const bubble = {
      id: Date.now(),
      user: u.n,
      color: u.c,
      amount: amount
    };

    setBidFeed(prev => {
      const newFeed = [...prev, bubble];
      return newFeed.slice(-3); // Keep only last 3
    });

    // Remove after 2.7s
    setTimeout(() => {
      setBidFeed(prev => prev.filter(b => b.id !== bubble.id));
    }, 2700);
  };

  const doFlash = (n) => {
    setFlashNumber(n);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 880);
  };

  const endRound = () => {
    setRunning(false);
    
    // Marcar pieza como vendida
    if (currentAuctionPiece) {
      setSoldPieces(prev => new Set([...prev, currentAuctionPiece.id]));
      setCurrentAuctionPiece(null);
    }
    
    setTimeout(() => {
      setSecs(10);
      setCount(0);
    }, 3200);
  };

  const handlePieceClick = (piece) => {
    if (soldPieces.has(piece.id)) return; // No permitir vender piezas ya vendidas
    if (running) return; // No permitir si hay subasta activa
    
    setSelectedPiece(piece);
    setShowSellModal(true);
  };

  const handleStartAuction = () => {
    if (!selectedPiece) return;
    
    // Cerrar modal
    setShowSellModal(false);
    
    // Iniciar subasta
    setCurrentAuctionPiece(selectedPiece);
    setBid(selectedPiece.minPrice);
    setCount(1);
    setSecs(10);
    setRunning(true);
    
    // Limpiar feed
    setBidFeed([]);
    
    // Primera puja del primer usuario
    setTimeout(() => {
      addBubble(users[0], selectedPiece.minPrice);
    }, 500);
    
    setSelectedPiece(null);
  };

  const strokeDashoffset = CIRC * (1 - secs / 10);
  const ringStroke = secs <= 3 ? '#FF3B30' : '#D93025';
  const bidBarWidth = Math.min((bid / 250) * 100, 100);
  
  const pieces = livePost?.pieces || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .model-area {
          position: absolute;
          bottom: 155px;
          left: 50%;
          transform: translateX(-50%);
          width: 185px;
          height: 335px;
          z-index: 3;
          opacity: 0.75;
        }

        .model-area svg {
          width: 100%;
          height: 100%;
          animation: sway 8s ease-in-out infinite;
        }

        @keyframes sway {
          0%, 100% { transform: translateX(0); }
          35% { transform: translateX(5px) rotate(0.3deg); }
          70% { transform: translateX(-4px) rotate(-0.3deg); }
        }

        .top-bar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 16px 10px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);
        }

        .top-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #2B2B2B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.85);
          font-size: 15px;
          border: none;
        }

        .transmit-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #D93025;
          border: none;
          border-radius: 22px;
          padding: 9px 20px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.3px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(217,48,37,0.45);
        }

        .transmit-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          animation: blink 1s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .viewers-badge {
          position: sticky;
          z-index: 20;
          top: 70px;
          left: 16px;
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,0,0,0.52);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          margin-bottom: -40px;
        }

        .v-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF3B30;
          animation: blink 1s infinite;
        }

        .timer-area {
          position: sticky;
          z-index: 20;
          top: 62px;
          float: right;
          margin-right: 16px;
          margin-bottom: -70px;
        }

        .ring-wrap {
          position: relative;
          width: 56px;
          height: 56px;
        }

        .ring-wrap svg {
          transform: rotate(-90deg);
          width: 56px;
          height: 56px;
        }

        .ring-bg {
          fill: none;
          stroke: rgba(255,255,255,0.1);
          stroke-width: 3;
        }

        .ring-fill {
          fill: none;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-dasharray: 150.8;
          transition: stroke-dashoffset 0.95s linear, stroke 0.3s;
        }

        .ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .t-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 19px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }

        .t-num.urgent {
          color: #FF3B30;
          animation: flicker 0.4s ease-in-out infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .t-seg {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
          margin-top: 1px;
        }

        .bid-feed {
          position: fixed;
          z-index: 20;
          left: 16px;
          bottom: 310px;
          width: 240px;
          max-height: 115px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 5px;
          pointer-events: none;
        }

        .bubble {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(0,0,0,0.58);
          border-radius: 20px;
          padding: 5px 12px 5px 5px;
          width: fit-content;
          animation: bubble-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes bubble-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.88);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .b-av {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .b-txt {
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }

        .b-n {
          color: rgba(255,255,255,0.6);
        }

        .b-a {
          color: #FF9F0A;
          font-weight: 700;
          margin-left: 3px;
        }

        .bid-card-wrap {
          position: fixed;
          z-index: 20;
          left: 0;
          right: 0;
          bottom: 218px;
          padding: 0 16px;
        }

        .bid-card {
          background: rgba(0,0,0,0.62);
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .bc-label {
          font-size: 9px;
          color: rgba(255,255,255,0.38);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .bc-amount {
          font-family: 'JetBrains Mono', monospace;
          font-size: 30px;
          font-weight: 600;
          color: #fff;
          line-height: 1;
        }

        .bc-amount .ps {
          font-size: 16px;
          color: rgba(255,255,255,0.55);
          margin-right: 1px;
        }

        .bc-right {
          text-align: right;
        }

        .bc-leader {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.88);
          margin-bottom: 2px;
        }

        .bc-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.32);
        }

        .bid-bar {
          height: 2px;
          background: rgba(255,255,255,0.07);
          border-radius: 1px;
          margin-top: 10px;
          overflow: hidden;
        }

        .bid-bar-fill {
          height: 100%;
          background: #D93025;
          border-radius: 1px;
          transition: width 0.4s ease;
        }

        .flash-wrap {
          position: fixed;
          inset: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          opacity: 0;
        }

        .flash-wrap.show {
          opacity: 1;
        }

        .flash-n {
          font-family: 'JetBrains Mono', monospace;
          font-size: 130px;
          font-weight: 800;
          color: rgba(255,255,255,0.7);
          animation: flashanim 0.9s ease-out forwards;
        }

        @keyframes flashanim {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .bottom-ui {
          position: fixed;
          z-index: 20;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .select-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin: 0 auto 14px;
          width: fit-content;
          background: rgba(24,20,10,0.88);
          border: 1px solid #B8940A;
          border-radius: 22px;
          padding: 9px 22px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.78);
          cursor: pointer;
        }

        .bottom-nav {
          background: #0A0A0A;
          border-radius: 26px 26px 0 0;
          padding: 14px 0 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-group {
          display: flex;
          align-items: center;
          background: #1E1E1E;
          border-radius: 50px;
          padding: 5px;
          gap: 3px;
        }

        .nav-btn {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          cursor: pointer;
          background: transparent;
          border: none;
        }

        .nav-btn.center {
          background: linear-gradient(145deg, #E040C8 0%, #C82060 55%, #A0108A 100%);
          box-shadow: 0 0 16px rgba(200,32,96,0.5);
        }

        .nav-btn .ni {
          font-size: 22px;
        }

        .nav-btn .nl {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }

        .nav-btn.center .nl {
          color: rgba(255,255,255,0.9);
        }

        /* PIECES GRID */
        .pieces-scroll-container {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 240px;
          max-height: 200px;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 15;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          padding: 0 16px;
        }

        .pieces-scroll-container::-webkit-scrollbar {
          width: 3px;
        }

        .pieces-scroll-container::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }

        .pieces-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(217,48,37,0.5);
          border-radius: 10px;
        }

        .pieces-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
          gap: 8px;
          padding: 8px;
          background: rgba(0,0,0,0.4);
          border-radius: 12px;
        }

        .piece-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .piece-card:hover {
          transform: scale(1.05);
          border-color: #D93025;
          box-shadow: 0 4px 12px rgba(217,48,37,0.5);
        }

        .piece-card.sold {
          opacity: 0.4;
          pointer-events: none;
        }

        .piece-card.active {
          border-color: #FFDE00;
          box-shadow: 0 0 20px rgba(255,222,0,0.6);
          animation: pulse-border 1s infinite;
        }

        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 20px rgba(255,222,0,0.6); }
          50% { box-shadow: 0 0 30px rgba(255,222,0,0.9); }
        }

        .piece-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .piece-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 4px;
        }

        .piece-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          color: #FFDE00;
          text-align: center;
        }

        .piece-sold-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #FF2D55;
          color: #fff;
          font-size: 8px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }

        /* SELL MODAL */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sell-modal {
          background: rgba(28,28,28,0.95);
          border: 1px solid rgba(255,45,85,0.3);
          border-radius: 20px;
          padding: 24px;
          max-width: 320px;
          width: 90%;
          animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          text-align: center;
          margin-bottom: 16px;
        }

        .modal-piece-preview {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .modal-piece-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-details {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .modal-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .modal-detail-row:last-child {
          margin-bottom: 0;
        }

        .modal-detail-label {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .modal-detail-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #FFDE00;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .modal-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn.cancel {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }

        .modal-btn.cancel:hover {
          background: rgba(255,255,255,0.15);
        }

        .modal-btn.confirm {
          background: linear-gradient(135deg, #D93025, #FF2D55);
          color: #fff;
          box-shadow: 0 4px 12px rgba(217,48,37,0.5);
        }

        .modal-btn.confirm:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(217,48,37,0.7);
        }

        .modal-warning {
          background: rgba(255,222,0,0.1);
          border: 1px solid rgba(255,222,0,0.3);
          border-radius: 8px;
          padding: 8px;
          margin-bottom: 16px;
          text-align: center;
          font-size: 11px;
          color: rgba(255,222,0,0.9);
        }
      `}</style>

      <div className="min-h-screen w-full bg-[#1C1C1C] overflow-x-hidden overflow-y-auto">
        <div className="relative min-h-[300vh]">
          {/* VIDEO */}
          <div className="fixed top-0 left-0 right-0 h-screen bg-[#1C1C1C] overflow-hidden">
          <div className="absolute inset-0 z-[2] pointer-events-none" 
               style={{background: 'radial-gradient(ellipse 80% 80% at 50% 45%, transparent 30%, rgba(0,0,0,0.5) 100%)'}}></div>
          <div className="model-area">
            <svg viewBox="0 0 180 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="90" cy="32" rx="20" ry="23" fill="rgba(180,130,100,0.55)" />
              <path d="M70 22 Q72 4 90 2 Q108 4 110 22 Q105 10 90 9 Q75 10 70 22Z" fill="rgba(70,35,18,0.65)" />
              <rect x="83" y="53" width="14" height="15" fill="rgba(180,130,100,0.5)" />
              <path d="M55 68 Q60 60 90 63 Q120 60 125 68 L130 118 Q118 126 90 128 Q62 126 50 118Z" fill="rgba(155,42,26,0.55)" />
              <path d="M50 114 Q32 165 30 252 L150 252 Q148 165 130 114 Q115 122 90 123 Q65 122 50 114Z" fill="rgba(115,20,14,0.5)" />
              <path d="M65 80 Q90 86 115 80" stroke="rgba(255,110,70,0.22)" strokeWidth="1.5" fill="none" />
              <path d="M55 72 Q36 90 33 118 Q38 122 44 119 Q48 96 62 80Z" fill="rgba(180,130,100,0.44)" />
              <path d="M125 72 Q144 90 147 118 Q142 122 136 119 Q132 96 118 80Z" fill="rgba(180,130,100,0.44)" />
              <ellipse cx="68" cy="258" rx="13" ry="5" fill="rgba(55,16,8,0.7)" />
              <ellipse cx="112" cy="258" rx="13" ry="5" fill="rgba(55,16,8,0.7)" />
            </svg>
          </div>
        </div>

        {/* TOP BAR */}
        <div className="top-bar">
          <div className="top-left">
            <button className="icon-btn" onClick={onEndLive}>✕</button>
            <button className="icon-btn">📷</button>
            <button className="icon-btn">⚡</button>
          </div>
          <button className="transmit-btn">
            <div className="transmit-dot"></div>
            TRANSMITIENDO
          </button>
        </div>

        {/* VIEWERS */}
        <div className="viewers-badge">
          <div className="v-dot"></div>
          <span>{viewersCount.toLocaleString()} viendo</span>
        </div>

        {/* TIMER RING - Solo mostrar si hay subasta activa */}
        {running && (
          <div className="timer-area">
            <div className="ring-wrap">
              <svg viewBox="0 0 56 56">
                <circle className="ring-bg" cx="28" cy="28" r="24" />
                <circle 
                  className="ring-fill" 
                  cx="28" 
                  cy="28" 
                  r="24" 
                  style={{ 
                    strokeDashoffset: strokeDashoffset,
                    stroke: ringStroke 
                  }} 
                />
              </svg>
              <div className="ring-center">
                <div className={`t-num ${secs <= 3 ? 'urgent' : ''}`}>{secs}</div>
                <div className="t-seg">SEG</div>
              </div>
            </div>
          </div>
        )}

        {/* BID BUBBLES - Solo mostrar si hay subasta activa */}
        {running && (
          <div className="bid-feed">
            {bidFeed.map((bubble) => (
              <div key={bubble.id} className="bubble">
                <div className="b-av" style={{ background: bubble.color }}>
                  {bubble.user[0]}
                </div>
                <div className="b-txt">
                  <span className="b-n">{bubble.user}</span>
                  <span className="b-a">+$5 → ${bubble.amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BID CARD - Solo mostrar si hay subasta activa */}
        {running && currentAuctionPiece && (
          <div className="bid-card-wrap">
            <div className="bid-card">
              <div>
                <div className="bc-label">Puja actual</div>
                <div className="bc-amount">
                  <span className="ps">$</span>
                  <span>{bid}</span>
                </div>
              </div>
              <div className="bc-right">
                <div className="bc-leader">👑 {leaderName}</div>
                <div className="bc-sub">{count} participantes</div>
              </div>
            </div>
            <div className="bid-bar">
              <div className="bid-bar-fill" style={{ width: `${bidBarWidth}%` }}></div>
            </div>
          </div>
        )}

        {/* FLASH */}
        <div className={`flash-wrap ${showFlash ? 'show' : ''}`}>
          <div className="flash-n">{flashNumber}</div>
        </div>

        {/* PIECES GRID */}
        {pieces.length > 0 && (
          <div className="pieces-scroll-container">
            <div className="pieces-grid">
              {pieces.map((piece, index) => (
                <div
                  key={piece.id || index}
                  className={`piece-card ${
                    soldPieces.has(piece.id) ? 'sold' : ''
                  } ${
                    currentAuctionPiece?.id === piece.id ? 'active' : ''
                  }`}
                  onClick={() => handlePieceClick(piece)}
                >
                  <img src={piece.url} alt={piece.description} className="piece-img" />
                  <div className="piece-overlay">
                    <div className="piece-price">RD${piece.minPrice}</div>
                  </div>
                  {soldPieces.has(piece.id) && (
                    <div className="piece-sold-badge">VENDIDO</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM */}
        <div className="bottom-ui">
          <div className="select-pill">👆 Selecciona una pieza para iniciar subasta</div>
          <div className="bottom-nav">
            <div className="nav-group">
              <button className="nav-btn">
                <span className="ni">🖼️</span>
                <span className="nl">Galería</span>
              </button>
              <button className="nav-btn center">
                <span className="ni">📸</span>
                <span className="nl">Capturar</span>
              </button>
              <button className="nav-btn">
                <span className="ni">✨</span>
                <span className="nl">Efectos</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* SELL MODAL */}
      {showSellModal && selectedPiece && (
        <div className="modal-backdrop" onClick={() => setShowSellModal(false)}>
          <div className="sell-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">🔨 ¿Iniciar Subasta?</div>
            
            <div className="modal-piece-preview">
              <img src={selectedPiece.url} alt={selectedPiece.description} />
            </div>
            
            <div className="modal-warning">
              ⏱️ La subasta durará 10 segundos
            </div>
            
            <div className="modal-details">
              <div className="modal-detail-row">
                <span className="modal-detail-label">Descripción</span>
                <span style={{ fontSize: '12px', color: '#fff', maxWidth: '60%', textAlign: 'right' }}>
                  {selectedPiece.description}
                </span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Precio Mínimo</span>
                <span className="modal-detail-value">RD${selectedPiece.minPrice}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Timer</span>
                <span className="modal-detail-value" style={{ color: '#FF3B30' }}>10s</span>
              </div>
            </div>
            
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '16px' }}>
              ⚠️ El precio mínimo no se puede cambiar una vez iniciada la subasta
            </div>
            
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowSellModal(false)}>
                Cancelar
              </button>
              <button className="modal-btn confirm" onClick={handleStartAuction}>
                🔨 VENDER
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
