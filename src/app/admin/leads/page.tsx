'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Lead, Car } from '@/types';
import { MOCK_LEADS, MOCK_CARS } from '@/lib/db';
import { getWhatsAppLink } from '@/lib/whatsapp';
import {
  MessageSquare,
  Phone,
  Search,
  RotateCcw,
  User,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Save,
  Car as CarIcon,
} from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [activeSource, setActiveSource] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Selected lead modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch(() => null)
      .finally(() => setLoading(false));

    fetch('/api/fleet')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCars(data);
      })
      .catch(() => null);
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      setLeads(leads.map((l) => (l.id === id ? { ...l, status: status as any } : l)));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: status as any });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: internalNotes }),
      });

      setLeads(
        leads.map((l) => (l.id === selectedLead.id ? { ...l, notes: internalNotes } : l))
      );
      setSelectedLead({ ...selectedLead, notes: internalNotes });
      alert('Internal notes saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  const tabs = ['ALL', 'NEW', 'CONTACTED', 'NEGOTIATING', 'CONVERTED', 'LOST'];

  const filteredLeads = leads.filter((l) => {
    const matchesTab = activeTab === 'ALL' || l.status === activeTab;
    const matchesSource = activeSource === 'ALL' || l.source === activeSource;
    const matchesSearch =
      l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.clientPhone.includes(searchQuery) ||
      l.leadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.carName && l.carName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSource && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Lead Management"
          subtitle="View inbound quote requests, update stage status, and save notes"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111111]">Inbound Inbox ({filteredLeads.length})</h2>
              <p className="text-xs text-[#666666]">Requests from website quote modals & contact forms</p>
            </div>

            <button
              onClick={fetchLeads}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5E5] hover:border-[#111111] text-xs font-semibold text-[#111111] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search client name, phone, lead ID, car..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl pl-10 pr-4 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="w-full lg:w-48">
                <select
                  value={activeSource}
                  onChange={(e) => setActiveSource(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                >
                  <option value="ALL">All Touchpoints</option>
                  <option value="contact-form">Contact Form</option>
                  <option value="quote-modal">Quote Modal</option>
                  <option value="whatsapp-click">WhatsApp Click</option>
                </select>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#E5E5E5] scrollbar-none">
              <span className="text-xs font-semibold text-[#666666] mr-2 shrink-0">Stage:</span>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-[#111111] text-white shadow-xs font-bold'
                      : 'bg-[#F5F5F3] text-[#555555] hover:text-[#111111] border border-[#E5E5E5]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Lead Table */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111111]">
                <thead className="bg-[#F5F5F3] border-b border-[#E5E5E5] text-[#666666] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-5">Lead ID</th>
                    <th className="py-3 px-5">Client Info</th>
                    <th className="py-3 px-5">Requested Vehicle</th>
                    <th className="py-3 px-5">Source</th>
                    <th className="py-3 px-5">Pipeline Stage</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#666666]">
                        No lead records found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const waUrl = getWhatsAppLink({
                        customMessage: `Hello ${lead.clientName}, following up regarding your inquiry for the ${lead.carName || 'vehicle'}.`
                      });

                      return (
                        <tr key={lead.id} className="hover:bg-[#F9F9F8] transition-colors">
                          <td className="py-3.5 px-5 font-mono text-[#111111] font-bold">
                            {lead.leadNumber}
                          </td>

                          <td className="py-3.5 px-5">
                            <span className="font-bold text-[#111111] block">{lead.clientName}</span>
                            <span className="font-mono text-[#666666] block text-[11px]">{lead.clientPhone}</span>
                            {lead.clientEmail && (
                              <span className="text-[#888888] text-[10px] block">{lead.clientEmail}</span>
                            )}
                          </td>

                          <td className="py-3.5 px-5 font-semibold text-[#111111]">
                            {lead.carName || 'General Showroom Inquiry'}
                          </td>

                          <td className="py-3.5 px-5">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] font-mono text-[#555555]">
                              {lead.source}
                            </span>
                          </td>

                          <td className="py-3.5 px-5">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                              className="bg-[#F5F5F3] border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs text-[#111111] font-bold focus:outline-none focus:border-[#111111] cursor-pointer"
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="NEGOTIATING">NEGOTIATING</option>
                              <option value="CONVERTED">CONVERTED</option>
                              <option value="LOST">LOST</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-5 text-right space-x-1.5">
                            <a href={`tel:${lead.clientPhone}`} className="p-1.5 rounded-full bg-[#F5F5F3] hover:bg-[#EAEAE7] text-[#111111] inline-flex items-center" title="Call Client">
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            <a href={waUrl} target="_blank" rel="noopener noreferrer" title="WhatsApp Client">
                              <button className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold inline-flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                              </button>
                            </a>

                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setInternalNotes(lead.notes || '');
                              }}
                              className="px-3 py-1 rounded-full bg-[#F5F5F3] hover:bg-[#EAEAE7] text-[#111111] border border-[#E5E5E5] text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" /> Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedLead && (
        <Modal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title={`Lead Record — ${selectedLead.leadNumber}`}
          subtitle={`Submitted on ${new Date(selectedLead.createdAt).toLocaleString()}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5]">
              <div>
                <span className="text-[10px] text-[#666666] font-bold uppercase block">Source</span>
                <span className="text-xs font-bold text-[#111111]">{selectedLead.source}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#666666] font-bold uppercase block">Stage</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                  className="bg-white border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs text-[#111111] font-bold"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="NEGOTIATING">NEGOTIATING</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-0.5">
                <span className="text-[#666666] font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#111111]" /> Name
                </span>
                <span className="text-xs font-bold text-[#111111] block">{selectedLead.clientName}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-0.5">
                <span className="text-[#666666] font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#111111]" /> Phone
                </span>
                <span className="text-xs font-bold text-[#111111] block">{selectedLead.clientPhone}</span>
              </div>

              {selectedLead.clientEmail && (
                <div className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-0.5">
                  <span className="text-[#666666] font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#111111]" /> Email
                  </span>
                  <span className="text-xs text-[#111111] block">{selectedLead.clientEmail}</span>
                </div>
              )}

              {selectedLead.carName && (
                <div className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-0.5">
                  <span className="text-[#666666] font-semibold flex items-center gap-1">
                    <CarIcon className="w-3.5 h-3.5 text-[#111111]" /> Requested Vehicle
                  </span>
                  <span className="text-xs font-bold text-[#111111] block">{selectedLead.carName}</span>
                </div>
              )}
            </div>

            {(selectedLead.startDate || selectedLead.location) && (
              <div className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] space-y-1 text-xs">
                {selectedLead.startDate && (
                  <div className="flex justify-between">
                    <span className="text-[#666666] flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#111111]" /> Dates:</span>
                    <span className="text-[#111111] font-semibold">{selectedLead.startDate} to {selectedLead.endDate}</span>
                  </div>
                )}
                {selectedLead.location && (
                  <div className="flex justify-between">
                    <span className="text-[#666666] flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#111111]" /> Location:</span>
                    <span className="text-[#111111] font-semibold">{selectedLead.location}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#111111] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#111111]" /> Admin Internal Notes
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log call outcome, agreed price, or deposit status..."
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-xs font-semibold flex items-center gap-1 hover:bg-black transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E5E5] flex items-center gap-2">
              <a href={`tel:${selectedLead.clientPhone}`} className="flex-1">
                <button className="w-full py-2.5 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] text-[#111111] text-xs font-semibold flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Call Client
                </button>
              </a>

              <a
                href={getWhatsAppLink({
                  customMessage: `Hello ${selectedLead.clientName}, following up regarding your inquiry for the ${selectedLead.carName || 'vehicle'}.`
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </button>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

