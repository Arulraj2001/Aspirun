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
import { ArrowLeft, Save, Sparkles, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { mockBlogs } from '@/data/mockData';
import { BlogPost } from '@/types';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

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

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbMode, setDbMode] = useState(false);

  useEffect(() => {
    async function loadBlogDetails() {
      const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                           !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

      if (isConfigured) {
        try {
          const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', blogId)
            .maybeSingle();

          if (data && !error) {
            setTitle(data.title);
            setSlug(data.slug || '');
            setExcerpt(data.excerpt || '');
            setContent(data.content || '');
            setCategory(data.category || 'Study Routine');
            setCoverImageUrl(data.cover_image_url || '');
            setTags(data.tags ? data.tags.join(', ') : '');
            setReadTimeMinutes(data.read_time_minutes || 5);
            setStatus((data.status as any) || 'published');
            setMetaDescription(data.meta_description || '');
            setMetaKeywords(data.meta_keywords ? data.meta_keywords.join(', ') : '');
            setDbMode(true);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching blog from Supabase:', err);
        }
      }

      // LocalStorage / Mock fallback
      const saved = localStorage.getItem('blogs_db') || '[]';
      const allBlogs: BlogPost[] = JSON.parse(saved).length > 0 ? JSON.parse(saved) : mockBlogs;
      const found = allBlogs.find((b) => b.id === blogId);

      if (found) {
        setTitle(found.title);
        setSlug(found.slug || '');
        setExcerpt(found.summary || '');
        setContent(found.content || '');
        setCategory(found.category || 'Study Routine');
        setTags('');
        setCoverImageUrl('');
        const minutes = parseInt(found.readTime) || 5;
        setReadTimeMinutes(minutes);
        setStatus('published');
        setMetaDescription('');
        setMetaKeywords('');
      }

      setDbMode(false);
      setLoading(false);
    }

    loadBlogDetails();
  }, [blogId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    const keywordsArray = metaKeywords.split(',').map(k => k.trim()).filter(Boolean);

    if (dbMode) {
      try {
        const { error } = await supabase
          .from('blogs')
          .update({
            title,
            slug,
            excerpt: excerpt || null,
            content,
            category,
            cover_image_url: coverImageUrl || null,
            tags: tagsArray,
            read_time_minutes: readTimeMinutes,
            status,
            meta_description: metaDescription || null,
            meta_keywords: keywordsArray,
            updated_at: new Date().toISOString()
          })
          .eq('id', blogId);

        if (!error) {
          setIsSubmitting(false);
          alert('Guidance article modifications saved to Supabase successfully.');
          router.push('/admin/blogs');
          return;
        } else {
          console.error('Supabase update error:', error);
        }
      } catch (err) {
        console.error('Database update crashed:', err);
      }
    }

    // LocalStorage Fallback
    const saved = localStorage.getItem('blogs_db') || '[]';
    const allBlogs: BlogPost[] = JSON.parse(saved);

    const updated = allBlogs.map((b) => {
      if (b.id === blogId) {
        return {
          ...b,
          title,
          slug,
          summary: excerpt,
          content,
          category,
          readTime: `${readTimeMinutes} mins read`
        };
      }
      return b;
    });

    localStorage.setItem('blogs_db', JSON.stringify(updated));

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Guidance blog updates saved to LocalStorage.');
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
          Modify Guidance Blog {dbMode && <span className="text-xs text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded font-normal ml-2">Supabase Sync</span>}
        </h1>
        <p className="text-xs text-surface-450 font-bold mt-1">
          Edit and save corrections to topper guidance articles.
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
                label="URL Slug"
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
          {/* Metadata Settings */}
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
            Save Modifications
          </Button>
        </div>
      </form>
    </Container>
  );
}
