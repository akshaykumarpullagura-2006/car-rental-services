'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Modal } from '@/components/ui/Modal';
import { Booking, Car } from '@/types';
import { MOCK_CARS } from '@/lib/db';
import { Plus, CalendarCheck, CheckCircle2, Clock, Ban } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    carId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    totalAmount: 0,
    depositPaid: 0,
    status: 'CONFIRMED',
    notes: '',
  });

  const fetchBookings = () => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
      })
      .catch(() => null);

    fetch('/api/fleet')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCars(data);
      })
      .catch(() => null);
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!formData.carId) {
      if (cars.length > 0) {
        setFormData((prev) => ({ ...prev, carId: cars[0].id, totalAmount: cars[0].pricePerDay * 3, depositPaid: cars[0].deposit }));
      }
      return;
    }

    const selectedCar = cars.find((c) => c.id === formData.carId);
    if (selectedCar) {
      const start = new Date(formData.startDate).getTime();
      const end = new Date(formData.endDate).getTime();
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      setFormData((prev) => ({
        ...prev,
        totalAmount: selectedCar.pricePerDay * days,
        depositPaid: selectedCar.deposit,
      }));
    }
  }, [formData.carId, formData.startDate, formData.endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCar = cars.find((c) => c.id === formData.carId);

    const payload = {
      carId: formData.carId,
      carName: selectedCar?.name || 'Vehicle',
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalAmount: Number(formData.totalAmount),
      depositPaid: Number(formData.depositPaid),
      status: formData.status,
      notes: formData.notes,
    };

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const newBooking = await res.json();
    setBookings([newBooking, ...bookings]);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await fetch('/api/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });

    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: newStatus as Booking['status'] } : b))
    );
  };

  const computeBookingStatus = (b: Booking) => {
    if (b.status === 'CANCELLED') return 'CANCELLED';
    const todayStr = new Date().toISOString().split('T')[0];
    if (b.endDate < todayStr) {
      return 'TRIP COMPLETED';
    }
    if (b.startDate <= todayStr && todayStr <= b.endDate) {
      return 'ACTIVE TRIP';
    }
    return b.status || 'CONFIRMED';
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Manual Bookings"
          subtitle="Log confirmed rental agreements, dates, and deposit tracking"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Rental Bookings Log ({bookings.length})</h3>
              <p className="text-xs text-[#666666]">Confirmed customer rental contracts</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Booking</span>
            </button>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-xs">
            {bookings.length === 0 ? (
              <div className="text-center py-16 p-8">
                <CalendarCheck className="w-10 h-10 text-[#111111] mx-auto mb-2" />
                <h4 className="text-base font-bold text-[#111111]">No Bookings Logged Yet</h4>
                <p className="text-xs text-[#666666] mt-1 max-w-md mx-auto">
                  Click "Create Booking" to log confirmed rental agreements here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#111111]">
                  <thead className="bg-[#F5F5F3] border-b border-[#E5E5E5] text-[#666666] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-5">Booking #</th>
                      <th className="py-3 px-5">Client Name</th>
                      <th className="py-3 px-5">Phone</th>
                      <th className="py-3 px-5">Rental Dates</th>
                      <th className="py-3 px-5">Total Amount</th>
                      <th className="py-3 px-5">Deposit Paid</th>
                      <th className="py-3 px-5">Trip Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {bookings.map((b) => {
                      const displayStatus = computeBookingStatus(b);
                      return (
                        <tr key={b.id} className="hover:bg-[#F9F9F8] transition-colors">
                          <td className="py-3.5 px-5 font-mono text-[#111111] font-bold">{b.bookingNumber}</td>
                          <td className="py-3.5 px-5 font-bold text-[#111111]">{b.clientName}</td>
                          <td className="py-3.5 px-5 font-mono">{b.clientPhone}</td>
                          <td className="py-3.5 px-5 font-medium">{b.startDate} to {b.endDate}</td>
                          <td className="py-3.5 px-5 font-bold text-[#111111]">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="py-3.5 px-5 text-emerald-700 font-semibold">₹{b.depositPaid.toLocaleString('en-IN')}</td>
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2">
                              {displayStatus === 'TRIP COMPLETED' ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-cyan-600" /> COMPLETED
                                </span>
                              ) : displayStatus === 'ACTIVE TRIP' ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-emerald-600" /> ACTIVE
                                </span>
                              ) : displayStatus === 'CANCELLED' ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  <Ban className="w-3 h-3 text-rose-600" /> CANCELLED
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#111111] border border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider">
                                  CONFIRMED
                                </span>
                              )}

                              <select
                                value={b.status}
                                onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                                className="bg-[#F5F5F3] border border-[#E5E5E5] rounded-lg px-2 py-0.5 text-[11px] text-[#111111] focus:outline-none focus:border-[#111111]"
                              >
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="ACTIVE TRIP">ACTIVE TRIP</option>
                                <option value="TRIP COMPLETED">TRIP COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Rental Booking"
          subtitle="Log confirmed rental terms"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">Select Vehicle *</label>
              <select
                value={formData.carId}
                onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
              >
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — ₹{c.pricePerDay.toLocaleString('en-IN')}/day
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Vikramaditya"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Agreed Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Deposit Collected (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.depositPaid}
                  onChange={(e) => setFormData({ ...formData, depositPaid: Number(e.target.value) })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-full bg-[#F5F5F3] text-xs font-semibold text-[#111111] border border-[#E5E5E5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#111111] text-xs font-semibold text-white"
              >
                Confirm & Create Booking
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

