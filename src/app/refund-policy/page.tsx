'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function RefundPolicyPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-white">Refund Policy</h1>
          <p className="text-xs text-gold-400 mt-2 font-mono">Last Updated: August 2026</p>
        </div>

        <GlassCard goldBorder className="p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Security Deposit Refunds</h2>
            <p>
              Security deposits authorized on credit cards or transferred via wire are processed for release immediately upon return of the vehicle, subject to a final physical and mechanical inspection. Return funds reflect on your issuing bank statement within 3–5 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Rental Pre-Payment Refunds</h2>
            <p>
              Pre-paid daily rates are eligible for a 100% refund if cancellation is requested at least 72 hours prior to the scheduled delivery time. Cancellations between 24 and 72 hours receive a 50% refund or full credit towards a future reservation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Early Vehicle Returns</h2>
            <p>
              If a vehicle is returned prior to the scheduled contract end date, unused rental days will be credited as non-expiring VIP fleet credits for future hires. Cash refunds are not issued for unutilized days once a vehicle is in customer possession.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Concierge Refund Inquiries</h2>
            <p>
              For refund status or account reconciliation, contact our billing desk at <span className="text-gold-300 font-semibold">billing@hailmaryrentals.com</span>.
            </p>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
