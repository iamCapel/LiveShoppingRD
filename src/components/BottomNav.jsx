import { useState, useRef, useEffect, useCallback } from "react";

// ── LS Logo SVG (fiel a la imagen: trazos fluidos superpuestos) ──────────────
function LSLogo({ size = 28, color = "currentColor", glowColor = null }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 120 86" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={glowColor ? { filter: `drop-shadow(0 0 6px ${glowColor})` } : {}}>
      {/* L stroke - outer */}
      <path d="M8 6 L8 68 L52 68" stroke={color} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35"/>
      {/* L stroke - middle */}
      <path d="M14 10 L14 63 L50 63" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6"/>
      {/* L stroke - inner */}
      <path d="M20 14 L20 58 L48 58" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="1"/>
      {/* S stroke - outer */}
      <path d="M112 12 C112 12 58 8 58 32 C58 56 115 52 115 72 C115 82 92 88 62 80" stroke={color} strokeWidth="11" strokeLinecap="round" fill="none" opacity="0.35"/>
      {/* S stroke - middle */}
      <path d="M106 16 C106 16 62 13 62 34 C62 54 110 50 110 70 C110 79 88 85 62 78" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.6"/>
      {/* S stroke - inner */}
      <path d="M100 20 C100 20 66 17 66 36 C66 52 105 49 105 68 C105 76 84 83 63 76" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity="1"/>
      {/* swoosh underline */}
      <path d="M18 76 C35 70 80 72 108 76" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M22 80 C42 75 78 77 104 80" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
    </svg>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const BellIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const UserIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
  </svg>
);

// ── Slide options for center button ──────────────────────────────────────────
const CENTER_OPTIONS = [
  {
    id: "promocionar",
    label: "Promocionar",
    icon: <PlusIcon />,
    accent: "#E0E0E0",
    bg: "rgba(255,255,255,0.08)",
  },
  {
    id: "livesell",
    label: "LiveSell",
    icon: null,
    accent: "#FF2D55",
    bg: "rgba(255,45,85,0.18)",
    isLive: true,
  },
];

