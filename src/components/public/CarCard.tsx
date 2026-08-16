'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/types';
import { logWhatsAppLeadAndOpen } from '@/lib/whatsapp';
import {
  Gauge,
  Users,
  MessageSquare,
  ArrowRight,
  Fuel,
  Settings2,
  Calendar,
} from 'lucide-react';

interface CarCardProps {
  car: Car;
  onOpenQuoteModal?: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onOpenQuoteModal }) => {
  const defaultFallback = 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop';
  const [imgSrc, setImgSrc] = React.useState<string>(car.images?.[0] || defaultFallback);

  React.useEffect(() => {
    setImgSrc(car.images?.[0] || defaultFallback);
  }, [car]);

  const status = car.status || 'AVAILABLE';

  const badgeStyles = {
    AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LIMITED: 'bg-amber-50 text-amber-700 border-amber-200',
    RENTED: 'bg-rose-50 text-rose-700 border-rose-200',
    COMING_SOON: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const badgeLabels = {
    AVAILABLE: 'Available',
    LIMITED: 'Limited',
    RENTED: 'Rented',
    COMING_SOON: 'Soon',
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex flex-col justify-between group transition-all duration-300 hover:border-[#111111] hover:shadow-md w-full">
      {/* Vehicle Image Container */}
      <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden mb-4 bg-[#F5F5F3]">
        <Image
          src={imgSrc}
          alt={car.name}
          fill
          unoptimized
          onError={() => setImgSrc(defaultFallback)}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status & Category Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${badgeStyles[status]}`}
          >
            {badgeLabels[status]}
          </span>

          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/90 text-[#111111] font-bold uppercase tracking-wider border border-[#E5E5E5] shadow-xs">
            {car.category}
          </span>
        </div>
      </div>

      {/* Title & Pricing */}
      <div className="space-y-3 flex-1">
        <div className="flex items-start justify-between gap-2 border-b border-[#E5E5E5] pb-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-[#666666] font-semibold uppercase tracking-wider block">
              {car.brand} • {car.year}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#111111] group-hover:text-black transition-colors leading-snug truncate" title={car.name}>
              {car.name}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-lg sm:text-xl font-extrabold text-[#111111]">
                ₹{car.pricePerDay.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#666666] font-medium">/day</span>
            </div>
            <span className="text-[10px] text-[#888888] block">
              Deposit: ₹{car.deposit.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Specification Grid */}
        <div className="grid grid-cols-4 gap-1 py-2 px-2.5 rounded-xl bg-[#F9F9F8] border border-[#E5E5E5] text-center text-[#555555]">
          <div className="flex flex-col items-center">
            <Fuel className="w-3.5 h-3.5 text-[#111111] mb-0.5" />
            <span className="text-[10px] font-semibold text-[#111111] truncate max-w-full">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center border-l border-[#E5E5E5]">
            <Settings2 className="w-3.5 h-3.5 text-[#111111] mb-0.5" />
            <span className="text-[10px] font-semibold text-[#111111] truncate max-w-full">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center border-l border-[#E5E5E5]">
            <Users className="w-3.5 h-3.5 text-[#111111] mb-0.5" />
            <span className="text-[10px] font-semibold text-[#111111]">{car.seating} Seats</span>
          </div>
          <div className="flex flex-col items-center border-l border-[#E5E5E5]">
            <Gauge className="w-3.5 h-3.5 text-[#111111] mb-0.5" />
            <span className="text-[10px] font-semibold text-[#111111] truncate max-w-full">{car.mileage}</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3.5 mt-3 border-t border-[#E5E5E5] space-y-2">
        <div className="flex items-center gap-2">
          {onOpenQuoteModal && (
            <button
              onClick={() => onOpenQuoteModal(car)}
              className="flex-1 py-2.5 px-3 rounded-full bg-[#111111] hover:bg-black text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          )}

          <button
            onClick={() => logWhatsAppLeadAndOpen(car.name)}
            className="px-3 py-2.5 rounded-full bg-[#F0F0EE] hover:bg-[#EAEAE7] text-[#111111] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors border border-[#E5E5E5]"
            title="Instant WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
        </div>

        <Link
          href={`/fleet/${car.id}`}
          className="w-full py-1 text-center text-xs font-semibold text-[#666666] hover:text-[#111111] transition-colors flex items-center justify-center gap-1 group/link"
        >
          <span>View Specs & Gallery</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

