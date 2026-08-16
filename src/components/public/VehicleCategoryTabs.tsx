'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { VehicleCategory } from '@/hooks/useVehicle';
import { Sparkles, Car, Shield, Zap } from 'lucide-react';

interface VehicleCategoryTabsProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (category: VehicleCategory) => void;
  disabled?: boolean;
}

const CATEGORIES: Array<{
  id: VehicleCategory;
  label: string;
  sublabel: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: 'ultraluxury', label: 'Ultra Luxury', sublabel: 'Supercar', icon: Zap },
  { id: 'luxury', label: 'Luxury', sublabel: 'Fortuner', icon: Sparkles },
  { id: 'medium', label: 'Medium', sublabel: 'Thar 4x4', icon: Shield },
  { id: 'basic', label: 'Basic', sublabel: 'Swift', icon: Car },
];

export const VehicleCategoryTabs: React.FC<VehicleCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto z-20 relative">
      <div className="p-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl grid grid-cols-4 gap-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              disabled={disabled}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-1.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex flex-col items-center justify-center select-none cursor-pointer group min-h-[40px] ${
                isSelected
                  ? 'bg-white text-[#111111] shadow-lg font-bold'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon className={`w-3 h-3 ${isSelected ? 'text-[#111111]' : 'text-white/80 group-hover:text-white'}`} />
                <span className="tracking-tight text-[10px] sm:text-xs font-bold truncate">{cat.label}</span>
              </div>
              <span className={`text-[8px] sm:text-[9px] truncate ${isSelected ? 'text-[#555555]' : 'text-gray-300 group-hover:text-white/90'}`}>
                {cat.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

