'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, MessageSquare, Key, Sparkles, MapPin } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const [cmsText, setCmsText] = useState({
    why_us_doorstep: 'Your chosen supercar or luxury SUV is detailed, sanitized, and delivered straight to your airport terminal, private FBO, or residence.',
    why_us_chauffeur: 'Prefer to be driven? Our licensed executive chauffeurs provide discreet, professional transport for gala events and corporate travel.',
  });

  useEffect(() => {
    fetch('/api/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCmsText({
            why_us_doorstep: data.why_us_doorstep || cmsText.why_us_doorstep,
            why_us_chauffeur: data.why_us_chauffeur || cmsText.why_us_chauffeur,
          });
        }
      })
      .catch(() => null);
  }, []);

  const pillars = [
    {
      icon: <MapPin className="w-5 h-5 text-[#111111]" />,
      title: 'Doorstep VIP Delivery',
      description: cmsText.why_us_doorstep,
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#111111]" />,
      title: 'Executive Chauffeur Option',
      description: cmsText.why_us_chauffeur,
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
      title: 'Instant WhatsApp Booking',
      description: 'Speak directly with a live luxury fleet concierge via WhatsApp for customized terms and immediate booking confirmation.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#111111]" />,
      title: 'Transparent Pricing Guarantee',
      description: 'Zero hidden surprise fees. Clear daily, weekly, and monthly rates with straightforward security deposit terms.',
    },
    {
      icon: <Key className="w-5 h-5 text-[#111111]" />,
      title: 'Flawless Fleet Condition',
      description: 'Every vehicle in our collection is late-model, low-mileage, and maintained to factory performance standards.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#111111]" />,
      title: 'Bespoke Concierge Customization',
      description: 'Special requests welcomed — custom interior fragrance, airport pickup, and event security arrangements.',
    },
  ];

  return (
    <section className="py-20 bg-[#F5F5F3] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>THE HAIL MARY DIFFERENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight uppercase">
            Why Discerning Clients Choose Hail Mary
          </h2>
          <p className="text-[#666666] text-sm sm:text-base mt-3 leading-relaxed">
            We operate as a luxury concierge service, catering to executives, VIPs, and automobile enthusiasts who demand perfection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-8 h-full shadow-xs hover:border-[#111111] transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
              <p className="text-[#666666] text-xs leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

