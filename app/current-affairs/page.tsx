'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCurrentAffairs } from '@/data/mockData';
import { CurrentAffairsItem } from '@/types';
import { Calendar, ArrowRight } from 'lucide-react';

const CATEGORIES = ['All', 'National', 'International', 'Economy', 'Science & Tech', 'Sports'];

export default function CurrentAffairsPage() {
  const [items, setItems] = useState<CurrentAffairsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync current affairs
    let saved = localStorage.getItem('current_affairs_db');
    if (!saved) {
      localStorage.setItem('current_affairs_db', JSON.stringify(mockCurrentAffairs));
      saved = JSON.stringify(mockCurrentAffairs);
    }
    const data: CurrentAffairsItem[] = JSON.parse(saved);
    
    setTimeout(() => {
      setItems(data);
      setLoading(false);
    }, 0);
  }, []);

  // Filter items
  const filtered = items.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Sort items by date descending
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group sorted items by date string
  const groupedByDate: Record<string, CurrentAffairsItem[]> = {};
  sorted.forEach((item) => {
    const dStr = new Date(item.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groupedByDate[dStr]) {
      groupedByDate[dStr] = [];
    }
    groupedByDate[dStr].push(item);
  });

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      <SectionHeader
        title="Daily Current Affairs"
        subtitle="Stay updated with daily exam-relevant national and international bulletins."
      />

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-semibold">Loading current affairs timeline...</p>
        </div>
      ) : sorted.length === 0 ? (
        <Card className="text-center py-16 border border-surface-200 bg-surface-50/20">
          <p className="text-xs text-surface-450 font-semibold italic">No articles found in this category.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByDate).map(([dateStr, dayItems]) => (
            <div key={dateStr} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-surface-200 pb-2">
                <Calendar className="h-4.5 w-4.5 text-brand-600" />
                <h3 className="text-xs md:text-sm font-black text-surface-900 tracking-wider uppercase">
                  {dateStr}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dayItems.map((item) => (
                  <Card key={item.id} hoverable className="flex flex-col justify-between border border-surface-200 bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>

                      <h4 className="text-sm md:text-base font-black text-surface-900 leading-snug line-clamp-2 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-surface-500 font-semibold leading-relaxed line-clamp-2 mb-4">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-surface-100 flex justify-end">
                      <Link href={`/current-affairs/${item.slug || item.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs font-black flex items-center gap-1">
                          View details <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
