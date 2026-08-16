'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Car, Clock, ShieldCheck } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const [cmsStats, setCmsStats] = useState({
    stat_cars: '50+',
    stat_satisfaction: '99.8%',
    stat_handoff: '30 Min',
    stat_hidden_fees: '₹0',
  });

  useEffect(() => {
    fetch('/api/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCmsStats({
            stat_cars: data.stat_cars || '50+',
            stat_satisfaction: data.stat_satisfaction || '99.8%',
            stat_handoff: data.stat_handoff || '30 Min',
            stat_hidden_fees: data.stat_hidden_fees || '₹0',
          });
        }
      })
      .catch(() => null);
  }, []);

  const stats = [
    {
      icon: <Car className="w-5 h-5 text-[#111111]" />,
      value: cmsStats.stat_cars,
      label: 'Exotic Vehicles',
      subtext: 'Rolls-Royce, Urus & Maybach',
    },
    {
      icon: <Trophy className="w-5 h-5 text-[#111111]" />,
      value: cmsStats.stat_satisfaction,
      label: 'Satisfaction Rate',
      subtext: 'Bespoke VIP concierge',
    },
    {
      icon: <Clock className="w-5 h-5 text-[#111111]" />,
      value: cmsStats.stat_handoff,
      label: 'Rapid Handoff',
      subtext: 'Airport & Hotel delivery',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#111111]" />,
      value: cmsStats.stat_hidden_fees,
      label: 'Hidden Charges',
      subtext: '100% Transparent terms',
    },
  ];

  return (
    <section className="pt-12 sm:pt-16 lg:pt-20 pb-10 bg-[#F5F5F3] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center shadow-xs hover:border-[#111111] transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                {item.value}
              </h3>
              <p className="text-xs font-bold text-[#111111] mt-1 uppercase tracking-wider">{item.label}</p>
              <p className="text-[11px] text-[#666666] mt-0.5">{item.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
