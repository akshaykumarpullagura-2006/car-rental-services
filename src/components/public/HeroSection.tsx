'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleCategoryTabs } from '@/components/public/VehicleCategoryTabs';
import { useVehicle } from '@/hooks/useVehicle';
import { ArrowRight, Car, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Car as CarType } from '@/types';
import { MOCK_CARS } from '@/lib/db';

interface HeroSectionProps {
  onOpenQuoteModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQuoteModal }) => {
  const [cars, setCars] = useState<CarType[]>(MOCK_CARS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [headline, setHeadline] = useState("Hail Mary's Premier Luxury Fleet");
  const [subheading, setSubheading] = useState(
    "Drive Rolls-Royce, Lamborghini, Ferrari, and Maybach with bespoke concierge delivery."
  );
  const [cmsMap, setCmsMap] = useState<Record<string, string>>({});

  const { selectedCategory, setCategory, isTransitioning } = useVehicle('ultraluxury');

  useEffect(() => {
    const loadLocalCms = () => {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('hailmary_cms');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed) {
              setCmsMap(parsed);
              if (parsed.hero_headline) setHeadline(parsed.hero_headline);
              if (parsed.hero_subheading) setSubheading(parsed.hero_subheading);
            }
          } catch (e) {}
        }
      }
    };

    const fetchHeroData = () => {
      fetch('/api/fleet')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setCars(data);
        })
        .catch(() => null);

      fetch('/api/cms')
        .then((res) => res.json())
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setCmsMap((prev) => {
              const merged = { ...prev, ...data };
              if (typeof window !== 'undefined') {
                localStorage.setItem('hailmary_cms', JSON.stringify(merged));
              }
              if (merged.hero_headline) setHeadline(merged.hero_headline);
              if (merged.hero_subheading) setSubheading(merged.hero_subheading);
              return merged;
            });
          }
        })
        .catch(() => null);
    };

    loadLocalCms();
    fetchHeroData();
    const interval = setInterval(fetchHeroData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Construct the 4 Flagship Category Slides in user requested order: Ultra Luxury -> Luxury -> Medium -> Basic (at last)
  const fourCategorySlides = React.useMemo(() => {
    const allFleet = cars.length > 0 ? cars : MOCK_CARS;

    const ultraLuxuryCar = allFleet.find((c) => 
      (c.category || '').toLowerCase().includes('ultra') || 
      c.brand.toLowerCase().includes('lamborghini') || 
      c.brand.toLowerCase().includes('rolls') ||
      c.name.toLowerCase().includes('urus') ||
      c.name.toLowerCase().includes('cullinan')
    ) || allFleet.find((c) => c.pricePerDay >= 100000) || allFleet[0];

    const luxuryCar = allFleet.find((c) => 
      c.name.toLowerCase().includes('fortuner') ||
      c.brand.toLowerCase().includes('mercedes') ||
      (c.category || '').toLowerCase() === 'luxury'
    ) || allFleet[1];

    const mediumCar = allFleet.find((c) => 
      c.name.toLowerCase().includes('thar') || 
      (c.category || '').toLowerCase() === 'medium'
    ) || allFleet[2];

    const basicCar = allFleet.find((c) => 
      c.name.toLowerCase().includes('swift') || 
      (c.category || '').toLowerCase() === 'basic'
    ) || allFleet[3];

    return [
      {
        ...ultraLuxuryCar,
        catKey: 'ultraluxury' as const,
        catName: 'Ultra Luxury Tier',
        image: cmsMap.hero_image_ultraluxury || (ultraLuxuryCar.images && ultraLuxuryCar.images[0]) || 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop',
      },
      {
        ...luxuryCar,
        catKey: 'luxury' as const,
        catName: 'Luxury Tier',
        image: cmsMap.hero_image_luxury || (luxuryCar.images && luxuryCar.images[0]) || '/images/fortuner-3d.png',
      },
      {
        ...mediumCar,
        catKey: 'medium' as const,
        catName: 'Medium Tier',
        image: cmsMap.hero_image_medium || (mediumCar.images && mediumCar.images[0]) || '/images/thar-3d.jpg',
      },
      {
        ...basicCar,
        catKey: 'basic' as const,
        catName: 'Basic Tier',
        image: cmsMap.hero_image_basic || (basicCar.images && basicCar.images[0]) || '/images/swift-3d.png',
      },
    ];
  }, [cars, cmsMap]);

  // Handle category selection from dock tabs with clean state sync
  const handleSelectCategory = React.useCallback(
    (catKey: 'basic' | 'medium' | 'luxury' | 'ultraluxury') => {
      const catIndices: Record<string, number> = { ultraluxury: 0, luxury: 1, medium: 2, basic: 3 };
      const newIdx = catIndices[catKey] ?? 0;
      setCurrentIndex(newIdx);
      setCategory(catKey);
    },
    [setCategory]
  );

  // Auto-play slideshow timer: changes hero vehicle image slide every 3 seconds (3000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIdx) => {
        const nextIdx = (prevIdx + 1) % 4;
        const catKeys = ['ultraluxury', 'luxury', 'medium', 'basic'] as const;
        setCategory(catKeys[nextIdx]);
        return nextIdx;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [setCategory]);

  const currentSlide = fourCategorySlides[currentIndex] || fourCategorySlides[0];
  const currentCar = currentSlide;
  const currentCarImage = currentSlide.image;

  // Clean title formatting (prevent "AUDI AUDI" duplication)
  const cleanVehicleName = React.useMemo(() => {
    if (!currentCar || !currentCar.name) return '';
    const nameStr = currentCar.name.trim();
    const brandStr = (currentCar.brand || '').trim();
    if (brandStr && nameStr.toLowerCase().startsWith(brandStr.toLowerCase())) {
      return nameStr;
    }
    return `${brandStr} ${nameStr}`;
  }, [currentCar]);

  const [quoteHover, setQuoteHover] = useState(false);

  const handlePrevSlide = () => {
    const prevIdx = currentIndex === 0 ? 3 : currentIndex - 1;
    const catKeys = ['ultraluxury', 'luxury', 'medium', 'basic'] as const;
    setCurrentIndex(prevIdx);
    setCategory(catKeys[prevIdx]);
  };

  const handleNextSlide = () => {
    const nextIdx = (currentIndex + 1) % 4;
    const catKeys = ['ultraluxury', 'luxury', 'medium', 'basic'] as const;
    setCurrentIndex(nextIdx);
    setCategory(catKeys[nextIdx]);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 📱 MOBILE HOMEPAGE HERO (Strict Order per Master Prompt Diagram: < 1024px) */}
      {/* ========================================================================= */}
      <section className="lg:hidden w-full bg-[#080808] text-white pt-24 pb-12 px-4 space-y-6 flex flex-col items-center">
        
        {/* 1. CENTERED HERO HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm space-y-2 px-2"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white uppercase drop-shadow-md">
            {headline || "Hail Mary's Premier Luxury Rental Fleet"}
          </h1>
        </motion.div>

        {/* 2. CENTERED HERO DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs sm:text-sm text-[#AAAAAA] text-center max-w-xs leading-relaxed font-medium"
        >
          {subheading}
        </motion.p>



        {/* 4. CONTROLLED VEHICLE SLIDESHOW CARD (4 Categories Slideshow) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-[92%] max-w-md bg-[#121212] border border-white/10 rounded-3xl p-3 shadow-2xl space-y-3 relative overflow-hidden"
        >
          {/* Controlled Image Box (Aspect Ratio 16/10) */}
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-black/60">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.catKey + '_' + currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentCarImage}
                  alt={cleanVehicleName}
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            {/* Carousel Nav Arrows Left & Right */}
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-10">
              <button
                onClick={handlePrevSlide}
                aria-label="Previous Vehicle"
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center pointer-events-auto shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                aria-label="Next Vehicle"
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center pointer-events-auto shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vehicle Info Badge (Clean Name & Isolated Category Tier) */}
          <div className="text-center space-y-1">
            <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
              {cleanVehicleName}
            </h3>
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
              {currentSlide.catName}
            </p>
          </div>

          {/* Carousel Slide Indicators (4 Category Dots) */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {fourCategorySlides.map((slide, idx) => (
              <button
                key={slide.catKey}
                onClick={() => {
                  setCurrentIndex(idx);
                  setCategory(slide.catKey);
                }}
                aria-label={`Go to ${slide.catName}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* 5. REQUEST QUOTE BUTTON (Full Width) */}
        <motion.button
          onClick={onOpenQuoteModal}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-[92%] max-w-md h-[52px] rounded-full bg-white text-[#111111] hover:bg-gray-200 font-extrabold text-sm flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
        >
          <span>Request a Quote</span>
          <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </motion.button>

        {/* 6. BROWSE FLEET BUTTON (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-[92%] max-w-md"
        >
          <Link
            href="/fleet"
            className="w-full h-[52px] rounded-full bg-[#161616] hover:bg-[#222222] border border-white/15 text-white font-extrabold text-sm flex items-center justify-center text-center shadow-xl"
          >
            <span>Browse Fleet</span>
          </Link>
        </motion.div>

        {/* 7. UNIFIED CATEGORY SELECTOR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-[92%] max-w-md pt-2"
        >
          <VehicleCategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            disabled={isTransitioning}
          />
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 🖥 DESKTOP HOMEPAGE HERO (Large & Extra-Large Devices: ≥ 1024px) */}
      {/* ========================================================================= */}
      <section className="hidden lg:flex relative w-full min-h-screen bg-black overflow-hidden flex-col justify-between p-8 xl:p-14 pt-28 xl:pt-32 pb-8">
        
        {/* Full-Screen High-Res Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCar.id + '_' + currentIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full h-full"
            >
              <Image
                src={currentCarImage}
                alt={currentCar.name}
                fill
                unoptimized
                className="object-cover object-center"
                priority
              />
              {/* Subtle Gradient for Ideal Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Carousel Arrow Navigation (Left & Right Controls) */}
        {fourCategorySlides.length > 1 && (
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-between pointer-events-none">
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Vehicle"
              className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center pointer-events-auto hover:bg-white hover:text-black hover:scale-110 transition-all shadow-2xl cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextSlide}
              aria-label="Next Vehicle"
              className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center pointer-events-auto hover:bg-white hover:text-black hover:scale-110 transition-all shadow-2xl cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Top Row: Large Editorial Headline Left & Floating Glass Search Widget Right */}
        <div className="relative z-10 max-w-[1480px] mx-auto w-full flex items-start justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl space-y-2 text-left"
          >
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white tracking-tight leading-[1.02] drop-shadow-2xl uppercase">
              {headline || "Hail Mary's Premier Luxury Rental Fleet"}
            </h1>
          </motion.div>


        </div>

        {/* Bottom Content Area */}
        <div className="relative z-10 max-w-[1480px] mx-auto w-full space-y-6">
          {/* Active Car Highlight Badge */}
          <motion.div
            key={`badge_${currentSlide.catKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider">
              {cleanVehicleName}
            </span>
            <span className="text-[11px] text-emerald-400 font-bold">
              {currentSlide.catName}
            </span>
          </motion.div>

          <div className="flex items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-lg space-y-5 text-left"
            >
              <p className="text-gray-200 text-sm xl:text-base font-medium leading-relaxed drop-shadow-lg">
                {subheading}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenQuoteModal}
                  onMouseEnter={() => setQuoteHover(true)}
                  onMouseLeave={() => setQuoteHover(false)}
                  className={`inline-flex items-center justify-center gap-3 text-xs font-bold px-6 py-3.5 rounded-full transition-all duration-300 shadow-xl group cursor-pointer min-h-[46px] border ${
                    quoteHover
                      ? 'bg-black text-white border-white/20 shadow-2xl'
                      : 'bg-white text-[#111111] border-transparent hover:bg-black hover:text-white'
                  }`}
                >
                  <span className="grid grid-cols-1 grid-rows-1 items-center justify-items-center">
                    <span className={`col-start-1 row-start-1 transition-opacity duration-300 ${quoteHover ? 'opacity-0' : 'opacity-100'}`}>
                      Request Quote
                    </span>
                    <span className={`col-start-1 row-start-1 transition-opacity duration-300 ${quoteHover ? 'opacity-100' : 'opacity-0'}`}>
                      Let's Talk
                    </span>
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center group-hover:scale-105 transition-colors duration-300 ${
                    quoteHover ? 'bg-white text-black' : 'bg-[#111111] text-white'
                  }`}>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>

                <Link
                  href="/fleet"
                  className="inline-flex items-center justify-center gap-2 bg-black/60 hover:bg-black/80 text-white border border-white/20 text-xs font-bold px-5 py-3.5 rounded-full transition-all backdrop-blur-md min-h-[46px]"
                >
                  <span>Browse Fleet</span>
                </Link>
              </div>
            </motion.div>

            {/* Desktop Stacked Stat Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-3 self-end"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 px-4 rounded-2xl shadow-2xl flex items-center gap-3.5 min-w-[170px]">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center font-bold">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-extrabold text-white block leading-tight">50+</span>
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider block">Exotic Fleet</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 px-4 rounded-2xl shadow-2xl flex items-center gap-3.5 min-w-[170px]">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-white text-white" />
                </div>
                <div>
                  <span className="text-lg font-extrabold text-white block leading-tight">5.0★</span>
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider block">Rated Fleet</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="pt-2 pb-12 sm:pb-16">
            <VehicleCategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              disabled={isTransitioning}
            />
          </div>
        </div>

        {/* Slide Indicator Dots Bottom Center (4 Category Dots) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {fourCategorySlides.map((slide, idx) => (
            <button
              key={slide.catKey}
              onClick={() => {
                setCurrentIndex(idx);
                setCategory(slide.catKey);
              }}
              aria-label={`Go to ${slide.catName}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
};
