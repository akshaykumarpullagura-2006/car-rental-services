'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

// ============================================================================
// 🏆 HOMEPAGE FULL SECTION STACKING PANEL WRAPPER (ONLY ACTIVE ON HOMEPAGE)
// ============================================================================
interface HomeSectionPanelProps {
  children: React.ReactNode;
  zIndex: number;
  bg?: string;
  id?: string;
}

const HomeSectionPanel: React.FC<HomeSectionPanelProps> = ({
  children,
  zIndex,
  bg = 'bg-[#F5F5F3]',
  id,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Track scroll position for this specific section panel
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start end', 'start start'],
  });

  // Physical upward movement directly controlled by scroll (translateY: 120px -> 0px)
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  // Subtle scale depth effect (scale: 0.98 -> 1)
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  return (
    <div
      ref={panelRef}
      id={id}
      style={{ zIndex }}
      className="sticky top-0 w-full flex flex-col justify-start"
    >
      <motion.div
        style={{ y, scale }}
        className={`w-full ${bg} rounded-t-[32px] sm:rounded-t-[48px] lg:rounded-t-[60px] border-t border-white/80 shadow-[0_-30px_90px_rgba(0,0,0,0.3)] relative overflow-hidden transition-shadow duration-300`}
      >
        <div className="w-full h-full pb-8 sm:pb-12">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

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
      {/* 🚀 FULL HOMEPAGE SECTION STACKING SYSTEM (SCROLL-DRIVEN PANEL DECK)  */}
      {/* ==================================================================== */}
      <div className="relative w-full bg-[#050505] text-[#111111] overflow-x-hidden">
        
        {/* SECTION 1: HERO PANEL (z-10) */}
        <div className="sticky top-0 z-10 w-full min-h-screen">
          <HeroSection onOpenQuoteModal={() => handleOpenQuoteModal()} />
        </div>

        {/* SECTION 2: STATS & MARQUES CAROUSEL PANEL (z-20) */}
        <HomeSectionPanel zIndex={20} bg="bg-[#F5F5F3]" id="stats-panel">
          <StatsSection />
          <BrandsCarousel />
        </HomeSectionPanel>

        {/* SECTION 3: FEATURED FLEET CATALOG PANEL (z-30) */}
        <HomeSectionPanel zIndex={30} bg="bg-white" id="fleet-panel">
          <FeaturedFleetSection cars={cars} onOpenQuoteModal={handleOpenQuoteModal} />
        </HomeSectionPanel>

        {/* SECTION 4: WHY DISCERNING CLIENTS CHOOSE HAIL MARY PANEL (z-40) */}
        <HomeSectionPanel zIndex={40} bg="bg-[#F5F5F3]" id="whyus-panel">
          <WhyUsSection />
        </HomeSectionPanel>

        {/* SECTION 5: EFFORTLESS PROCESS / HOW RENTING WORKS PANEL (z-50) */}
        <HomeSectionPanel zIndex={50} bg="bg-white" id="howitworks-panel">
          <HowItWorksSection />
        </HomeSectionPanel>

        {/* SECTION 6: CLIENT REVIEWS & TESTIMONIALS PANEL (z-60) */}
        <HomeSectionPanel zIndex={60} bg="bg-[#F5F5F3]" id="testimonials-panel">
          <TestimonialsSection testimonials={testimonials} />
        </HomeSectionPanel>

        {/* SECTION 7: FREQUENTLY ASKED QUESTIONS PANEL (z-70) */}
        <HomeSectionPanel zIndex={70} bg="bg-white" id="faq-panel">
          <FaqSection />
        </HomeSectionPanel>
      </div>

      {/* Quote Booking Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        car={selectedCarForQuote}
      />
    </>
  );
}
