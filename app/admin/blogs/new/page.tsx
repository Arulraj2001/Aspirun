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
import { BlogPost } from '@/types';

export default function NewBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Study Routine');
  const [author, setAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [readTime, setReadTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Auto-generate clean slug
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const newBlog: BlogPost = {
      id: `blog-cust-${Date.now()}`,
      title,
      slug,
      summary,
      content,
      category,
      author,
      authorRole,
      readTime: readTime || '5 mins read',
      date: new Date().toISOString().substring(0, 10)
    };

    const saved = localStorage.getItem('blogs_db') || '[]';
    const allBlogs: BlogPost[] = JSON.parse(saved);
    const updated = [...allBlogs, newBlog];
    localStorage.setItem('blogs_db', JSON.stringify(updated));

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Guidance blog published successfully.');
      router.push('/admin/blogs');
    }, 800);
  };

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
          Publish Guidance Article
        </h1>
        <p className="text-xs text-surface-450 font-bold mt-1">
          Draft a new revision strategy or routine scheduling blog.
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
              label="URL Slug (Auto-generated)"
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
              Publish Blog Post
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
