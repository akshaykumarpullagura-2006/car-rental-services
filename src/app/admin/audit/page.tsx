'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  Clock,
  User,
  FileEdit,
  Car,
  DollarSign,
  RefreshCcw,
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  category: 'CMS' | 'Fleet' | 'Pricing' | 'Lead' | 'System' | 'Security';
  details: string;
  status: 'SUCCESS' | 'MODIFIED' | 'WARNING';
  ip: string;
}

export default function AdminAuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: 'log-101',
      timestamp: '2026-08-16 18:50:12 IST',
      user: 'Akshay (Admin)',
      role: 'Super Admin',
      action: 'CMS About Section Updated',
      category: 'CMS',
      details: 'Updated About Us page story paragraphs, badge, and flagship showroom photo URL',
      status: 'SUCCESS',
      ip: '103.21.124.5',
    },
    {
      id: 'log-102',
      timestamp: '2026-08-16 18:48:00 IST',
      user: 'Akshay (Admin)',
      role: 'Super Admin',
      action: 'Flagship Spotlight Car Changed',
      category: 'Fleet',
      details: 'Changed Flagship Spotlight vehicle to Lamborghini Urus Performante (car-urus-02)',
      status: 'MODIFIED',
      ip: '103.21.124.5',
    },
    {
      id: 'log-103',
      timestamp: '2026-08-16 18:22:15 IST',
      user: 'System Bot',
      role: 'Automated Service',
      action: 'Category Background Images Synced',
      category: 'CMS',
      details: 'Synced category background images for Ultra Luxury, Luxury, Medium, and Basic tiers',
      status: 'SUCCESS',
      ip: '127.0.0.1',
    },
    {
      id: 'log-104',
      timestamp: '2026-08-16 17:10:44 IST',
      user: 'Concierge Desk',
      role: 'Manager',
      action: 'Lead Status Updated',
      category: 'Lead',
      details: 'Marked lead #LD-882 (Rolls-Royce Cullinan inquiry) as CONFIRMED',
      status: 'SUCCESS',
      ip: '103.21.124.12',
    },
    {
      id: 'log-105',
      timestamp: '2026-08-16 16:05:30 IST',
      user: 'Akshay (Admin)',
      role: 'Super Admin',
      action: 'Vehicle Daily Rate Adjusted',
      category: 'Pricing',
      details: 'Updated daily rate for Mercedes-AMG G 63 Grand Edition from ₹1,10,000 to ₹1,15,000',
      status: 'MODIFIED',
      ip: '103.21.124.5',
    },
    {
      id: 'log-106',
      timestamp: '2026-08-16 14:30:00 IST',
      user: 'System Audit',
      role: 'Security Desk',
      action: 'Admin Authentication Success',
      category: 'Security',
      details: 'Admin session initiated via token verification for concierge desk session',
      status: 'SUCCESS',
      ip: '103.21.124.5',
    },
  ]);

  const categories = ['ALL', 'CMS', 'Fleet', 'Pricing', 'Lead', 'System', 'Security'];

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || l.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear audit history?')) {
      setLogs([]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CMS':
        return <FileEdit className="w-3.5 h-3.5 text-blue-600" />;
      case 'Fleet':
        return <Car className="w-3.5 h-3.5 text-purple-600" />;
      case 'Pricing':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Security':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="System Audit & Activity Logs"
          subtitle="Track real-time administrative actions, CMS changes, fleet rate edits, and security logs"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          {/* Action & Filter Bar */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by action, details, user, or IP address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl pl-10 pr-4 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EAEAE7] text-[#111111] text-xs font-semibold flex items-center gap-1.5 border border-[#E5E5E5] transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> Refresh
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Audit
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#E5E5E5]">
              <span className="text-xs text-[#666666] font-semibold pr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#111111]" /> Filter Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-[#F5F5F3] text-[#555555] hover:text-[#111111] hover:bg-[#EAEAE7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Logs Table Card */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#111111]" />
                <span>Audit Activity Trail ({filteredLogs.length} Entries)</span>
              </h3>
              <span className="text-[11px] text-[#666666] font-medium">Auto-logged in real-time</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F3] border-b border-[#E5E5E5] text-[11px] font-bold text-[#111111] uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">User / Role</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Action Summary</th>
                    <th className="py-3 px-4">Event Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-xs">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#666666] font-medium">
                        No audit log entries matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F9F9F8] transition-colors">
                        <td className="py-3.5 px-4 text-[#666666] font-mono text-[11px] whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#111111]">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#888888]" />
                            <span>{log.user}</span>
                          </div>
                          <span className="text-[10px] text-[#666666] block font-normal">{log.role}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] text-[11px] font-semibold text-[#111111]">
                            {getCategoryIcon(log.category)}
                            {log.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#111111] whitespace-nowrap">
                          {log.action}
                        </td>
                        <td className="py-3.5 px-4 text-[#555555] max-w-md leading-relaxed">
                          {log.details}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={log.status === 'SUCCESS' ? 'emerald' : log.status === 'MODIFIED' ? 'amber' : 'rose'}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#666666]">
                          {log.ip}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
