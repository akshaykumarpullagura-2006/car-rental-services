'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What are the age and driver license requirements?',
      answer: 'Drivers must be at least 21 years of age. A valid driver’s license or an International Driver’s Permit paired with a passport is required.',
    },
    {
      question: 'How does the security deposit work and when is it refunded?',
      answer: 'A refundable security deposit ranging from ₹5,000 to ₹3,00,000 (depending on vehicle tier) is authorized prior to key handoff. Upon returning the vehicle in pristine condition, the hold is released immediately.',
    },
    {
      question: 'How do I complete a reservation after receiving a quote?',
      answer: 'Because Hail Mary operates as an exclusive concierge service, all bookings are finalized via phone or WhatsApp with your dedicated account manager. This guarantees personal vehicle delivery, custom dates, and zero automated booking conflicts.',
    },
    {
      question: 'What insurance coverage is required?',
      answer: 'Clients must maintain an active driver license and basic insurance policy. Our concierge will walk you through vehicle-specific coverage terms.',
    },
    {
      question: 'Do you deliver cars directly to airports and hotels?',
      answer: 'Yes! Doorstep delivery to private jet terminals, luxury hotels, or private residences in Mumbai is included with your VIP reservation.',
    },
    {
      question: 'What is the daily mileage limit?',
      answer: 'Standard rentals include complimentary mileage per day. Additional mileage packages can be pre-purchased during your WhatsApp reservation.',
    },
  ];

  const whatsappUrl = getWhatsAppLink({
    customMessage: 'Hello Hail Mary Concierge, I have a question regarding rental requirements.'
  });

  return (
    <div className="pt-28 pb-20 bg-[#F5F5F3] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>NEED ASSISTANCE?</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight uppercase">
            Frequently Asked Questions
          </h1>
          <p className="text-[#666666] text-xs sm:text-sm mt-3">
            Everything you need to know about our luxury rental policies, insurance, and doorstep delivery.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-6 cursor-pointer transition-all shadow-xs"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#111111] flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#111111] shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-[#111111] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {isOpen && (
                  <p className="text-[#666666] text-xs sm:text-sm mt-3 pt-3 border-t border-[#E5E5E5] leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center bg-white rounded-3xl p-8 border border-[#E5E5E5] shadow-xs space-y-2">
          <h3 className="text-lg font-bold text-[#111111]">Have a Specific Question?</h3>
          <p className="text-xs text-[#666666]">Our concierge desk is available 24 hours a day.</p>
          <div className="pt-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <button className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors">
                <MessageSquare className="w-4 h-4" /> Ask Concierge on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

