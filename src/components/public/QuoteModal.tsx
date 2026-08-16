'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Car } from '@/types';
import { logWhatsAppLeadAndOpen } from '@/lib/whatsapp';
import { MessageSquare, Calendar, MapPin, User, Phone, Mail, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  car?: Car | null;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, car }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    startDate: '',
    endDate: '',
    location: 'Mumbai',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car?.id || null,
          carName: car?.name || 'General Fleet Request',
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          clientEmail: formData.clientEmail,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location,
          notes: formData.notes,
          source: 'booking-inquiry-form',
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    logWhatsAppLeadAndOpen(car?.name || 'Luxury Vehicle Fleet', formData.clientPhone);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={car ? `Request Quote — ${car.name}` : 'Request a Rental Quote'}
      subtitle="Submit your rental dates and details. Our concierge will review your request and contact you directly."
    >
      {success ? (
        <div className="text-center py-8 space-y-6 animate-in fade-in">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-[#111111]">Booking Request Received!</h4>
            <p className="text-[#666666] text-xs mt-2 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-[#111111] font-semibold">{formData.clientName}</span>. Your request has been sent to our concierge team. We will reach out to <span className="text-[#111111] font-medium">{formData.clientPhone}</span> shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#111111] text-white text-xs font-semibold inline-flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Express WhatsApp Concierge</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F5F5F3] text-[#111111] text-xs font-semibold border border-[#E5E5E5]"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {car && (
            <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-[#666666] uppercase tracking-wider font-bold">
                  Requested Vehicle
                </span>
                <h4 className="text-base font-bold text-[#111111]">{car.name}</h4>
                <p className="text-xs text-[#666666]">Rate: ₹{car.pricePerDay.toLocaleString('en-IN')} / day</p>
              </div>
              <span className="text-[10px] px-3 py-1 bg-white border border-[#E5E5E5] text-[#111111] rounded-full font-semibold">
                {car.category}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#111111]" /> Full Name *
              </label>
              <input
                type="text"
                name="clientName"
                required
                value={formData.clientName}
                onChange={handleChange}
                placeholder="e.g. Vikramaditya"
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#111111]" /> Mobile Number *
              </label>
              <input
                type="tel"
                name="clientPhone"
                required
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#111111]" /> Email (Optional)
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="client@domain.com"
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#111111]" /> Pickup Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mumbai, Delhi NCR, Bengaluru..."
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#111111]" /> Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#111111]" /> End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1">
              Special Notes / Requests
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Chauffeur option, wedding event, airport delivery..."
              className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] resize-none"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Request Form'}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F0F0EE] hover:bg-[#EAEAE7] text-[#111111] border border-[#E5E5E5] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

