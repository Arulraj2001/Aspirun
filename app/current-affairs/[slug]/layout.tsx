import type { Metadata } from 'next';
import { mockCurrentAffairs } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Resolve current affairs article
  const item = mockCurrentAffairs.find((c) => c.slug === slug || c.id === slug);

  if (!item) {
    return {
      title: "Daily Current Affairs GK Headline | Aspirav",
      description: "Read national and international daily news highlights, economic changes, and science reports for general knowledge."
    };
  }

  // Clean description snippet
  const cleanSnippet = item.content
    ? item.content.substring(0, 160).replace(/[#*`\n\r]/g, ' ') + '...'
    : 'Read the detailed current affairs news card summary on Aspirav.';

  return {
    title: `${item.title} - GK & Current Affairs Card | Aspirav`,
    description: cleanSnippet,
    alternates: {
      canonical: `/current-affairs/${slug}`
    }
  };
}

export default function CurrentAffairsDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
