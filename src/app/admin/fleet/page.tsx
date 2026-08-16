'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Car } from '@/types';
import { MOCK_CARS } from '@/lib/db';
import { Plus, Edit, Trash2, Search, Image as ImageIcon } from 'lucide-react';

export default function AdminFleetPage() {
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const availableFeatures = ['AC', 'GPS', 'Bluetooth', 'Airbags', 'Automatic', 'Chauffeur Available', 'Sunroof', 'Starlight Headliner', 'Akrapovič Titanium Exhaust', 'Carbon Fiber Bonnet', '3 Locking Diffs', 'Burmester Sound'];

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Rolls-Royce',
    model: '',
    year: 2024,
    category: 'Luxury',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seating: 5,
    engine: '6.75L V12',
    horsepower: 600,
    zeroToSixty: '4.9s',
    topSpeed: '155 mph',
    mileage: '14 mpg',
    pricePerDay: 2200,
    pricePerWeek: 13500,
    pricePerMonth: 48000,
    deposit: 5000,
    driverCharges: 250,
    extraKmCharge: 10,
    status: 'AVAILABLE',
    featured: true,
    features: ['AC', 'GPS', 'Bluetooth', 'Airbags', 'Automatic'],
    imagesStr: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop',
  });

  const fetchFleet = () => {
    fetch('/api/fleet')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCars(data);
      })
      .catch(() => null);
  };

  useEffect(() => {
    fetchFleet();
    const interval = setInterval(fetchFleet, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAdd = () => {
    setEditingCar(null);
    setFormData({
      name: '',
      brand: 'Rolls-Royce',
      model: '',
      year: 2024,
      category: 'Luxury',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seating: 5,
      engine: '6.75L V12',
      horsepower: 600,
      zeroToSixty: '4.9s',
      topSpeed: '155 mph',
      mileage: '14 mpg',
      pricePerDay: 2200,
      pricePerWeek: 13500,
      pricePerMonth: 48000,
      deposit: 5000,
      driverCharges: 250,
      extraKmCharge: 10,
      status: 'AVAILABLE',
      featured: true,
      features: ['AC', 'GPS', 'Bluetooth', 'Airbags', 'Automatic'],
      imagesStr: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: car.year,
      category: car.category,
      fuelType: (car.fuelType as any) || 'Petrol',
      transmission: (car.transmission as any) || 'Automatic',
      seating: car.seating,
      engine: car.engine,
      horsepower: car.horsepower,
      zeroToSixty: car.zeroToSixty,
      topSpeed: car.topSpeed,
      mileage: car.mileage || '15 mpg',
      pricePerDay: car.pricePerDay,
      pricePerWeek: car.pricePerWeek || 0,
      pricePerMonth: car.pricePerMonth || 0,
      deposit: car.deposit,
      driverCharges: car.driverCharges || 200,
      extraKmCharge: car.extraKmCharge || 5,
      status: car.status,
      featured: car.featured,
      features: car.features || ['AC', 'GPS', 'Bluetooth', 'Airbags', 'Automatic'],
      imagesStr: car.images.join('\n'),
    });
    setIsModalOpen(true);
  };

  const toggleFeature = (feat: string) => {
    if (formData.features.includes(feat)) {
      setFormData({ ...formData, features: formData.features.filter((f) => f !== feat) });
    } else {
      setFormData({ ...formData, features: [...formData.features, feat] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls = formData.imagesStr
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const carPayload = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model || formData.name,
      year: Number(formData.year),
      category: formData.category,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      seating: Number(formData.seating),
      engine: formData.engine,
      horsepower: Number(formData.horsepower),
      zeroToSixty: formData.zeroToSixty,
      topSpeed: formData.topSpeed,
      mileage: formData.mileage,
      pricePerDay: Number(formData.pricePerDay),
      pricePerWeek: Number(formData.pricePerWeek),
      pricePerMonth: Number(formData.pricePerMonth),
      deposit: Number(formData.deposit),
      driverCharges: Number(formData.driverCharges),
      extraKmCharge: Number(formData.extraKmCharge),
      status: formData.status,
      featured: formData.featured,
      features: formData.features,
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop'],
      specs: { 'Engine': formData.engine, 'Mileage': formData.mileage },
    };

    if (editingCar) {
      await fetch(`/api/fleet/${editingCar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carPayload),
      });

      setCars(cars.map((c) => (c.id === editingCar.id ? { ...c, ...carPayload, id: editingCar.id } : c)));
    } else {
      const res = await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carPayload),
      });
      const created = await res.json();
      setCars([created, ...cars]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle entry?')) {
      return;
    }
    await fetch(`/api/fleet/${id}`, { method: 'DELETE' });
    setCars(cars.filter((c) => c.id !== id));
  };

  const filteredCars = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-[#111111] font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Fleet Inventory"
          subtitle="Manage showroom vehicles, rates, gallery images, and status"
        />

        <div className="p-6 lg:p-8 space-y-6 w-full">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vehicle, brand, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-10 pr-4 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl border border-[#E5E5E5] p-5 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-[#F5F5F3]">
                    <img
                      src={car.images[0] || 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop'}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <Badge variant={car.status === 'AVAILABLE' ? 'emerald' : car.status === 'LIMITED' ? 'amber' : 'rose'}>
                        {car.status}
                      </Badge>
                      {car.featured && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#111111] text-white font-bold uppercase">
                          Flagship
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#666666] font-bold uppercase">{car.brand} • {car.category}</span>
                    <h4 className="text-base font-bold text-[#111111] line-clamp-1">{car.name}</h4>
                    <p className="text-lg font-extrabold text-[#111111] mt-0.5">
                      ₹{car.pricePerDay.toLocaleString('en-IN')} <span className="text-xs text-[#666666] font-normal">/ day</span>
                    </p>
                  </div>

                  <div className="text-xs text-[#666666] space-y-0.5">
                    <p>Engine: {car.engine} ({car.horsepower} HP)</p>
                    <p>Fuel: {car.fuelType} • Deposit: ₹{car.deposit.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5] text-xs">
                  <span className="text-[#666666] text-[11px]">{car.images.length} Photos</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(car)}
                      className="px-3 py-1 rounded-full bg-[#F5F5F3] hover:bg-[#EAEAE7] text-[#111111] font-semibold text-xs inline-flex items-center gap-1 border border-[#E5E5E5]"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCar ? `Edit Vehicle — ${editingCar.name}` : 'Add New Showroom Vehicle'}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rolls-Royce Cullinan"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Rolls-Royce"
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                >
                  <option value="Basic">Basic</option>
                  <option value="Medium">Medium</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Ultra Luxury">Ultra Luxury</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV">SUV</option>
                  <option value="Sports">Sports</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value as any })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Dual-Clutch">Dual-Clutch</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Daily Rate (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Weekly Rate (₹)</label>
                <input
                  type="number"
                  value={formData.pricePerWeek}
                  onChange={(e) => setFormData({ ...formData, pricePerWeek: Number(e.target.value) })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Monthly Rate (₹)</label>
                <input
                  type="number"
                  value={formData.pricePerMonth}
                  onChange={(e) => setFormData({ ...formData, pricePerMonth: Number(e.target.value) })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Deposit (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Horsepower</label>
                <input
                  type="number"
                  value={formData.horsepower}
                  onChange={(e) => setFormData({ ...formData, horsepower: Number(e.target.value) })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">0 - 60 mph</label>
                <input
                  type="text"
                  value={formData.zeroToSixty}
                  onChange={(e) => setFormData({ ...formData, zeroToSixty: e.target.value })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Seating</label>
                <input
                  type="number"
                  value={formData.seating}
                  onChange={(e) => setFormData({ ...formData, seating: Number(e.target.value) })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111]"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="LIMITED">LIMITED</option>
                  <option value="RENTED">RENTED</option>
                  <option value="COMING_SOON">COMING SOON</option>
                </select>
              </div>
            </div>

            {/* Feature Multi-Select Tags */}
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-2">
                Included Features
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableFeatures.map((feat) => {
                  const isSelected = formData.features.includes(feat);
                  return (
                    <button
                      type="button"
                      key={feat}
                      onClick={() => toggleFeature(feat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#F5F5F3] text-[#666666] border border-[#E5E5E5]'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{feat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Image URLs Multi-Line Input */}
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#111111]" /> Image Gallery URLs (One URL per line)
              </label>
              <textarea
                rows={3}
                value={formData.imagesStr}
                onChange={(e) => setFormData({ ...formData, imagesStr: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="accent-[#111111] w-4 h-4"
                />
                <span>Set as Flagship Feature</span>
              </label>

              <div className="flex items-center gap-2">
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
                  {editingCar ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

