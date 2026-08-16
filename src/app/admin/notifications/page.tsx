'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Bell, Check, Sparkles } from 'lucide-react';

interface NotificationItem {
  id: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

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
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="flex min-h-screen bg-dark-500 text-gray-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="In-App Notification Center"
          subtitle="Real-time alert log for new quote leads, WhatsApp clicks, and booking events"
        />

        <div className="p-8 space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Event Log</h3>
              <p className="text-xs text-gray-400">Total Notifications: {notifications.length}</p>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl bg-gold-500/10 border border-gold-400/40 text-gold-300 hover:bg-gold-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" /> Mark All as Read
            </button>
          </div>

          <GlassCard goldBorder className="p-0 overflow-hidden">
            <div className="divide-y divide-white/5">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 flex items-center justify-between gap-4 text-xs transition-colors ${n.read ? 'bg-transparent text-gray-400' : 'bg-gold-500/10 text-white font-semibold'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-white/5 text-gray-500' : 'bg-gold-500/20 text-gold-300 border border-gold-400/40'}`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p>{n.message}</p>
                      <span className="text-[10px] text-gray-500 block font-mono">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {n.link && (
                    <Link href={n.link} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-gold-500/20 text-gold-300 text-[11px] font-semibold transition-colors shrink-0">
                      View Target →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
