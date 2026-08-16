'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldAlert, Car, ArrowRight } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Fleet', href: '/fleet' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
  ];

  const whatsappUrl = getWhatsAppLink({
    customMessage: 'Hello Hail Mary Concierge, I would like to make a rental enquiry.'
  });

  const [quoteHover, setQuoteHover] = useState(false);
  const isHome = pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] py-3.5 shadow-md text-[#111111]'
          : isHome
          ? 'bg-black/30 backdrop-blur-md border-b border-white/10 py-4 text-white'
          : 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]/60 py-4 text-[#111111]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-white text-[#111111] flex items-center justify-center font-bold group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <Car className="w-4 h-4 text-[#111111]" />
            </div>
            <div>
              <span className={`text-lg font-bold tracking-tight group-hover:opacity-80 transition-opacity ${!scrolled && isHome ? 'text-white' : 'text-[#111111]'}`}>
                HAIL MARY
              </span>
              <span className={`block text-[8px] tracking-[0.2em] font-semibold uppercase -mt-1 ${!scrolled && isHome ? 'text-gray-200' : 'text-[#666666]'}`}>
                RENTAL SERVICES
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items - Glassmorphism Container */}
          <nav className={`hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full backdrop-blur-xl border transition-all ${
            !scrolled && isHome
              ? 'bg-white/10 border-white/20 shadow-xl text-white'
              : 'bg-[#F0F0EE] border-[#E5E5E5] text-[#111111]'
          }`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#111111] shadow-sm font-bold'
                      : !scrolled && isHome
                      ? 'text-white/80 hover:text-white hover:bg-white/15'
                      : 'text-[#555555] hover:text-[#111111] hover:bg-white/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setQuoteHover(true)}
              onMouseLeave={() => setQuoteHover(false)}
              className={`inline-flex items-center gap-3 text-xs font-semibold pl-5 pr-1.5 py-1.5 rounded-full transition-all duration-300 shadow-md group border ${
                quoteHover
                  ? 'bg-black text-white border-white/20 shadow-xl'
                  : !scrolled && isHome
                  ? 'bg-white text-[#111111] border-transparent hover:bg-black hover:text-white'
                  : 'bg-[#111111] text-white border-transparent hover:bg-black'
              }`}
            >
              <span className="grid grid-cols-1 grid-rows-1 items-center justify-items-center">
                <span className={`col-start-1 row-start-1 transition-opacity duration-300 ${quoteHover ? 'opacity-0' : 'opacity-100'}`}>
                  Request Quote
                </span>
                <span className={`col-start-1 row-start-1 transition-opacity duration-300 ${quoteHover ? 'opacity-100' : 'opacity-0'}`}>
                  Let's Talk
                </span>
              </span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center group-hover:scale-105 transition-colors duration-300 ${
                quoteHover
                  ? 'bg-white text-black'
                  : !scrolled && isHome
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111]'
              }`}>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
