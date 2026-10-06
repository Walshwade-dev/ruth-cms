import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow potential future admin/CMS routes from being indexed
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://ruthshiru.com/sitemap.xml',
  };
}
