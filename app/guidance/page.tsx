'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockBlogs } from '@/data/mockData';
import { BlogPost } from '@/types';
import { Clock, ArrowRight, Search } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Study Routine',
  'Mock Strategy',
  'Revision',
  'Motivation',
  'Exam Tips',
  'Time Management',
  'Mistake Analysis'
];

export default function GuidancePage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Sync blogs
    let saved = localStorage.getItem('blogs_db');
    if (!saved) {
      localStorage.setItem('blogs_db', JSON.stringify(mockBlogs));
      saved = JSON.stringify(mockBlogs);
    }
    const data: BlogPost[] = JSON.parse(saved);
    setTimeout(() => {
      setBlogs(data);
      setLoading(false);
    }, 0);
  }, []);

  // Filter based on search & category selection
  const filtered = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    // Perform loose match on category slug
    return matchesSearch && blog.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      <SectionHeader
        title="Topper & Mentor Guidance Blogs"
        subtitle="Read step-by-step exam preparation techniques, revision maps, and scheduling tips from exam toppers."
      />

      {/* Search and Category filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search blogs, authors or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 text-xs md:text-sm bg-white border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-semibold">Loading guides library...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16 border border-surface-200 bg-surface-50/20">
          <p className="text-xs text-surface-450 font-semibold italic">No articles found matching the current search parameters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((blog) => (
            <Card key={blog.id} hoverable className="flex flex-col justify-between border border-surface-200 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                    {blog.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-surface-450">
                    <Clock className="h-3.5 w-3.5" /> {blog.readTime}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-black text-surface-900 leading-snug mb-3 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-surface-500 font-semibold leading-relaxed mb-6 line-clamp-2">
                  {blog.summary}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-surface-100 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-650 font-black border border-brand-100 text-xs">
                    {blog.author[0]}
                  </span>
                  <div>
                    <p className="text-xs font-black text-surface-800">{blog.author}</p>
                    <p className="text-[9px] text-surface-450 font-bold uppercase">{blog.authorRole}</p>
                  </div>
                </div>

                <Link href={`/guidance/${blog.slug || blog.id}`}>
                  <Button variant="ghost" size="sm" className="text-xs font-black flex items-center gap-1">
                    Read Article <ArrowRight className="h-4 w-4" />
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
