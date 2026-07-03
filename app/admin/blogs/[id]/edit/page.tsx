'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { BlogPost } from '@/types';
import { mockBlogs } from '@/data/mockData';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Study Routine');
  const [author, setAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [readTime, setReadTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('blogs_db') || '[]';
    const allBlogs: BlogPost[] = JSON.parse(saved).length > 0 ? JSON.parse(saved) : mockBlogs;
    const found = allBlogs.find((b) => b.id === blogId);

    setTimeout(() => {
      if (found) {
        setTitle(found.title);
        setSlug(found.slug || '');
        setSummary(found.summary);
        setContent(found.content);
        setCategory(found.category);
        setAuthor(found.author);
        setAuthorRole(found.authorRole);
        setReadTime(found.readTime);
      }
      setLoading(false);
    }, 0);
  }, [blogId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const saved = localStorage.getItem('blogs_db') || '[]';
    const allBlogs: BlogPost[] = JSON.parse(saved);

    const updated = allBlogs.map((b) => {
      if (b.id === blogId) {
        return {
          ...b,
          title,
          slug,
          summary,
          content,
          category,
          author,
          authorRole,
          readTime
        };
      }
      return b;
    });

    localStorage.setItem('blogs_db', JSON.stringify(updated));

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Guidance blog modifications saved successfully.');
      router.push('/admin/blogs');
    }, 800);
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-bold">Syncing draft details...</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-6">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/blogs" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Console
        </Link>
      </div>

      <div className="border-b border-surface-150 pb-4">
        <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
          Modify Guidance Blog
        </h1>
        <p className="text-xs text-surface-450 font-bold mt-1">
          Edit and save corrections to topper guidance articles.
        </p>
      </div>

      <Card className="border border-surface-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Article Title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. 5 Habits of High Scoring Mock Performers"
              required
            />
            <Input
              label="URL Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. habits-high-scoring-mock-performers"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Study Routine', label: 'Study Routine' },
                { value: 'Mock Strategy', label: 'Mock Strategy' },
                { value: 'Revision', label: 'Revision' },
                { value: 'Motivation', label: 'Motivation' },
                { value: 'Exam Tips', label: 'Exam Tips' },
                { value: 'Time Management', label: 'Time Management' },
                { value: 'Mistake Analysis', label: 'Mistake Analysis' }
              ]}
            />
            <Input
              label="Estimated Reading Time"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="e.g. 8 mins read"
            />
            <Input
              label="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. IAS Ankit Sharma"
              required
            />
          </div>

          <Input
            label="Author Subtitle / Role"
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            placeholder="e.g. Rank 14, UPSC CSE 2025"
            required
          />

          <Textarea
            label="Article Summary Brief"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Provide a short 1-2 sentence hook for catalog cards..."
            rows={2}
            required
          />

          <Textarea
            label="Rich Article Body Content (HTML Supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="<p>Write your detailed guide here...</p>"
            rows={10}
            required
          />

          <div className="flex justify-end pt-4 border-t mt-6">
            <Button type="submit" isLoading={isSubmitting} icon={<Save className="h-4.5 w-4.5" />}>
              Save Modifications
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
