import type { Metadata } from 'next';
import { mockMaterials } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Resolve material note profile
  const material = mockMaterials.find((m) => m.slug === slug || m.id === slug);

  if (!material) {
    return {
      title: "Study Material PDF & Study Notes | Aspirav",
      description: "Download free government exam syllabus notes, practice sheets, and PDF textbooks on Aspirav."
    };
  }

  return {
    title: `${material.title} - Study Material Note | Aspirav`,
    description: `Access study sheet: ${material.title}. Includes comprehensive summaries, exam tips, and PDF reference sets for competitive preparations.`,
    alternates: {
      canonical: `/materials/${slug}`
    }
  };
}

export default function MaterialDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
