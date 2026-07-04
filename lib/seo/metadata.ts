import type { Metadata } from 'next';

interface BuildMetadataProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  ogType = 'website'
}: BuildMetadataProps): Metadata {
  const defaultKeywords = [
    "Aspirav",
    "Study Planner",
    "Exam preparation",
    "UPSC daily targets",
    "SSC CGL planner",
    "Government exam quiz",
    "Doubt solving community",
    "Toppers strategy blogs"
  ];

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const absoluteUrl = `https://www.aspirav.co.in${cleanPath}`;

  return {
    title,
    description,
    keywords: Array.from(new Set([...defaultKeywords, ...keywords])),
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      type: ogType,
      title,
      description,
      url: absoluteUrl,
      siteName: 'Aspirav',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}
