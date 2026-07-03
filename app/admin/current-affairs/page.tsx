'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCurrentAffairs } from '@/data/mockData';
import { CurrentAffairsItem } from '@/types';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function AdminCurrentAffairsDashboard() {
  const [items, setItems] = useState<CurrentAffairsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleDeleteItem = (id: string) => {
    if (!confirm('Are you sure you want to delete this bulletin?')) return;
    const updated = items.filter((ca) => ca.id !== id);
    localStorage.setItem('current_affairs_db', JSON.stringify(updated));
    setItems(updated);
    alert('Current affairs bulletin deleted successfully.');
  };

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-150 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
            Current Affairs Publisher Console
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Publish daily exam-relevant news bullets for students.
          </p>
        </div>

        <Link href="/admin/current-affairs/new">
          <Button size="sm" icon={<Plus className="h-4.5 w-4.5" />}>
            Publish News Bulletin
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-bold animate-pulse">Syncing timeline...</p>
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center py-16 border border-surface-200 bg-surface-50/20">
          <p className="text-xs text-surface-450 font-semibold italic">No daily bulletins published yet. Create one now!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border border-surface-200 hover:border-brand-200 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-1.5 py-0.2 rounded">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-semibold text-surface-400">Date: {item.date}</span>
                  </div>

                  <h3 className="text-xs md:text-sm font-black text-surface-850 leading-snug">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="danger"
                    size="sm"
                    className="h-8 text-xs font-black flex items-center gap-1"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
