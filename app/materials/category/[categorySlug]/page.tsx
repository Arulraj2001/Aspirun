'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockExams, mockMaterials } from '@/data/mockData';
import { StudyMaterial } from '@/types';
import {
  BookOpen,
  Download,
  Video,
  FileText,
  Bookmark,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export default function MaterialsCategoryPage({ params }: PageProps) {
  const { categorySlug } = use(params);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  useEffect(() => {
    let saved = localStorage.getItem('materials_db');
    if (!saved) {
      localStorage.setItem('materials_db', JSON.stringify(mockMaterials));
      saved = JSON.stringify(mockMaterials);
    }
    const data: StudyMaterial[] = JSON.parse(saved);
    setTimeout(() => {
      // Filter by category slug (case-insensitive) and publish status
      setMaterials(
        data.filter(
          (m) =>
            m.category.toLowerCase().replace(' ', '-') === categorySlug.toLowerCase() &&
            m.status !== 'draft'
        )
      );
    }, 0);
  }, [categorySlug]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'PDF':
        return <FileText className="h-4.5 w-4.5 text-red-500" />;
      case 'Video':
        return <Video className="h-4.5 w-4.5 text-blue-500" />;
      case 'Formula sheet':
        return <FileSpreadsheet className="h-4.5 w-4.5 text-teal-650" />;
      case 'Notes':
        return <Bookmark className="h-4.5 w-4.5 text-brand-650" />;
      default:
        return <BookOpen className="h-4.5 w-4.5 text-surface-500" />;
    }
  };

  const formattedTitle = categorySlug
    .replace('-', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title={`${formattedTitle} Catalog`}
        subtitle={`Browse our detailed exam preparation materials categorized under ${formattedTitle}.`}
        action={
          <Link href="/materials">
            <Button size="sm" variant="outline">
              Back to Catalog
            </Button>
          </Link>
        }
      />

      {materials.length === 0 ? (
        <Card className="text-center py-12 border border-surface-200 bg-surface-50/50">
          <AlertCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">No Handouts Found</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">We don&apos;t have any published materials under this format format.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => {
            const associatedExam = mockExams.find((e) => e.id === material.examId);
            const materialSlug = material.slug || material.id;
            const hasPDF = material.url && material.url.toLowerCase().endsWith('.pdf');

            return (
              <Card key={material.id} className="border border-surface-200 flex flex-col justify-between hover:border-surface-300 transition-colors animate-in fade-in duration-200">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-brand-650 bg-brand-50 px-2.5 py-0.5 rounded uppercase border border-brand-100">
                      {getCategoryIcon(material.category)}
                      {material.category}
                    </span>
                    <StatusBadge status={material.isFree ? 'free' : 'premium'} />
                  </div>

                  <h3 className="text-sm font-black text-surface-850 leading-snug line-clamp-2">
                    {material.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-[10px] text-surface-450 font-bold uppercase">
                    <span>{associatedExam?.code || 'Govt Exam'}</span>
                    <span>&bull;</span>
                    <span>{material.subject}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6 pt-4 border-t border-surface-150">
                  <Link href={`/materials/${materialSlug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                      Read Online
                    </Button>
                  </Link>

                  {hasPDF && (
                    <a href={material.url} download className="flex-1">
                      <Button variant="primary" size="sm" className="w-full justify-center text-xs flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" /> Get PDF
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
