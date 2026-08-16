'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, MessageSquare, Facebook, Linkedin, Twitter } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface SocialStation {
  id: string;
  name: string;
  url: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

interface SocialRideTrackProps {
  cmsData?: Record<string, string>;
}

export const SocialRideTrack: React.FC<SocialRideTrackProps> = ({ cmsData }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [carProgress, setCarProgress] = useState<number>(0); // 0 to 1 along the active track
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const whatsappNumber = cmsData?.whatsapp_number || '919876543210';
  const whatsappUrl = getWhatsAppLink({
    phoneNumber: whatsappNumber,
    customMessage: 'Hello Hail Mary Concierge, I connected with you via WhatsApp.',
  });

  // Dynamically configured social platforms from CMS
  const stations: SocialStation[] = useMemo(() => {
    const list: SocialStation[] = [];
    
    if (cmsData?.instagram_url !== 'disabled') {
      list.push({
        id: 'instagram',
        name: 'Instagram',
        url: cmsData?.instagram_url || 'https://instagram.com/hailmaryrentals',
        icon: Instagram,
        color: '#E1306C',
      });
    }

    if (cmsData?.youtube_url !== 'disabled') {
      list.push({
        id: 'youtube',
        name: 'YouTube',
        url: cmsData?.youtube_url || 'https://youtube.com/@hailmaryrentals',
        icon: Youtube,
        color: '#FF0000',
      });
    }

    list.push({
      id: 'whatsapp',
      name: 'WhatsApp',
      url: whatsappUrl,
      icon: MessageSquare,
      color: '#25D366',
    });

    if (cmsData?.facebook_url !== 'disabled') {
      list.push({
        id: 'facebook',
        name: 'Facebook',
        url: cmsData?.facebook_url || 'https://facebook.com/hailmaryrentals',
        icon: Facebook,
        color: '#1877F2',
      });
    }

    if (cmsData?.linkedin_url && cmsData.linkedin_url !== 'disabled') {
      list.push({
        id: 'linkedin',
        name: 'LinkedIn',
        url: cmsData.linkedin_url,
        icon: Linkedin,
        color: '#0A66C2',
      });
    }

    if (cmsData?.x_url && cmsData.x_url !== 'disabled') {
      list.push({
        id: 'x',
        name: 'X',
        url: cmsData.x_url,
        icon: Twitter,
        color: '#FFFFFF',
      });
    }

    return list;
  }, [cmsData, whatsappUrl]);

  // Smooth continuous car movement along track (8 seconds per loop)
  useEffect(() => {
    if (prefersReducedMotion || stations.length === 0) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animateCar = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % 8000; // 8 seconds duration
      const progress = elapsed / 8000;
      setCarProgress(progress);
      animationFrameId = requestAnimationFrame(animateCar);
    };

    animationFrameId = requestAnimationFrame(animateCar);

    return () => cancelAnimationFrame(animationFrameId);
  }, [prefersReducedMotion, stations.length]);

  // Calculate start and end percentages for car track based on layout
  const { trackLeft, trackWidth, carCurrentPercent, activeStationIdx } = useMemo(() => {
    const N = stations.length;
    if (N === 0) return { trackLeft: 0, trackWidth: 100, carCurrentPercent: 0, activeStationIdx: 0 };

    if (isMobile) {
      // 2 columns grid on mobile
      const startX = 25; // center of col 1
      const endX = 75;   // center of col 2
      const width = endX - startX;
      
      // Interpolate progress along mobile 2-col span
      const currentX = startX + carProgress * width;
      const activeIdx = Math.floor(carProgress * N) % N;

      return {
        trackLeft: startX,
        trackWidth: width,
        carCurrentPercent: hoveredIndex !== null ? (hoveredIndex % 2 === 0 ? 25 : 75) : currentX,
        activeStationIdx: hoveredIndex !== null ? hoveredIndex : activeIdx,
      };
    } else {
      // Desktop horizontal row across N stations
      const step = 100 / N;
      const startX = step / 2; // Center of 1st icon
      const endX = 100 - step / 2; // Center of last icon
      const width = endX - startX;

      const currentX = startX + carProgress * width;
      const activeIdx = Math.floor(carProgress * N) % N;

      const targetX = hoveredIndex !== null ? (hoveredIndex + 0.5) * step : currentX;

      return {
        trackLeft: startX,
        trackWidth: width,
        carCurrentPercent: targetX,
        activeStationIdx: hoveredIndex !== null ? hoveredIndex : activeIdx,
      };
    }
  }, [stations.length, isMobile, carProgress, hoveredIndex]);

  return (
    <div className="w-full bg-[#080808] py-8 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-6">
        
        {/* Dynamic Social Media Station Cards Grid */}
        <div
          className={`w-full grid gap-4 justify-items-center ${
            stations.length <= 4
              ? 'grid-cols-2 sm:grid-cols-4'
              : stations.length === 5
              ? 'grid-cols-2 sm:grid-cols-5'
              : 'grid-cols-2 sm:grid-cols-6'
          }`}
        >
          {stations.map((station, idx) => {
            const isActive = activeStationIdx === idx;
            const isHovered = hoveredIndex === idx;
            const Icon = station.icon;

            return (
              <div
                key={station.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="w-full flex flex-col items-center group cursor-pointer"
              >
                {/* Small Dot above Social Card */}
                <div className="flex flex-col items-center mb-2 space-y-1">
                  <motion.div
                    animate={{
                      scale: isActive || isHovered ? 1.4 : 1,
                      backgroundColor: isActive || isHovered ? '#FFFFFF' : '#444444',
                      boxShadow: isActive || isHovered ? '0 0 10px rgba(255,255,255,0.8)' : '0 0 0px transparent',
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-2 h-2 rounded-full border border-white/30"
                  />

                  {/* Thin Vertical Connector Line */}
                  <div
                    className={`w-[1px] h-3 transition-colors duration-200 ${
                      isActive || isHovered ? 'bg-white/60' : 'bg-white/15'
                    }`}
                  />
                </div>

                {/* Compact Social Card (80–120px wide, 65–100px high) */}
                <a
                  href={station.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Hail Mary on ${station.name}`}
                  className={`w-28 sm:w-32 h-16 sm:h-20 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 px-3 py-2 text-center relative overflow-hidden backdrop-blur-md ${
                    isActive || isHovered
                      ? 'bg-white/15 border-white/40 shadow-xl -translate-y-1'
                      : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  {/* Active Station Glow */}
                  {(isActive || isHovered) && (
                    <div
                      className="absolute inset-0 opacity-20 transition-opacity pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${station.color}, transparent 70%)`,
                      }}
                    />
                  )}

                  {/* Platform Icon */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive || isHovered
                        ? 'bg-white text-[#111111] shadow-md'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>

                  {/* Platform Name */}
                  <span className="text-[10px] sm:text-xs font-semibold text-white/90 tracking-tight block">
                    {station.name}
                  </span>
                </a>
              </div>
            );
          })}
        </div>

        {/* TINY CAR TRACK — Positioned DIRECTLY BELOW the social media icons */}
        <div className="relative w-full pt-4 pb-2">
          
          {/* Subtle Hairline Track Line (Starts under 1st icon, ends under last icon) */}
          <div
            className="absolute top-6 h-[1.5px] bg-gradient-to-r from-white/10 via-white/30 to-white/10 rounded-full"
            style={{
              left: `${trackLeft}%`,
              width: `${trackWidth}%`,
            }}
          />

          {/* TINY Sleek Automotive Silhouette (20-30px high) */}
          <motion.div
            animate={{
              left: `${carCurrentPercent}%`,
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              ease: 'easeOut',
            }}
            className="absolute top-2 -translate-x-1/2 pointer-events-none z-30 flex items-center"
          >
            <div className="relative flex items-center">
              {/* Car Body SVG (Height approx 22px) */}
              <div className="relative w-10 h-5 sm:w-12 sm:h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
                <svg
                  viewBox="0 0 100 50"
                  fill="currentColor"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  {/* Sleek Low-Slung Supercar Silhouette */}
                  <path d="M5,35 L12,35 A8,8 0 0,1 28,35 L72,35 A8,8 0 0,1 88,35 L95,35 C97,35 98,33 97,31 L88,18 C85,13 78,10 70,10 L38,10 C30,10 22,15 15,22 L8,29 C6,31 5,33 5,35 Z" opacity="0.95" />
                  {/* Cabin Window */}
                  <path d="M38,13 L68,13 C73,13 77,15 80,19 L84,25 L25,25 L32,17 C34,14 36,13 38,13 Z" fill="#000000" opacity="0.6" />
                  {/* Alloy Wheels */}
                  <circle cx="20" cy="35" r="7" fill="#111111" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="20" cy="35" r="3" fill="#FFFFFF" />
                  <circle cx="80" cy="35" r="7" fill="#111111" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="80" cy="35" r="3" fill="#FFFFFF" />
                  {/* Aerodynamic Side Streak */}
                  <line x1="30" y1="28" x2="68" y2="28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                </svg>
              </div>

              {/* Minimal Soft Headlight Beam */}
              <div className="w-8 h-4 bg-gradient-to-r from-white/70 via-white/20 to-transparent blur-[2px] -ml-0.5 rounded-r-full pointer-events-none" />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
