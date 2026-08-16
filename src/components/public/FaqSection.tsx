'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

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

  // Luxury Automotive Easing Curve: cubic-bezier(0.22, 1, 0.36, 1)
  const premiumEase = [0.22, 1, 0.36, 1];

  return (
    <section className="py-20 bg-[#F6F6F4] border-t border-[#E5E5E5] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area with Sequential Scroll Reveal */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          
          {/* 1. FAQ Badge */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: premiumEase }}
            className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>NEED ASSISTANCE?</span>
          </motion.div>

          {/* 2. Main Heading */}
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: premiumEase }}
            className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight uppercase"
          >
            Frequently Asked Questions
          </motion.h2>

          {/* 3. Description */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: 0.2, ease: premiumEase }}
            className="text-[#666666] text-xs sm:text-sm leading-relaxed"
          >
            Everything you need to know about our luxury rental policies, insurance, and doorstep delivery.
          </motion.p>
        </div>

        {/* FAQ Accordion Cards List (Staggered Entrance) */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : 0.25 + idx * 0.07,
                  ease: premiumEase,
                }}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className={`group relative bg-white rounded-2xl border p-5 sm:p-6 cursor-pointer transition-all duration-250 select-none ${
                  isOpen
                    ? 'border-[#111111] shadow-md bg-white'
                    : 'border-[#E5E5E5] hover:border-[#888888] hover:shadow-sm'
                }`}
              >
                {/* Active Accent Border Line */}
                <div
                  className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300 ${
                    isOpen ? 'bg-[#111111] opacity-100' : 'bg-transparent opacity-0'
                  }`}
                />

                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xs sm:text-base font-bold text-[#111111] flex items-start gap-2.5 flex-1 pr-2">
                    <HelpCircle
                      className={`w-4 h-4 shrink-0 mt-0.5 transition-all duration-300 ${
                        isOpen ? 'text-[#111111] scale-110' : 'text-[#888888] group-hover:text-[#111111]'
                      }`}
                    />
                    <span className="leading-snug transition-transform duration-200 group-hover:translate-x-0.5">
                      {faq.question}
                    </span>
                  </h3>

                  {/* Smooth Rotating Chevron Arrow (0deg -> 180deg) */}
                  <div className="p-1 rounded-full bg-[#F6F6F4] group-hover:bg-[#EAEAEA] transition-colors shrink-0">
                    <ChevronDown
                      className={`w-4 h-4 text-[#111111] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Animated Accordion Answer (height 0 -> auto & opacity 0 -> 1) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: premiumEase },
                          opacity: { duration: 0.25, delay: 0.08, ease: 'easeOut' },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.25, ease: premiumEase },
                          opacity: { duration: 0.15, ease: 'easeIn' },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="text-[#666666] text-xs sm:text-sm mt-3.5 pt-3.5 border-t border-[#E5E5E5] leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Concierge CTA Box */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.6, ease: premiumEase }}
          className="mt-12 text-center bg-white rounded-3xl p-8 border border-[#E5E5E5] shadow-xs space-y-2"
        >
          <h3 className="text-lg font-bold text-[#111111]">Have a Specific Question?</h3>
          <p className="text-xs text-[#666666]">Our concierge desk is available 24 hours a day.</p>
          <div className="pt-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <button className="px-6 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold inline-flex items-center gap-2 transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-102">
                <MessageSquare className="w-4 h-4" /> Ask Concierge on WhatsApp
              </button>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
