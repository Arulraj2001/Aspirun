import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.aspirav.co.in';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/materials`, lastModified: new Date() },
    { url: `${baseUrl}/mock-tests`, lastModified: new Date() },
    { url: `${baseUrl}/community`, lastModified: new Date() },
    { url: `${baseUrl}/guidance`, lastModified: new Date() },
    { url: `${baseUrl}/current-affairs`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];
}
