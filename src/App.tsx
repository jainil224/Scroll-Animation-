import React, { useState, useEffect, useRef } from 'react';

// Image Assets
const PORTAL_BG = "https://res.cloudinary.com/dsn0ks2hl/image/upload/v1779968549/Main_hol_wbyrzv.png";
const CURTAIN_LEFT = "https://res.cloudinary.com/dsn0ks2hl/image/upload/v1779968649/left_side_uitehx.png";
const CURTAIN_RIGHT = "https://res.cloudinary.com/dsn0ks2hl/image/upload/v1779968549/right_side_baj1ns.png";
const WORLD_BG = "https://res.cloudinary.com/dsn0ks2hl/image/upload/v1779968548/World_bg_ltivsq.png";

const CARD_IMAGES = [
  "https://res.cloudinary.com/dsn0ks2hl/image/upload/v1780023115/two_upscaled_sauqie.jpg",
  "https://res.cloudinary.com/dsn0ks2hl/image/upload/v1780023115/one_zbfoxt.jpg",
  "https://res.cloudinary.com/dsn0ks2hl/image/upload/v1780023114/three_upscaled_r6dqay.jpg"
];

// Scene 2 Card Data (9 Cards)
const SCENE2_CARDS = [
  { title: 'Hidden Realms', desc: 'Luminous sanctuaries unseen by wandering eyes', color: '#f3cdd6' },
  { title: 'Wild Solitudes', desc: 'Dissolve into untamed horizons and deep calm', color: '#dcedc2' },
  { title: 'Silent Havens', desc: 'Remote escapes far beyond ordinary reach', color: '#c3e3f4' },
  { title: 'Bespoke Quests', desc: 'Journeys shaped around your vision and soul', color: '#f0e4c0' },
  { title: 'Vivid Drifts', desc: 'Surreal passages through breathtaking terrain', color: '#dcd2f2' },
  { title: 'Mystic Crests', desc: 'Timeless ridgelines wrapped in cloud and myth', color: '#f3cdd6' },
  { title: 'Deep Currents', desc: 'Glowing depths alive with uncharted wonder', color: '#c3e3f4' },
  { title: 'Gilded Dusk', desc: 'Amber horizons that stretch past all reason', color: '#f0e4c0' },
  { title: 'Glassy Tides', desc: 'Calm waters holding skies of pure stillness', color: '#dcedc2' }
];

// Helper Functions
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

// useIsMobile() Hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);
  return isMobile;
};

// Navigation Components
const StarLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ cursor: 'pointer' }}>
    <path d="M14 2l2.09 6.42H23l-5.45 3.96 2.09 6.42L14 14.84l-5.64 4.06 2.09-6.42L4.96 8.42h6.95L14 2z" fill="white" opacity="0.9" />
    <circle cx="14" cy="24" r="1.5" fill="white" opacity="0.6" />
    <circle cx="6" cy="6" r="1" fill="white" opacity="0.4" />
    <circle cx="22" cy="6" r="1" fill="white" opacity="0.4" />
  </svg>
);

const navLinkStyle: React.CSSProperties = {
  fontFamily: "'Imprima', sans-serif",
  fontSize: '12px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#fff',
  opacity: 0.9,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
};

const Navigation = () => {
  return (
    <nav style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 50 }}>
      {/* Mobile Nav */}
      <div className="flex md:hidden justify-between items-center w-full" style={{ padding: '18px 20px' }}>
        <span style={navLinkStyle} className="hover:opacity-100">Explore</span>
        <StarLogo />
        <span style={navLinkStyle} className="hover:opacity-100">Connect</span>
      </div>

      {/* Desktop & Tablet Nav */}
      <div className="hidden md:flex justify-between items-center w-full" style={{ padding: '22px 48px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <span style={navLinkStyle} className="hover:opacity-100">Worlds</span>
          <span style={navLinkStyle} className="hover:opacity-100">Atelier</span>
          <span style={navLinkStyle} className="hover:opacity-100">Immersions</span>
        </div>
        <StarLogo />
        <div style={{ display: 'flex', gap: '32px' }}>
          <span style={navLinkStyle} className="hover:opacity-100">Craft</span>
          <span style={navLinkStyle} className="hover:opacity-100">Codex</span>
          <span style={navLinkStyle} className="hover:opacity-100">Connect</span>
        </div>
      </div>
    </nav>
  );
};

