'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { mockExams, mockMaterials } from '@/data/mockData';
import { StudyMaterial, MaterialCategory } from '@/types';
import { ArrowLeft, Save, Upload, FileText, CheckCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditMaterialPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [examId, setExamId] = useState('exam-upsc');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('PDF');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('English');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  
  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [simulatedPath, setSimulatedPath] = useState('');
  const [fileMeta, setFileMeta] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let saved = localStorage.getItem('materials_db');
    if (!saved) {
      localStorage.setItem('materials_db', JSON.stringify(mockMaterials));
      saved = JSON.stringify(mockMaterials);
    }
    const data: StudyMaterial[] = JSON.parse(saved);
    const item = data.find((m) => m.id === id);

    setTimeout(() => {
      if (item) {
        setTitle(item.title);
        setSlug(item.slug || '');
        setExamId(item.examId);
        setSubject(item.subject);
        setTopic(item.topic || '');
        setCategory(item.category);
        setContent(item.content || '');
        setVideoUrl(item.videoUrl || '');
        setLanguage(item.language || 'English');
        setIsFree(item.isFree);
        setPrice(item.price ? String(item.price) : '');
        setStatus(item.status || 'published');
        setSimulatedPath(item.url || '');
        setFileMeta(item.sizeOrDuration || '');
      }
      setLoading(false);
    }, 0);
  }, [id]);

  // Handle PDF Upload Simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploading(true);
      
      // Simulate Supabase Storage Upload duration
      setTimeout(() => {
        setUploading(false);
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const mockUrl = `/uploads/${cleanName}`;
        setSimulatedPath(mockUrl);
        setFileMeta(`${(file.size / 1024 / 1024).toFixed(2)} MB`);
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subject.trim()) {
      alert('Please fill out the title and subject fields.');
      return;
    }

    const finalSlug = slug.trim() 
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : title.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    const saved = localStorage.getItem('materials_db') || '[]';
    const currentMaterials: StudyMaterial[] = JSON.parse(saved);

    const updated = currentMaterials.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          examId,
          title,
          category,
          sizeOrDuration: category === 'PDF' || category === 'Notes' || category === 'Formula sheet'
            ? (fileMeta || m.sizeOrDuration || '1.2 MB')
            : '30 mins',
          url: category === 'PDF' || category === 'Formula sheet' || category === 'Practice set'
            ? (simulatedPath || m.url || '/uploads/sample_handout.pdf')
            : videoUrl || '#',
          isFree,
          subject,
          slug: finalSlug,
          content,
          videoUrl: category === 'Video' ? videoUrl : undefined,
          language,
          price: !isFree && price ? parseFloat(price) : undefined,
          status,
          topic,
          updatedAt: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
      }
      return m;
    });

    localStorage.setItem('materials_db', JSON.stringify(updated));
    router.push('/admin/materials');
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Loading Form Data...</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">Retrieving study material details.</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/admin/materials" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Materials List
        </Link>
      </div>

      <SectionHeader
        title="Edit Study Material"
        subtitle={`Update configuration and parameters for: ${title}`}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form Core Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100">
                Core Metadata
              </h3>

              <div className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Material Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Indian Parliament High-Yield Revision Handout"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Custom Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g., parliament-revision-notes"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500 text-surface-550"
                  />
                </div>

                {/* Subject & Topic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                      Subject Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Indian Polity"
                      className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                      Topic Milestone
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Parliament structure"
                      className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Detailed Document Content (HTML / Text)
                  </label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write or paste detailed content notes here..."
                    className="w-full px-4 py-3 text-xs md:text-sm font-medium border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

              </div>
            </Card>

            {/* Document PDF Upload Section */}
            {(category === 'PDF' || category === 'Formula sheet' || category === 'Practice set') && (
              <Card className="border border-surface-200">
                <h3 className="text-sm font-black text-surface-850 mb-3 flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-brand-650" />
                  PDF Attachment (Supabase Storage upload)
                </h3>
                <p className="text-[11px] text-surface-450 mb-4 font-semibold">
                  Select a document file to update the Supabase Storage bucket. This will replace the previous reference attachment.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-surface-300 bg-surface-50 rounded-2xl justify-center text-center">
                  <label className="cursor-pointer flex flex-col items-center justify-center">
                    <span className="p-3 bg-white border border-surface-200 text-surface-450 hover:text-brand-500 rounded-xl shadow-xs inline-flex mb-2">
                      <Upload className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-black text-surface-850">Replace PDF Document File</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {uploading && (
                  <p className="text-xs text-brand-600 font-extrabold mt-3 animate-pulse">Uploading file to storage bucket...</p>
                )}

                {simulatedPath && (
                  <div className="mt-4 p-3 bg-success-50 border border-success-200 text-success-850 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success-600" />
                    <span>File Target Linked: {uploadedFile ? uploadedFile.name : simulatedPath} ({fileMeta})</span>
                  </div>
                )}
              </Card>
            )}

            {/* Video lecture URL */}
            {category === 'Video' && (
              <Card className="border border-surface-200">
                <h3 className="text-sm font-black text-brand-900 mb-4">Video Link Mapping</h3>
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Tutorial Link / URL
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </Card>
            )}

          </div>

          {/* Right Column: Taxonomy and publish settings */}
          <div className="space-y-6">
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100">
                Taxonomy & Access
              </h3>

              <div className="space-y-4">
                
                {/* Exam Category */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Target Exam Category
                  </label>
                  <Select
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                    options={mockExams.map((e) => ({ value: e.id, label: e.name }))}
                  />
                </div>

                {/* Category Type */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Material Format Type
                  </label>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                    options={[
                      { value: 'PDF', label: 'PDF Document' },
                      { value: 'Video', label: 'Video Lecture' },
                      { value: 'Notes', label: 'Revision Notes' },
                      { value: 'Formula sheet', label: 'Formula Sheet' },
                      { value: 'Practice set', label: 'Practice Set' },
                      { value: 'Article', label: 'Articles' },
                    ]}
                  />
                </div>

                {/* Pricing Toggles */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Access Level
                  </label>
                  <Select
                    value={isFree ? 'free' : 'premium'}
                    onChange={(e) => setIsFree(e.target.value === 'free')}
                    options={[
                      { value: 'free', label: 'Free Access' },
                      { value: 'premium', label: 'Premium Locked' },
                    ]}
                  />
                </div>

                {/* Price input (only if Premium is active) */}
                {!isFree && (
                  <div>
                    <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                      Price (INR optional)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 99"
                      className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}

                {/* Language */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Content Language
                  </label>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    options={[
                      { value: 'English', label: 'English Only' },
                      { value: 'Hindi', label: 'Bilingual (Hindi/English)' },
                    ]}
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Publishing Status
                  </label>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    options={[
                      { value: 'published', label: 'Published (Public)' },
                      { value: 'draft', label: 'Draft (Internal)' },
                    ]}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" size="md" className="w-full justify-center" icon={<Save className="h-4.5 w-4.5" />}>
                    Save Changes
                  </Button>
                </div>

              </div>
            </Card>
          </div>

        </div>
      </form>
    </Container>
  );
}
