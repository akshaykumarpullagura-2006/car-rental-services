'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Users, CheckCircle2, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const [cmsData, setCmsData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data) setCmsData(data);
      })
      .catch(() => null);
  }, []);

  return (
    <div className="pt-28 pb-20 bg-[#F5F5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>{cmsData.about_badge || 'OUR HERITAGE'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight uppercase">
            {cmsData.about_title || 'Redefining Luxury Vehicles'}
          </h1>
          <p className="text-[#666666] text-xs sm:text-sm mt-3 leading-relaxed">
            {cmsData.about_subheading || 'Hail Mary Rental Services delivers world-class automotive excellence with zero administrative friction.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              {cmsData.about_heading_detail || 'Uncompromising Standards & Discretion'}
            </h2>
            <p className="text-[#666666] text-xs sm:text-sm leading-relaxed">
              {cmsData.about_paragraph_1 || 'We own and curate an elite fleet of exotic supercars, hyper-SUVs, and ultra-luxury limousines. Every car undergoes multi-point mechanical inspections and high-grade aesthetic detailing prior to every client handoff.'}
            </p>
            <p className="text-[#666666] text-xs sm:text-sm leading-relaxed">
              {cmsData.about_paragraph_2 || 'Whether you require a Rolls-Royce Cullinan for a wedding weekend, a Lamborghini Urus for coastal touring, or a fleet of G-Wagons, our concierge manages every detail with complete discretion.'}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-[#111111]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>100% Owned Fleet</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Doorstep VIP Handoff</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>24/7 Concierge Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Comprehensive Insurance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E5E5E5] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop"
                alt="Hail Mary Showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                <p className="text-white text-xs font-semibold tracking-wider uppercase">
                  Private Showroom & Executive Headquarters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center shadow-xs space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#111111] mx-auto" />
            <h3 className="text-base font-bold text-[#111111]">Pristine Maintenance</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Factory service records, pristine detailing, and multi-point safety checks.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center shadow-xs space-y-2">
            <Award className="w-8 h-8 text-[#111111] mx-auto" />
            <h3 className="text-base font-bold text-[#111111]">VIP Reputation</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Trusted by executives, touring artists, and corporate family offices worldwide.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center shadow-xs space-y-2">
            <Users className="w-8 h-8 text-[#111111] mx-auto" />
            <h3 className="text-base font-bold text-[#111111]">Dedicated Handlers</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Personalized vehicle walkthroughs and 24/7 roadside VIP support included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
