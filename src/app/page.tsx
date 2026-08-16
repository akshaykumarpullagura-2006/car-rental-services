'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/public/HeroSection';
import { StatsSection } from '@/components/public/StatsSection';
import { BrandsCarousel } from '@/components/public/BrandsCarousel';
import { WhyUsSection } from '@/components/public/WhyUsSection';
import { HowItWorksSection } from '@/components/public/HowItWorksSection';
import { FeaturedFleetSection } from '@/components/public/FeaturedFleetSection';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';
import { FaqSection } from '@/components/public/FaqSection';
import { QuoteModal } from '@/components/public/QuoteModal';
import { MOCK_CARS } from '@/lib/db';
import { Car, Testimonial } from '@/types';

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCarForQuote, setSelectedCarForQuote] = useState<Car | null>(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/fleet')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setCars(data);
        })
        .catch(() => null);

      fetch('/api/testimonials')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setTestimonials(data);
        })
        .catch(() => null);
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenQuoteModal = (car?: Car) => {
    setSelectedCarForQuote(car || null);
    setQuoteModalOpen(true);
  };

  const autoRentalSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'HAIL MARY RENTAL SERVICES',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop',
    telephone: '+1-555-234-5678',
    email: 'concierge@hailmaryrentals.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9454 Wilshire Blvd',
      addressLocality: 'Beverly Hills',
      addressRegion: 'CA',
      postalCode: '90212',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '34.0669',
      longitude: '-118.4004',
    },
    openingHours: 'Mo-Su 08:00-22:00',
    priceRange: '$$$$',
  };

  return (
    <>
      {/* AutoRental Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoRentalSchema) }}
      />

      {/* ==================================================================== */}
      {/* 🚀 NATURAL DOCUMENT FLOW HOMEPAGE (ZERO SECTION-TO-SECTION STACKING)  */}
      {/* ==================================================================== */}
      <main className="w-full bg-[#F5F5F3] text-[#111111]">
        {/* SECTION 1: HERO */}
        <HeroSection onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* SECTION 2: STATS & MARQUES CAROUSEL */}
        <StatsSection />
        <BrandsCarousel />

        {/* SECTION 3: FEATURED FLEET CATALOG */}
        <FeaturedFleetSection cars={cars} onOpenQuoteModal={handleOpenQuoteModal} />

        {/* SECTION 4: WHY DISCERNING CLIENTS CHOOSE HAIL MARY */}
        <WhyUsSection />

        {/* SECTION 5: EFFORTLESS PROCESS / HOW RENTING WORKS */}
        <HowItWorksSection />

        {/* SECTION 6: CLIENT REVIEWS & TESTIMONIALS */}
        <TestimonialsSection testimonials={testimonials} />

        {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
        <FaqSection />
      </main>

      {/* Quote Booking Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        car={selectedCarForQuote}
      />
    </>
  );
}
