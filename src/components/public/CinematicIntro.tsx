'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Volume2, VolumeX, Shield, Car as CarIcon, Zap } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

const VEHICLES = [
  {
    id: 'basic',
    label: 'Basic',
    name: 'Suzuki Swift 2021',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop',
    icon: CarIcon,
    accent: 'border-emerald-400/50 text-emerald-300',
  },
  {
    id: 'medium',
    label: 'Medium',
    name: 'Mahindra Thar 4x4',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
    icon: Shield,
    accent: 'border-amber-400/50 text-amber-300',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    name: 'Toyota Fortuner GR-S',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
    icon: Sparkles,
    accent: 'border-gold-400/50 text-gold-300',
  },
  {
    id: 'ultraluxury',
    label: 'Ultra Luxury',
    name: 'Lamborghini Aventador',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=800&auto=format&fit=crop',
    icon: Zap,
    accent: 'border-purple-400/50 text-purple-300',
  },
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize soft 4-second audio flare via Web Audio API
  const playShowroomSoundtrack = () => {
    try {
      if (!audioEnabled) return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 2.0);

      subGain.gain.setValueAtTime(0.01, ctx.currentTime);
      subGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start();
      subOsc.stop(ctx.currentTime + 3.8);
    } catch (e) {
      console.warn('Audio playback restricted:', e);
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem('hm_4s_animated_intro_played', 'true');
    setShow(false);
    onComplete();
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPlayed = sessionStorage.getItem('hm_4s_animated_intro_played');

    if (prefersReducedMotion || hasPlayed) {
      setShow(false);
      onComplete();
      return;
    }

    playShowroomSoundtrack();

    // Auto complete intro after EXACTLY 4.0 seconds
    const timer = setTimeout(() => {
      sessionStorage.setItem('hm_4s_animated_intro_played', 'true');
      setShow(false);
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="fixed inset-0 z-[200] bg-[#06070a] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
      >
        {/* Dark Luxury Studio Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070a] via-dark-600/90 to-[#06070a] pointer-events-none" />

        {/* Sweeping Golden Light Flare Beams */}
        <motion.div
          animate={{ x: ['-100%', '200%'], opacity: [0, 0.5, 0] }}
          transition={{ duration: 4.0, ease: 'easeInOut', repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/25 to-transparent transform -skew-x-12 pointer-events-none"
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                scale: Math.random() * 0.6 + 0.2,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{ y: [null, '-15vh'], opacity: [null, 0] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: 'linear' }}
              className="absolute w-1.5 h-1.5 rounded-full bg-gold-300 blur-[1px]"
            />
          ))}
        </div>

        {/* Top Control Bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-gold-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
            <span>4-SECOND ALL-FLEET SHOWROOM REVEAL</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all"
              title="Toggle Audio"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-gold-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>

            <button
              onClick={handleSkip}
              className="px-4 py-2 rounded-full bg-white/10 border border-gold-400/30 text-gold-300 hover:bg-gold-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md transition-all shadow-gold-glow"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
            </button>
          </div>
        </div>

        {/* Main Stage: Animated 4-Vehicle Cards */}
        <div className="relative w-full max-w-7xl h-[480px] sm:h-[560px] flex flex-col items-center justify-center z-10 px-4">
          
          {/* Header Title with Pulse Glow */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
            className="text-center mb-6 space-y-2 z-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-widest shadow-gold-glow">
              <Sparkles className="w-4 h-4 text-gold-400 animate-spin" />
              <span>Choose Your Perfect Ride</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Premium Rental Cars <span className="gold-gradient-text">For Every Journey</span>
            </h1>
          </motion.div>

          {/* 4 Vehicles Side-by-Side — Rich Continuous Card Animations */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl z-10">
            {VEHICLES.map((v, idx) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                      '0 10px 30px rgba(0,0,0,0.8)',
                      '0 20px 40px rgba(212,175,55,0.3)',
                      '0 10px 30px rgba(0,0,0,0.8)',
                    ],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    delay: idx * 0.25,
                    ease: 'easeInOut',
                  }}
                  className="flex flex-col items-center text-center relative group p-3 rounded-2xl bg-dark-600/90 border border-gold-400/40 shadow-2xl backdrop-blur-md overflow-hidden hover:scale-105 transition-transform"
                >
                  {/* Shimmer Light Streak Passing Over Each Card */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.4, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 pointer-events-none"
                  />

                  {/* Spotlight Gold Flare Header */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gold-gradient opacity-90 shadow-gold-glow" />

                  {/* High-Resolution Luxury Vehicle Photography */}
                  <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-dark-300">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-600 via-transparent to-transparent opacity-85" />

                    <div className={`absolute top-2 left-2 px-3 py-1 rounded-full bg-black/90 backdrop-blur-md border text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-lg ${v.accent}`}>
                      <Icon className="w-3 h-3" />
                      <span>{v.label}</span>
                    </div>
                  </div>

                  {/* Vehicle Name Label */}
                  <div className="mt-3 text-center pb-1">
                    <span className="text-xs font-black text-white block truncate max-w-[150px] group-hover:text-gold-300 transition-colors">
                      {v.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom 4.0-Second Progress Bar */}
        <div className="absolute bottom-6 left-12 right-12 max-w-xl mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden z-30">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.0, ease: 'linear' }}
            className="h-full bg-gold-gradient rounded-full shadow-gold-glow"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
