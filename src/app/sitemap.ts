import { MetadataRoute } from 'next';
import { works } from '@/data/works';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ruthshiru.com'; // Placeholder URL until production domain is known

  const publishedWorks = works.filter((w) => w.status === 'Published');

  const portfolioUrls = publishedWorks.map((work) => ({
    url: `${baseUrl}/portfolio/${work.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learning-journey`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    ...portfolioUrls,
  ];
}
