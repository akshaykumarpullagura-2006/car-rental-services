'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Car } from '@/types';
import { MOCK_CARS } from '@/lib/db';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminPricingPage() {
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/fleet')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCars(data);
      })
      .catch(() => null);
  }, []);

  const handlePriceChange = (id: string, field: keyof Car, value: number) => {
    setCars(
      cars.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const updates = cars.map((c) => ({
        id: c.id,
        pricePerDay: c.pricePerDay,
        pricePerWeek: c.pricePerWeek || 0,
        pricePerMonth: c.pricePerMonth || 0,
        deposit: c.deposit,
      }));

      await fetch('/api/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Bulk Pricing Editor"
          subtitle="Inline rate overrides across daily, weekly, monthly tiers and deposits"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Fleet Rate Matrix</h3>
              <p className="text-xs text-[#666666]">Edit rates directly inline</p>
            </div>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Rates Saved!
                </span>
              )}
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save All Rates'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#111111]">
                <thead className="bg-[#F5F5F3] border-b border-[#E5E5E5] text-[#666666] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-5">Vehicle</th>
                    <th className="py-3 px-5">Brand & Category</th>
                    <th className="py-3 px-5">Daily Rate (₹)</th>
                    <th className="py-3 px-5">Weekly Rate (₹)</th>
                    <th className="py-3 px-5">Monthly Rate (₹)</th>
                    <th className="py-3 px-5">Deposit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-[#F9F9F8] transition-colors">
                      <td className="py-3.5 px-5 font-bold text-[#111111] flex items-center gap-3">
                        <img src={car.images[0]} alt={car.name} className="w-9 h-9 rounded-lg object-cover border border-[#E5E5E5]" />
                        <span>{car.name}</span>
                      </td>

                      <td className="py-3.5 px-5 font-mono text-[#666666]">
                        {car.brand} • {car.category}
                      </td>

                      <td className="py-3.5 px-5">
                        <input
                          type="number"
                          value={car.pricePerDay}
                          onChange={(e) => handlePriceChange(car.id, 'pricePerDay', Number(e.target.value))}
                          className="w-28 bg-[#F5F5F3] border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs text-[#111111] font-bold focus:outline-none focus:border-[#111111]"
                        />
                      </td>

                      <td className="py-3.5 px-5">
                        <input
                          type="number"
                          value={car.pricePerWeek || 0}
                          onChange={(e) => handlePriceChange(car.id, 'pricePerWeek', Number(e.target.value))}
                          className="w-28 bg-[#F5F5F3] border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                        />
                      </td>

                      <td className="py-3.5 px-5">
                        <input
                          type="number"
                          value={car.pricePerMonth || 0}
                          onChange={(e) => handlePriceChange(car.id, 'pricePerMonth', Number(e.target.value))}
                          className="w-28 bg-[#F5F5F3] border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                        />
                      </td>

                      <td className="py-3.5 px-5">
                        <input
                          type="number"
                          value={car.deposit}
                          onChange={(e) => handlePriceChange(car.id, 'deposit', Number(e.target.value))}
                          className="w-28 bg-[#F5F5F3] border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

