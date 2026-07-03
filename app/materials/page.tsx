'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockExams, mockMaterials } from '@/data/mockData';
import { StudyMaterial } from '@/types';
import {
  BookOpen,
  Search,
  Download,
  Video,
  FileText,
  Bookmark,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export default function MaterialsCatalogPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [examId, setExamId] = useState('all');
  const [subject, setSubject] = useState('all');
  const [category, setCategory] = useState('all');
  const [pricing, setPricing] = useState('all');

  useEffect(() => {
    // Sync catalog with local storage simulated DB
    let saved = localStorage.getItem('materials_db');
    if (!saved) {
      localStorage.setItem('materials_db', JSON.stringify(mockMaterials));
      saved = JSON.stringify(mockMaterials);
    }
    const data: StudyMaterial[] = JSON.parse(saved);
    setTimeout(() => {
      // Only show published materials to public
      setMaterials(data.filter((m) => m.status !== 'draft'));
    }, 0);
  }, []);

  // Filter materials based on controls
  const filteredMaterials = materials.filter((material) => {
    // 1. Text Search matching title or subject
    if (searchTerm.trim() && !material.title.toLowerCase().includes(searchTerm.toLowerCase()) && !material.subject.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // 2. Filter by Exam
    if (examId !== 'all' && material.examId !== examId) {
      return false;
    }
    // 3. Filter by Subject
    if (subject !== 'all' && material.subject.toLowerCase() !== subject.toLowerCase()) {
      return false;
    }
    // 4. Filter by Category type
    if (category !== 'all' && material.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    // 5. Filter by Pricing
    if (pricing !== 'all') {
      const isFreeMatch = pricing === 'free' ? material.isFree : !material.isFree;
      if (!isFreeMatch) return false;
    }
    return true;
  });

  // Extract unique subjects for dropdown
  const uniqueSubjects = Array.from(new Set(materials.map((m) => m.subject)));

  // Helper to get Category Icon
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'PDF':
        return <FileText className="h-4.5 w-4.5 text-red-500" />;
      case 'Video':
        return <Video className="h-4.5 w-4.5 text-blue-500" />;
      case 'Formula sheet':
        return <FileSpreadsheet className="h-4.5 w-4.5 text-teal-650" />;
      case 'Notes':
        return <Bookmark className="h-4.5 w-4.5 text-brand-600" />;
      default:
        return <BookOpen className="h-4.5 w-4.5 text-surface-500" />;
    }
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title="Study Materials & Handouts"
        subtitle="Access high-frequency PDF notes, video lectures, formula sheets, and strategy articles."
        action={
          <Link href="/admin/materials">
            <Button size="sm" variant="outline">
              Admin Portal
            </Button>
          </Link>
        }
      />

      {/* Filter Toolbar Controls */}
      <Card className="border border-surface-200 mb-8 bg-surface-50/55">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-surface-450" />
            <input
              type="text"
              placeholder="Search by topic, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-surface-250 rounded-xl text-xs md:text-sm font-semibold bg-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Exam Dropdown */}
          <Select
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            options={[
              { value: 'all', label: 'All Exam Categories' },
              ...mockExams.map((e) => ({ value: e.id, label: e.name })),
            ]}
          />

          {/* Subject Dropdown */}
          <Select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            options={[
              { value: 'all', label: 'All Subjects' },
              ...uniqueSubjects.map((sub) => ({ value: sub, label: sub })),
            ]}
          />

          {/* Type Category Dropdown */}
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'all', label: 'All Formats (PDF, Video)' },
              { value: 'PDF', label: 'PDF Documents' },
              { value: 'Video', label: 'Video Lectures' },
              { value: 'Notes', label: 'Revision Notes' },
              { value: 'Formula sheet', label: 'Formula Sheets' },
              { value: 'Practice set', label: 'Practice Sets' },
              { value: 'Article', label: 'Articles' },
            ]}
          />

          {/* Free/Premium Pricing */}
          <Select
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            options={[
              { value: 'all', label: 'Free & Premium' },
              { value: 'free', label: 'Free Access Only' },
              { value: 'premium', label: 'Premium Only' },
            ]}
          />

        </div>
      </Card>

      {/* Grid listing */}
      {filteredMaterials.length === 0 ? (
        <Card className="text-center py-12 border border-surface-200">
          <AlertCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">No Handouts Cataloged</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">Try adjusting your filters or search keywords.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => {
            const associatedExam = mockExams.find((e) => e.id === material.examId);
            const materialSlug = material.slug || material.id;
            
            // Checking if PDF file exists (has a valid pdf link)
            const hasPDF = material.url && material.url.toLowerCase().endsWith('.pdf');

            return (
              <Card key={material.id} className="border border-surface-200 flex flex-col justify-between hover:border-surface-300 transition-colors">
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
                    {material.topic && (
                      <>
                        <span>&bull;</span>
                        <span className="truncate max-w-[120px]">{material.topic}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6 pt-4 border-t border-surface-150">
                  <Link href={`/materials/${materialSlug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                      Read Online
                    </Button>
                  </Link>

                  {/* Show Download PDF button ONLY if PDF exists */}
                  {hasPDF && (
                    <a href={material.url} download className="flex-1" onClick={(e) => e.stopPropagation()}>
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
