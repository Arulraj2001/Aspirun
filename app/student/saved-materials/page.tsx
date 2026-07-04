'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockMaterials } from '@/data/mockData';
import { StudyMaterial } from '@/types';
import { BookOpen, Bookmark, Trash2, ArrowLeft } from 'lucide-react';

export default function SavedMaterialsPage() {
  const [savedItems, setSavedItems] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch bookmarks list from local storage
    const savedIds = JSON.parse(localStorage.getItem('saved_materials_ids') || '[]');
    
    const finalIds = savedIds;

    // 2. Fetch full materials db
    const savedMat = localStorage.getItem('materials_db');
    let materialsList: StudyMaterial[] = [];
    if (savedMat) {
      materialsList = JSON.parse(savedMat);
    } else {
      materialsList = mockMaterials;
    }

    const filtered = materialsList.filter((m) => finalIds.includes(m.id));
    setTimeout(() => {
      setSavedItems(filtered);
      setLoading(false);
    }, 0);
  }, []);

  const handleRemoveBookmark = (id: string) => {
    const savedIds: string[] = JSON.parse(localStorage.getItem('saved_materials_ids') || '[]');
    const updatedIds = savedIds.filter((item) => item !== id);
    localStorage.setItem('saved_materials_ids', JSON.stringify(updatedIds));

    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    alert('Material removed from saved list.');
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Syncing bookmarks...</h3>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back to student dashboard */}
      <div className="mb-6">
        <Link href="/student/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <SectionHeader
        title="My Saved Study Materials"
        subtitle="Access all your bookmarked syllabus notes, formula sheets, and practice sets."
      />

      {savedItems.length === 0 ? (
        <Card className="text-center py-16 border border-surface-200 bg-surface-50/20">
          <Bookmark className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">No Saved Materials</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">Bookmark articles and PDFs inside the Materials listing catalogs to save them here.</p>
          <Link href="/materials" className="mt-4 inline-block">
            <Button size="sm">Explore Materials</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedItems.map((item) => (
            <Card key={item.id} className="border border-surface-200 flex flex-col justify-between hover:border-brand-200 transition-colors">
              <div>
                <div className="flex justify-between items-start gap-3.5 mb-3.5">
                  <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleRemoveBookmark(item.id)}
                    className="text-surface-450 hover:text-danger-600 p-1 cursor-pointer transition-colors"
                    title="Remove bookmark"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                <h3 className="text-sm md:text-base font-black text-surface-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-surface-500 font-semibold mt-1">
                  Subject: {item.subject} &bull; Target Exam: {item.examId.replace('mock-', '').toUpperCase()}
                </p>
              </div>

              <div className="pt-5 border-t border-surface-100 mt-5 flex justify-end">
                <Link href={`/materials/${item.slug || item.id}`}>
                  <Button size="sm" variant="primary" icon={<BookOpen className="h-4 w-4" />}>
                    Continue Reading
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
