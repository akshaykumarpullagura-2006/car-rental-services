'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Bell, User, Check, Sparkles } from 'lucide-react';

interface NotificationItem {
  id: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [bellOpen, setBellOpen] = useState(false);

  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => null);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="py-5 px-6 lg:px-8 border-b border-[#E5E5E5] flex items-center justify-between bg-white relative z-30 shadow-xs">
      <div>
        <h1 className="text-xl font-bold text-[#111111] tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-[#666666] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Session</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="p-2 rounded-full bg-[#F5F5F3] border border-[#E5E5E5] text-[#111111] hover:bg-[#EAEAE7] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111111] text-white font-extrabold text-[9px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {bellOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl p-4 shadow-xl z-50 border border-[#E5E5E5] animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-3">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#111111]" /> Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#111111] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#666666] text-center py-4">No recent notifications</p>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.link || '/admin/leads'}
                      onClick={() => setBellOpen(false)}
                      className={`block p-3 rounded-xl border text-xs transition-colors ${
                        n.read
                          ? 'bg-[#F5F5F3] border-[#E5E5E5] text-[#666666]'
                          : 'bg-white border-[#111111] text-[#111111] font-semibold'
                      }`}
                    >
                      <p>{n.message}</p>
                      <span className="text-[9px] text-[#888888] mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E5E5]">
          <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-[#111111] block">Admin</span>
            <span className="text-[10px] text-[#666666] block">Concierge Desk</span>
          </div>
        </div>
      </div>
    </header>
  );
};

