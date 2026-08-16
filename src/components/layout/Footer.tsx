'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Phone, Mail, MapPin, MessageSquare, Clock, Instagram, ArrowUpRight } from 'lucide-react';
import { logWhatsAppLeadAndOpen } from '@/lib/whatsapp';
import { SocialRideTrack } from '@/components/layout/SocialRideTrack';

export const Footer: React.FC = () => {
  const [cmsInfo, setCmsInfo] = useState<Record<string, string>>({
    direct_phone: '+91 98765 43210',
    contact_email: 'concierge@hailmaryrentals.com',
    address_line: 'Bandra Kurla Complex, Mumbai, MH 400051',
  });

  useEffect(() => {
    fetch('/api/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCmsInfo(data);
        }
      })
      .catch(() => null);
  }, []);

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cmsInfo.address_line || 'Bandra Kurla Complex, Mumbai')}`;
  const telUrl = `tel:${(cmsInfo.direct_phone || '+919876543210').replace(/[^0-9+]/g, '')}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cmsInfo.contact_email || 'concierge@hailmaryrentals.com')}`;
  const instagramUrl = cmsInfo.instagram_url || 'https://instagram.com/hailmaryrentals';

  return (
    <footer className="bg-[#080808] text-white pt-16 pb-12 relative overflow-hidden border-t border-white/10">
      
      {/* 1. TOP FOOTER CONTENT — 4 Business Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          
          {/* Column 1 — Brand Identity & Mini Contact Buttons */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-white text-[#111111] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Car className="w-4 h-4 text-[#111111]" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white block">
                  HAIL MARY
                </span>
                <span className="block text-[8px] tracking-[0.2em] text-[#999999] font-semibold uppercase -mt-1">
                  RENTAL SERVICES
                </span>
              </div>
            </Link>
            <p className="text-[#888888] text-xs leading-relaxed max-w-sm">
              Premier luxury car rental platform. Delivering supercars, Maybachs, G-Wagons, and executive SUVs directly to your doorstep or airport terminal.
            </p>
            
            {/* Small Contact/Social Mini Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => logWhatsAppLeadAndOpen('Footer Concierge Link')}
                className="p-2.5 rounded-full bg-[#1A1A1A] text-white hover:bg-emerald-600 transition-colors border border-white/10"
                aria-label="WhatsApp Concierge"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <a
                href={telUrl}
                className="p-2.5 rounded-full bg-[#1A1A1A] text-white hover:bg-white hover:text-[#111111] transition-colors border border-white/10"
                aria-label="Direct Phone Line Dialpad"
                title="Call on Phone Dialpad"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#1A1A1A] text-white hover:bg-pink-600 transition-colors border border-white/10"
                aria-label="Instagram Page"
                title="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 — Fleet Catalog */}
          <div className="space-y-3.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              Fleet Catalog
            </h4>
            <ul className="space-y-2 text-xs text-[#888888]">
              <li>
                <Link href="/fleet?category=Ultra Luxury" className="hover:text-white transition-colors">
                  Ultra Luxury & Maybach
                </Link>
              </li>
              <li>
                <Link href="/fleet?category=Luxury" className="hover:text-white transition-colors">
                  Supercars & Sports
                </Link>
              </li>
              <li>
                <Link href="/fleet?category=Medium" className="hover:text-white transition-colors">
                  Luxury SUVs & G-Wagon
                </Link>
              </li>
              <li>
                <Link href="/fleet?category=Basic" className="hover:text-white transition-colors">
                  Executive Sedans
                </Link>
              </li>
              <li>
                <Link href="/fleet" className="hover:text-white transition-colors text-white font-medium inline-flex items-center gap-1">
                  <span>View All Fleet</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Company & Legal */}
          <div className="space-y-3.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#888888]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  VIP Concierge Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Sourcing Desk
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors">
                  Rental Requirements & FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Concierge Desk */}
          <div className="space-y-3.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              Concierge Desk
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-[#888888] hover:text-white transition-colors group"
                >
                  <MapPin className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{cmsInfo.address_line}</span>
                </a>
              </li>

              <li>
                <a
                  href={telUrl}
                  className="flex items-center gap-2.5 text-[#888888] hover:text-white transition-colors group"
                >
                  <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="font-mono">{cmsInfo.direct_phone}</span>
                </a>
              </li>

              <li>
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#888888] hover:text-white transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>{cmsInfo.contact_email}</span>
                </a>
              </li>

              <li className="flex items-center gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-medium">24/7 WhatsApp Assistance</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* TOP DIVIDER */}
      <div className="w-full border-t border-white/10" />

      {/* 2. SOCIAL MEDIA SECTION + TINY CAR ANIMATION (No "FOLLOW THE RIDE" heading!) */}
      <SocialRideTrack cmsData={cmsInfo} />

      {/* BOTTOM DIVIDER */}
      <div className="w-full border-t border-white/10" />

      {/* 3. BOTTOM FOOTER — Copyright & Legal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p>© {new Date().getFullYear()} HAIL MARY RENTAL SERVICES. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};
