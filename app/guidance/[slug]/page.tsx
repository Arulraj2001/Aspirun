'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockBlogs, mockPlans, mockMaterials } from '@/data/mockData';
import { BlogPost, StudyPlan, StudyMaterial } from '@/types';
import { Calendar, Clock, ArrowLeft, MessageSquare, BookOpen, Compass } from 'lucide-react';

export default function GuidanceDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedPlans, setRelatedPlans] = useState<StudyPlan[]>([]);
  const [relatedMat, setRelatedMat] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch blogs
    const saved = localStorage.getItem('blogs_db') || '[]';
    const allBlogs: BlogPost[] = JSON.parse(saved).length > 0 ? JSON.parse(saved) : mockBlogs;
    const found = allBlogs.find((b) => b.slug === slug || b.id === slug);

    let plans: StudyPlan[] = [];
    let mat: StudyMaterial[] = [];

    if (found) {
      // Load related study plans matching general exams or categories
      const targetExam = found.category.includes('UPSC') ? 'exam-upsc' : 'exam-ssc';
      plans = mockPlans.filter((p) => p.examId === targetExam).slice(0, 2);

      // Load related materials matching subjects
      mat = mockMaterials.filter((m) => m.category === 'PDF' || m.category === 'Notes').slice(0, 2);
    }

    setTimeout(() => {
      if (found) {
        setBlog(found);
        setRelatedPlans(plans);
        setRelatedMat(mat);
      }
      setLoading(false);
    }, 0);
  }, [slug]);

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-semibold">Syncing article details...</p>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Article Not Found</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">We could not locate this guide in our system.</p>
        <Link href="/guidance">
          <Button>Back to Guidance Portal</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/guidance" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Guidance Library
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Blog Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                {blog.category}
              </span>
              <span className="text-xs font-bold text-surface-450 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Published: {blog.date}
              </span>
              <span className="text-xs font-bold text-surface-450 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {blog.readTime}
              </span>
            </div>

            <h1 className="text-2xl md:text-4.5xl font-black text-surface-900 leading-tight">
              {blog.title}
            </h1>

            {/* Author Profile block */}
            <div className="p-3 bg-surface-50 border border-surface-200 rounded-2xl flex items-center gap-2.5 w-fit">
              <span className="h-9 w-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-black border border-brand-200 text-xs">
                {blog.author[0]}
              </span>
              <div>
                <p className="text-xs font-black text-surface-800">By {blog.author}</p>
                <p className="text-[10px] text-brand-650 font-extrabold uppercase">{blog.authorRole}</p>
              </div>
            </div>

            <div
              className="text-xs md:text-sm font-semibold text-surface-700 leading-relaxed space-y-4 pt-6 border-t border-surface-150 blog-article-rich-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Peer Community discussion CTA */}
          <Card className="border border-brand-200 bg-brand-50/15 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="text-xs md:text-sm font-black text-brand-900 uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="h-4.5 w-4.5 text-brand-600" /> Have Questions or Doubts?
              </h4>
              <p className="text-xs text-surface-550 font-semibold mt-1 max-w-md leading-relaxed">
                Join our secure student forum and ask strategies doubts or revision shortcuts with peer aspirants.
              </p>
            </div>
            <Link href="/community">
              <Button size="sm" variant="primary" className="shrink-0 font-black">
                Open Peers Forum
              </Button>
            </Link>
          </Card>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-6">
          
          {/* Related Planner Pathways */}
          <Card className="border border-surface-200 bg-white">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-brand-650" />
              Related Study Plans
            </h3>

            <div className="space-y-3.5">
              {relatedPlans.map((plan) => (
                <div key={plan.id} className="p-3 bg-surface-50 border rounded-xl flex flex-col gap-1 hover:border-surface-300 transition-colors">
                  <h4 className="text-xs font-black text-surface-850 line-clamp-1 leading-snug">{plan.title}</h4>
                  <p className="text-[10px] text-surface-450 font-bold">{plan.durationDays} Days &bull; {plan.difficulty}</p>
                  <Link href={`/study-planner/${plan.examId.replace('exam-', '')}/${plan.slug || plan.id}`} className="mt-1.5 self-start">
                    <span className="text-[10px] font-black text-brand-650 hover:underline">
                      Explore Curriculum &rarr;
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          {/* Related Materials / PDF downloads */}
          <Card className="border border-surface-200 bg-white">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-brand-650" />
              Related Study Guides
            </h3>

            <div className="space-y-3.5">
              {relatedMat.map((mat) => (
                <div key={mat.id} className="p-3 bg-surface-50 border rounded-xl flex flex-col gap-1 hover:border-surface-300 transition-colors">
                  <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-1.5 py-0.2 rounded self-start">
                    {mat.category}
                  </span>
                  <h4 className="text-xs font-black text-surface-850 line-clamp-1 leading-snug mt-1">{mat.title}</h4>
                  <Link href={`/materials/${mat.slug || mat.id}`} className="mt-1.5">
                    <span className="text-[10px] font-black text-brand-650 hover:underline">
                      Read notes &rarr;
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </Container>
  );
}
