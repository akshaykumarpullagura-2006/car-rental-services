'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function CancellationPolicyPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-white">Cancellation Policy</h1>
          <p className="text-xs text-gold-400 mt-2 font-mono">Last Updated: August 2026</p>
        </div>

        <GlassCard goldBorder className="p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Standard Reservation Cancellation</h2>
            <p>
              Clients may cancel confirmed vehicle reservations up to 72 hours prior to scheduled delivery with zero cancellation fee. Requests submitted within 24–72 hours incur a 1-day rental rate administrative fee.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Flight & Flight Delays Policy</h2>
            <p>
              For airport terminal or private FBO deliveries, Hail Mary tracks inbound flight numbers. If your flight is delayed or rerouted, your reservation and handoff time are automatically adjusted at no extra charge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Weather & Emergency Cancellations</h2>
            <p>
              In the event of extreme weather warnings or flight groundings, reservation dates can be rescheduled or converted to full account credits without penalty.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. How to Submit a Cancellation</h2>
            <p>
              To cancel or modify your reservation, notify your dedicated account manager via WhatsApp or email <span className="text-gold-300 font-semibold">concierge@hailmaryrentals.com</span>.
            </p>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
