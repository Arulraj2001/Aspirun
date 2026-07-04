'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Save, Sparkles, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { mockBlogs } from '@/data/mockData';
import { BlogPost } from '@/types';

export default function NewBlogPage() {
  const router = useRouter();

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Study Routine');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  // SEO Fields
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Auto-generate clean slug
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const keywordsArray = metaKeywords.split(',').map(k => k.trim()).filter(Boolean);

    // 1. Try to save to Supabase Database first
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const { error } = await supabase
          .from('blogs')
          .insert({
            title,
            slug,
            excerpt: excerpt || null,
            content,
            category,
            cover_image_url: coverImageUrl || null,
            tags: tagsArray,
            read_time_minutes: readTimeMinutes,
            status,
            author_id: userId,
            meta_description: metaDescription || null,
            meta_keywords: keywordsArray
          });

        if (!error) {
          setIsSubmitting(false);
          alert('Guidance article published to Supabase database successfully.');
          router.push('/admin/blogs');
          return;
        } else {
          console.error('Supabase save error:', error);
        }
      } catch (err) {
        console.error('Database insertion crashed:', err);
      }
    }

    // 2. LocalStorage Fallback if Supabase not configured or failed
    const newBlog: BlogPost = {
      id: `blog-cust-${Date.now()}`,
      title,
      slug,
      summary: excerpt,
      content,
      category,
      author: 'Admin Developer',
      authorRole: 'Content Moderator',
      readTime: `${readTimeMinutes} mins read`,
      date: new Date().toISOString().substring(0, 10)
    };

    const saved = localStorage.getItem('blogs_db') || '[]';
    const allBlogs: BlogPost[] = JSON.parse(saved);
    const updated = [...allBlogs, newBlog];
    localStorage.setItem('blogs_db', JSON.stringify(updated));

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Guidance blog saved to LocalStorage (Database offline/fallback mode).');
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
          Draft a new revision strategy, routine scheduling blog, or toppers handbook post.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Core Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-surface-200 space-y-4">
            <h2 className="text-sm font-black text-surface-850 uppercase tracking-wider border-b border-surface-100 pb-2">
              Article Content Details
            </h2>
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

            <Textarea
              label="Article Summary / Excerpt Brief"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Provide a short 1-2 sentence preview hook for catalog cards..."
              rows={2}
              required
            />

            <Textarea
              label="Rich Article Body Content (HTML Supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<p>Write your detailed guide here...</p>"
              rows={12}
              required
            />
          </Card>
        </div>

        {/* Right Column - Category & SEO Metadata Settings */}
        <div className="space-y-6">
          {/* Metadata Cards */}
          <Card className="border border-surface-200 space-y-4">
            <h2 className="text-sm font-black text-surface-850 uppercase tracking-wider border-b border-surface-100 pb-2 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-500" /> Settings & Category
            </h2>
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Read Time (Min)"
                type="number"
                min={1}
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(parseInt(e.target.value) || 5)}
                required
              />
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' }
                ]}
              />
            </div>

            <Input
              label="Cover Image URL"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />

            <Input
              label="Tags (Comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="UPSC, IAS, Strategy"
            />
          </Card>

          {/* SEO Metadata Card */}
          <Card className="border border-surface-200 bg-white space-y-4 shadow-sm">
            <h2 className="text-sm font-black text-surface-850 uppercase tracking-wider border-b border-surface-100 pb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-indigo-500" /> Google SEO Meta Tags
            </h2>

            <Textarea
              label={`Meta Description (${metaDescription.length}/160)`}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value.substring(0, 160))}
              placeholder="Search snippet description shown in search results..."
              rows={3}
            />

            <Input
              label="Meta Keywords (Comma separated)"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="upsc guide, study plan, schedule"
            />
          </Card>

          <Button type="submit" isLoading={isSubmitting} variant="primary" className="w-full justify-center" icon={<Save className="h-4.5 w-4.5" />}>
            Publish Blog Post
          </Button>
        </div>
      </form>
    </Container>
  );
}
