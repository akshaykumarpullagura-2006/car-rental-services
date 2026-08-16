'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Modal } from '@/components/ui/Modal';
import { Crown } from 'lucide-react';

interface CustomerProfile {
  phone: string;
  name: string;
  email?: string;
  enquiries: any[];
  bookings: any[];
  totalSpent: number;
  lastActivity: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .catch(() => null);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Customer Directory"
          subtitle="Unique client profiles & aggregate rental history"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111111]">
                <thead className="bg-[#F5F5F3] border-b border-[#E5E5E5] text-[#666666] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-5">Client Name</th>
                    <th className="py-3 px-5">Phone Number</th>
                    <th className="py-3 px-5">Email</th>
                    <th className="py-3 px-5">Enquiries</th>
                    <th className="py-3 px-5">Bookings</th>
                    <th className="py-3 px-5">Total Value</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {customers.map((c) => {
                    const isVip = c.bookings.length > 0 || c.totalSpent > 50000;
                    return (
                      <tr key={c.phone} className="hover:bg-[#F9F9F8] transition-colors">
                        <td className="py-3.5 px-5 font-bold text-[#111111] flex items-center gap-1.5">
                          {c.name}
                          {isVip && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                        </td>
                        <td className="py-3.5 px-5 font-mono">{c.phone}</td>
                        <td className="py-3.5 px-5 text-[#666666]">{c.email || 'N/A'}</td>
                        <td className="py-3.5 px-5 font-semibold text-[#111111]">{c.enquiries.length} Enquiries</td>
                        <td className="py-3.5 px-5 font-semibold text-emerald-700">{c.bookings.length} Hires</td>
                        <td className="py-3.5 px-5 font-bold text-[#111111]">
                          ₹{c.totalSpent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="px-3 py-1 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] text-[#111111] hover:bg-[#EAEAE7] text-xs font-semibold transition-colors"
                          >
                            View Timeline
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Customer Timeline Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Client Profile — ${selectedCustomer.name}`}
          subtitle={`Phone: ${selectedCustomer.phone} | Total Value: ₹${selectedCustomer.totalSpent.toLocaleString('en-IN')}`}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] text-center">
              <div>
                <span className="text-[#666666] block text-[10px] uppercase font-bold">Enquiries</span>
                <span className="text-base font-bold text-[#111111]">{selectedCustomer.enquiries.length}</span>
              </div>
              <div>
                <span className="text-[#666666] block text-[10px] uppercase font-bold">Bookings</span>
                <span className="text-base font-bold text-emerald-700">{selectedCustomer.bookings.length}</span>
              </div>
              <div>
                <span className="text-[#666666] block text-[10px] uppercase font-bold">Total Spent</span>
                <span className="text-base font-bold text-[#111111]">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                Activity History
              </h4>

              <div className="space-y-2">
                {selectedCustomer.bookings.map((b: any) => (
                  <div key={b.id} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#111111] space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 font-mono">BOOKING — {b.bookingNumber || b.id}</span>
                      <span className="text-[10px] text-[#666666]">{b.startDate} to {b.endDate}</span>
                    </div>
                    <p className="font-semibold text-[#111111]">{b.carName || 'Vehicle Hired'}</p>
                    <p className="text-[11px] text-emerald-700 font-bold">Amount: ₹{b.totalAmount?.toLocaleString('en-IN')}</p>
                  </div>
                ))}

                {selectedCustomer.enquiries.map((e: any) => (
                  <div key={e.id} className="p-3 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] text-[#111111] space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111111] font-mono">INQUIRY — {e.leadNumber || e.id}</span>
                      <span className="text-[10px] text-[#666666]">{new Date(e.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[#555555]">{e.carName || 'General Inquiry'} (Source: {e.source})</p>
                    {e.notes && <p className="text-[#666666] italic text-[11px]">"{e.notes}"</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

