'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MessageSquare, Phone, Mail, MapPin, Clock, Lock, CheckCircle2, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [cmsMap, setCmsMap] = useState<Record<string, string>>({
    whatsapp_number: '919876543210',
    direct_phone: '+91 98765 43210',
    contact_email: 'concierge@hailmaryrentals.com',
    address_line: 'Bandra Kurla Complex, Mumbai, MH 400051',
    business_hours: 'Showroom: 8:00 AM – 10:00 PM IST (24/7 WhatsApp Concierge)',
  });

  const [savingBusiness, setSavingBusiness] = useState(false);
  const [businessSaved, setBusinessSaved] = useState(false);

  // Password Change Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSaved, setPassSaved] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    fetch('/api/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data) setCmsMap(data);
      })
      .catch(() => null);
  }, []);

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBusiness(true);
    try {
      await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsMap),
      });
      setBusinessSaved(true);
      setTimeout(() => setBusinessSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingBusiness(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (newPassword !== confirmPassword) {
      setPassError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPassError('Password must be at least 8 characters long.');
      return;
    }

    setSavingPass(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (res.ok) {
        setPassSaved(true);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPassSaved(false), 3000);
      } else {
        const data = await res.json();
        setPassError(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setPassError('Network error while updating password.');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Admin & Business Settings"
          subtitle="Configure site-wide business details, WhatsApp routing, and admin security"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          {/* Business Info Form */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 lg:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#111111]" />
                <span>Global Business & WhatsApp Setup</span>
              </h3>

              {businessSaved && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Settings Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  WhatsApp Concierge Phone Number (Digits only, e.g. 919876543210)
                </label>
                <input
                  type="text"
                  required
                  value={cmsMap.whatsapp_number || ''}
                  onChange={(e) => setCmsMap({ ...cmsMap, whatsapp_number: e.target.value })}
                  placeholder="919876543210"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                />
                <span className="text-[10px] text-[#666666] mt-1 block">
                  All WhatsApp CTAs across the public website automatically route to this number.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Direct Phone Line
                  </label>
                  <input
                    type="text"
                    value={cmsMap.direct_phone || ''}
                    onChange={(e) => setCmsMap({ ...cmsMap, direct_phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={cmsMap.contact_email || ''}
                    onChange={(e) => setCmsMap({ ...cmsMap, contact_email: e.target.value })}
                    placeholder="concierge@hailmaryrentals.com"
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Showroom Address
                </label>
                <input
                  type="text"
                  value={cmsMap.address_line || ''}
                  onChange={(e) => setCmsMap({ ...cmsMap, address_line: e.target.value })}
                  placeholder="Bandra Kurla Complex, Mumbai, MH 400051"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Hours of Operation
                </label>
                <input
                  type="text"
                  value={cmsMap.business_hours || ''}
                  onChange={(e) => setCmsMap({ ...cmsMap, business_hours: e.target.value })}
                  placeholder="Showroom: 8:00 AM – 10:00 PM IST (24/7 WhatsApp Concierge)"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingBusiness}
                  className="px-5 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingBusiness ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Admin Password Change Form */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 lg:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#111111]" />
                <span>Admin Password Security</span>
              </h3>

              {passSaved && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Password Updated!
                </span>
              )}
            </div>

            {passError && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl font-semibold">
                {passError}
              </p>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">New Master Password *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111111] mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPass}
                  className="px-5 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{savingPass ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

