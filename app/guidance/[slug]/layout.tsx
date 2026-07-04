import type { Metadata } from 'next';
import { mockBlogs } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Resolve strategy guide blog profile
  const blog = mockBlogs.find((b) => b.slug === slug || b.id === slug);

  if (!blog) {
    return {
      title: "Government Exam Preparation Strategy Guide | Aspirav",
      description: "Read detailed toppers study plans, daily routine structures, exam booklet guidelines, and mock tactics."
    };
  }

  // Clean blog snippet text
  const cleanSnippet = blog.content
    ? blog.content.substring(0, 160).replace(/[#*`\n\r]/g, ' ') + '...'
    : 'Read the detailed preparation guidance article on Aspirav.';

  return {
    title: `${blog.title} | Toppers Guidance Blog`,
    description: cleanSnippet,
    alternates: {
      canonical: `/guidance/${slug}`
    }
  };
}

export default function GuidanceDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
