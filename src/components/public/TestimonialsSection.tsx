'use client';

import React, { useState, useEffect } from 'react';
import { Testimonial } from '@/types';
import { Star, Quote, Plus, CheckCircle2, MessageSquare, X, Maximize2, ShieldCheck, Phone, Sparkles } from 'lucide-react';
import { logWhatsAppLeadAndOpen } from '@/lib/whatsapp';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Testimonial | null>(null);

  // Form states
  const [author, setAuthor] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (isModalOpen || selectedReview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, selectedReview]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content || !phone) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author,
          phone,
          rating,
          content,
          featured: true,
          status: 'PENDING',
        }),
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsModalOpen(false);
        setAuthor('');
        setPhone('');
        setContent('');
        setRating(5);
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayList = testimonials.length > 0 ? testimonials : [];
  const marqueeItems = [...displayList, ...displayList, ...displayList];

  return (
    <section className="py-20 bg-[#F5F5F3] border-t border-[#E5E5E5] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-white border border-[#E5E5E5] shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
              <span>TESTIMONIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight uppercase">
              Trusted By Clients Nationwide
            </h2>
            <p className="text-[#666666] text-sm mt-2 leading-relaxed">
              Read authentic reviews from clients who experience our concierge standards. Click any card to expand details.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white text-xs font-semibold px-5 py-3 rounded-full transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Marquee Loop */}
      <div className="relative w-full overflow-hidden py-4">
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#F5F5F3] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#F5F5F3] to-transparent z-20 pointer-events-none" />

        {marqueeItems.length > 0 ? (
          <div className="animate-marquee flex gap-6 px-4">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => setSelectedReview(item)}
                className="w-[320px] sm:w-[360px] shrink-0 bg-white rounded-2xl border border-[#E5E5E5] p-6 flex flex-col justify-between cursor-pointer group transition-all duration-300 hover:border-[#111111] hover:shadow-md relative"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-[#111111]" />
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? 'text-[#111111] fill-[#111111]'
                            : 'text-[#E5E5E5]'
                        }`}
                      />
                    ))}
                  </div>

                  <Quote className="w-6 h-6 text-[#E5E5E5] mb-2" />

                  <p className="text-[#333333] text-xs leading-relaxed italic line-clamp-4">
                    "{item.content}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111111] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {item.author.charAt(0)}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#111111] group-hover:text-black transition-colors">{item.author}</h4>
                      <p className="text-[10px] text-[#666666] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#111111]" />
                        <span>{item.phone || 'Verified Client'}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold">
                    Expand →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#666666] text-xs">
            No client reviews available yet.
          </div>
        )}
      </div>

      {/* Expanded Review Modal */}
      {selectedReview && (
        <div
          onClick={() => setSelectedReview(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E5E5] p-8 space-y-6 relative shadow-xl my-auto animate-in zoom-in-95"
          >
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#F5F5F3] text-[#111111] hover:bg-[#EAEAE7] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] text-[#111111]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" /> VERIFIED CONCIERGE EXPERIENCE
            </div>

            <div className="flex items-center gap-1 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < selectedReview.rating
                      ? 'text-[#111111] fill-[#111111]'
                      : 'text-[#E5E5E5]'
                  }`}
                />
              ))}
            </div>

            <p className="text-[#111111] text-base leading-relaxed italic">
              "{selectedReview.content}"
            </p>

            <div className="pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111111] text-white font-bold text-base flex items-center justify-center shrink-0">
                  {selectedReview.author.charAt(0)}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#111111]">{selectedReview.author}</h4>
                  <p className="text-xs text-[#666666] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#111111]" />
                    <span>{selectedReview.phone || 'Verified Client'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-full bg-[#F5F5F3] hover:bg-[#EAEAE7] text-xs font-semibold text-[#111111] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    logWhatsAppLeadAndOpen('VIP Concierge Service Inquiry');
                  }}
                  className="px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Book Experience</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Review Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 space-y-6 relative shadow-xl my-auto animate-in zoom-in-95"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#F5F5F3] text-[#111111] hover:bg-[#EAEAE7] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center text-[#111111]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#111111]">Submit Your Review</h3>
                <p className="text-xs text-[#666666]">
                  Share your Hail Mary rental experience with prospective clients.
                </p>
              </div>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Submitted Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you! Your review has been submitted for admin verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                    Rating ({rating} Stars)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        type="button"
                        key={starVal}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starVal)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            starVal <= (hoverRating || rating)
                              ? 'text-[#111111] fill-[#111111]'
                              : 'text-[#E5E5E5]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Vikramaditya"
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe your vehicle condition and concierge service experience..."
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111] resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-[#F5F5F3] text-[#111111] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

