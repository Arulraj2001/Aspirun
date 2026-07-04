import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/student/', 
        '/login', 
        '/register',
        '/*?*', // Prevent indexing parameterized query links
      ],
    },
    sitemap: 'https://www.aspirav.co.in/sitemap.xml',
  };
}
