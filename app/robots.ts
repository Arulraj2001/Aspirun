import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/student/', '/today'],
    },
    sitemap: 'https://www.aspirav.co.in/sitemap.xml',
  };
}
