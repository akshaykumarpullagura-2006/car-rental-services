'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-white">Terms of Service & Rental Policy</h1>
          <p className="text-xs text-gold-400 mt-2 font-mono">Last Updated: August 2026</p>
        </div>

        <GlassCard goldBorder className="p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Reservation & Quote Terms</h2>
            <p>
              Quotes generated on this platform represent non-binding estimates based on current fleet availability. Reservations are finalized exclusively after confirmation by a Hail Mary account manager and execution of the physical rental agreement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Security Deposits & Vehicle Usage</h2>
            <p>
              A refundable security deposit hold is authorized on a credit card prior to key handoff. Vehicles must be operated in accordance with state traffic laws. Racetrack usage, burnouts, and unpaved off-road driving are strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Cancellation & Refund Policy</h2>
            <p>
              Cancellations made 72 hours prior to scheduled delivery receive a 100% refund of any pre-collected deposit funds. Cancellations within 24 hours of delivery are subject to a 1-day rental rate fee.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Chauffeur & Doorstep Delivery Policy</h2>
            <p>
              Doorstep handoffs to airports or hotels require the driver of record to present physical identification and active insurance documentation in person.
            </p>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
