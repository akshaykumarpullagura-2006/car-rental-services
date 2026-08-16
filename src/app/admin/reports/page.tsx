'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BarChart3, TrendingUp, Car, RefreshCw } from 'lucide-react';

interface ReportData {
  totalLeads: number;
  convertedLeads: number;
  totalBookings: number;
  conversionRate: string;
  sourceBreakdown: Array<{ name: string; count: number }>;
  statusBreakdown: Array<{ name: string; count: number }>;
  topCars: Array<{ name: string; enquiries: number }>;
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = () => {
    setLoading(true);
    fetch('/api/reports')
      .then((res) => res.json())
      .then((resData) => {
        if (resData) setData(resData);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
        <AdminSidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-[#666666]">Loading Operational Reports...</p>
        </main>
      </div>
    );
  }

  const maxSourceCount = Math.max(...data.sourceBreakdown.map((s) => s.count), 1);
  const maxStatusCount = Math.max(...data.statusBreakdown.map((s) => s.count), 1);

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Operational Reports & Analytics"
          subtitle="Conversion metrics, lead source breakdowns, and vehicle enquiry analytics"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Performance Metrics</h3>
              <p className="text-xs text-[#666666]">Calculated from live database leads</p>
            </div>

            <button
              onClick={fetchReports}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5E5] text-xs font-semibold text-[#111111] flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Reports</span>
            </button>
          </div>

          {/* Top KPI Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <span className="text-[11px] text-[#666666] font-semibold block uppercase">Total Leads Captured</span>
              <span className="text-3xl font-extrabold text-[#111111] mt-1 block">{data.totalLeads}</span>
              <p className="text-[11px] text-[#666666] mt-1">Digital enquiry touchpoints</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <span className="text-[11px] text-[#666666] font-semibold block uppercase">Converted Bookings</span>
              <span className="text-3xl font-extrabold text-emerald-700 mt-1 block">{data.convertedLeads}</span>
              <p className="text-[11px] text-emerald-700 mt-1 font-semibold">Confirmed rental agreements</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <span className="text-[11px] text-[#666666] font-semibold block uppercase">Lead Conversion Rate</span>
              <span className="text-3xl font-extrabold text-[#111111] mt-1 block">{data.conversionRate}</span>
              <p className="text-[11px] text-[#666666] mt-1">Converted vs total leads</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <span className="text-[11px] text-[#666666] font-semibold block uppercase">Bookings Logged</span>
              <span className="text-3xl font-extrabold text-[#111111] mt-1 block">{data.totalBookings}</span>
              <p className="text-[11px] text-[#666666] mt-1">Manual agreements</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads by Source */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4 shadow-xs">
              <h4 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#111111]" />
                <span>Leads by Touchpoint Source</span>
              </h4>

              <div className="space-y-3 pt-1">
                {data.sourceBreakdown.map((s) => {
                  const percentage = Math.round((s.count / maxSourceCount) * 100);
                  return (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#111111]">{s.name}</span>
                        <span className="text-[#666666] font-mono">{s.count} Leads ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#F5F5F3] overflow-hidden border border-[#E5E5E5]">
                        <div
                          className="h-full rounded-full bg-[#111111] transition-all duration-700"
                          style={{ width: `${Math.max(8, percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pipeline Stage Distribution */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4 shadow-xs">
              <h4 className="text-base font-bold text-[#111111] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#111111]" />
                <span>Pipeline Stage Distribution</span>
              </h4>

              <div className="space-y-3 pt-1">
                {data.statusBreakdown.map((st) => {
                  const percentage = Math.round((st.count / maxStatusCount) * 100);
                  return (
                    <div key={st.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#111111]">{st.name} Stage</span>
                        <span className="text-emerald-700 font-mono">{st.count} Leads</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#F5F5F3] overflow-hidden border border-[#E5E5E5]">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                          style={{ width: `${Math.max(6, percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Enquired Vehicles List */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4 shadow-xs">
            <h4 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#111111]" />
              <span>Top 5 Most Enquired Vehicles</span>
            </h4>

            <div className="divide-y divide-[#E5E5E5] text-xs">
              {data.topCars.map((c, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] text-[#111111] font-bold flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-[#111111]">{c.name}</span>
                  </div>
                  <span className="font-mono text-[#111111] font-semibold">{c.enquiries} Enquiries</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

