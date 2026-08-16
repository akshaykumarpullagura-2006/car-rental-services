'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { Lead } from '@/types';
import { MOCK_LEADS } from '@/lib/db';
import { getWhatsAppLink } from '@/lib/whatsapp';
import {
  Users,
  Car,
  CalendarCheck,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Phone,
  RotateCcw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [stats, setStats] = useState({
    totalFleet: 8,
    availableCars: 6,
    totalLeads: 2,
    newLeads: 1,
    totalBookings: 2,
    conversionRate: '35%',
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = () => {
    setLoading(true);
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch(() => null);

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const newCount = leads.filter((l) => l.status === 'NEW').length;
  const contactedCount = leads.filter((l) => l.status === 'CONTACTED').length;
  const negotiatingCount = leads.filter((l) => l.status === 'NEGOTIATING').length;
  const convertedCount = leads.filter((l) => l.status === 'CONVERTED').length;
  const lostCount = leads.filter((l) => l.status === 'LOST').length;

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Executive CRM Dashboard"
          subtitle="Real-time Lead Inbox & Operations Metrics"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111111]">Pipeline Overview</h2>
              <p className="text-xs text-[#666666]">Live operational data queried from Supabase & store</p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5E5] hover:border-[#111111] text-xs font-semibold text-[#111111] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold block uppercase tracking-wider">
                    New Enquiries
                  </span>
                  <span className="text-3xl font-extrabold text-[#111111] mt-1 block">
                    {newCount}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#111111]" />
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-3 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Pending Review
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold block uppercase tracking-wider">
                    Total Pipeline Leads
                  </span>
                  <span className="text-3xl font-extrabold text-[#111111] mt-1 block">
                    {leads.length}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-xs text-emerald-600 mt-3 font-semibold">
                {convertedCount} Converted to Hires
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold block uppercase tracking-wider">
                    Active Fleet Vehicles
                  </span>
                  <span className="text-3xl font-extrabold text-[#111111] mt-1 block">
                    {stats.totalFleet}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center">
                  <Car className="w-5 h-5 text-[#111111]" />
                </div>
              </div>
              <p className="text-xs text-[#666666] mt-3 font-semibold">
                {stats.availableCars} Available Today
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold block uppercase tracking-wider">
                    Conversion Rate
                  </span>
                  <span className="text-3xl font-extrabold text-[#111111] mt-1 block">
                    {stats.conversionRate}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-[#111111]" />
                </div>
              </div>
              <p className="text-xs text-[#666666] mt-3 font-semibold">
                Confirmed Rentals
              </p>
            </div>
          </div>

          {/* Lead Status Breakdown */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
              Status Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5]">
                <span className="block text-xl font-bold text-[#111111]">{newCount}</span>
                <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold">NEW</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="block text-xl font-bold text-amber-700">{contactedCount}</span>
                <span className="text-[10px] text-amber-800 uppercase tracking-wider font-semibold">CONTACTED</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="block text-xl font-bold text-blue-700">{negotiatingCount}</span>
                <span className="text-[10px] text-blue-800 uppercase tracking-wider font-semibold">NEGOTIATING</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="block text-xl font-bold text-emerald-700">{convertedCount}</span>
                <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-semibold">CONVERTED</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="block text-xl font-bold text-rose-700">{lostCount}</span>
                <span className="text-[10px] text-rose-800 uppercase tracking-wider font-semibold">LOST</span>
              </div>
            </div>
          </div>

          {/* Recent Leads Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111111]">Recent Leads Inbox</h3>
                <p className="text-xs text-[#666666]">Inbound booking form submissions</p>
              </div>
              <Link href="/admin/leads">
                <button className="px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5">
                  <span>View All Leads</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#111111]">
                  <thead className="bg-[#F5F5F3] border-b border-[#E5E5E5] text-[#666666] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-5">Lead ID</th>
                      <th className="py-3 px-5">Client Name</th>
                      <th className="py-3 px-5">Phone</th>
                      <th className="py-3 px-5">Requested Vehicle</th>
                      <th className="py-3 px-5">Source</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {leads.slice(0, 10).map((lead) => {
                      const waUrl = getWhatsAppLink({
                        customMessage: `Hello ${lead.clientName}, following up regarding your quote request for the ${lead.carName || 'vehicle'}.`
                      });

                      return (
                        <tr key={lead.id} className="hover:bg-[#F9F9F8] transition-colors">
                          <td className="py-3.5 px-5 font-mono text-[#111111] font-bold">
                            {lead.leadNumber}
                          </td>
                          <td className="py-3.5 px-5 font-bold text-[#111111]">
                            {lead.clientName}
                            {lead.location && (
                              <span className="block text-[10px] text-[#666666] font-normal">
                                {lead.location}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 font-mono">{lead.clientPhone}</td>
                          <td className="py-3.5 px-5 font-semibold text-[#111111]">
                            {lead.carName || 'General Inquiry'}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] text-[#555555]">
                              {lead.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <Badge
                              variant={
                                lead.status === 'NEW'
                                  ? 'gold'
                                  : lead.status === 'CONTACTED'
                                  ? 'amber'
                                  : lead.status === 'CONVERTED'
                                  ? 'emerald'
                                  : 'gray'
                              }
                            >
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-5 text-right space-x-1.5">
                            <a href={`tel:${lead.clientPhone}`} className="p-1.5 rounded-full bg-[#F5F5F3] hover:bg-[#EAEAE7] text-[#111111] inline-flex items-center">
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a href={waUrl} target="_blank" rel="noopener noreferrer">
                              <button className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold inline-flex items-center gap-1 transition-colors">
                                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                              </button>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

