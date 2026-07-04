import type { Metadata } from 'next';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { categorySlug } = await params;
  
  // Format visual label
  let examLabel = categorySlug.toUpperCase();
  if (categorySlug.toLowerCase() === 'upsc') examLabel = 'UPSC CSE';
  else if (categorySlug.toLowerCase() === 'ssc') examLabel = 'SSC CGL & CHSL';
  else if (categorySlug.toLowerCase() === 'rrb' || categorySlug.toLowerCase() === 'railways') examLabel = 'Railways RRB NTPC';
  else if (categorySlug.toLowerCase() === 'ibps' || categorySlug.toLowerCase() === 'banking') examLabel = 'IBPS Bank PO';

  return {
    title: `Free ${examLabel} Study Materials & PDF Notes | Aspirav`,
    description: `Download premium study PDFs, syllabus plans, formula lists, and practice sets tailored for ${examLabel} exams.`,
    alternates: {
      canonical: `/materials/category/${categorySlug}`
    }
  };
}

export default function MaterialCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
