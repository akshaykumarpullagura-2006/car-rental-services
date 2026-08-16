'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-gold-400 mt-2 font-mono">Last Updated: August 2026</p>
        </div>

        <GlassCard goldBorder className="p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Executive Confidentiality</h2>
            <p>
              HAIL MARY RENTAL SERVICES adheres to strict non-disclosure principles. Information submitted through quote forms, WhatsApp communications, or phone inquiries is utilized strictly for rental fulfillment and VIP client record keeping. We never monetize or sell client data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Information Collection</h2>
            <p>
              We collect contact information (full name, phone number, email address, rental dates, delivery locations) provided voluntarily during quote requests. For active rentals, identity verification documents (driver’s license, proof of insurance) are processed securely.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Data Security & Storage</h2>
            <p>
              All digital communications and database records are protected by industry-standard encryption protocols. High-profile clients and corporate entities can request complete record expungement upon conclusion of the rental contract.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Contacting Our Data Officer</h2>
            <p>
              For privacy requests or record modifications, contact <span className="text-gold-300 font-semibold">privacy@hailmaryrentals.com</span> or write to 9454 Wilshire Blvd, Beverly Hills, CA 90212.
            </p>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
