'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = getWhatsAppLink({
    customMessage: 'Hello Hail Mary Concierge, I am looking for a VIP luxury rental inquiry.'
  });

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group border border-emerald-400/40 shadow-emerald-500/30"
      aria-label="Contact Concierge on WhatsApp"
      title="Chat with VIP WhatsApp Concierge"
    >
      <div className="relative flex items-center justify-center">
        <MessageSquare className="w-6 h-6 fill-current" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-ping" />
      </div>
    </a>
  );
};
