'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  className,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide';

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base font-bold',
  };

  const variants = {
    gold: 'bg-gold-gradient text-dark-500 shadow-gold-glow hover:shadow-gold-glow-lg hover:brightness-110 border border-gold-300/40',
    outline: 'border border-gold-400/60 text-gold-300 hover:bg-gold-400/10 hover:border-gold-300 hover:text-white',
    ghost: 'text-gray-300 hover:text-gold-300 hover:bg-white/5',
    dark: 'bg-dark-300 text-white border border-white/10 hover:border-gold-400/50 hover:text-gold-300',
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, sizes[size], variants[variant], fullWidth && 'w-full', className)
      )}
      {...props}
    >
      {icon && <span className="mr-2.5 inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
