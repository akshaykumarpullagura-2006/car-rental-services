import type { Metadata } from 'next';
import './globals.css';
import { PublicLayoutWrapper } from '@/components/layout/PublicLayoutWrapper';

export const metadata: Metadata = {
  title: 'HAIL MARY RENTAL SERVICES - Ultra Luxury & Exotic Supercar Rental Concierge',
  description: 'Premier luxury vehicle rental service in Beverly Hills & Miami. Drive Rolls-Royce, Lamborghini, Ferrari, Maybach, and AMG with doorstep delivery and 24/7 VIP concierge.',
  keywords: ['luxury car rental', 'exotic supercar rental', 'Rolls-Royce rental', 'Lamborghini Urus rental', 'Beverly Hills car rental', 'Miami exotic car rental', 'chauffeur service'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-dark-500 text-gray-100 min-h-screen flex flex-col antialiased">
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
