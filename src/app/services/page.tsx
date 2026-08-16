'use client';

import React, { useState } from 'react';
import { QuoteModal } from '@/components/public/QuoteModal';
import { ShieldCheck, UserCheck, Plane, Building2, Sparkles, MessageSquare, Key } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function ServicesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const services = [
    {
      icon: <UserCheck className="w-6 h-6 text-[#111111]" />,
      title: 'Executive Chauffeur Service',
      description: 'Discreet, background-checked professional chauffeurs available for corporate summits, VIP events, weddings, and high-profile private transportation.',
    },
    {
      icon: <Plane className="w-6 h-6 text-[#111111]" />,
      title: 'VIP Airport Handoff',
      description: 'Your requested vehicle is detailed and ready waiting at private aviation FBOs or commercial airport terminals.',
    },
    {
      icon: <Building2 className="w-6 h-6 text-[#111111]" />,
      title: 'Corporate Fleet Accounts',
      description: 'Tailored monthly and seasonal vehicle packages for visiting executives, entertainment productions, and corporate retreats.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#111111]" />,
      title: 'Event & Film Rentals',
      description: 'Camera-ready supercars and ultra-luxury SUVs delivered on set with dedicated ground handlers.',
    },
    {
      icon: <Key className="w-6 h-6 text-[#111111]" />,
      title: 'Long-Term Luxury Leases',
      description: 'Flexible multi-month rentals with zero long-term commitments, full coverage, and vehicle swap privileges.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#111111]" />,
      title: 'Armored Transport',
      description: 'Bullet-resistant armored SUV options paired with executive close protection detail upon request.',
    },
  ];

  const whatsappUrl = getWhatsAppLink({
    customMessage: 'Hello Hail Mary Concierge, I would like to inquire about bespoke VIP services.'
  });

  return (
    <div className="pt-28 pb-20 bg-[#F5F5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>BESPOKE OFFERINGS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight uppercase">
            Luxury Concierge Services
          </h1>
          <p className="text-[#666666] text-xs sm:text-sm mt-3 leading-relaxed">
            Beyond car rentals — we craft automotive experiences tailored to executives, production studios, and VIPs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-3 shadow-xs hover:border-[#111111] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="text-lg font-bold text-[#111111]">{s.title}</h3>
              <p className="text-[#666666] text-xs leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#E5E5E5] shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">Require a Custom Proposal?</h2>
            <p className="text-[#666666] text-xs sm:text-sm leading-relaxed">
              Our 24/7 Concierge Desk handles unique travel logistics, security escorts, and fleet reservations with complete confidentiality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setQuoteOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold shadow-xs"
              >
                Request Custom Proposal
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="w-full px-6 py-3 rounded-full bg-[#F0F0EE] hover:bg-[#EAEAE7] border border-[#E5E5E5] text-[#111111] text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Concierge
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
