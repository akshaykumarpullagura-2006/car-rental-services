'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CarCard } from '@/components/public/CarCard';
import { WhyOurFleetSection } from '@/components/public/WhyOurFleetSection';
import { QuoteModal } from '@/components/public/QuoteModal';
import { MOCK_CARS } from '@/lib/db';
import { Car } from '@/types';
import { logWhatsAppLeadAndOpen } from '@/lib/whatsapp';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Check,
  X,
  RotateCcw,
  MessageSquare,
  Car as CarIcon,
  Fuel,
  Zap,
} from 'lucide-react';

export default function FleetPage() {
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedFuel, setSelectedFuel] = useState<string>('ALL');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('ALL');
  const [selectedSeats, setSelectedSeats] = useState<string>('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(250000);
  const [sortBy, setSortBy] = useState<string>('Recommended');

  // Mobile Filter Sheet State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Comparison state
  const [compareCars, setCompareCars] = useState<Car[]>([]);

  // Quote modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCarForQuote, setSelectedCarForQuote] = useState<Car | null>(null);
  const [cmsData, setCmsData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFleetData = () => {
      fetch('/api/fleet')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) setCars(data);
        })
        .catch(() => null);

      fetch('/api/cms')
        .then((res) => res.json())
        .then((data) => {
          if (data) setCmsData(data);
        })
        .catch(() => null);
    };

    fetchFleetData();
    const interval = setInterval(fetchFleetData, 3000);
    return () => clearInterval(interval);
  }, []);

  const categoryCards = [
    { name: 'Basic', label: 'Basic', icon: CarIcon },
    { name: 'Medium', label: 'Medium 4x4', icon: CarIcon },
    { name: 'Luxury', label: 'Luxury SUV', icon: Sparkles },
    { name: 'Ultra Luxury', label: 'Ultra Luxury', icon: Sparkles },
    { name: 'Hatchback', label: 'Hatchback', icon: CarIcon },
    { name: 'SUV', label: 'SUV / 4x4', icon: CarIcon },
    { name: 'Sports', label: 'Sports', icon: Zap },
    { name: 'Electric', label: 'Electric EV', icon: Fuel },
  ];

  const brands = ['ALL', 'Suzuki', 'Mahindra', 'Toyota', 'Rolls-Royce', 'Lamborghini', 'Ferrari', 'Mercedes-Benz', 'Porsche', 'Bentley', 'Land Rover', 'BMW', 'Audi'];
  const fuels = ['ALL', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const transmissions = ['ALL', 'Automatic', 'Manual', 'Dual-Clutch'];
  const availabilities = ['ALL', 'AVAILABLE', 'LIMITED', 'RENTED', 'COMING_SOON'];

  const filteredCars = cars
    .filter((car) => {
      const matchesSearch =
        (car.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (car.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (car.engine || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' ||
        car.category === selectedCategory ||
        (selectedCategory === 'Basic' && (car.category === 'Basic' || (car.pricePerDay || 0) <= 5000)) ||
        (selectedCategory === 'Medium' && (car.category === 'Medium' || ((car.pricePerDay || 0) > 5000 && (car.pricePerDay || 0) <= 20000))) ||
        (selectedCategory === 'Luxury' && (car.category === 'Luxury' || car.category === 'Ultra Luxury')) ||
        (selectedCategory === 'Ultra Luxury' && (car.category === 'Ultra Luxury' || (car.pricePerDay || 0) >= 100000));

      const matchesBrand = selectedBrand === 'ALL' || car.brand === selectedBrand;
      const matchesFuel = selectedFuel === 'ALL' || car.fuelType === selectedFuel;
      const matchesTransmission = selectedTransmission === 'ALL' || car.transmission === selectedTransmission;
      const matchesSeats = selectedSeats === 'ALL' || (car.seating || '').toString() === selectedSeats;
      const matchesAvailability = selectedAvailability === 'ALL' || car.status === selectedAvailability;
      const matchesPrice = (car.pricePerDay || 0) <= maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission &&
        matchesSeats &&
        matchesAvailability &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      if (sortBy === 'Price Low-High') return (a.pricePerDay || 0) - (b.pricePerDay || 0);
      if (sortBy === 'Price High-Low') return (b.pricePerDay || 0) - (a.pricePerDay || 0);
      if (sortBy === 'New Arrivals') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'Most Popular') return (b.horsepower || 0) - (a.horsepower || 0);
      return 0;
    });

  const featuredCar =
    (cmsData.flagship_car_id ? cars.find((c) => c.id === cmsData.flagship_car_id) : null) ||
    cars.find((c) => c.featured) ||
    cars[0];

  const toggleCompare = (car: Car) => {
    if (compareCars.some((c) => c.id === car.id)) {
      setCompareCars(compareCars.filter((c) => c.id !== car.id));
    } else {
      if (compareCars.length < 3) {
        setCompareCars([...compareCars, car]);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setSelectedFuel('ALL');
    setSelectedTransmission('ALL');
    setSelectedSeats('ALL');
    setSelectedAvailability('ALL');
    setMaxPrice(250000);
    setSortBy('Recommended');
  };

  const handleOpenQuoteModal = (car?: Car) => {
    setSelectedCarForQuote(car || null);
    setQuoteModalOpen(true);
  };

  return (
    <div className="pt-24 pb-20 bg-[#F5F5F3] min-h-screen">
      {/* Banner */}
      <section className="relative py-14 lg:py-16 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#111111] tracking-wider px-3.5 py-1 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>FLEET CATALOG</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight uppercase">
            Curated Showroom Vehicles
          </h1>
          <p className="text-[#666666] text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
            Filter our collection by marquee, category, fuel type, or daily rate. Delivered directly to your residence or airport terminal.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Category Pills */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
            Browse By Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {categoryCards.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(isActive ? 'ALL' : cat.name)}
                  className={`p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[50px] ${
                    isActive
                      ? 'bg-[#111111] text-white border-[#111111] shadow-xs font-bold'
                      : 'bg-white border-[#E5E5E5] text-[#555555] hover:border-[#111111] hover:text-[#111111]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#666666]'}`} />
                  <span className="text-[11px] font-semibold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="px-5 py-3 rounded-full bg-[#111111] text-white font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Fleet ({filteredCars.length})</span>
          </button>
        </div>

        {/* Desktop Filter Panel */}
        <div className="hidden lg:block sticky top-20 z-30 mb-8">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4 relative">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Cullinan, Urus, Thar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl pl-10 pr-3 py-2 text-xs text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="col-span-2">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b === 'ALL' ? 'All Brands' : b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  {fuels.map((f) => (
                    <option key={f} value={f}>
                      {f === 'ALL' ? 'All Fuel Types' : f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  {transmissions.map((t) => (
                    <option key={t} value={t}>
                      {t === 'ALL' ? 'Transmission' : t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  {availabilities.map((a) => (
                    <option key={a} value={a}>
                      {a === 'ALL' ? 'All Statuses' : a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[#666666]">Max Daily Rate:</span>
                <input
                  type="range"
                  min="2500"
                  max="250000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-36 accent-[#111111]"
                />
                <span className="text-[#111111] font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#111111]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#F5F5F3] border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  >
                    <option value="Recommended">Sort: Recommended</option>
                    <option value="Price Low-High">Price: Low to High</option>
                    <option value="Price High-Low">Price: High to Low</option>
                    <option value="New Arrivals">Newest Models</option>
                    <option value="Most Popular">Highest Horsepower</option>
                  </select>
                </div>

                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1 rounded-lg bg-[#F5F5F3] hover:bg-[#EAEAE7] text-[#111111] text-xs font-semibold flex items-center gap-1 transition-colors border border-[#E5E5E5]"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-[#666666]">
            Showing <span className="text-[#111111] font-bold">{filteredCars.length}</span> vehicles
          </p>

          {compareCars.length > 0 && (
            <div className="text-xs px-3.5 py-1.5 bg-white border border-[#E5E5E5] text-[#111111] font-semibold rounded-full flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
              <span>Comparing {compareCars.length}/3 Vehicles</span>
            </div>
          )}
        </div>

        {/* Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#E5E5E5] rounded-3xl p-8 mb-16">
            <p className="text-base font-bold text-[#111111]">No vehicles found matching your filter criteria.</p>
            <p className="text-xs text-[#666666] mt-1">Try clearing filters or adjusting your budget range.</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Grid (≥ 768px) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredCars.map((car) => {
                const isComparing = compareCars.some((c) => c.id === car.id);
                return (
                  <div key={car.id} className="relative group">
                    <CarCard car={car} onOpenQuoteModal={handleOpenQuoteModal} />

                    <button
                      onClick={() => toggleCompare(car)}
                      className={`absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-1 ${
                        isComparing
                          ? 'bg-[#111111] text-white shadow-xs'
                          : 'bg-white/80 text-[#111111] hover:bg-white border border-[#E5E5E5]'
                      }`}
                    >
                      {isComparing ? <Check className="w-3 h-3 text-white" /> : null}
                      <span>{isComparing ? 'Comparing' : '+ Compare'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Mobile Stacked Deck Scroll Layout (< 768px) */}
            <div className="md:hidden relative space-y-4 pb-12 mb-16">
              {filteredCars.map((car, idx) => {
                const isComparing = compareCars.some((c) => c.id === car.id);
                return (
                  <div
                    key={car.id}
                    className="sticky top-24 transition-all duration-300"
                    style={{ zIndex: idx + 1 }}
                  >
                    <div className="relative bg-white rounded-3xl border border-[#E5E5E5] shadow-xl overflow-hidden">
                      <CarCard car={car} onOpenQuoteModal={handleOpenQuoteModal} />

                      <button
                        onClick={() => toggleCompare(car)}
                        className={`absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-1 ${
                          isComparing
                            ? 'bg-[#111111] text-white shadow-xs'
                            : 'bg-white/80 text-[#111111] hover:bg-white border border-[#E5E5E5]'
                        }`}
                      >
                        {isComparing ? <Check className="w-3 h-3 text-white" /> : null}
                        <span>{isComparing ? 'Comparing' : '+ Compare'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Featured Vehicle Spotlight Section */}
        {featuredCar && (
          <section className="mb-16">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-4">
              {cmsData.flagship_title || 'FLAGSHIP SPOTLIGHT'}
            </h3>
            <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 sm:p-8 relative overflow-hidden shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-[#F5F5F3]">
                  <img
                    src={featuredCar?.images?.[0] || 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop'}
                    alt={featuredCar?.name || 'Featured Car'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-[#111111] text-white rounded-full">
                      {cmsData.flagship_badge || 'Flagship Feature'}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs text-[#666666] font-semibold uppercase">{featuredCar?.brand || 'Luxury Marquee'}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">{featuredCar?.name || 'Flagship Vehicle'}</h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Engine: {featuredCar?.engine || 'V8 Biturbo'} • {featuredCar?.horsepower || 500} HP • 0-60 in {featuredCar?.zeroToSixty || '3.5s'}
                  </p>

                  <div className="p-4 rounded-xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-baseline justify-between">
                    <span className="text-xs text-[#666666]">Daily Rate</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#111111]">
                      ₹{featuredCar?.pricePerDay?.toLocaleString('en-IN') || '0'} <span className="text-xs text-[#666666] font-normal">/ day</span>
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Link href={`/fleet/${featuredCar?.id || ''}`} className="w-full sm:flex-1">
                      <button className="w-full py-3 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold">
                        View Specifications
                      </button>
                    </Link>
                    <button
                      onClick={() => logWhatsAppLeadAndOpen(featuredCar?.name || 'Flagship Vehicle')}
                      className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#F0F0EE] hover:bg-[#EAEAE7] border border-[#E5E5E5] text-[#111111] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <WhyOurFleetSection />
      </div>

      {/* Mobile Filter Bottom Sheet Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
          <div className="bg-white border-t border-[#E5E5E5] rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filter Fleet Vehicles
              </h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#666666]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#111111] font-semibold mb-1">Search Keywords</label>
                <input
                  type="text"
                  placeholder="Search Cullinan, Urus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#111111] font-semibold mb-1">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-[#111111]"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>{b === 'ALL' ? 'All Brands' : b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#111111] font-semibold mb-1">Fuel Type</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full bg-[#F5F5F3] border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs text-[#111111]"
                >
                  {fuels.map((f) => (
                    <option key={f} value={f}>{f === 'ALL' ? 'All Fuel Types' : f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#111111] font-semibold mb-1">Max Daily Rate (₹)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="2500"
                    max="250000"
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#111111]"
                  />
                  <span className="text-[#111111] font-bold text-xs">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3 border-t border-[#E5E5E5]">
              <button
                onClick={handleResetFilters}
                className="w-full py-3 rounded-full bg-[#F5F5F3] text-xs text-[#111111] font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-full bg-[#111111] text-white text-xs font-semibold"
              >
                Apply Filters ({filteredCars.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        car={selectedCarForQuote}
      />
    </div>
  );
}

