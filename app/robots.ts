import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/student/', '/today'],
    },
    sitemap: 'https://www.studysetu.co.in/sitemap.xml',
  };
}
