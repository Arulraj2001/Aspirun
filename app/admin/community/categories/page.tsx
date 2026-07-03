'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { mockExams } from '@/data/mockData';
import {
  ArrowLeft,
  Plus,
  Pin,
  Edit
} from 'lucide-react';

interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  linkedExamCode: string;
  rulesText: string;
  isActive: boolean;
  isPinned: boolean;
}

const defaultCategories: CategoryConfig[] = [
  { id: 'cat-1', name: 'SSC Exams', slug: 'ssc', description: 'CGL, CHSL, MTS & CPO doubt clearing', linkedExamCode: 'SSC-CGL', rulesText: 'Strictly exam-related shortcuts and syllabus questions.', isActive: true, isPinned: true },
  { id: 'cat-2', name: 'Railway Exams', slug: 'railway', description: 'RRB NTPC, Group D & ALP queries', linkedExamCode: 'RRB-NTPC', rulesText: 'No advertising or coaching referrals.', isActive: true, isPinned: true },
  { id: 'cat-3', name: 'Police Exams', slug: 'police', description: 'State Sub-Inspector & Constable lists', linkedExamCode: 'UP-SI', rulesText: 'Discuss syllabus questions only.', isActive: true, isPinned: false },
  { id: 'cat-4', name: 'Banking Exams', slug: 'banking', description: 'IBPS PO/Clerk & SBI prep strategies', linkedExamCode: 'SBI-PO', rulesText: 'Share only reference answers or strategies.', isActive: true, isPinned: false }
];

export default function CategoriesConfigPage() {
  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [linkedExam, setLinkedExam] = useState('');
  const [rules, setRules] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    let saved = localStorage.getItem('community_categories_db');
    if (!saved) {
      localStorage.setItem('community_categories_db', JSON.stringify(defaultCategories));
      saved = JSON.stringify(defaultCategories);
    }
    const data: CategoryConfig[] = JSON.parse(saved);
    setTimeout(() => {
      setCategories(data);
    }, 0);
  }, []);

  const handleOpenNewModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setLinkedExam('SSC-CGL');
    setRules('');
    setIsActive(true);
    setIsPinned(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryConfig) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setLinkedExam(cat.linkedExamCode);
    setRules(cat.rulesText);
    setIsActive(cat.isActive);
    setIsPinned(cat.isPinned);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    let updatedList: CategoryConfig[] = [];

    if (editingCategory) {
      // Edit
      updatedList = categories.map((c) => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            name,
            slug: slug.toLowerCase().replace(/\s+/g, '-'),
            description,
            linkedExamCode: linkedExam,
            rulesText: rules,
            isActive,
            isPinned
          };
        }
        return c;
      });
      alert('Category configurations updated.');
    } else {
      // Create
      const newCat: CategoryConfig = {
        id: `cat-${Date.now()}`,
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description,
        linkedExamCode: linkedExam,
        rulesText: rules,
        isActive,
        isPinned
      };
      updatedList = [...categories, newCat];
      alert('New doubt category initialized.');
    }

    localStorage.setItem('community_categories_db', JSON.stringify(updatedList));
    setCategories(updatedList);
    setIsModalOpen(false);
  };

  const handleTogglePin = (id: string) => {
    const updated = categories.map((c) => {
      if (c.id === id) {
        return { ...c, isPinned: !c.isPinned };
      }
      return c;
    });
    localStorage.setItem('community_categories_db', JSON.stringify(updated));
    setCategories(updated);
    alert('Pin status updated.');
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back to admin community dashboard */}
      <div className="mb-6">
        <Link href="/admin/community" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Moderation Hub
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 leading-snug">
            Category Configuration Management
          </h1>
          <p className="text-xs text-surface-500 font-semibold mt-1">
            Build and optimize doubt categories for student forums.
          </p>
        </div>

        <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={handleOpenNewModal}>
          Initialize New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className={`border ${cat.isActive ? 'border-surface-200' : 'border-surface-150 bg-surface-50'}`}>
            <div className="flex flex-col gap-4">
              
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm md:text-base font-black text-surface-900 leading-snug">{cat.name}</h3>
                    {cat.isPinned && (
                      <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                      cat.isActive 
                        ? 'bg-success-50 border-success-100 text-success-700' 
                        : 'bg-surface-200 border-surface-300 text-surface-500'
                    }`}>
                      {cat.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </div>
                  <p className="text-[10px] text-surface-450 font-bold uppercase mt-1">Slug: /{cat.slug}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleTogglePin(cat.id)} className="h-7 text-[10px] uppercase font-black">
                    Pin/Unpin
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(cat)} className="h-7 text-[10px] uppercase font-black">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-surface-550 leading-relaxed font-semibold">
                {cat.description}
              </p>

              <div className="bg-surface-50 p-3 rounded-xl border border-surface-150 text-[11px] font-bold text-surface-500">
                <p>Linked Exam: <strong className="text-surface-750">{cat.linkedExamCode}</strong></p>
                {cat.rulesText && <p className="mt-1">Safety Instruction: <span className="text-brand-600 italic font-semibold">&quot;{cat.rulesText}&quot;</span></p>}
              </div>

            </div>
          </Card>
        ))}
      </div>

      {/* Edit/Create Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Modify configurations: ${editingCategory.name}` : 'Initialize New Category'}
        size="md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., General Studies"
          />

          <Input
            label="Category Slug (URL path)"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g., general-studies"
            hint="Lowercase words separated by hyphens."
          />

          <Input
            label="Brief Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., General studies & UPSC prep queries"
          />

          <Select
            label="Linked Exam"
            value={linkedExam}
            onChange={(e) => setLinkedExam(e.target.value)}
            options={mockExams.map((e) => ({
              value: e.code,
              label: `${e.name} (${e.code})`
            }))}
          />

          <Input
            label="Safety Instructions / Custom Category Rule"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="e.g., Post only NCERT doubts"
            hint="Displays dynamically inside rules banner."
          />

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-surface-650">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Category Active status
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-surface-650">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              Pin at Top of forum lists
            </label>
          </div>

          <div className="pt-3 border-t border-surface-150 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Category Config
            </Button>
          </div>

        </form>
      </Modal>

    </Container>
  );
}
