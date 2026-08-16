'use client';

import React from 'react';

interface BadgeProps {
  variant?: 'gold' | 'emerald' | 'amber' | 'rose' | 'gray';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'gold', children, className = '' }) => {
  const styles = {
    gold: 'bg-gold-500/10 border-gold-400/30 text-gold-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    gray: 'bg-gray-500/10 border-gray-500/30 text-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md uppercase tracking-wider ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
