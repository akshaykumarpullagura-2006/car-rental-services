'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Clock, CheckCircle2, Instagram, Sparkles } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const [cmsInfo, setCmsInfo] = useState({
    address_line: 'Bandra Kurla Complex, Mumbai, MH 400051',
    direct_phone: '+91 98765 43210',
    contact_email: 'concierge@hailmaryrentals.com',
    instagram_url: 'https://instagram.com',
    business_hours: 'Showroom: 8:00 AM – 10:00 PM IST',
  });

  useEffect(() => {
    fetch('/api/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCmsInfo({
            address_line: data.address_line || cmsInfo.address_line,
            direct_phone: data.direct_phone || cmsInfo.direct_phone,
            contact_email: data.contact_email || cmsInfo.contact_email,
            instagram_url: data.instagram_url || cmsInfo.instagram_url,
            business_hours: data.business_hours || cmsInfo.business_hours,
          });
        }
      })
      .catch(() => null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name,
          clientPhone: formData.phone,
          clientEmail: formData.email,
          notes: `[Subject: ${formData.subject}] ${formData.message}`,
          source: 'contact-form',
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const whatsappUrl = getWhatsAppLink({
    customMessage: 'Hello Hail Mary Concierge, I am contacting you from your website contact page.'
  });

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cmsInfo.address_line)}`;
  const telUrl = `tel:${cmsInfo.direct_phone.replace(/[^0-9+]/g, '')}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cmsInfo.contact_email)}`;

  return (
    <div className="pt-28 pb-20 bg-[#F5F5F3] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>24/7 CONCIERGE DESK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight uppercase">
            Connect With Our Team
          </h1>
          <p className="text-[#666666] text-xs sm:text-sm mt-3 leading-relaxed">
            Have a custom fleet request, event inquiry, or airport delivery date? Reach out directly via form or WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 space-y-6 shadow-xs">
              <h3 className="text-lg font-bold text-[#111111]">Mumbai Showroom</h3>

              <div className="space-y-4 text-xs text-[#111111]">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-black transition-colors group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#111111] block">Flagship Address</span>
                    <p className="text-[#666666] group-hover:underline">{cmsInfo.address_line}</p>
                  </div>
                </a>

                <a
                  href={telUrl}
                  className="flex items-start gap-3 hover:text-black transition-colors group cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#111111] block">Direct VIP Phone Line</span>
                    <p className="text-[#666666] group-hover:underline font-mono">{cmsInfo.direct_phone}</p>
                  </div>
                </a>

                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-black transition-colors group cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#111111] block">Email Desk</span>
                    <p className="text-[#666666] group-hover:underline">{cmsInfo.contact_email}</p>
                  </div>
                </a>

                <a
                  href={cmsInfo.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-pink-600 transition-colors group cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#111111] block">Instagram</span>
                    <p className="text-[#666666] group-hover:underline">@hailmaryrentals</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 pt-1 border-t border-[#E5E5E5]">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#111111] block">Hours of Operation</span>
                    <p className="text-[#666666]">{cmsInfo.business_hours}</p>
                    <p className="text-emerald-700 text-[11px] font-semibold mt-0.5">24/7 WhatsApp Assistance Available</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex items-center gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                    <MessageSquare className="w-4 h-4" /> Start Direct WhatsApp Chat
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-[#111111]">Message Delivered</h3>
                  <p className="text-[#666666] text-xs max-w-sm mx-auto">
                    Thank you. Our concierge team has received your inquiry and will get in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-extrabold text-[#111111] mb-4">Send an Inquiry</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Vikramaditya"
                        className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram@domain.com"
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Fleet Availability">Fleet Availability</option>
                      <option value="Chauffeur Service">Chauffeur Service</option>
                      <option value="Corporate Account">Corporate / Production Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please let us know your requested dates, car models, and location..."
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold shadow-xs"
                  >
                    Send VIP Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

