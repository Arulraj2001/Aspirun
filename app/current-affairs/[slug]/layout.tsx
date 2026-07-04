import type { Metadata } from 'next';
import { mockCurrentAffairs } from '@/data/mockData';
import { supabaseServer } from '@/lib/supabase/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;

  let item: any = null;

  // Try fetching from database first
  try {
    const { data, error } = await supabaseServer
      .from('current_affairs')
      .select('*')
      .or(`slug.eq."${slug}",id.eq."${slug}"`)
      .maybeSingle();

    if (data && !error) {
      item = {
        title: data.title,
        content: data.content,
        metaDescription: data.meta_description,
        slug: data.slug,
      };
    }
  } catch (err) {
    console.error('Error fetching current affairs metadata from Supabase:', err);
  }

  // Fallback to mock data
  if (!item) {
    const found = mockCurrentAffairs.find((c) => c.slug === slug || c.id === slug);
    if (found) {
      item = {
        title: found.title,
        content: found.content,
        metaDescription: found.summary,
        slug: found.slug,
      };
    }
  }

  if (!item) {
    return {
      title: "Daily Current Affairs GK Headline | Aspirav",
      description: "Read national and international daily news highlights, economic changes, and science reports for general knowledge.",
      alternates: {
        canonical: `/current-affairs/${slug}`
      }
    };
  }

  const cleanSnippet = item.metaDescription || (item.content
    ? item.content.substring(0, 160).replace(/[#*`\n\r]/g, ' ') + '...'
    : 'Read the detailed current affairs news card summary on Aspirav.');

  return {
    title: `${item.title} - GK & Current Affairs Card | Aspirav`,
    description: cleanSnippet,
    alternates: {
      canonical: `/current-affairs/${item.slug}`
    }
  };
}

export default function CurrentAffairsDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
