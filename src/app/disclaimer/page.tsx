'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function DisclaimerPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-white">Disclaimer</h1>
          <p className="text-xs text-gold-400 mt-2 font-mono">Last Updated: August 2026</p>
        </div>

        <GlassCard goldBorder className="p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Marketing & Lead Generation Platform Notice</h2>
            <p>
              This website serves exclusively as a digital showroom, marketing showcase, and lead generation catalog for Hail Mary Rental Services. This site is NOT an automated self-booking or ride-hailing engine. All reservations, contract terms, identity verification, and payment processing are finalized directly via phone, in-person concierge, or official WhatsApp communications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Vehicle Availability & Pricing</h2>
            <p>
              Daily rates, specifications, and availability badges displayed on this platform are updated regularly but remain subject to final verification by an account manager based on seasonal demand, insurance underwriting, and delivery location.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Intellectual Property</h2>
            <p>
              Trademarks, brand logos, and model names (including Rolls-Royce, Lamborghini, Ferrari, Mercedes-Benz, Porsche, Bentley) belong to their respective corporate owners and are used strictly for vehicle identification purposes.
            </p>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
