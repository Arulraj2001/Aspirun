import type { Metadata } from 'next';
import { mockMaterials } from '@/data/mockData';
import { supabaseServer } from '@/lib/supabase/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;

  let material: any = null;

  // Try fetching from database first
  try {
    const { data, error } = await supabaseServer
      .from('materials')
      .select('*')
      .or(`slug.eq."${slug}",id.eq."${slug}"`)
      .maybeSingle();

    if (data && !error) {
      material = {
        title: data.title,
        metaDescription: data.meta_description,
        slug: data.slug,
      };
    }
  } catch (err) {
    console.error('Error fetching materials metadata from Supabase:', err);
  }

  // Fallback to mock data
  if (!material) {
    const found = mockMaterials.find((m) => m.slug === slug || m.id === slug);
    if (found) {
      material = {
        title: found.title,
        metaDescription: `Access study sheet: ${found.title} on subject ${found.subject}.`,
        slug: found.slug,
      };
    }
  }

  if (!material) {
    return {
      title: "Study Material PDF & Study Notes | Aspirav",
      description: "Download free government exam syllabus notes, practice sheets, and PDF textbooks on Aspirav.",
      alternates: {
        canonical: `/materials/${slug}`
      }
    };
  }

  const cleanDescription = material.metaDescription || 
    `Access study sheet: ${material.title}. Includes comprehensive summaries, exam tips, and PDF reference sets for competitive preparations.`;

  return {
    title: `${material.title} - Study Material Note | Aspirav`,
    description: cleanDescription,
    alternates: {
      canonical: `/materials/${material.slug}`
    }
  };
}

export default function MaterialDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
