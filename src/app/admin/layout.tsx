'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-dark-500">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-dark-500 text-gray-100 flex flex-col font-sans">
      {children}
    </div>
  );
}
