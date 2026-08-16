'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Wrench, Headphones } from 'lucide-react';

export const WhyOurFleetSection: React.FC = () => {
  const pillars = [
    {
      icon: <Wrench className="w-5 h-5 text-[#111111]" />,
      title: 'Regularly Serviced',
      description: 'Certified technicians conduct multi-point mechanical inspections before every handoff.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#111111]" />,
      title: 'Fully Sanitized',
      description: 'Deep steam cleaning, interior detailing, and sterile preparation prior to delivery.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#111111]" />,
      title: 'Insurance Covered',
      description: 'Comprehensive physical damage and liability protection for complete peace of mind.',
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#111111]" />,
      title: 'Premium Support',
      description: 'Direct access to your dedicated 24/7 VIP concierge and roadside assistance.',
    },
  ];

  return (
    <section className="py-16 relative z-10 bg-[#F5F5F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>STANDARDS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#111111] tracking-tight uppercase">
            Why Our Fleet Sets The Benchmark
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center shadow-xs hover:border-[#111111] transition-all">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                {p.icon}
              </div>
              <h3 className="text-base font-bold text-[#111111] mb-1.5">{p.title}</h3>
              <p className="text-xs text-[#666666] leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

