'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Car,
  CalendarCheck,
  UserSquare2,
  DollarSign,
  FileEdit,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Lead Inbox', href: '/admin/leads', icon: Users },
    { name: 'Fleet Inventory', href: '/admin/fleet', icon: Car },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Customers', href: '/admin/customers', icon: UserSquare2 },
    { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
    { name: 'CMS & Content', href: '/admin/cms', icon: FileEdit },
    { name: 'Audit Logs', href: '/admin/audit', icon: ShieldCheck },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white border border-[#E5E5E5] text-[#111111] shadow-sm"
          aria-label="Toggle Admin Sidebar"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-60 bg-white border-r border-[#E5E5E5] flex flex-col justify-between p-5 shrink-0 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="pt-2 lg:pt-0 pb-2 border-b border-[#E5E5E5]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#111111] tracking-tight block">
                  HAIL MARY
                </span>
                <span className="text-[8px] text-[#666666] font-semibold uppercase tracking-wider block -mt-0.5">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-xs font-bold'
                      : 'text-[#555555] hover:bg-[#F5F5F3] hover:text-[#111111]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#666666]'}`} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E5E5E5] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F3] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

