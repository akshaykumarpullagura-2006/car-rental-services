import { MetadataRoute } from 'next';
import { MOCK_CARS } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hailmaryrentals.com';

  const staticPages = [
    '',
    '/fleet',
    '/services',
    '/about',
    '/contact',
    '/faqs',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/cancellation-policy',
    '/cookie-policy',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const carPages = MOCK_CARS.map((car) => ({
    url: `${baseUrl}/fleet/${car.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...carPages];
}
