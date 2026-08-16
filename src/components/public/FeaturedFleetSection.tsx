'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CarCard } from '@/components/public/CarCard';
import { Car } from '@/types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedFleetProps {
  cars: Car[];
  onOpenQuoteModal: (car: Car) => void;
}

export const FeaturedFleetSection: React.FC<FeaturedFleetProps> = ({ cars, onOpenQuoteModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Basic', 'Medium', 'Luxury', 'Ultra Luxury'];

  const filteredCars = selectedCategory === 'ALL'
    ? cars.slice(0, 6)
    : cars.filter((c) => c.category === selectedCategory);

  return (
    <section className="py-20 bg-[#F5F5F3] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
              <span>FEATURED COLLECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight uppercase">
              Explore Showroom Vehicles
            </h2>
            <p className="text-[#666666] text-sm mt-2">
              Every vehicle is detailed, sanitized, and ready for doorstep concierge delivery.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-white p-1.5 rounded-full border border-[#E5E5E5] shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#555555] hover:text-[#111111] hover:bg-[#F5F5F3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Grid (≥ 768px) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} onOpenQuoteModal={onOpenQuoteModal} />
          ))}
        </div>

        {/* Mobile Stacked Deck Scroll Layout (< 768px) */}
        <div className="md:hidden relative space-y-4 pb-8">
          {filteredCars.map((car, idx) => (
            <div
              key={car.id}
              className="sticky top-24 transition-all duration-300"
              style={{ zIndex: idx + 1 }}
            >
              <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <CarCard car={car} onOpenQuoteModal={onOpenQuoteModal} />
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white text-sm font-semibold px-8 py-4 rounded-full transition-all shadow-sm group"
          >
            <span>View Complete Fleet Catalog ({cars.length}+ Vehicles)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

