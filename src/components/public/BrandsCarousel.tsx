'use client';

import React from 'react';

export const BrandsCarousel: React.FC = () => {
  const brands = [
    { name: 'ROLLS-ROYCE', tag: 'Bespoke' },
    { name: 'LAMBORGHINI', tag: 'Supercar' },
    { name: 'FERRARI', tag: 'Exotic' },
    { name: 'MERCEDES-AMG', tag: 'G-Wagon' },
    { name: 'PORSCHE', tag: 'Performance' },
    { name: 'BENTLEY', tag: 'Ultra Luxury' },
    { name: 'LAND ROVER', tag: 'Defender 4x4' },
    { name: 'BMW', tag: 'M Competition' },
  ];

  return (
    <section className="py-8 border-y border-[#E5E5E5] bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <p className="text-[11px] uppercase font-bold text-[#111111] tracking-[0.2em]">
          MARQUES IN OUR COLLECTION
        </p>
      </div>

      <div className="flex overflow-hidden space-x-8 select-none group">
        <div className="flex space-x-6 animate-marquee shrink-0 items-center">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] hover:border-[#111111] transition-all cursor-pointer"
            >
              <span className="text-xs font-bold text-[#111111] tracking-wider">
                {brand.name}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white text-[#666666] font-semibold border border-[#E5E5E5]">
                {brand.tag}
              </span>
            </div>
          ))}
        </div>

        <div className="flex space-x-6 animate-marquee shrink-0 items-center" aria-hidden="true">
          {brands.map((brand, idx) => (
            <div
              key={`dup-${idx}`}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] hover:border-[#111111] transition-all cursor-pointer"
            >
              <span className="text-xs font-bold text-[#111111] tracking-wider">
                {brand.name}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white text-[#666666] font-semibold border border-[#E5E5E5]">
                {brand.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