// Slider Dots (Scene 1 UI Helper)
const SliderDots = () => (
  <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
    <div style={{ width: '28px', height: '4px', borderRadius: '2px', backgroundColor: '#fff', opacity: 0.9, transition: 'all 0.3s ease' }} />
    <div style={{ width: '14px', height: '4px', borderRadius: '2px', backgroundColor: '#fff', opacity: 0.3, transition: 'all 0.3s ease' }} />
    <div style={{ width: '14px', height: '4px', borderRadius: '2px', backgroundColor: '#fff', opacity: 0.3, transition: 'all 0.3s ease' }} />
    <div style={{ width: '14px', height: '4px', borderRadius: '2px', backgroundColor: '#fff', opacity: 0.3, transition: 'all 0.3s ease' }} />
  </div>
);

// Arc Card Slider Component
interface ArcCardSliderProps {
  cards: { title: string; desc: string; color: string }[];
  sliderRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
}

const ArcCardSlider: React.FC<ArcCardSliderProps> = ({ cards, sliderRef, isMobile }) => {
  const cardW = isMobile ? 160 : 220;
  const cardH = isMobile ? 175 : 230;
  const cardSpacingDeg = isMobile ? 12 : 9;
  const centerIndex = Math.floor(cards.length / 2); // 4
  const arcRadius = isMobile ? 700 : 1100;

  return (
    <div
      ref={sliderRef}
      className="will-change-transform"
      style={{
        position: 'absolute',
        bottom: isMobile ? '60px' : '80px',
        left: 0,
        right: 0,
        height: isMobile ? '260px' : '360px',
        overflow: 'visible',
        pointerEvents: 'auto',
        opacity: 0,
        zIndex: 11,
      }}
    >
      {cards.map((card, i) => {
        const cardNumber = String(i + 1).padStart(2, '0');
        const baseDeg = (i - centerIndex) * cardSpacingDeg;
        const deg = baseDeg + (centerIndex * cardSpacingDeg);
        const rad = (deg * Math.PI) / 180;
        const x = Math.sin(rad) * arcRadius;
        const y = arcRadius - Math.cos(rad) * arcRadius;
        const bottom = -y + (isMobile ? 140 : 200);

        return (
          <div
            key={i}
            className="arc-card will-change-transform"
            style={{
              position: 'absolute',
              width: `${cardW}px`,
              height: `${cardH}px`,
              bottom: `${bottom}px`,
              left: `calc(50% + ${x}px - ${cardW / 2}px)`,
              backgroundColor: card.color,
              borderRadius: isMobile ? '16px' : '24px',
              padding: isMobile ? '20px' : '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#0a0608',
              cursor: 'pointer',
              transform: `rotate(${deg}deg)`,
              transformOrigin: `${cardW / 2}px ${arcRadius}px`,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 30px 60px -10px rgba(255, 255, 255, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
            }}
          >
            {/* Top row: Number circle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  width: isMobile ? '28px' : '36px',
                  height: isMobile ? '28px' : '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(10, 6, 8, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '10px' : '12px',
                  fontWeight: '700',
                  fontFamily: "'Imprima', sans-serif",
                }}
              >
                {cardNumber}
              </div>
            </div>

            {/* Bottom text */}
            <div>
              <h3
                style={{
                  fontFamily: "'Viaoda Libre', serif",
                  fontSize: isMobile ? '18px' : '23px',
                  lineHeight: '1.15',
                  marginBottom: '6px',
                  color: '#0a0608',
                  letterSpacing: '-0.02em',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Imprima', sans-serif",
                  fontSize: isMobile ? '10.5px' : '12px',
                  lineHeight: '1.45',
                  color: 'rgba(10, 6, 8, 0.72)',
                }}
              >
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const isMobile = useIsMobile();

  // Curtains open transitions timeline
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [useTransition, setUseTransition] = useState(true);

  // References to bypass React updates during RAF performance loop
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLImageElement>(null);
  const portalRef = useRef<HTMLImageElement>(null);
  const curtainLRef = useRef<HTMLImageElement>(null);
  const curtainRRef = useRef<HTMLImageElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Mouse Coordinates Refs
  const mouseRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  });

  // Timestamps for entrance animation
  const entranceTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // 100ms -> curtains pull open
    const openTimer = setTimeout(() => {
      setCurtainsOpen(true);
    }, 100);

    // 2200ms -> transitions disabled for latency-free live parallax
    const transitionTimer = setTimeout(() => {
      setUseTransition(false);
    }, 2200);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  // Listeners for mousemove & animation rendering loop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Mouse coordinates relative to viewport center (-1 to 1)
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - halfW) / halfW;
      mouseRef.current.targetY = (e.clientY - halfH) / halfH;
    };

    // Passive listener for responsive performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animFrameId: number;

    const renderLoop = () => {
      // Compute mouse interpolation (Damping Speed = 0.07)
      mouseRef.current.currentX += (mouseRef.current.targetX - mouseRef.current.currentX) * 0.07;
      mouseRef.current.currentY += (mouseRef.current.targetY - mouseRef.current.currentY) * 0.07;

      const mX = mouseRef.current.currentX;
      const mY = mouseRef.current.currentY;

      // Scroll Progress Calculations
      let sp = 0;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const totalHeight = containerRef.current.scrollHeight;
        const windowH = window.innerHeight;
        // scrollY relative to container top
        const scrolled = -rect.top;
        const scrollable = totalHeight - windowH;
        sp = clamp(scrolled / scrollable, 0, 1);
      }

      // Eased progress via Quadratic Ease-in-out
      const ep = easeInOut(sp);

      // Entrance UI Fade Calculations
      if (!entranceTimeRef.current) {
        entranceTimeRef.current = Date.now();
      }
      const elapsed = Date.now() - entranceTimeRef.current;
      
      // UI starts fading in at 600ms, completed in 1000ms
      let uiFade = 0;
      if (elapsed > 600) {
        uiFade = clamp((elapsed - 600) / 1000, 0, 1);
      }

      // 1. Layer 1: World Background
      if (worldRef.current) {
        const worldScale = lerp(1, 1.18, ep);
        const transX = mX * 3;
        const transY = mY * 3;
        worldRef.current.style.transform = `scale(${worldScale}) translate(${transX}px, ${transY}px)`;
      }


      // 3. Layer 3: Portal Frame
      if (portalRef.current) {
        const portalScale = lerp(1, 7.5, ep);
        const transX = mX * 3.5;
        const transY = mY * 3.5;
        // Fade portal frame from 1 to 0 between scroll progress 0.65 and 0.85
        let portalOpacity = 1;
        if (sp > 0.65) {
          portalOpacity = clamp(1 - (sp - 0.65) / 0.20, 0, 1);
        }
        portalRef.current.style.transform = `scale(${portalScale}) translate(${transX}px, ${transY}px)`;
        portalRef.current.style.opacity = String(portalOpacity);
      }

      // 4. Layer 4L & 4R: Curtains (Only update via RAF after entrance transition is disabled)
      if (!useTransition) {
        const isMob = window.innerWidth < 768;
        const baseShift = isMob ? 35 : 0;

        const leftCurtainScrollTranslate = -baseShift - lerp(0, 150, ep);
        const leftCurtainScale = lerp(1, 1.3, ep);
        if (curtainLRef.current) {
          const transX = mX * 6;
          // Y dampened by 0.3x
          const transY = mY * 6 * 0.3;
          curtainLRef.current.style.transform = `translateX(${leftCurtainScrollTranslate}%) scale(${leftCurtainScale}) translate(${transX}px, ${transY}px)`;
        }

        const rightCurtainScrollTranslate = baseShift + lerp(0, 150, ep);
        const rightCurtainScale = lerp(1, 1.3, ep);
        if (curtainRRef.current) {
          const transX = mX * 6;
          // Y dampened by 0.3x
          const transY = mY * 6 * 0.3;
          curtainRRef.current.style.transform = `translateX(${rightCurtainScrollTranslate}%) scale(${rightCurtainScale}) translate(${transX}px, ${transY}px)`;
        }
      }

      // 5. Scene 1 UI
      if (scene1Ref.current) {
        // Opacity fades during first 22% scroll
        const s1Opacity = uiFade * clamp(1 - sp / 0.22, 0, 1);
        scene1Ref.current.style.opacity = String(s1Opacity);
        scene1Ref.current.style.pointerEvents = s1Opacity < 0.1 ? 'none' : 'auto';
      }

      // 6. Scene 2 UI
      const s2Opacity = clamp((sp - 0.68) / 0.16, 0, 1);
      if (scene2Ref.current) {
        scene2Ref.current.style.opacity = String(s2Opacity);
        scene2Ref.current.style.pointerEvents = s2Opacity < 0.1 ? 'none' : 'auto';
      }

      // 7. Arc Card Slider (Layer 2.5)
      if (sliderRef.current) {
        sliderRef.current.style.opacity = String(s2Opacity);
        sliderRef.current.style.pointerEvents = s2Opacity < 0.1 ? 'none' : 'auto';

        const cardsElements = sliderRef.current.querySelectorAll('.arc-card');
        const isMob = window.innerWidth < 768;
        const cardSpacingDeg = isMob ? 12 : 9;
        const arcRadius = isMob ? 700 : 1100;
        const cardW = isMob ? 160 : 220;
        const totalCards = 9;
        const centerIndex = 4;
        const arcSweepDeg = (totalCards - 1) * cardSpacingDeg;

        // RotationOffset starts at 0.70 and completes by 1.00 scroll
        const rotationOffset = lerp(
          0,
          arcSweepDeg,
          clamp((sp - 0.70) / 0.30, 0, 1)
        );

        cardsElements.forEach((cardEl, i) => {
          const baseDeg = (i - centerIndex) * cardSpacingDeg;
          const deg = baseDeg - rotationOffset + (centerIndex * cardSpacingDeg);
          const rad = (deg * Math.PI) / 180;
          const x = Math.sin(rad) * arcRadius;
          const y = arcRadius - Math.cos(rad) * arcRadius;
          const bottom = -y + (isMob ? 140 : 200);

          const htmlEl = cardEl as HTMLElement;
          htmlEl.style.bottom = `${bottom}px`;
          htmlEl.style.left = `calc(50% + ${x}px - ${cardW / 2}px)`;
          htmlEl.style.transform = `rotate(${deg}deg)`;
        });
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, [useTransition]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '480vh',
        position: 'relative',
        backgroundColor: '#0a0608',
      }}
    >
      {/* Viewport Box */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          backgroundColor: '#0a0608',
          zIndex: 1,
        }}
      >
        {/* Navigation */}
        <Navigation />

        {/* Top Fade Gradient overlay (Layer 45) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '42vh',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            zIndex: 45,
            pointerEvents: 'none',
          }}
        />

        {/* BOTTOM STACK LAYERS */}

        {/* Layer 1: World Background (z-index: 0) */}
        <img
          ref={worldRef}
          src={WORLD_BG}
          alt="Ancient Mythic landscape background"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            zIndex: 0,
            transformOrigin: '50% 50%',
            transform: 'scale(1) translate(0px, 0px)',
          }}
        />


        {/* Layer 2.5: Arc Card Slider (z-index: 9) */}
        <ArcCardSlider
          cards={SCENE2_CARDS}
          sliderRef={sliderRef}
          isMobile={isMobile}
        />

        {/* Layer 3: Portal Frame (z-index: 15) */}
        <img
          ref={portalRef}
          src={PORTAL_BG}
          alt="Cinematic circular golden stone portal frame"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            zIndex: 15,
            transformOrigin: '52% 38%',
            transform: 'scale(1) translate(0px, 0px)',
          }}
        />

        {/* Layer 3.5: Bottom Dark Vignette Fade (z-index: 16) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '40%',
            background: 'linear-gradient(to top, rgba(10, 6, 8, 0.85) 0%, rgba(10, 6, 8, 0.4) 40%, transparent 100%)',
            zIndex: 16,
            pointerEvents: 'none',
          }}
        />

        {/* Layer 4L: Curtain Left (z-index: 16) */}
        <img
          ref={curtainLRef}
          src={CURTAIN_LEFT}
          alt="Magical golden pattern left curtain overlay"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            zIndex: 16,
            transformOrigin: 'left center',
            objectPosition: 'right center',
            transition: useTransition ? 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            transform: curtainsOpen ? (isMobile ? 'translateX(-35%) scale(1)' : 'translateX(0%) scale(1)') : 'translateX(-100%) scale(1)',
          }}
        />

        {/* Layer 4R: Curtain Right (z-index: 16) */}
        <img
          ref={curtainRRef}
          src={CURTAIN_RIGHT}
          alt="Magical golden pattern right curtain overlay"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            zIndex: 16,
            transformOrigin: 'right center',
            objectPosition: 'left center',
            transition: useTransition ? 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            transform: curtainsOpen ? (isMobile ? 'translateX(35%) scale(1)' : 'translateX(0%) scale(1)') : 'translateX(100%) scale(1)',
          }}
        />

        {/* ACTIVE SCENE OVERLAYS (z-index: 20) */}

        {/* Scene 1 UI overlay */}
        <div
          ref={scene1Ref}
          className="absolute inset-0 flex flex-col justify-between items-center text-center will-change-transform"
          style={{
            zIndex: 20,
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Main Hero Header */}

          {/* MOBILE LAYOUT (md:hidden) */}
          <div className="flex md:hidden flex-col items-center justify-center w-full px-6" style={{ padding: '95px 24px 0px' }}>
            <h1
              style={{
                fontFamily: "'Viaoda Libre', serif",
                fontSize: 'clamp(32px, 10vw, 44px)',
                lineHeight: '0.95',
                color: '#fff',
                marginBottom: '10px',
                letterSpacing: '0.05em',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              FALL › INTO
              <br />
              <span className="opacity-80">REVERIE</span>
            </h1>
            <p
              style={{
                fontFamily: "'Imprima', sans-serif",
                fontSize: 'clamp(11px, 3.5vw, 13px)',
                lineHeight: '1.6',
                color: '#e5e4e7',
                maxWidth: '310px',
                opacity: 0.85,
                marginBottom: '32px',
              }}
            >
              Crafting boundless digital worlds where the edge between AI, vision, and living myth dissolves.
            </p>

            {/* Mobile Reel Card */}
            <div
              className="group relative flex flex-col justify-end items-start overflow-hidden hover:scale-105"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '22px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 1px 1px rgba(255,255,255,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src={CARD_IMAGES[2]}
                alt="Reel visual"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,6,8,0.85) 0%, rgba(10,6,8,0.2) 60%, transparent 100%)',
                }}
              />
              <div style={{ position: 'relative', padding: '12px', width: '100%', textAlign: 'left', pointerEvents: 'none' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="white">
                    <path d="M2.5 1.5v5l4-2.5-4-2.5z" />
                  </svg>
                </div>
                <div style={{ fontSize: '10px', letterSpacing: '0.08em', fontWeight: 'bold', textTransform: 'uppercase', color: '#fff' }}>
                  View Reel
                </div>
              </div>
            </div>

            <SliderDots />
          </div>

          {/* TABLET LAYOUT (hidden md:flex xl:hidden) */}
          <div className="hidden md:flex xl:hidden flex-col items-center justify-center w-full px-12" style={{ paddingTop: '105px' }}>
            <h1
              style={{
                fontFamily: "'Viaoda Libre', serif",
                fontSize: '68px',
                lineHeight: '0.9',
                color: '#fff',
                marginBottom: '12px',
                letterSpacing: '0.04em',
                textShadow: '0 4px 25px rgba(0,0,0,0.5)',
              }}
            >
              FALL › INTO <span className="opacity-85 font-light">REVERIE</span>
            </h1>
            <p
              style={{
                fontFamily: "'Imprima', sans-serif",
                fontSize: '15px',
                lineHeight: '1.65',
                color: '#e5e4e7',
                maxWidth: '480px',
                opacity: 0.85,
                marginBottom: '44px',
              }}
            >
              Crafting boundless digital worlds where the edge between AI, vision, and living myth dissolves.
            </p>

            {/* Tablet Row of 3 Cards */}
            <div className="flex gap-[14px]">
              {/* Card 1 */}
              <div
                className="relative overflow-hidden hover:scale-105 hover:-translate-y-1"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '22px',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 1px 1px rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img src={CARD_IMAGES[0]} alt="Luminous realm" className="absolute inset-0 w-full h-full object-cover" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,6,8,0.7) 0%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fff', fontWeight: 'bold' }}>
                  Explore
                </div>
              </div>

              {/* Card 2: Patrons Stats */}
              <div
                className="relative overflow-hidden flex flex-col justify-between hover:scale-105 hover:-translate-y-1"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '22px',
                  backgroundColor: '#0a0608',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 1px 1px rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  padding: '16px',
                  textAlign: 'left',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img src={CARD_IMAGES[1]} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,6,8,0.7) 0%, rgba(10,6,8,0.2) 100%)' }} />
                <span style={{ position: 'relative', fontSize: '32px', fontFamily: "'Viaoda Libre', serif", color: '#f0e4c0', lineHeight: '1' }}>32</span>
                <span style={{ position: 'relative', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#e5e4e7', fontWeight: 'bold' }}>World Patrons</span>
              </div>

              {/* Card 3 */}
              <div
                className="relative overflow-hidden hover:scale-105 hover:-translate-y-1"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '22px',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.4), 0 0 1px 1px rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img src={CARD_IMAGES[2]} alt="Reel visual" className="absolute inset-0 w-full h-full object-cover" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,6,8,0.7) 0%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="6" height="6" viewBox="0 0 8 8" fill="black">
                      <path d="M2.5 1.5v5l4-2.5-4-2.5z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fff', fontWeight: 'bold' }}>View Reel</span>
                </div>
              </div>
            </div>

            <SliderDots />
          </div>

          {/* DESKTOP LAYOUT (hidden xl:flex) */}
          <div className="hidden xl:flex items-center justify-between w-full h-full" style={{ padding: '0px 10%' }}>
            {/* Left side text block */}
            <div style={{ textAlign: 'left', maxWidth: '420px', transform: 'translateY(15px)' }}>
              <h1
                style={{
                  fontFamily: "'Viaoda Libre', serif",
                  fontSize: 'clamp(56px, 5.5vw, 82px)',
                  lineHeight: '0.85',
                  color: '#fff',
                  marginBottom: '16px',
                  letterSpacing: '0.04em',
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                }}
              >
                FALL › INTO
                <br />
                <span style={{ opacity: 0.85 }}>REVERIE</span>
              </h1>
              <p
                style={{
                  fontFamily: "'Imprima', sans-serif",
                  fontSize: '14.5px',
                  lineHeight: '1.7',
                  color: '#e5e4e7',
                  opacity: 0.85,
                  marginBottom: '10px',
                }}
              >
                Crafting boundless digital worlds where the edge between AI, vision, and living myth dissolves.
              </p>
              <SliderDots />
            </div>

            {/* Right side cards row */}
            <div className="flex gap-5" style={{ transform: 'translateY(35px)' }}>
              {/* Card 1 */}
              <div
                className="relative overflow-hidden hover:scale-105 hover:-translate-y-2"
                style={{
                  width: '158px',
                  height: '158px',
                  borderRadius: '28px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.45), 0 0 1px 1px rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img src={CARD_IMAGES[0]} alt="Luminous landscape" className="absolute inset-0 w-full h-full object-cover" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,6,8,0.75) 0%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', fontWeight: 'bold' }}>
                  Explore
                </div>
              </div>

              {/* Card 2: Patrons Stats */}
              <div
                className="relative overflow-hidden flex flex-col justify-between hover:scale-105 hover:-translate-y-2"
                style={{
                  width: '158px',
                  height: '158px',
                  borderRadius: '28px',
                  backgroundColor: '#0a0608',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.45), 0 0 1px 1px rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  padding: '20px',
                  textAlign: 'left',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img src={CARD_IMAGES[1]} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,6,8,0.7) 0%, rgba(10,6,8,0.2) 100%)' }} />
                <span style={{ position: 'relative', fontSize: '38px', fontFamily: "'Viaoda Libre', serif", color: '#f0e4c0', lineHeight: '1' }}>32</span>
                <span style={{ position: 'relative', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e5e4e7', fontWeight: 'bold' }}>World Patrons</span>
              </div>

              {/* Card 3 */}
              <div
                className="relative overflow-hidden hover:scale-105 hover:-translate-y-2"
                style={{
                  width: '158px',
                  height: '158px',
                  borderRadius: '28px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.45), 0 0 1px 1px rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img src={CARD_IMAGES[2]} alt="Reel visual" className="absolute inset-0 w-full h-full object-cover" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,6,8,0.75) 0%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="6" height="6" viewBox="0 0 8 8" fill="black">
                      <path d="M2.5 1.5v5l4-2.5-4-2.5z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', fontWeight: 'bold' }}>View Reel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Desktop Scroll Cue (Desktop only) */}
          <div
            className="hidden xl:flex flex-col items-center gap-2"
            style={{
              position: 'absolute',
              bottom: '48px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: "'Imprima', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: '#fff',
                opacity: 0.65,
                textTransform: 'uppercase',
              }}
            >
              Descend
            </span>
            <div
              className="animate-bob-up flex items-center justify-center"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(10, 6, 8, 0.4)',
                backdropFilter: 'blur(2px)',
              }}
            >
              <div
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  opacity: 0.9,
                }}
              />
            </div>
          </div>
        </div>

        {/* Scene 2 UI overlay */}
        <div
          ref={scene2Ref}
          style={{
            position: 'absolute',
            top: isMobile ? '70px' : '105px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '780px',
            textAlign: 'center',
            pointerEvents: 'none',
            opacity: 0,
            zIndex: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "'Viaoda Libre', serif",
              fontSize: isMobile ? 'clamp(20px, 6.5vw, 28px)' : '46px',
              fontWeight: 'normal',
              letterSpacing: '0.06em',
              color: '#ffffff',
              marginBottom: isMobile ? '8px' : '16px',
              textTransform: 'uppercase',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              lineHeight: '1.1',
            }}
          >
            Forge Beyond the Real
          </h2>
          <p
            style={{
              fontFamily: "'Imprima', sans-serif",
              fontSize: isMobile ? '12px' : '14.5px',
              color: '#dcd2f2',
              lineHeight: '1.6',
              maxWidth: '580px',
              margin: '0 auto',
              opacity: 0.85,
              textShadow: '0 2px 10px rgba(0,0,0,0.4)',
            }}
          >
            Singular voyages to astonishing destinations, shaped for those who seek beauty beyond the ordinary and the known.
          </p>
        </div>

        {/* Branding Signature */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? '16px' : '24px',
            right: isMobile ? '20px' : '48px',
            zIndex: 50,
            fontFamily: "'Imprima', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#fff',
            opacity: 0.8,
            pointerEvents: 'auto',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            backgroundColor: 'rgba(10, 6, 8, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '6px 14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
          }}
          className="hover:opacity-100 hover:scale-105 cursor-pointer"
        >
          Made with <span style={{ color: '#f3cdd6', margin: '0 4px' }}>♥</span> by Jainil Patel
        </div>
      </div>
    </div>
  );
}
