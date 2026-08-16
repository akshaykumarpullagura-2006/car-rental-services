'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Testimonial } from '@/types';
import { FileEdit, Save, Plus, Trash2, CheckCircle2, XCircle, Star, ShieldAlert, Check, Ban, MapPin } from 'lucide-react';

export default function AdminCMSPage() {
  const [cmsMap, setCmsMap] = useState<Record<string, string>>({
    hero_headline: 'Unrivaled Luxury. Exotic Performance.',
    hero_subheading: 'Drive Rolls-Royce, Lamborghini, Ferrari, and Maybach with bespoke concierge delivery.',
    stat_cars: '50+',
    stat_satisfaction: '99.8%',
    stat_handoff: '30 Min',
    stat_hidden_fees: '₹0',
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [carsList, setCarsList] = useState<any[]>([]);
  const [savingCms, setSavingCms] = useState(false);
  const [cmsSaved, setCmsSaved] = useState(false);

  // New testimonial form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const fetchCMS = () => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('hailmary_cms');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && Object.keys(parsed).length > 0) {
            setCmsMap(parsed);
          }
        } catch (e) {}
      }
    }

    fetch('/api/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setCmsMap((prev) => {
            const merged = { ...prev, ...data };
            if (typeof window !== 'undefined') {
              localStorage.setItem('hailmary_cms', JSON.stringify(merged));
            }
            return merged;
          });
        }
      })
      .catch(() => null);

    fetch('/api/fleet')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCarsList(data);
      })
      .catch(() => null);

    fetch('/api/testimonials?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(() => null);
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  const persistCMS = async (updatedMap?: Record<string, string>) => {
    const targetMap = updatedMap || cmsMap;
    setSavingCms(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('hailmary_cms', JSON.stringify(targetMap));
    }

    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetMap),
      });
      const data = await res.json();
      if (data && data.cms) {
        setCmsMap(data.cms);
        if (typeof window !== 'undefined') {
          localStorage.setItem('hailmary_cms', JSON.stringify(data.cms));
        }
      }
      setCmsSaved(true);
      setTimeout(() => setCmsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCms(false);
    }
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistCMS();
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newContent) return;

    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: newAuthor,
        phone: newPhone || '+91 98765 43210',
        rating: newRating,
        content: newContent,
        featured: true,
        fromAdmin: true,
      }),
    });

    const created = await res.json();
    setTestimonials([created, ...testimonials]);
    setNewAuthor('');
    setNewPhone('');
    setNewContent('');
    setNewRating(5);
  };

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'DENIED') => {
    await fetch('/api/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });

    setTestimonials(
      testimonials.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const handleDeleteTestimonial = async (id: string) => {
    await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="CMS & Review Moderation"
          subtitle="Update site content, stats, contact info, and moderate client reviews"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          {/* Section 1: Homepage Text Overrides */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 lg:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-[#111111]" />
                <span>Homepage Text & Statistics</span>
              </h3>

              {cmsSaved && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Live Content Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveCMS} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Hero Headline</label>
                <input
                  type="text"
                  value={cmsMap.hero_headline || ''}
                  onChange={(e) => setCmsMap({ ...cmsMap, hero_headline: e.target.value })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Hero Subheading</label>
                <textarea
                  rows={2}
                  value={cmsMap.hero_subheading || ''}
                  onChange={(e) => setCmsMap({ ...cmsMap, hero_subheading: e.target.value })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* 4 Category Background Image Controls */}
              <div className="p-5 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-2 gap-1">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <span>🖼 Showroom Category Hero Images (4 Categories)</span>
                  </h4>
                  <span className="text-[10px] text-[#666666] font-medium">
                    Updates ONLY the selected category background across all mobile & desktop views
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Ultra Luxury Category (Supercar / Cullinan) */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#E5E5E5] space-y-2">
                    <label className="block text-xs font-bold text-[#111111] flex items-center justify-between">
                      <span>🏎 1. Ultra Luxury (Supercar) Image</span>
                      <span className="text-[10px] text-[#666666] font-normal">Category 1</span>
                    </label>
                    <input
                      type="text"
                      value={cmsMap.hero_image_ultraluxury || ''}
                      onChange={(e) => setCmsMap({ ...cmsMap, hero_image_ultraluxury: e.target.value })}
                      onBlur={() => persistCMS()}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                    />
                    {cmsMap.hero_image_ultraluxury && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F5F5F3]">
                        <img
                          src={cmsMap.hero_image_ultraluxury}
                          alt="Ultra Luxury Preview"
                          className="w-full h-full object-cover object-center"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const val = 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1600&auto=format&fit=crop';
                          const updated = { ...cmsMap, hero_image_ultraluxury: val };
                          setCmsMap(updated);
                          persistCMS(updated);
                        }}
                        className="text-[10px] text-[#111111] hover:underline font-semibold"
                      >
                        Default Rolls-Royce
                      </button>
                    </div>
                  </div>

                  {/* 2. Luxury Category (Fortuner) */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#E5E5E5] space-y-2">
                    <label className="block text-xs font-bold text-[#111111] flex items-center justify-between">
                      <span>🚘 2. Luxury (Fortuner) Image</span>
                      <span className="text-[10px] text-[#666666] font-normal">Category 2</span>
                    </label>
                    <input
                      type="text"
                      value={cmsMap.hero_image_luxury || ''}
                      onChange={(e) => setCmsMap({ ...cmsMap, hero_image_luxury: e.target.value })}
                      onBlur={() => persistCMS()}
                      placeholder="/images/fortuner-3d.png"
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                    />
                    {cmsMap.hero_image_luxury && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F5F5F3]">
                        <img
                          src={cmsMap.hero_image_luxury}
                          alt="Luxury Preview"
                          className="w-full h-full object-cover object-center"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const val = '/images/fortuner-3d.png';
                          const updated = { ...cmsMap, hero_image_luxury: val };
                          setCmsMap(updated);
                          persistCMS(updated);
                        }}
                        className="text-[10px] text-[#111111] hover:underline font-semibold"
                      >
                        Default Fortuner
                      </button>
                    </div>
                  </div>

                  {/* 3. Medium Category (Thar 4x4) */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#E5E5E5] space-y-2">
                    <label className="block text-xs font-bold text-[#111111] flex items-center justify-between">
                      <span>🚙 3. Medium (Thar 4x4) Image</span>
                      <span className="text-[10px] text-[#666666] font-normal">Category 3</span>
                    </label>
                    <input
                      type="text"
                      value={cmsMap.hero_image_medium || ''}
                      onChange={(e) => setCmsMap({ ...cmsMap, hero_image_medium: e.target.value })}
                      onBlur={() => persistCMS()}
                      placeholder="/images/thar-3d.jpg"
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                    />
                    {cmsMap.hero_image_medium && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F5F5F3]">
                        <img
                          src={cmsMap.hero_image_medium}
                          alt="Medium Preview"
                          className="w-full h-full object-cover object-center"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const val = '/images/thar-3d.jpg';
                          const updated = { ...cmsMap, hero_image_medium: val };
                          setCmsMap(updated);
                          persistCMS(updated);
                        }}
                        className="text-[10px] text-[#111111] hover:underline font-semibold"
                      >
                        Default Thar 4x4
                      </button>
                    </div>
                  </div>

                  {/* 4. Basic Category (Swift) */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#E5E5E5] space-y-2">
                    <label className="block text-xs font-bold text-[#111111] flex items-center justify-between">
                      <span>🚗 4. Basic (Swift) Image</span>
                      <span className="text-[10px] text-[#666666] font-normal">Category 4</span>
                    </label>
                    <input
                      type="text"
                      value={cmsMap.hero_image_basic || ''}
                      onChange={(e) => setCmsMap({ ...cmsMap, hero_image_basic: e.target.value })}
                      onBlur={() => persistCMS()}
                      placeholder="/images/swift-3d.png"
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                    />
                    {cmsMap.hero_image_basic && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F5F5F3]">
                        <img
                          src={cmsMap.hero_image_basic}
                          alt="Basic Preview"
                          className="w-full h-full object-cover object-center"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const val = '/images/swift-3d.png';
                          const updated = { ...cmsMap, hero_image_basic: val };
                          setCmsMap(updated);
                          persistCMS(updated);
                        }}
                        className="text-[10px] text-[#111111] hover:underline font-semibold"
                      >
                        Default Swift
                      </button>
                    </div>
                  </div>
                </div>
                </div>

              {/* 🏆 Flagship Vehicle Spotlight Control (Fleet Page) */}
              <div className="p-5 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-2 gap-1">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏆 Fleet Section Flagship Spotlight Control</span>
                  </h4>
                  <span className="text-[10px] text-[#666666] font-medium">
                    Select which vehicle is highlighted as the Flagship Spotlight on the Fleet catalog page
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Featured Spotlight Vehicle
                    </label>
                    <select
                      value={cmsMap.flagship_car_id || ''}
                      onChange={(e) => setCmsMap({ ...cmsMap, flagship_car_id: e.target.value })}
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] font-semibold focus:outline-none focus:border-[#111111]"
                    >
                      {carsList.map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.brand} {car.name} (₹{car.pricePerDay?.toLocaleString('en-IN')}/day)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Spotlight Section Title
                    </label>
                    <input
                      type="text"
                      value={cmsMap.flagship_title || 'FLAGSHIP SPOTLIGHT'}
                      onChange={(e) => setCmsMap({ ...cmsMap, flagship_title: e.target.value })}
                      placeholder="FLAGSHIP SPOTLIGHT"
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Spotlight Feature Badge
                    </label>
                    <input
                      type="text"
                      value={cmsMap.flagship_badge || 'Flagship Feature'}
                      onChange={(e) => setCmsMap({ ...cmsMap, flagship_badge: e.target.value })}
                      placeholder="Flagship Feature"
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>
              </div>

              {/* 📖 About Us & Heritage Section Control */}
              <div className="p-5 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-2 gap-1">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <span>📖 About Us Page & Brand Heritage Controls</span>
                  </h4>
                  <span className="text-[10px] text-[#666666] font-medium">
                    Edit the story, headlines, badge text, and showroom image on the About Us page
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      About Section Badge
                    </label>
                    <input
                      type="text"
                      value={cmsMap.about_badge || 'OUR HERITAGE'}
                      onChange={(e) => setCmsMap({ ...cmsMap, about_badge: e.target.value })}
                      placeholder="OUR HERITAGE"
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Main Page Heading
                    </label>
                    <input
                      type="text"
                      value={cmsMap.about_title || 'Redefining Luxury Vehicles'}
                      onChange={(e) => setCmsMap({ ...cmsMap, about_title: e.target.value })}
                      placeholder="Redefining Luxury Vehicles"
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Detail Section Heading
                    </label>
                    <input
                      type="text"
                      value={cmsMap.about_heading_detail || 'Uncompromising Standards & Discretion'}
                      onChange={(e) => setCmsMap({ ...cmsMap, about_heading_detail: e.target.value })}
                      placeholder="Uncompromising Standards & Discretion"
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1">
                    Page Subheading Summary
                  </label>
                  <input
                    type="text"
                    value={cmsMap.about_subheading || ''}
                    onChange={(e) => setCmsMap({ ...cmsMap, about_subheading: e.target.value })}
                    placeholder="Hail Mary Rental Services delivers world-class automotive excellence with zero administrative friction."
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Heritage Story Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={cmsMap.about_paragraph_1 || ''}
                      onChange={(e) => setCmsMap({ ...cmsMap, about_paragraph_1: e.target.value })}
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl p-3 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Heritage Story Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={cmsMap.about_paragraph_2 || ''}
                      onChange={(e) => setCmsMap({ ...cmsMap, about_paragraph_2: e.target.value })}
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl p-3 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Showroom / Featured About Image URL
                    </label>
                    <input
                      type="text"
                      value={cmsMap.about_showroom_image || ''}
                      onChange={(e) => setCmsMap({ ...cmsMap, about_showroom_image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-1631295868223-63265b40d9e4..."
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">
                      Showroom Box Title
                    </label>
                    <input
                      type="text"
                      value={cmsMap.about_showroom_title || 'Flagship Showroom'}
                      onChange={(e) => setCmsMap({ ...cmsMap, about_showroom_title: e.target.value })}
                      placeholder="Flagship Showroom"
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Fleet Stat</label>
                  <input
                    type="text"
                    value={cmsMap.stat_cars || ''}
                    onChange={(e) => setCmsMap({ ...cmsMap, stat_cars: e.target.value })}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Satisfaction Stat</label>
                  <input
                    type="text"
                    value={cmsMap.stat_satisfaction || ''}
                    onChange={(e) => setCmsMap({ ...cmsMap, stat_satisfaction: e.target.value })}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Delivery Time Stat</label>
                  <input
                    type="text"
                    value={cmsMap.stat_handoff || ''}
                    onChange={(e) => setCmsMap({ ...cmsMap, stat_handoff: e.target.value })}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Hidden Fees Stat</label>
                  <input
                    type="text"
                    value={cmsMap.stat_hidden_fees || ''}
                    onChange={(e) => setCmsMap({ ...cmsMap, stat_hidden_fees: e.target.value })}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] space-y-3">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Showroom Contact Details
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Address</label>
                  <input
                    type="text"
                    value={cmsMap.address_line || 'Bandra Kurla Complex, Mumbai, MH 400051'}
                    onChange={(e) => setCmsMap({ ...cmsMap, address_line: e.target.value })}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Phone Line</label>
                    <input
                      type="text"
                      value={cmsMap.direct_phone || '+91 98765 43210'}
                      onChange={(e) => setCmsMap({ ...cmsMap, direct_phone: e.target.value })}
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={cmsMap.whatsapp_number || '919876543210'}
                      onChange={(e) => setCmsMap({ ...cmsMap, whatsapp_number: e.target.value })}
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                    />
                  </div>
                </div>

                {/* Social Media Handles for Follow The Ride Track (4 Options) */}
                <div className="pt-3 border-t border-[#E5E5E5] space-y-3">
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    🚗 &quot;Follow The Ride&quot; Social Media Links (4 Configured Platforms)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">1. Instagram URL</label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/hailmaryrentals"
                        value={cmsMap.instagram_url || ''}
                        onChange={(e) => setCmsMap({ ...cmsMap, instagram_url: e.target.value })}
                        className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">2. YouTube URL</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/@hailmaryrentals"
                        value={cmsMap.youtube_url || ''}
                        onChange={(e) => setCmsMap({ ...cmsMap, youtube_url: e.target.value })}
                        className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">3. WhatsApp Number</label>
                      <input
                        type="text"
                        placeholder="919876543210"
                        value={cmsMap.whatsapp_number || '919876543210'}
                        onChange={(e) => setCmsMap({ ...cmsMap, whatsapp_number: e.target.value })}
                        className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">4. Facebook URL</label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/hailmaryrentals"
                        value={cmsMap.facebook_url || ''}
                        onChange={(e) => setCmsMap({ ...cmsMap, facebook_url: e.target.value })}
                        className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingCms}
                  className="px-5 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingCms ? 'Saving...' : 'Save CMS Content'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Testimonials & Reviews Moderation */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 lg:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold text-[#111111]">
                Client Reviews Moderation
              </h3>
              <span className="text-xs px-3 py-1 bg-[#F5F5F3] border border-[#E5E5E5] text-[#111111] rounded-full font-semibold">
                {testimonials.length} Reviews
              </span>
            </div>

            {/* Add Testimonial Form */}
            <form onSubmit={handleAddTestimonial} className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-3">
              <h4 className="text-xs font-bold text-[#111111]">Add New Testimonial</h4>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Star Rating ({newRating} / 5)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      type="button"
                      key={starVal}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(starVal)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          starVal <= (hoverRating || newRating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-[#CCCCCC]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Vikramaditya"
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Review Text *</label>
                <textarea
                  rows={2}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Outstanding vehicle condition..."
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-[#111111] text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review (Approved)</span>
              </button>
            </form>

            {/* Testimonials List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Reviews Moderation Queue
              </h4>

              {testimonials.length > 0 ? (
                testimonials.map((t) => {
                  const status = t.status || 'APPROVED';
                  return (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < (t.rating || 5)
                                      ? 'fill-amber-500 text-amber-500'
                                      : 'text-[#CCCCCC]'
                                  }`}
                                />
                              ))}
                            </div>

                            {status === 'APPROVED' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase flex items-center gap-1">
                                <Check className="w-3 h-3" /> Live
                              </span>
                            )}

                            {status === 'PENDING' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold uppercase flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" /> Pending
                              </span>
                            )}

                            {status === 'DENIED' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold uppercase flex items-center gap-1">
                                <Ban className="w-3 h-3" /> Hidden
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#111111] leading-relaxed italic">"{t.content}"</p>

                          <div className="text-[11px] font-bold text-[#111111]">
                            {t.author} — <span className="text-[#666666] font-normal">{t.phone || 'No Phone'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {status !== 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'APPROVED')}
                              className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Approve</span>
                            </button>
                          )}

                          {status !== 'DENIED' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'DENIED')}
                              className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5 text-amber-700" />
                              <span>Deny</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-xs text-[#666666]">
                  No reviews submitted.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Floating Save Changes Bar */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111111] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md">
          {cmsSaved ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Content Saved & Applied!
            </span>
          ) : (
            <span className="text-xs text-gray-300 font-medium">
              {savingCms ? 'Saving changes to database...' : 'Instant Auto-Save Enabled'}
            </span>
          )}
          <button
            type="button"
            onClick={() => persistCMS()}
            disabled={savingCms}
            className="bg-white text-[#111111] hover:bg-gray-200 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-[#111111]" />
            <span>{savingCms ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}

