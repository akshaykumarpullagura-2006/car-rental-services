'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Car, HelpCircle, Menu, X, ArrowRight, MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const MobileBottomNav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleHomeClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const whatsappUrl = getWhatsAppLink({
    customMessage: 'Hello Hail Mary Concierge, I would like to make a VIP rental inquiry.'
  });

  // Menu items specified by user screenshot
  const menuLinks = [
    { name: 'Home', href: '/' },
    { name: 'Fleet', href: '/fleet' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
  ];

  return (
    <>
      {/* FIXED PREMIUM MOBILE BOTTOM NAVIGATION BAR (Mobile Only: max-width 767px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] select-none">
        
        {/* Navigation Bar Container */}
        <div className="bg-[#F4F3EF] border-t border-[#E5E5E5] text-[#111111] shadow-[0_-4px_25px_rgba(0,0,0,0.12)] relative">
          
          <div className="max-w-md mx-auto grid grid-cols-5 items-end h-[74px] px-2 relative pb-2">
            
            {/* 1. SERVICES */}
            <Link
              href="/services"
              className={`flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
                pathname === '/services' ? 'text-[#111111] font-bold' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-[9px] uppercase font-bold tracking-wider">SERVICES</span>
            </Link>

            {/* 2. FLEET */}
            <Link
              href="/fleet"
              className={`flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
                pathname === '/fleet' ? 'text-[#111111] font-bold' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Car className="w-5 h-5" />
              <span className="text-[9px] uppercase font-bold tracking-wider">FLEET</span>
            </Link>

            {/* 3. HOME (CENTER ELEVATED HAIL MARY LOGO BUTTON) */}
            <div className="flex flex-col items-center justify-center relative -top-3">
              <button
                onClick={handleHomeClick}
                aria-label="Hail Mary Home"
                className={`w-14 h-14 rounded-full bg-white border border-[#E5E5E5] text-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.18)] flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer ${
                  pathname === '/' ? 'ring-2 ring-[#111111] ring-offset-2' : ''
                }`}
              >
                {/* REAL HAIL MARY LOGO MARK (Vehicle Emblem) */}
                <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-inner">
                  <Car className="w-4 h-4 text-white" />
                </div>
              </button>
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#111111] mt-1">
                HOME
              </span>
            </div>

            {/* 4. FAQS */}
            <Link
              href="/faqs"
              className={`flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
                pathname === '/faqs' ? 'text-[#111111] font-bold' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-[9px] uppercase font-bold tracking-wider">FAQS</span>
            </Link>

            {/* 5. MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open Navigation Menu"
              className={`flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
                menuOpen ? 'text-[#111111] font-bold' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {menuOpen ? <X className="w-5 h-5 text-[#111111]" /> : <Menu className="w-5 h-5" />}
              <span className="text-[9px] uppercase font-bold tracking-wider">MENU</span>
            </button>

          </div>
        </div>
      </div>

      {/* COMPACT MENU BOTTOM SHEET */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            {/* Slide-Up Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="md:hidden fixed bottom-[74px] inset-x-0 z-40 bg-[#0B0B0B] text-white border-t border-white/10 rounded-t-3xl p-6 shadow-2xl space-y-4 max-w-lg mx-auto"
            >
              {/* Sheet Drag Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-2" />

              {/* Menu Panel Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-[#111111] flex items-center justify-center font-bold">
                    <Car className="w-4 h-4 text-[#111111]" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold uppercase tracking-tight text-white block">
                      HAIL MARY
                    </span>
                    <span className="block text-[8px] tracking-[0.2em] text-[#999999] font-semibold uppercase -mt-0.5">
                      RENTAL SERVICES
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Options matching exact user screenshot */}
              <div className="flex flex-col gap-2 pt-1">
                {menuLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`text-sm font-extrabold px-5 py-3.5 rounded-2xl transition-all flex items-center justify-between min-h-[48px] ${
                        isActive
                          ? 'bg-white text-[#111111] shadow-xl'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#111111] shrink-0" />}
                    </Link>
                  );
                })}
              </div>

              {/* Divider & Prominent Request a Quote CTA */}
              <div className="pt-3 border-t border-white/10">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-[#111111] hover:bg-gray-200 text-center py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 min-h-[50px] shadow-xl"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4 text-[#111111]" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
