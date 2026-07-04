import type { Metadata } from 'next';
import { mockBlogs } from '@/data/mockData';
import { supabaseServer } from '@/lib/supabase/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;

  let blog: any = null;

  // Try fetching from database first
  try {
    const { data, error } = await supabaseServer
      .from('blogs')
      .select('*')
      .or(`slug.eq."${slug}",id.eq."${slug}"`)
      .maybeSingle();

    if (data && !error) {
      blog = {
        title: data.title,
        content: data.content,
        metaDescription: data.meta_description,
        slug: data.slug,
      };
    }
  } catch (err) {
    console.error('Error fetching blog metadata from Supabase:', err);
  }

  // Fallback to mock data if DB query doesn't resolve anything
  if (!blog) {
    const found = mockBlogs.find((b) => b.slug === slug || b.id === slug);
    if (found) {
      blog = {
        title: found.title,
        content: found.content,
        metaDescription: found.summary,
        slug: found.slug,
      };
    }
  }

  if (!blog) {
    return {
      title: "Government Exam Preparation Strategy Guide | Aspirav",
      description: "Read detailed toppers study plans, daily routine structures, exam booklet guidelines, and mock tactics.",
      alternates: {
        canonical: `/guidance/${slug}`
      }
    };
  }

  const cleanSnippet = blog.metaDescription || (blog.content
    ? blog.content.substring(0, 160).replace(/[#*`\n\r]/g, ' ') + '...'
    : 'Read the detailed preparation guidance article on Aspirav.');

  return {
    title: `${blog.title} | Toppers Guidance Blog`,
    description: cleanSnippet,
    alternates: {
      canonical: `/guidance/${blog.slug}`
    }
  };
}

export default function GuidanceDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
