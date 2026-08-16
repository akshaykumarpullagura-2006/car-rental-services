import { useState, useCallback } from 'react';

export type VehicleCategory = 'basic' | 'medium' | 'luxury' | 'ultraluxury';

export interface VehicleDetails {
  id: VehicleCategory;
  categoryName: string;
  name: string;
  brand: string;
  colorName: string;
  colorHex: string;
  modelPath: string;
  badgeLabel: string;
  emoji: string;
  specs: {
    engine: string;
    horsepower: number;
    zeroToSixty: string;
    bodyStyle: string;
  };
}

export const VEHICLES: Record<VehicleCategory, VehicleDetails> = {
  basic: {
    id: 'basic',
    categoryName: 'Basic',
    name: 'Suzuki Swift',
    brand: 'Suzuki',
    colorName: 'Pearl White',
    colorHex: '#F5F5F7',
    modelPath: '/images/swift-3d.png',
    emoji: '🚗',
    badgeLabel: '🚗 Suzuki Swift • Interactive 3D Model • Drag to Rotate 360°',
    specs: {
      engine: '1.2L DualJet VVT',
      horsepower: 89,
      zeroToSixty: '11.2s',
      bodyStyle: 'Hatchback',
    },
  },
  medium: {
    id: 'medium',
    categoryName: 'Medium',
    name: 'Mahindra Thar',
    brand: 'Mahindra',
    colorName: 'Rage Red 4x4',
    colorHex: '#8B0000',
    modelPath: 'https://images.unsplash.com/photo-1609521263047-f8d205293f24?q=80&w=1600&auto=format&fit=crop',
    emoji: '🚙',
    badgeLabel: '🚙 Mahindra Thar • Interactive 3D Model • Drag to Rotate 360°',
    specs: {
      engine: '2.0L mStallion TGDi',
      horsepower: 150,
      zeroToSixty: '9.5s',
      bodyStyle: '4x4 Off-Road SUV',
    },
  },
  luxury: {
    id: 'luxury',
    categoryName: 'Luxury',
    name: 'Toyota Fortuner',
    brand: 'Toyota',
    colorName: 'Super White',
    colorHex: '#FAFAFA',
    modelPath: '/images/fortuner-3d.png',
    emoji: '🚘',
    badgeLabel: '🚘 Toyota Fortuner • Interactive 3D Model • Drag to Rotate 360°',
    specs: {
      engine: '2.8L D-4D Turbo Diesel',
      horsepower: 201,
      zeroToSixty: '9.8s',
      bodyStyle: 'Executive SUV',
    },
  },
  ultraluxury: {
    id: 'ultraluxury',
    categoryName: 'Ultra Luxury',
    name: 'Lamborghini Aventador',
    brand: 'Lamborghini',
    colorName: 'Giallo Orion Yellow',
    colorHex: '#FFD700',
    modelPath: '/models/lamborghini.glb',
    emoji: '🏎',
    badgeLabel: '🏎 Lamborghini Aventador • Interactive 3D Model • Drag to Rotate 360°',
    specs: {
      engine: '6.5L Naturally Aspirated V12',
      horsepower: 770,
      zeroToSixty: '2.8s',
      bodyStyle: 'Exotic Supercar',
    },
  },
};

export function useVehicle(initialCategory: VehicleCategory = 'ultraluxury') {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>(initialCategory);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setCategory = useCallback((category: VehicleCategory) => {
    if (category === selectedCategory) return;
    setIsTransitioning(true);
    setSelectedCategory(category);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 700); // 700ms transition duration
  }, [selectedCategory]);

  return {
    selectedCategory,
    currentVehicle: VEHICLES[selectedCategory],
    isTransitioning,
    setCategory,
    vehiclesList: Object.values(VEHICLES),
  };
}
