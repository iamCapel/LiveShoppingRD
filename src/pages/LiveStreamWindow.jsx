import { useState, useEffect, useRef } from "react";

// ─── Particle Burst Component ─────────────────────────────────────────────────
function ConfettiParticle({ style }) {
  return <div style={style} className="confetti-particle" />;
}

// ─── Bid Row ──────────────────────────────────────────────────────────────────
function BidRow({ bid, isTop }) {
  return (
    <div className={`bid-row ${isTop ? "bid-top" : ""}`}>
      <span className="bid-avatar">{bid.user[0].toUpperCase()}</span>
      <span className="bid-user">{bid.user}</span>
      <span className="bid-amount">RD${bid.amount.toLocaleString()}</span>
      {isTop && <span className="bid-crown">👑</span>}
    </div>
  );
}

// ─── Sold Overlay ─────────────────────────────────────────────────────────────
function SoldOverlay({ winner, onClose }) {
  const randomBetween = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      style: {
        left: `${randomBetween(10, 90)}%`,
        top: `${randomBetween(10, 80)}%`,
        background: ["#FF3CAC", "#FFDE00", "#00FFA3", "#00D4FF", "#FF6B35"][i % 5],
        width: `${randomBetween(6, 14)}px`,
        height: `${randomBetween(6, 14)}px`,
        borderRadius: i % 3 === 0 ? "50%" : "2px",
        animationDelay: `${(i * 0.05).toFixed(2)}s`,
        transform: `rotate(${randomBetween(0, 360)}deg)`,
      },
    }))
  );

  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="sold-overlay">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} style={p.style} />
      ))}
      <div className="sold-card">
        <div className="sold-hammer">🔨</div>
        <div className="sold-label">¡VENDIDO!</div>
        <img src={winner.piece.url} alt={winner.piece.description} className="sold-piece-img" />
        <div className="sold-piece-name">{winner.piece.description}</div>
        <div className="sold-winner-row">
          <span className="sold-avatar-big">{winner.user[0].toUpperCase()}</span>
          <div>
            <div className="sold-winner-name">{winner.user}</div>
            <div className="sold-winner-price">RD${winner.amount.toLocaleString()}</div>
          </div>
        </div>
        <div className="sold-congrats">🎉 ¡Mejor postor!</div>
      </div>
    </div>
  );
}

