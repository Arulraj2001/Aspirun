'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCommunityPosts } from '@/data/mockData';
import { CommunityPost } from '@/types';
import {
  MessageSquare,
  ThumbsUp,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function CommunityHomepage() {
  const [trendingThreads, setTrendingThreads] = useState<CommunityPost[]>([]);

  useEffect(() => {

    // 2. Load threads from localStorage or seed
    let saved = localStorage.getItem('community_threads_db');
    if (!saved) {
      localStorage.setItem('community_threads_db', JSON.stringify(mockCommunityPosts));
      saved = JSON.stringify(mockCommunityPosts);
    }
    const data: CommunityPost[] = JSON.parse(saved);
    
    // Safety check: filter out threads with >=3 reports and sort by upvotes for trending
    const trending = data
      .filter((t) => t.reportsCount < 3)
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 3);
      
    setTimeout(() => {
      setTrendingThreads(trending);
    }, 0);
  }, []);

  const categories = [
    { slug: 'ssc', label: 'SSC Exams', desc: 'CGL, CHSL, MTS & CPO doubt clearing' },
    { slug: 'railway', label: 'Railway Exams', desc: 'RRB NTPC, Group D & ALP queries' },
    { slug: 'police', label: 'Police Exams', desc: 'State Sub-Inspector & Constable lists' },
    { slug: 'banking', label: 'Banking Exams', desc: 'IBPS PO/Clerk & SBI prep strategies' },
    { slug: 'state-exams', label: 'State Exams', desc: 'UPPSC, BPSC, MPSC & state civil resources' },
    { slug: 'study-routine', label: 'Study Routine', desc: 'Time-tables, daily streaks, & tracking reviews' },
    { slug: 'motivation', label: 'Motivation', desc: 'Inspirational tips and aspirant success logs' },
    { slug: 'mock-discussion', label: 'Mock Discussions', desc: 'Sectional speeds, MCQs, & syllabus unlocks' }
  ];

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-12">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-950 rounded-3xl p-6 md:p-12 text-white relative overflow-hidden shadow-lg border border-brand-950">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-300 bg-brand-850 px-2.5 py-0.5 rounded border border-brand-800">
            Secure Student Forums
          </span>
          <h1 className="text-xl md:text-3.5xl font-black tracking-tight leading-snug">
            Safe, Admin-Moderated Peer doubt clearing
          </h1>
          <p className="text-xs md:text-sm text-brand-200 font-semibold leading-relaxed">
            Connect with serious competitive exam aspirants, post syllabus queries, share subject study strategies, and solve routine challenges without adverts, contact exchanges, or promotional spam.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link href="/community/rules">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Strict Guidelines
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative backdrop elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-brand-800/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Safety Notice Warning Banner */}
      <div className="p-4.5 bg-brand-50 border border-brand-150 rounded-2xl flex items-start gap-3.5 max-w-4xl">
        <ShieldAlert className="h-5.5 w-5.5 text-brand-650 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs md:text-sm font-extrabold text-brand-900">Safety & Moderation Warning notice</h4>
          <p className="text-xs text-brand-700 leading-relaxed font-semibold mt-1">
            StudySetu is committed to keeping comments exam-focused. Links, contacts exchange (WhatsApp, Telegram handles, phone numbers), paid materials selling, or misbehavior will trigger an immediate permanent mute or hardware profile ban.
          </p>
        </div>
      </div>

      {/* Grid Categories */}
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-base md:text-xl font-black text-surface-850 uppercase tracking-wider">
            Explore Categories
          </h2>
          <span className="text-xs text-surface-450 font-bold uppercase">Select Category below to post</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Card key={cat.slug} hoverable className="border border-surface-200 flex flex-col justify-between hover:border-brand-300 transition-colors">
              <div>
                <span className="p-2.5 bg-surface-50 text-brand-650 rounded-xl inline-flex mb-3.5 border border-surface-150">
                  <MessageSquare className="h-5 w-5" />
                </span>
                <h3 className="text-sm md:text-base font-black text-surface-900">{cat.label}</h3>
                <p className="text-xs text-surface-450 mt-1 font-semibold leading-relaxed line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-5 border-t border-surface-100 mt-5 flex justify-end">
                <Link href={`/community/${cat.slug}`}>
                  <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-black tracking-wider gap-1 group">
                    Enter Forum <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending discussions and guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trending posts list */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-base md:text-xl font-black text-surface-850 uppercase tracking-wider">
            Trending Discussions
          </h2>

          <div className="space-y-4">
            {trendingThreads.map((thread) => (
              <Card key={thread.id} hoverable className="border border-surface-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                        {thread.category}
                      </span>
                      {thread.isPinned && (
                        <span className="text-[10px] font-black bg-success-50 text-success-700 border border-success-100 px-2 py-0.5 rounded">
                          Pinned
                        </span>
                      )}
                      {thread.isSolved && (
                        <span className="text-[10px] font-black bg-success-50 text-success-700 border border-success-100 px-2 py-0.5 rounded">
                          Solved
                        </span>
                      )}
                      {thread.isLocked && (
                        <span className="text-[10px] font-black bg-surface-150 text-surface-600 px-2 py-0.5 rounded">
                          Locked
                        </span>
                      )}
                    </div>

                    <Link href={`/community/thread/${thread.id}`}>
                      <h3 className="text-xs md:text-base font-black text-surface-900 leading-snug mt-2 hover:text-brand-650 hover:underline cursor-pointer">
                        {thread.title}
                      </h3>
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-surface-550 leading-relaxed mt-2.5 line-clamp-2">
                  {thread.content}
                </p>

                <div className="flex items-center justify-between gap-4 mt-4 pt-3.5 border-t border-surface-150 flex-wrap">
                  <span className="text-[10px] font-bold text-surface-400">
                    Started by <strong className="text-surface-750">{thread.authorName}</strong> &bull; {new Date(thread.date).toLocaleDateString()}
                  </span>

                  <div className="flex gap-3 text-xs font-bold text-surface-500">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5 text-brand-600" /> {thread.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> {thread.repliesCount}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Rules */}
        <div className="space-y-6">
          <Card className="border-2 border-brand-100 bg-brand-50/20">
            <h3 className="text-sm font-black uppercase text-brand-850 tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldAlert className="h-5 w-5 text-brand-550 shrink-0" />
              Strict rules reminder
            </h3>
            
            <ul className="space-y-3.5 text-xs text-surface-650 font-bold leading-relaxed">
              <li className="flex gap-2">
                <span className="text-danger-600 font-black">1.</span>
                <span><strong>No spamming:</strong> Job notices, promotional channels, or paid course deals are banned.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-danger-600 font-black">2.</span>
                <span><strong>No contact swapping:</strong> Do not share personal emails, phone numbers, or social handles.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-danger-600 font-black">3.</span>
                <span><strong>Exam Topics Only:</strong> Discussions must correspond to syllabus topics, strategies, routinely timetables, or mocks.</span>
              </li>
            </ul>

            <div className="mt-6">
              <Link href="/community/rules">
                <Button size="sm" variant="outline" className="w-full justify-center">
                  Read rules guidelines
                </Button>
              </Link>
            </div>
          </Card>
        </div>

      </div>

    </Container>
  );
}
