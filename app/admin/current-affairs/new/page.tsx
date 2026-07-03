'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { CurrentAffairsItem } from '@/types';

export default function NewCurrentAffairsPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('National');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const newItem: CurrentAffairsItem = {
      id: `ca-cust-${Date.now()}`,
      title,
      slug,
      summary,
      content,
      category: category as 'National' | 'International' | 'Economy' | 'Science & Tech' | 'Sports',
      date
    };

    const saved = localStorage.getItem('current_affairs_db') || '[]';
    const allItems: CurrentAffairsItem[] = JSON.parse(saved);
    const updated = [...allItems, newItem];
    localStorage.setItem('current_affairs_db', JSON.stringify(updated));

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Current affairs bulletin published successfully.');
      router.push('/admin/current-affairs');
    }, 800);
  };

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-6">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/current-affairs" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Console
        </Link>
      </div>

      <div className="border-b border-surface-150 pb-4">
        <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
          Publish News Bulletin
        </h1>
        <p className="text-xs text-surface-450 font-bold mt-1">
          Add a daily GK update card with key highlights summary points.
        </p>
      </div>

      <Card className="border border-surface-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bulletin Title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. India-UK Free Trade Agreement Negotiations Advance"
              required
            />
            <Input
              label="URL Slug (Auto-generated)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. india-uk-fta-advancements"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Topic Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'National', label: 'National' },
                { value: 'International', label: 'International' },
                { value: 'Economy', label: 'Economy & Finance' },
                { value: 'Science & Tech', label: 'Science & Space' },
                { value: 'Sports', label: 'Sports' }
              ]}
            />
            <Input
              label="Publication Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Brief Bullet Summary Hook"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Provide a 1-2 sentence hook highlighting the core event..."
            rows={2}
            required
          />

          <Textarea
            label="Rich Bulletin Content (HTML Supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="<p>Provide details, dates, and names here...</p>"
            rows={10}
            required
          />

          <div className="flex justify-end pt-4 border-t mt-6">
            <Button type="submit" isLoading={isSubmitting} icon={<Save className="h-4.5 w-4.5" />}>
              Publish Bulletin
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
