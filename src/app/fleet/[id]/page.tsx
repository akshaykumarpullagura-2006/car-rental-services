'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { QuoteModal } from '@/components/public/QuoteModal';
import { MOCK_CARS } from '@/lib/db';
import { Car, CarGalleryItem } from '@/types';
import { logWhatsAppLeadAndOpen } from '@/lib/whatsapp';
import {
  Zap,
  Gauge,
  Users,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Sparkles,
  ChevronRight,
  Fuel,
  Maximize2,
  X,
} from 'lucide-react';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id as string;

  const [car, setCar] = useState<Car | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const foundMock = MOCK_CARS.find((c) => c.id === carId || c.slug === carId);
    if (foundMock) setCar(foundMock);

    fetch(`/api/fleet/${carId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) setCar(data);
      })
      .catch(() => null);
  }, [carId]);

  if (!car) {
    return (
      <div className="pt-32 pb-20 bg-[#F5F5F3] min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="w-10 h-10 rounded-full border-2 border-[#111111] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-[#666666] text-xs">Loading Vehicle Details...</p>
        </div>
      </div>
    );
  }

  const galleryItems: CarGalleryItem[] = car.gallery && car.gallery.length > 0
    ? car.gallery
    : car.images.map((url, idx) => ({
        url,
        tag: idx === 0 ? 'Exterior' : idx === 1 ? 'Interior' : idx === 2 ? 'Dashboard' : 'Rear',
      }));

  const activeImage = galleryItems[activeImageIndex]?.url || car.images[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setActiveImageIndex((prev) => (prev + 1) % galleryItems.length);
    }
    if (touchStartX.current - touchEndX.current < -50) {
      setActiveImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  const badgeStyles = {
    AVAILABLE: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    LIMITED: 'bg-amber-50 text-amber-800 border-amber-200',
    RENTED: 'bg-rose-50 text-rose-800 border-rose-200',
    COMING_SOON: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  const badgeLabels = {
    AVAILABLE: 'Available Now',
    LIMITED: 'Limited Availability',
    RENTED: 'Currently Rented',
    COMING_SOON: 'Coming Soon',
  };

  return (
    <div className="pt-28 pb-20 bg-[#F5F5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#666666] mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#111111] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#CCCCCC]" />
          <Link href="/fleet" className="hover:text-[#111111] transition-colors">Fleet Collection</Link>
          <ChevronRight className="w-3 h-3 text-[#CCCCCC]" />
          <span className="text-[#111111] font-semibold">{car.name}</span>
        </div>

        {/* Back Link */}
        <Link
          href="/fleet"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#111111] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Fleet Catalog</span>
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={() => setLightboxOpen(true)}
              className="relative w-full h-[320px] sm:h-[440px] rounded-3xl overflow-hidden bg-white border border-[#E5E5E5] cursor-zoom-in group select-none shadow-xs"
            >
              <Image
                src={activeImage}
                alt={car.name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
                priority
              />

              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-white/90 backdrop-blur-md border border-[#E5E5E5] text-[#111111] rounded-full shadow-xs">
                  {galleryItems[activeImageIndex]?.tag || 'Exterior'} View
                </span>
              </div>

              <button className="hidden sm:flex absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#111111] border border-[#E5E5E5] transition-colors items-center gap-1.5 text-xs font-semibold shadow-xs">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>

            {/* Thumbnail Selectors */}
            <div className="grid grid-cols-4 gap-2.5">
              {galleryItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#111111] scale-[1.02]'
                      : 'border-[#E5E5E5] opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={item.url} alt={`${car.name} ${item.tag}`} fill className="object-cover" />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] font-semibold text-white bg-black/70 px-1 py-0.5 rounded text-center truncate">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Specs Breakdown */}
            <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#111111]" />
                <span>Vehicle Specifications</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5]">
                  <Fuel className="w-4 h-4 text-[#111111] mx-auto mb-1" />
                  <span className="block text-sm font-bold text-[#111111]">{car.fuelType}</span>
                  <span className="text-[10px] text-[#666666] uppercase">Fuel Type</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5]">
                  <Zap className="w-4 h-4 text-[#111111] mx-auto mb-1" />
                  <span className="block text-sm font-bold text-[#111111]">{car.horsepower} HP</span>
                  <span className="text-[10px] text-[#666666] uppercase">Max Power</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5]">
                  <Gauge className="w-4 h-4 text-[#111111] mx-auto mb-1" />
                  <span className="block text-sm font-bold text-[#111111]">{car.zeroToSixty}</span>
                  <span className="text-[10px] text-[#666666] uppercase">0-60 mph</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5]">
                  <Users className="w-4 h-4 text-[#111111] mx-auto mb-1" />
                  <span className="block text-sm font-bold text-[#111111]">{car.seating} Seats</span>
                  <span className="text-[10px] text-[#666666] uppercase">Capacity</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 space-y-5 sticky top-28 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase text-[#666666] font-bold tracking-wider">
                    {car.brand} • {car.year}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeStyles[car.status || 'AVAILABLE']}`}>
                    {badgeLabels[car.status || 'AVAILABLE']}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">{car.name}</h1>
              </div>

              {/* Pricing Cards */}
              <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#666666] font-semibold block">Daily Starting Rate</span>
                  <span className="text-2xl font-extrabold text-[#111111]">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#666666]"> / 24 hours</span>
                </div>
                <span className="text-[11px] px-3 py-1 bg-white text-[#111111] border border-[#E5E5E5] font-semibold rounded-full shadow-xs">
                  Standard Rate
                </span>
              </div>

              {/* Deposit Details */}
              <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#666666]">Security Deposit:</span>
                  <span className="text-[#111111] font-bold">₹{car.deposit.toLocaleString('en-IN')} (Refundable)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666]">Chauffeur Option:</span>
                  <span className="text-[#111111] font-bold">₹{(car.driverCharges || 1000).toLocaleString('en-IN')} / day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666]">Extra Mileage Charge:</span>
                  <span className="text-[#111111] font-bold">₹{car.extraKmCharge || 25} / km</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full py-3.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Quote & Availability</span>
                </button>

                <button
                  onClick={() => logWhatsAppLeadAndOpen(car.name)}
                  className="w-full py-3.5 rounded-full bg-[#F5F5F3] hover:bg-[#EAEAE7] border border-[#E5E5E5] text-[#111111] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Inquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh] rounded-3xl overflow-hidden">
            <Image src={activeImage} alt={car.name} fill className="object-contain" priority />
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        car={car}
      />
    </div>
  );
}

