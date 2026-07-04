import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers can access all public pages
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin-login',
          '/student/',   // Private — no SEO value
          '/api/',       // Never index API routes
        ],
      },
      {
        // Block AI training bots specifically
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai'],
        disallow: '/',
      },
    ],
    sitemap: 'https://www.aspirav.co.in/sitemap.xml',
    host: 'https://www.aspirav.co.in',
  };
}
