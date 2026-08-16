'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { IntroAnimation } from '@/components/public/IntroAnimation';

export const PublicLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen bg-dark-500">{children}</main>;
  }

  const isHome = pathname === '/';

  return (
    <>
      {isHome && <IntroAnimation />}
      <Navbar />
      <main className="flex-grow pb-24 md:pb-0">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />
    </>
  );
};
