'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { ShieldCheck, Lock, Mail, Car, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@hailmaryrentals.com');
  const [password, setPassword] = useState('AdminPass123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-500 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <GlassCard goldBorder className="max-w-md w-full p-8 space-y-6 relative z-10">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient p-[1px] shadow-gold-glow mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-dark-500 rounded-[15px] flex items-center justify-center">
              <Car className="w-6 h-6 text-gold-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">HAIL MARY CRM</h1>
          <p className="text-xs text-gold-400 uppercase tracking-widest font-semibold">
            Single Admin Executive Portal
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gold-400" /> Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-300/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-400" /> Master Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-300/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 font-mono"
            />
          </div>

          <GoldButton type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
          </GoldButton>
        </form>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-400 space-y-1">
          <p className="text-gray-300 font-semibold">Seeded Single Admin Credentials:</p>
          <p>Email: <code className="text-gold-300">admin@hailmaryrentals.com</code></p>
          <p>Password: <code className="text-gold-300">AdminPass123!</code></p>
        </div>
      </GlassCard>
    </div>
  );
}
