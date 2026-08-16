'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function CookiePolicyPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-white">Cookie Policy</h1>
          <p className="text-xs text-gold-400 mt-2 font-mono">Last Updated: August 2026</p>
        </div>

        <GlassCard goldBorder className="p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Use of Essential Cookies</h2>
            <p>
              Hail Mary Rental Services utilizes essential session cookies solely for website navigation, user preference persistence (such as vehicle comparison lists), and secure admin authentication.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Third-Party Analytics</h2>
            <p>
              We may utilize privacy-first aggregated web analytics to optimize site loading speeds and 3D vehicle canvas performance. We do not sell or track personal browsing habits across external websites.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Managing Cookie Preferences</h2>
            <p>
              Visitors may disable or clear cookies through their internet browser settings at any time without restricting core showroom browsing functionality.
            </p>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