// ── Main BottomNav ────────────────────────────────────────────────────────────
export default function BottomNav({ activeTab, onTabChange, urgentLive, onLiveSellClick }) {
  const [centerIdx, setCenterIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const [animDir, setAnimDir] = useState(null); // "left" | "right"
  const [isAnimating, setIsAnimating] = useState(false);
  const [liveGlow, setLiveGlow] = useState(false);
  const startX = useRef(null);
  const trackRef = useRef(null);
  const len = CENTER_OPTIONS.length;

  // infinite index helpers
  const mod = (n, m) => ((n % m) + m) % m;
  const prev = mod(centerIdx - 1, len);
  const next = mod(centerIdx + 1, len);

  const current = CENTER_OPTIONS[centerIdx];
  const isLive = current.id === "livesell";

  // LiveSell glow pulse
  useEffect(() => {
    if (!isLive) { setLiveGlow(false); return; }
    const t = setInterval(() => setLiveGlow(g => !g), 900);
    return () => clearInterval(t);
  }, [isLive]);

  const slide = useCallback((dir) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimDir(dir);
    setTimeout(() => {
      setCenterIdx(i => mod(dir === "left" ? i + 1 : i - 1, len));
      setAnimDir(null);
      setDragDelta(0);
      setIsAnimating(false);
    }, 260);
  }, [isAnimating, len]);

  // ── pointer / touch drag ──
  const onPointerDown = (e) => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX;
    setDragging(true);
  };
  const onPointerMove = (e) => {
    if (!dragging || startX.current == null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    setDragDelta(x - startX.current);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragDelta < -30) slide("left");
    else if (dragDelta > 30) slide("right");
    else setDragDelta(0);
    startX.current = null;
  };

  // Handle center button click based on current option
  const handleCenterClick = () => {
    if (current.id === "promocionar") {
      onTabChange('promote');
    } else if (current.id === "livesell") {
      // Navigate to live streaming preparation
      if (onLiveSellClick) {
        onLiveSellClick();
      }
    }
  };

  // translate for drag live feedback
  const dragTranslate = dragging ? Math.max(-40, Math.min(40, dragDelta)) : 0;

  const tabs = [
    { id: "home", label: "Inicio", icon: <HomeIcon active={activeTab === "home"} /> },
    { id: "search", label: "Buscar", icon: <SearchIcon /> },
    { id: "_center_", label: "", icon: null }, // placeholder
    { id: "notifications", label: "Alertas", icon: <BellIcon /> },
    { id: "profile", label: "Perfil", icon: <UserIcon /> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── CONTAINER ── */
        .bn-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
        }

        /* ── BAR ── */
        .bn-bar {
          width: 100%;
          background: rgba(14, 13, 22, 0.97);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 8px 6px 20px;
          position: relative;
        }

        /* ── NORMAL TAB ── */
        .bn-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 4px 0;
          position: relative;
          transition: transform 0.15s;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .bn-tab:hover { transform: translateY(-2px); }
        .bn-tab-icon {
          transition: color 0.2s;
        }
        .bn-tab-label {
          font-size: 10px;
          font-weight: 500;
          transition: color 0.2s;
          letter-spacing: 0.2px;
        }
        .bn-tab.inactive .bn-tab-icon,
        .bn-tab.inactive .bn-tab-label { color: rgba(255,255,255,0.38); }
        .bn-tab.active .bn-tab-icon,
        .bn-tab.active .bn-tab-label { color: #FF2D55; }
        /* active dot */
        .bn-tab.active::after {
          content: '';
          position: absolute;
          bottom: -6px;
          width: 4px; height: 4px;
          background: #FF2D55;
          border-radius: 50%;
          box-shadow: 0 0 6px #FF2D55;
        }
        /* notification badge */
        .bn-badge {
          position: absolute;
          top: 2px;
          right: 25%;
          width: 6px;
          height: 6px;
          background: #FF2D55;
          border-radius: 50%;
          animation: bn-pulse 1s infinite;
        }
        @keyframes bn-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }

        /* ── CENTER SLOT ── */
        .bn-center-slot {
          flex: 1.4;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          position: relative;
          padding-bottom: 2px;
        }

        /* ── CENTER BUTTON ── */
        .bn-center-btn {
          position: relative;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: grab;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          margin-bottom: 4px;
          transition: box-shadow 0.3s;
          touch-action: none;
          overflow: hidden;
        }
        .bn-center-btn:active { cursor: grabbing; }

        /* ring */
        .bn-center-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        /* bg fill */
        .bn-center-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transition: background 0.3s;
        }

        /* swipe arrows on sides */
        .bn-swipe-hint {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: rgba(255,255,255,0.18);
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .bn-swipe-hint.left  { left: -18px; }
        .bn-swipe-hint.right { right: -18px; }

        /* icon + label inside button */
        .bn-center-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          transition: transform 0.26s cubic-bezier(0.34,1.3,0.64,1), opacity 0.2s;
        }
        .bn-center-content.exit-left  { transform: translateX(-36px); opacity: 0; }
        .bn-center-content.exit-right { transform: translateX(36px); opacity: 0; }
        .bn-center-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.6px;
          line-height: 1;
          transition: color 0.3s;
        }

        /* live pulse ring */
        .bn-live-pulse {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px solid #FF2D55;
          animation: livePulse 1.2s ease-out infinite;
        }
        @keyframes livePulse {
          0%   { transform: scale(1);    opacity: 0.7; }
          100% { transform: scale(1.28); opacity: 0; }
        }

        /* dots indicator */
        .bn-dots {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
        }
        .bn-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.25s;
        }
        .bn-dot.on {
          background: currentColor;
          width: 12px;
          border-radius: 2px;
        }

        /* side ghost thumbs */
        .bn-ghost {
          position: absolute;
          top: 50%; 
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          opacity: 0.22;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .bn-ghost.ghost-left  { left: 0; }
        .bn-ghost.ghost-right { right: 0; }
        .bn-ghost-circle {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .bn-ghost-label {
          font-size: 8px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.3px;
          font-weight: 500;
        }
      `}</style>

      {/* ── CONTAINER ── */}
      <div className="bn-container">
        {/* ── BAR ── */}
        <div className="bn-bar">
          {tabs.map((tab) => {
          if (tab.id === "_center_") {
            return (
              <div key="center" className="bn-center-slot">

                {/* ghost left */}
                <div className="bn-ghost ghost-left">
                  <div className="bn-ghost-circle">
                    {CENTER_OPTIONS[prev].icon
                      ? <span style={{ color: CENTER_OPTIONS[prev].accent, opacity: 0.7, display:"flex" }}>
                          {CENTER_OPTIONS[prev].icon}
                        </span>
                      : <LSLogo size={14} color={CENTER_OPTIONS[prev].accent} />
                    }
                  </div>
                  <span className="bn-ghost-label">{CENTER_OPTIONS[prev].label}</span>
                </div>

                {/* center button */}
                <div
                  ref={trackRef}
                  className="bn-center-btn"
                  onClick={handleCenterClick}
                  onMouseDown={onPointerDown}
                  onMouseMove={onPointerMove}
                  onMouseUp={onPointerUp}
                  onMouseLeave={onPointerUp}
                  onTouchStart={e => onPointerDown(e.touches[0])}
                  onTouchMove={e => onPointerMove(e.touches[0])}
                  onTouchEnd={onPointerUp}
                  style={{ transform: `translateX(${dragTranslate * 0.35}px)` }}
                >
                  {/* live pulse ring */}
                  {isLive && <div className="bn-live-pulse" />}

                  {/* ring */}
                  <div className="bn-center-ring" style={{
                    borderColor: isLive
                      ? (liveGlow ? current.accent : "rgba(255,45,85,0.4)")
                      : `${current.accent}55`,
                    boxShadow: isLive && liveGlow
                      ? `0 0 18px ${current.accent}88`
                      : "none",
                  }} />

                  {/* bg */}
                  <div className="bn-center-bg" style={{ background: current.bg }} />

                  {/* content */}
                  <div className={`bn-center-content ${
                    animDir === "left" ? "exit-left"
                    : animDir === "right" ? "exit-right"
                    : ""
                  }`}>
                    <div style={{ color: current.accent, display: "flex" }}>
                      {current.icon
                        ? current.icon
                        : <LSLogo size={30} color={current.accent} glowColor={isLive && liveGlow ? current.accent : null} />
                      }
                    </div>
                    <span className="bn-center-label" style={{ color: current.accent }}>
                      {current.label}
                    </span>
                  </div>

                  {/* swipe hints */}
                  <span className="bn-swipe-hint left">‹</span>
                  <span className="bn-swipe-hint right">›</span>
                </div>

                {/* ghost right */}
                <div className="bn-ghost ghost-right">
                  <div className="bn-ghost-circle">
                    {CENTER_OPTIONS[next].icon
                      ? <span style={{ color: CENTER_OPTIONS[next].accent, opacity: 0.7, display:"flex" }}>
                          {CENTER_OPTIONS[next].icon}
                        </span>
                      : <LSLogo size={14} color={CENTER_OPTIONS[next].accent} />
                    }
                  </div>
                  <span className="bn-ghost-label">{CENTER_OPTIONS[next].label}</span>
                </div>

                {/* position dots */}
                <div className="bn-dots">
                  {CENTER_OPTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`bn-dot ${i === centerIdx ? "on" : ""}`}
                      style={{ color: current.accent }}
                    />
                  ))}
                </div>
              </div>
            );
          }

          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              className={`bn-tab ${isActive ? "active" : "inactive"}`}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="bn-tab-icon">
                {tab.icon}
                {/* Show badge on notifications if urgent live */}
                {tab.id === "notifications" && urgentLive && (
                  <div className="bn-badge" />
                )}
              </div>
              <span className="bn-tab-label">{tab.label}</span>
            </div>
          );
        })}
        </div>
      </div>
    </>
  );
}