// ─── Sell Modal ───────────────────────────────────────────────────────────────
function SellModal({ piece, onConfirm, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sell-modal" onClick={e => e.stopPropagation()}>
        {/* blurred photo background */}
        <div className="sell-photo-bg" style={{ backgroundImage: `url(${piece.url})` }} />

        {/* rotated stamp */}
        <div className="sell-stamp">SUBASTA</div>

        {/* close */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* glass content */}
        <div className="sell-glass">
          {/* thumbnail with watermarks */}
          <div className="sell-thumb-frame">
            <img src={piece.url} alt={piece.description} />
            <div className="sell-wm-live">
              <div className="sell-wm-dot" />
              EN VIVO
            </div>
            <div className="sell-wm-name">{piece.description.substring(0, 20)}...</div>
          </div>

          {/* data chips */}
          <div className="sell-data-row">
            <div className="sell-data-chip">
              <div className="sell-data-chip-label">Precio</div>
              <div className="sell-data-chip-val">RD${piece.minPrice.toLocaleString()}</div>
            </div>
            <div className="sell-data-chip">
              <div className="sell-data-chip-label">Timer</div>
              <div className="sell-data-chip-val red">10s</div>
            </div>
            <div className="sell-data-chip">
              <div className="sell-data-chip-label">Inicio</div>
              <div className="sell-data-chip-val">MIN</div>
            </div>
          </div>

          <div className="sell-lock-note">⚠ Precio mínimo <span>no editable</span></div>

          <button className="sell-confirm-btn" onClick={() => onConfirm(piece)}>
            🔨 VENDER
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LiveStreamWindow({ 
  videoRef, 
  livePost, 
  viewers = 0, 
  liveTimeRemaining = 3600,
  onEndLive 
}) {
  const [recentlySold, setRecentlySold] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [auctionPiece, setAuctionPiece] = useState(null);
  const [auctionTimer, setAuctionTimer] = useState(10);
  const [bids, setBids] = useState([]);
  const [viewersCount, setViewersCount] = useState(viewers);
  const [soldOverlay, setSoldOverlay] = useState(null);
  const [pulseViewers, setPulseViewers] = useState(false);
  const [newBidFlash, setNewBidFlash] = useState(false);
  const [soldPieces, setSoldPieces] = useState(new Set());
  const auctionRef = useRef(null);

  const BIDDERS = ["Ana M.", "Carlos R.", "María G.", "José L.", "Laura P.", "Pedro S.", "Sofia V.", "Juan D.", "Carmen T."];

  function randomBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  // Viewer fluctuation
  useEffect(() => {
    const t = setInterval(() => {
      setViewersCount((v) => v + randomBetween(-12, 25));
      setPulseViewers(true);
      setTimeout(() => setPulseViewers(false), 500);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Auction logic
  useEffect(() => {
    if (!auctionPiece) return;
    clearInterval(auctionRef.current);
    auctionRef.current = setInterval(() => {
      setAuctionTimer((t) => {
        if (t <= 1) {
          clearInterval(auctionRef.current);
          // Determine winner
          const topBid = bids[0];
          if (topBid) {
            setSoldOverlay({ piece: auctionPiece, user: topBid.user, amount: topBid.amount });
            setRecentlySold((prev) => [auctionPiece, ...prev].slice(0, 6));
            setSoldPieces((prev) => new Set([...prev, auctionPiece.id]));
            setBids([]);
            setAuctionPiece(null);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(auctionRef.current);
  }, [auctionPiece, bids]);

  // Auto-bid simulation
  useEffect(() => {
    if (!auctionPiece) return;
    const t = setInterval(() => {
      if (Math.random() < 0.55) {
        const bidder = BIDDERS[randomBetween(0, BIDDERS.length - 1)];
        const topPrice = bids[0]?.amount ?? auctionPiece.minPrice;
        const newAmount = topPrice + randomBetween(50, 300);
        setBids((prev) => [{ user: bidder, amount: newAmount }, ...prev].slice(0, 8));
        setAuctionTimer(10); // reset timer on each bid
        setNewBidFlash(true);
        setTimeout(() => setNewBidFlash(false), 400);
      }
    }, 2200);
    return () => clearInterval(t);
  }, [auctionPiece, bids]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleStartAuction = (piece) => {
    setSelectedPiece(null);
    setAuctionPiece(piece);
    setAuctionTimer(10);
    setBids([{ user: BIDDERS[0], amount: piece.minPrice }]);
  };

  const pieces = livePost?.pieces || [];
  const available = pieces.filter((p) => !soldPieces.has(p.id || pieces.indexOf(p)));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .live-root {
          min-height: 100vh;
          background: #07060D;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          position: relative;
          overflow-x: hidden;
        }

        /* ── TOP BAR ── */
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .live-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #FF2D55;
          padding: 5px 14px;
          border-radius: 30px;
          font-family: 'Bebas Neue';
          letter-spacing: 1px;
          font-size: 15px;
        }
        .live-dot {
          width: 8px; height: 8px;
          background: #fff;
          border-radius: 50%;
          animation: blink 1s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .viewers-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 5px 12px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          transition: transform 0.2s;
        }
        .viewers-badge.pulse { transform: scale(1.07); color: #00FFA3; }
        .viewers-icon { font-size: 14px; }

        .countdown-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Bebas Neue';
          font-size: 22px;
          letter-spacing: 2px;
          color: #FFDE00;
        }

        .end-live-btn {
          background: rgba(255,45,85,0.2);
          border: 1px solid #FF2D55;
          color: #fff;
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .end-live-btn:hover {
          background: #FF2D55;
        }

        /* ── MAIN LAYOUT ── */
        .main-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          flex: 1;
          min-height: 0;
        }

        /* ── VIDEO AREA ── */
        .video-area {
          position: relative;
          background: linear-gradient(160deg, #12101C 0%, #1A1530 100%);
          min-height: 600px;
          overflow: hidden;
        }
        
        .video-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        
        .video-stream {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .video-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ── AUCTION BOX ── */
        .auction-box {
          position: absolute;
          left: 12px; right: 12px; bottom: 12px;
          background: rgba(10,9,20,0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,45,85,0.3);
          border-radius: 20px;
          padding: 18px;
          box-shadow: 0 0 40px rgba(255,45,85,0.15);
        }
        .auction-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .auction-piece-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .auction-thumb {
          width: 52px; height: 52px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid #FF2D55;
        }
        .auction-piece-info {}
        .auction-piece-name { font-weight: 600; font-size: 15px; }
        .auction-min { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }

        .timer-circle {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: conic-gradient(#FF2D55 calc(var(--pct) * 1%), rgba(255,45,85,0.1) 0);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue';
          font-size: 22px;
          transition: all 0.5s;
        }
        .timer-circle.urgent { --color: #FF6B35; }

        .bids-list { display: flex; flex-direction: column; gap: 6px; max-height: 150px; overflow-y: auto; }
        .bids-list::-webkit-scrollbar { width: 3px; }
        .bids-list::-webkit-scrollbar-track { background: transparent; }
        .bids-list::-webkit-scrollbar-thumb { background: rgba(255,45,85,0.4); border-radius: 10px; }

        .bid-row {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          font-size: 13px;
          transition: background 0.3s;
          animation: bidSlide 0.3s ease;
        }
        @keyframes bidSlide { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: none; } }
        .bid-row.bid-top {
          background: rgba(255,222,0,0.08);
          border: 1px solid rgba(255,222,0,0.2);
        }
        .bid-avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF2D55, #FF6B35);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
        }
        .bid-user { flex: 1; color: rgba(255,255,255,0.7); }
        .bid-amount { font-weight: 700; color: #FFDE00; font-family: 'Bebas Neue'; font-size: 16px; letter-spacing:1px; }
        .bid-crown { font-size: 14px; }

        .bid-flash { animation: flashBid 0.4s ease; }
        @keyframes flashBid {
          0% { background: rgba(255,222,0,0.25); }
          100% { background: transparent; }
        }

        .no-auction {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 12px;
          color: rgba(255,255,255,0.3);
          font-size: 15px;
          padding: 40px;
          text-align: center;
        }
        .no-auction-icon { font-size: 48px; opacity: 0.4; }

        /* ── RECENTLY SOLD STRIP ── */
        .sold-strip {
          position: absolute;
          top: 16px; left: 16px; right: 16px;
          display: flex;
          gap: 10px;
          overflow-x: auto;
          z-index: 10;
        }
        .sold-strip::-webkit-scrollbar { display: none; }
        .sold-chip {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(255,45,85,0.4);
          padding: 5px 10px 5px 5px;
          border-radius: 30px;
          font-size: 12px;
          animation: chipIn 0.4s ease;
        }
        @keyframes chipIn { from { opacity:0; transform: scale(0.8); } to { opacity:1; transform: none; } }
        .sold-chip-img {
          width: 28px; height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        .sold-chip-label { color: rgba(255,255,255,0.8); }
        .sold-chip-badge {
          background: #FF2D55;
          border-radius: 30px;
          padding: 1px 7px;
          font-size: 10px;
          font-weight: 700;
        }

        /* ── THUMBNAIL STRIP (WhatsApp style) ── */
        .thumb-strip-wrapper {
          position: absolute;
          bottom: 234px;
          left: 0; right: 0;
          padding: 0 12px 10px;
          z-index: 10;
        }
        .thumb-strip-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          margin-bottom: 7px;
          padding-left: 2px;
        }
        .thumb-strip {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          overflow-y: visible;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 6px;
          cursor: grab;
        }
        .thumb-strip:active { cursor: grabbing; }
        .thumb-strip::-webkit-scrollbar { height: 2px; }
        .thumb-strip::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .thumb-strip::-webkit-scrollbar-thumb { background: rgba(255,45,85,0.5); border-radius: 10px; }

        .thumb-item {
          flex-shrink: 0;
          scroll-snap-align: start;
          width: 58px;
          border-radius: 10px;
          overflow: visible;
          cursor: pointer;
          position: relative;
          transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
        }
        .thumb-item:hover { transform: translateY(-5px) scale(1.08); }
        .thumb-item.active-auction { transform: translateY(-6px) scale(1.1); }
        .thumb-item.sold { opacity: 0.3; cursor: default; pointer-events: none; }

        .thumb-img-wrap {
          width: 58px;
          height: 72px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          transition: border-color 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .thumb-item:hover .thumb-img-wrap {
          border-color: #FF2D55;
          box-shadow: 0 4px 16px rgba(255,45,85,0.45);
        }
        .thumb-item.active-auction .thumb-img-wrap {
          border-color: #FFDE00;
          box-shadow: 0 4px 20px rgba(255,222,0,0.5);
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* dark gradient bottom on each thumb */
        .thumb-img-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          pointer-events: none;
        }

        .thumb-price {
          position: absolute;
          bottom: 3px; left: 0; right: 0;
          text-align: center;
          font-family: 'Bebas Neue';
          font-size: 11px;
          color: #FFDE00;
          letter-spacing: 0.3px;
          z-index: 2;
          pointer-events: none;
        }

        .thumb-badge {
          position: absolute;
          top: -5px; right: -5px;
          width: 16px; height: 16px;
          border-radius: 50%;
          font-size: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
          border: 1.5px solid #07060D;
          z-index: 3;
        }
        .thumb-badge.live { background: #FFDE00; color: #000; }
        .thumb-badge.sold-dot { background: #FF2D55; color: #fff; }

        /* VENDER tap label */
        .thumb-sell-label {
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: rgba(255,45,85,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 2;
        }
        .thumb-item:hover .thumb-sell-label { opacity: 1; }
        .thumb-sell-text {
          font-family: 'Bebas Neue';
          font-size: 12px;
          letter-spacing: 1px;
          color: #fff;
          background: #FF2D55;
          padding: 2px 6px;
          border-radius: 6px;
        }

        /* ── MODALS ── */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        /* compact card */
        .sell-modal {
          position: relative;
          width: 220px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08);
          animation: popIn 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes popIn { from { opacity:0; transform: scale(0.78); } to { opacity:1; transform: scale(1); } }

        /* full bleed photo background */
        .sell-photo-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: blur(2px) brightness(0.55) saturate(0.8);
          transform: scale(1.06);
        }

        /* smoky glass layer */
        .sell-glass {
          position: relative;
          z-index: 2;
          background: rgba(8,7,18,0.52);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 16px 14px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        /* close */
        .modal-close {
          position: absolute;
          top: 10px; right: 10px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.7);
          width: 26px; height: 26px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 11px;
          z-index: 5;
          transition: background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-close:hover { background: rgba(255,45,85,0.45); color: #fff; }

        /* watermark tag — rotated stamp */
        .sell-stamp {
          position: absolute;
          top: 18px; left: -8px;
          background: rgba(255,45,85,0.82);
          backdrop-filter: blur(4px);
          color: #fff;
          font-family: 'Bebas Neue';
          font-size: 10px;
          letter-spacing: 2px;
          padding: 3px 12px;
          transform: rotate(-12deg);
          box-shadow: 0 2px 10px rgba(255,45,85,0.5);
          z-index: 5;
          border-radius: 2px;
        }

        /* photo thumbnail */
        .sell-thumb-frame {
          width: 88px;
          height: 110px;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid rgba(255,255,255,0.18);
          box-shadow: 0 6px 24px rgba(0,0,0,0.55);
          margin-bottom: 10px;
          margin-top: 6px;
          position: relative;
          flex-shrink: 0;
        }
        .sell-thumb-frame img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        /* thin light edge on photo */
        .sell-thumb-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
          pointer-events: none;
        }

        /* watermark overlays on the thumb */
        .sell-wm-name {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(6px);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: rgba(255,255,255,0.9);
          text-align: center;
          padding: 4px 4px;
          text-transform: uppercase;
        }
        .sell-wm-live {
          position: absolute;
          top: 5px; right: 5px;
          display: flex; align-items: center; gap: 3px;
          background: rgba(255,45,85,0.75);
          backdrop-filter: blur(4px);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #fff;
          padding: 2px 5px;
          border-radius: 4px;
        }
        .sell-wm-dot {
          width: 5px; height: 5px;
          background: #fff;
          border-radius: 50%;
          animation: blink 0.9s infinite;
        }

        /* data stamps below thumb */
        .sell-data-row {
          display: flex;
          gap: 6px;
          width: 100%;
          margin-bottom: 8px;
        }
        .sell-data-chip {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border-radius: 8px;
          padding: 5px 4px;
          text-align: center;
        }
        .sell-data-chip-label {
          font-size: 8px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .sell-data-chip-val {
          font-family: 'Bebas Neue';
          font-size: 14px;
          letter-spacing: 0.5px;
          color: #FFDE00;
          line-height: 1;
        }
        .sell-data-chip-val.red { color: #FF2D55; }

        /* locked note */
        .sell-lock-note {
          font-size: 9px;
          color: rgba(255,255,255,0.28);
          text-align: center;
          margin-bottom: 10px;
          letter-spacing: 0.3px;
        }
        .sell-lock-note span { color: rgba(255,222,0,0.45); }

        /* confirm button */
        .sell-confirm-btn {
          width: 100%;
          background: linear-gradient(135deg, #FF2D55 0%, #FF6B35 100%);
          border: none;
          color: #fff;
          font-family: 'Bebas Neue';
          font-size: 16px;
          letter-spacing: 2.5px;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 6px 20px rgba(255,45,85,0.4);
        }
        .sell-confirm-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .sell-confirm-btn:active { transform: translateY(0); }

        /* ── SOLD OVERLAY ── */
        .sold-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        .confetti-particle {
          position: absolute;
          animation: confettiFall 1.5s ease-out forwards;
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120px) rotate(720deg); opacity: 0; }
        }
        .sold-card {
          background: #12101E;
          border: 1px solid rgba(255,222,0,0.3);
          border-radius: 28px;
          padding: 32px 28px;
          max-width: 340px;
          width: 90%;
          text-align: center;
          box-shadow: 0 0 80px rgba(255,222,0,0.15);
          animation: soldPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes soldPop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .sold-hammer { font-size: 48px; margin-bottom: 8px; animation: hammerHit 0.5s ease; }
        @keyframes hammerHit {
          0% { transform: rotate(-40deg); }
          50% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
        .sold-label {
          font-family: 'Bebas Neue';
          font-size: 52px;
          color: #FF2D55;
          letter-spacing: 4px;
          line-height: 1;
          margin-bottom: 16px;
          animation: soldFlicker 0.3s ease 3;
        }
        @keyframes soldFlicker { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .sold-piece-img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 16px;
          margin: 0 auto 10px;
          display: block;
          border: 3px solid #FFDE00;
        }
        .sold-piece-name { font-weight: 600; font-size: 16px; margin-bottom: 16px; }
        .sold-winner-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,222,0,0.07);
          border: 1px solid rgba(255,222,0,0.2);
          border-radius: 16px;
          padding: 12px 16px;
          margin-bottom: 12px;
          text-align: left;
        }
        .sold-avatar-big {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF2D55, #FF6B35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .sold-winner-name { font-weight: 600; font-size: 15px; margin-bottom: 2px; }
        .sold-winner-price {
          font-family: 'Bebas Neue';
          font-size: 26px;
          color: #FFDE00;
          letter-spacing: 1px;
        }
        .sold-congrats { font-size: 20px; }
      `}</style>

      <div className="live-root">
        {/* TOP BAR */}
        <div className="top-bar">
          <div className="live-badge">
            <div className="live-dot" />
            EN VIVO
          </div>
          <div className="countdown-badge">
            ⏱ {formatTime(liveTimeRemaining)}
          </div>
          <div className={`viewers-badge ${pulseViewers ? "pulse" : ""}`}>
            <span className="viewers-icon">👁</span>
            {viewersCount.toLocaleString()} viendo
          </div>
          <button className="end-live-btn" onClick={onEndLive}>
            Terminar Live
          </button>
        </div>

        {/* MAIN */}
        <div className="main-layout">
          {/* VIDEO AREA */}
          <div className="video-area">
            {/* Video stream */}
            <div className="video-container">
              <video
                ref={videoRef}
                className="video-stream"
                autoPlay
                playsInline
                muted
              />
            </div>
            <div className="video-grid-overlay" />

            {/* Recently Sold Strip */}
            {recentlySold.length > 0 && (
              <div className="sold-strip">
                {recentlySold.map((p, idx) => (
                  <div key={idx} className="sold-chip">
                    <img src={p.url} alt={p.description} className="sold-chip-img" />
                    <span className="sold-chip-label">{p.description.substring(0, 15)}...</span>
                    <span className="sold-chip-badge">VENDIDA</span>
                  </div>
                ))}
              </div>
            )}

            {/* Thumbnail Strip */}
            <div className="thumb-strip-wrapper">
              <div className="thumb-strip-label">Catálogo · toca para subastar</div>
              <div className="thumb-strip">
                {pieces.map((piece, index) => {
                  const pieceId = piece.id || index;
                  const isSold = soldPieces.has(pieceId);
                  const isActive = auctionPiece && (auctionPiece.id === pieceId || pieces.indexOf(auctionPiece) === index);
                  
                  return (
                    <div
                      key={index}
                      className={`thumb-item ${isSold ? "sold" : ""} ${isActive ? "active-auction" : ""}`}
                      onClick={() => !isSold && !isActive && setSelectedPiece({ ...piece, id: pieceId })}
                    >
                      <div className="thumb-img-wrap">
                        <img src={piece.url} alt={piece.description} className="thumb-img" />
                        <div className="thumb-price">RD${(piece.minPrice / 1000).toFixed(1)}k</div>
                        {!isSold && !isActive && (
                          <div className="thumb-sell-label">
                            <span className="thumb-sell-text">VENDER</span>
                          </div>
                        )}
                      </div>
                      {isActive && (
                        <div className="thumb-badge live">▶</div>
                      )}
                      {isSold && (
                        <div className="thumb-badge sold-dot">✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Auction Box */}
            <div className="auction-box">
              {auctionPiece ? (
                <>
                  <div className="auction-header">
                    <div className="auction-piece-row">
                      <img src={auctionPiece.url} alt={auctionPiece.description} className="auction-thumb" />
                      <div className="auction-piece-info">
                        <div className="auction-piece-name">{auctionPiece.description.substring(0, 30)}</div>
                        <div className="auction-min">Mínimo: RD${auctionPiece.minPrice.toLocaleString()}</div>
                      </div>
                    </div>
                    <div
                      className={`timer-circle ${auctionTimer <= 3 ? "urgent" : ""}`}
                      style={{ "--pct": (auctionTimer / 10) * 100 }}
                    >
                      {auctionTimer}
                    </div>
                  </div>
                  <div className={`bids-list ${newBidFlash ? "bid-flash" : ""}`}>
                    {bids.map((bid, i) => (
                      <BidRow key={i} bid={bid} isTop={i === 0} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-auction">
                  <div className="no-auction-icon">🔨</div>
                  <div>Selecciona una pieza del catálogo<br />para iniciar la subasta</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SELL MODAL */}
        {selectedPiece && (
          <SellModal
            piece={selectedPiece}
            onConfirm={handleStartAuction}
            onClose={() => setSelectedPiece(null)}
          />
        )}

        {/* SOLD OVERLAY */}
        {soldOverlay && (
          <SoldOverlay
            winner={soldOverlay}
            onClose={() => setSoldOverlay(null)}
          />
        )}
      </div>
    </>
  );
}
