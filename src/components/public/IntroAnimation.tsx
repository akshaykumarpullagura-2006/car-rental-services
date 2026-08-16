'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, ArrowRight } from 'lucide-react';

// ============================================================================
// 🎬 HAIL MARY RENTAL SERVICES — CINEMATIC INTRO CONFIGURATION
// ============================================================================
export const INTRO_CONFIG = {
  SHOW_INTRO: true,
  INTRO_PLAY_ONCE_PER_SESSION: true,
  SKIP_BUTTON_ENABLED: true,
  DESKTOP_VIDEO_PATH: '/videos/intro.mp4',
  MOBILE_VIDEO_PATH: '/videos/intro-mobile.mp4',
  SESSION_STORAGE_KEY: 'hailmary_intro_played',
};

export const IntroAnimation: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<'video' | 'logo' | 'fadeout' | 'ended'>('video');
  const [useCanvasFallback, setUseCanvasFallback] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Initial Session & Reduced Motion Checks
  useEffect(() => {
    if (!INTRO_CONFIG.SHOW_INTRO) {
      setActive(false);
      return;
    }

    // Reduced motion preference check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setActive(false);
      return;
    }

    // Session replay check
    if (INTRO_CONFIG.INTRO_PLAY_ONCE_PER_SESSION && typeof window !== 'undefined') {
      const hasPlayed = sessionStorage.getItem(INTRO_CONFIG.SESSION_STORAGE_KEY);
      if (hasPlayed === 'true') {
        setActive(false);
        return;
      }
    }

    // Enable Intro & Lock Body Scroll
    setActive(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 2. Video Playback & Fallback Detection
  useEffect(() => {
    if (!active) return;

    // Timeout fallback: if video doesn't play within 1.5s, switch to built-in canvas generator
    const timeout = setTimeout(() => {
      if (videoRef.current && videoRef.current.paused) {
        setUseCanvasFallback(true);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [active]);

  // 3. Built-in Canvas Fallback Generator (Cinematic Supercar Ambient Lights Reveal)
  useEffect(() => {
    if (!active || !useCanvasFallback || phase !== 'video') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 5000; // 5.0 seconds automotive camera sweep

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Phase A: Volumetric Ambient Spotlight Sweep (0% - 60%)
      const spotOpacity = Math.sin(progress * Math.PI) * 0.8;
      const lightY = centerY - 20 + progress * 40;

      const gradient = ctx.createRadialGradient(
        centerX, lightY, 10,
        centerX, lightY, width * 0.6
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${spotOpacity * 0.35})`);
      gradient.addColorStop(0.3, `rgba(180, 200, 255, ${spotOpacity * 0.15})`);
      gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Phase B: Supercar Silhouette Beam & LED Headlights Reveal (20% - 85%)
      if (progress > 0.15 && progress < 0.9) {
        const carProgress = (progress - 0.15) / 0.75;
        const scale = 0.8 + carProgress * 0.35;
        const headlightAlpha = Math.min(carProgress * 2, 1) * Math.sin(carProgress * Math.PI);

        // Twin LED Headlight Beams
        const leftHeadlightX = centerX - 180 * scale;
        const rightHeadlightX = centerX + 180 * scale;
        const headlightY = centerY + 30 * scale;

        [leftHeadlightX, rightHeadlightX].forEach((hx) => {
          const hBeam = ctx.createRadialGradient(hx, headlightY, 2, hx, headlightY, 120 * scale);
          hBeam.addColorStop(0, `rgba(255, 255, 255, ${headlightAlpha})`);
          hBeam.addColorStop(0.2, `rgba(220, 235, 255, ${headlightAlpha * 0.6})`);
          hBeam.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = hBeam;
          ctx.beginPath();
          ctx.arc(hx, headlightY, 120 * scale, 0, Math.PI * 2);
          ctx.fill();
        });

        // Sleek Car Roof & Hood Contour Outline
        ctx.strokeStyle = `rgba(255, 255, 255, ${headlightAlpha * 0.25})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 240 * scale, headlightY + 20);
        ctx.quadraticCurveTo(centerX - 160 * scale, centerY - 60 * scale, centerX, centerY - 80 * scale);
        ctx.quadraticCurveTo(centerX + 160 * scale, centerY - 60 * scale, centerX + 240 * scale, headlightY + 20);
        ctx.stroke();
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        // Transition to Logo phase when canvas animation finishes
        setPhase('logo');
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, useCanvasFallback, phase]);

  // 4. Video Event Handlers
  const handleVideoEnded = () => {
    setPhase('logo');
  };

  const handleVideoError = () => {
    setUseCanvasFallback(true);
  };

  // 5. Logo Phase Auto Transition to Fade Out
  useEffect(() => {
    if (!active || phase !== 'logo') return;

    // Show logo for 1.4 seconds (0.6s reveal + 0.8s hold), then fade into homepage
    const logoTimer = setTimeout(() => {
      setPhase('fadeout');
    }, 1400);

    return () => clearTimeout(logoTimer);
  }, [active, phase]);

  // 6. Complete Intro Exit & Cleanup
  useEffect(() => {
    if (!active || phase !== 'fadeout') return;

    const fadeoutTimer = setTimeout(() => {
      finishIntro();
    }, 700);

    return () => clearTimeout(fadeoutTimer);
  }, [active, phase]);

  const finishIntro = () => {
    setPhase('ended');
    setActive(false);
    document.body.style.overflow = '';

    if (INTRO_CONFIG.INTRO_PLAY_ONCE_PER_SESSION && typeof window !== 'undefined') {
      sessionStorage.setItem(INTRO_CONFIG.SESSION_STORAGE_KEY, 'true');
    }
  };

  const handleSkip = () => {
    setPhase('fadeout');
    setTimeout(() => {
      finishIntro();
    }, 300);
  };

  if (!active || phase === 'ended') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="hailmary_cinematic_intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[99999] bg-[#050505] text-white flex items-center justify-center overflow-hidden select-none"
      >
        {/* ==================================================================== */}
        {/* 1. CINEMATIC VEHICLE REVEAL STAGE (Video / Canvas Engine) */}
        {/* ==================================================================== */}
        {phase === 'video' && (
          <div className="absolute inset-0 w-full h-full">
            {!useCanvasFallback ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                onPlay={() => setUseCanvasFallback(false)}
                className="w-full h-full object-cover object-center"
              >
                <source src={INTRO_CONFIG.DESKTOP_VIDEO_PATH} type="video/mp4" />
                <source src={INTRO_CONFIG.MOBILE_VIDEO_PATH} type="video/mp4" />
              </video>
            ) : (
              <canvas ref={canvasRef} className="w-full h-full object-cover block" />
            )}

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none" />
          </div>
        )}

        {/* ==================================================================== */}
        {/* 2. HAIL MARY OFFICIAL BRAND LOGO REVEAL STAGE */}
        {/* ==================================================================== */}
        {(phase === 'logo' || phase === 'fadeout') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 flex flex-col items-center justify-center text-center p-6"
          >
            {/* Official Hail Mary Emblem Badge */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] mb-4 border border-white/40"
            >
              <Car className="w-8 h-8 sm:w-10 sm:h-10 text-[#111111]" />
            </motion.div>

            {/* Official Hail Mary Brand Text */}
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase drop-shadow-2xl font-sans"
            >
              HAIL MARY
            </motion.h1>

            <motion.span
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[10px] sm:text-xs tracking-[0.35em] font-extrabold uppercase text-gray-300 mt-1 block"
            >
              RENTAL SERVICES
            </motion.span>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* 3. MINIMAL OPTIONAL SKIP BUTTON */}
        {/* ==================================================================== */}
        {INTRO_CONFIG.SKIP_BUTTON_ENABLED && phase !== 'fadeout' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleSkip}
            className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
            aria-label="Skip Intro"
          >
            <span>SKIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
