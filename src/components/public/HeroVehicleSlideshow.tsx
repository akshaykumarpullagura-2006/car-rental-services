'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Car } from '@/types';
import { MOCK_CARS } from '@/lib/db';
import { VehicleCategory } from '@/hooks/useVehicle';

interface HeroVehicleSlideshowProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (category: VehicleCategory) => void;
}

export const HeroVehicleSlideshow: React.FC<HeroVehicleSlideshowProps> = ({
  selectedCategory,
}) => {
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch('/api/fleet')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCars(data);
        }
      })
      .catch(() => null);
  }, []);

  // Filter vehicles matching the selected category
  const filteredCars = React.useMemo(() => {
    if (!cars || cars.length === 0) return MOCK_CARS;
    
    const catMap: Record<VehicleCategory, string[]> = {
      basic: ['basic', 'hatchback', 'swift'],
      medium: ['medium', 'thar', 'suv', '4x4'],
      luxury: ['luxury', 'fortuner', 'executive', 'sedan'],
      ultraluxury: ['ultraluxury', 'ultra luxury', 'exotic', 'supercar', 'convertible'],
    };

    const targetKeywords = catMap[selectedCategory] || [];
    const matched = cars.filter((c) => {
      const cCat = (c.category || '').toLowerCase();
      const cName = (c.name || '').toLowerCase();
      return targetKeywords.some((kw) => cCat.includes(kw) || cName.includes(kw));
    });

    return matched.length > 0 ? matched : cars;
  }, [cars, selectedCategory]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Auto-play interval removed so main page slideshow images do not change automatically on their own

  const currentCar = filteredCars[currentIndex] || filteredCars[0] || MOCK_CARS[0];
  const carImage = currentCar.images && currentCar.images[0]
    ? currentCar.images[0]
    : 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCars.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredCars.length) % filteredCars.length);
  };

  return (
    <div
      className="w-full h-[400px] sm:h-[460px] lg:h-[500px] bg-white rounded-3xl border border-[#E5E5E5] shadow-xs relative overflow-hidden flex flex-col justify-between group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Image Slideshow Container */}
      <div className="absolute inset-0 z-0 bg-[#F9F9F8]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCar.id + '_' + currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={carImage}
              alt={currentCar.name}
              fill
              unoptimized
              className="object-cover"
              priority
            />
            {/* Gradient Vignette for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top Bar: Category Indicator & Slide Counter */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E5E5] text-[#111111] shadow-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentCar.brand} • {currentCar.category || 'Luxury Fleet'}</span>
        </span>

        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
          {currentIndex + 1} / {filteredCars.length} Vehicles
        </span>
      </div>

      {/* Navigation Controls */}
      {filteredCars.length > 1 && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E5E5] text-[#111111] flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all pointer-events-auto cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E5E5] text-[#111111] flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all pointer-events-auto cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Bottom Content Bar */}
      <div className="relative z-10 p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
              {currentCar.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-200 font-medium">
              <span>{currentCar.horsepower} HP</span>
              <span>•</span>
              <span>0-60 in {currentCar.zeroToSixty}</span>
              <span>•</span>
              <span>{currentCar.seating} Seats</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-gray-300 uppercase tracking-wider block font-semibold">Starting Rate</span>
              <span className="text-xl font-extrabold text-white">₹{currentCar.pricePerDay.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-300">/day</span></span>
            </div>

            <Link
              href={`/fleet/${currentCar.id}`}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F5F3] text-[#111111] text-xs font-bold flex items-center gap-1 shadow-sm transition-all shrink-0"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Pagination Dots */}
        {filteredCars.length > 1 && (
          <div className="pt-2 flex items-center justify-center gap-1.5">
            {filteredCars.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
