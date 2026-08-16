'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from 'lucide-react';

// ============================================================================
// 🏎️ HAIL MARY RENTAL SERVICES — PREMIUM LAMBORGHINI LOADER CONFIGURATION
// ============================================================================
export const LOADER_CONFIG = {
  SHOW_LUXURY_LOADER: true,
  LOADER_PLAY_ONCE_PER_SESSION: true,
  SESSION_STORAGE_KEY: 'hailmary_lamborghini_loader_played',
  VIDEO_PATH: '/videos/lamborghini-intro.mp4',
};

export const IntroAnimation: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<'animating' | 'fadeout' | 'ended'>('animating');
  const [useCanvasFallback, setUseCanvasFallback] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Initial Session & Reduced Motion Checks
  useEffect(() => {
    if (!LOADER_CONFIG.SHOW_LUXURY_LOADER) {
      setActive(false);
      return;
    }

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setActive(false);
      return;
    }

    // Check session storage
    if (LOADER_CONFIG.LOADER_PLAY_ONCE_PER_SESSION && typeof window !== 'undefined') {
      const hasPlayed = sessionStorage.getItem(LOADER_CONFIG.SESSION_STORAGE_KEY);
      if (hasPlayed === 'true') {
        setActive(false);
        return;
      }
    }

    setActive(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 2. Loading Progress Counter & Sequence Timer (3.5 Seconds Total)
  useEffect(() => {
    if (!active) return;

    const startTime = Date.now();
    const duration = 3200; // 3.2s animation phase

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
        setPhase('fadeout');
      }
    }, 30);

    return () => clearInterval(progressInterval);
  }, [active]);

  // 3. Complete Exit & Cleanup
  useEffect(() => {
    if (!active || phase !== 'fadeout') return;

    const fadeTimer = setTimeout(() => {
      setPhase('ended');
      setActive(false);
      document.body.style.overflow = '';

      if (LOADER_CONFIG.LOADER_PLAY_ONCE_PER_SESSION && typeof window !== 'undefined') {
        sessionStorage.setItem(LOADER_CONFIG.SESSION_STORAGE_KEY, 'true');
      }
    }, 600);

    return () => clearTimeout(fadeTimer);
  }, [active, phase]);

  // 4. Video Error Handling & Canvas Fallback Trigger
  useEffect(() => {
    if (!active) return;

    const videoTimer = setTimeout(() => {
      if (videoRef.current && videoRef.current.paused) {
        setUseCanvasFallback(true);
      }
    }, 1200);

    return () => clearTimeout(videoTimer);
  }, [active]);

  // 5. Built-in Lamborghini HTML5 Canvas Fallback Engine
  useEffect(() => {
    if (!active || !useCanvasFallback || phase !== 'animating') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime: number | null = null;
    const duration = 3200;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const p = Math.min(elapsed / duration, 1);

      const w = canvas.width;
      const h = canvas.height;

      // Off-white Hail Mary background
      ctx.fillStyle = '#F5F5F3';
      ctx.fillRect(0, 0, w, h);

      // Car position: Left -> Right
      const carW = Math.min(w * 0.45, 480);
      const carH = carW * 0.38;
      const startX = -carW - 100;
      const endX = w + 100;
      const carX = startX + p * (endX - startX);
      const carY = h * 0.54;

      // Subtle Road Line
      const roadY = carY + carH * 0.75;
      ctx.strokeStyle = 'rgba(17, 17, 17, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, roadY);
      ctx.lineTo(w * 0.9, roadY);
      ctx.stroke();

      // Active Light Trail under car
      ctx.strokeStyle = 'rgba(17, 17, 17, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, roadY);
      ctx.lineTo(Math.min(w * 0.1 + p * (w * 0.8), w * 0.9), roadY);
      ctx.stroke();

      // Draw Lamborghini Supercar Silhouette
      ctx.save();
      ctx.translate(carX, carY);

      // Car Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(carW * 0.5, carH * 0.78, carW * 0.48, carH * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body Silhouette
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.moveTo(0, carH * 0.65);
      ctx.quadraticCurveTo(carW * 0.1, carH * 0.55, carW * 0.22, carH * 0.4);
      ctx.quadraticCurveTo(carW * 0.35, carH * 0.12, carW * 0.62, carH * 0.12);
      ctx.quadraticCurveTo(carW * 0.82, carH * 0.35, carW * 0.95, carH * 0.58);
      ctx.quadraticCurveTo(carW * 0.99, carH * 0.65, carW, carH * 0.7);
      ctx.lineTo(0, carH * 0.7);
      ctx.closePath();
      ctx.fill();

      // Glass Windshield
      ctx.fillStyle = '#333333';
      ctx.beginPath();
      ctx.moveTo(carW * 0.36, carH * 0.4);
      ctx.lineTo(carW * 0.48, carH * 0.16);
      ctx.lineTo(carW * 0.62, carH * 0.16);
      ctx.lineTo(carW * 0.66, carH * 0.4);
      ctx.closePath();
      ctx.fill();

      // LED Headlight Beam (front right side)
      const beamGrad = ctx.createLinearGradient(carW * 0.95, carH * 0.55, carW * 1.5, carH * 0.65);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(carW * 0.92, carH * 0.52);
      ctx.lineTo(carW * 1.5, carH * 0.4);
      ctx.lineTo(carW * 1.5, carH * 0.75);
      ctx.lineTo(carW * 0.92, carH * 0.62);
      ctx.closePath();
      ctx.fill();

      // Wheels
      const wheelR = carH * 0.18;
      const wheelY = carH * 0.68;
      [carW * 0.22, carW * 0.78].forEach((wx) => {
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Spoke rotation
        const angle = p * Math.PI * 20;
        ctx.save();
        ctx.translate(wx, wheelY);
        ctx.rotate(angle);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos((i * Math.PI * 2) / 5) * (wheelR - 2), Math.sin((i * Math.PI * 2) / 5) * (wheelR - 2));
          ctx.stroke();
        }
        ctx.restore();
      });

      ctx.restore();

      if (p < 1) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [active, useCanvasFallback, phase]);

  if (!active || phase === 'ended') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="hailmary_lamborghini_loader"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[999999] bg-[#F5F5F3] text-[#111111] flex flex-col items-center justify-between py-12 px-6 overflow-hidden select-none"
      >
        {/* ==================================================================== */}
        {/* 1. TOP BRAND HEADER: HAIL MARY EMBLEM & LOGO */}
        {/* ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mt-6 z-20"
        >
          <div className="w-12 h-12 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-md mb-2.5 border border-[#E5E5E5]">
            <Car className="w-6 h-6 text-[#111111]" />
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#111111] uppercase font-sans">
            HAIL MARY
          </h1>
          <span className="text-[9px] sm:text-[11px] tracking-[0.3em] font-bold uppercase text-[#666666] mt-0.5 block">
            RENTAL SERVICES
          </span>
        </motion.div>

        {/* ==================================================================== */}
        {/* 2. MIDDLE STAGE: LAMBORGHINI SUPERCAR CAROUSEL (VIDEO / CANVAS) */}
        {/* ==================================================================== */}
        <div className="relative w-full max-w-4xl h-56 sm:h-72 flex items-center justify-center overflow-hidden">
          {!useCanvasFallback ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              onError={() => setUseCanvasFallback(true)}
              className="w-full h-full object-contain object-center"
            >
              <source src={LOADER_CONFIG.VIDEO_PATH} type="video/mp4" />
              <source src="/videos/intro.mp4" type="video/mp4" />
            </video>
          ) : (
            <canvas ref={canvasRef} className="w-full h-full block" />
          )}
        </div>

        {/* ==================================================================== */}
        {/* 3. BOTTOM: SUBTLE ROAD LINE & THIN 100% PROGRESS BAR */}
        {/* ==================================================================== */}
        <div className="w-full max-w-md flex flex-col items-center mb-8 space-y-3 z-20">
          <div className="w-full h-[2px] bg-[#E5E5E5] rounded-full overflow-hidden relative">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-[#111111] transition-all duration-75 ease-out rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
