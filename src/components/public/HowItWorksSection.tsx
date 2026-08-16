'use client';

import React from 'react';
import { Car, MessageSquare, Key, Sparkles } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <Car className="w-5 h-5 text-[#111111]" />,
      title: 'Select Your Vehicle',
      description: 'Browse our curated fleet of supercars, Maybachs, G-Wagons, and luxury SUVs.',
    },
    {
      step: '02',
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
      title: 'Request Custom Quote',
      description: 'Submit your dates online or connect instantly with our live WhatsApp concierge.',
    },
    {
      step: '03',
      icon: <Key className="w-5 h-5 text-[#111111]" />,
      title: 'VIP Handoff & Drive',
      description: 'Receive your detailed vehicle at your door or airport terminal and enjoy the journey.',
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-[#E5E5E5] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>EFFORTLESS PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight uppercase">
            How Renting With Us Works
          </h2>
          <p className="text-[#666666] text-sm mt-3">
            Three simple steps to secure your dream vehicle in under 10 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F5F5F3] rounded-2xl border border-[#E5E5E5] p-8 relative group h-full shadow-xs hover:border-[#111111] transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-3xl font-extrabold text-[#D1D1CD] font-mono group-hover:text-[#111111] transition-colors">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
              <p className="text-[#666666] text-xs leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
