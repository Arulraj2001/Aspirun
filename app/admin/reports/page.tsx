'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCommunityPosts } from '@/data/mockData';
import { CommunityPost } from '@/types';
import { ArrowLeft, ShieldCheck, AlertTriangle, Pin, Lock, Trash2 } from 'lucide-react';

export default function AdminReportsPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Flag some posts as reported for demonstration
    const flagged = mockCommunityPosts.map((p, idx) => {
      if (idx === 2) {
        return { ...p, reportsCount: 3 };
      }
      return p;
    });

    setTimeout(() => {
      setPosts(flagged);
      setLoading(false);
    }, 0);
  }, []);

  const handlePinPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isPinned: !p.isPinned };
        }
        return p;
      })
    );
    alert('Post pin updated.');
  };

  const handleLockThread = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isLocked: !p.isLocked };
        }
        return p;
      })
    );
    alert('Thread lock updated.');
  };

  const handleRemovePost = (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    alert('Post removed.');
  };

  const handleWarnUser = (authorName: string) => {
    alert(`Warned user ${authorName}.`);
  };

  const handleMuteUser = (authorName: string) => {
    alert(`Suspended user ${authorName} posting access.`);
  };

  const flaggedPosts = posts.filter((p) => p.reportsCount > 0);

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="border-b border-surface-150 pb-4">
        <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
          Doubt Reports Moderator Center
        </h1>
        <p className="text-xs text-surface-450 font-bold mt-1">
          Review community-reported questions, strategy sheets, and comments.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-bold animate-pulse">Syncing moderation log...</p>
        </div>
      ) : flaggedPosts.length === 0 ? (
        <Card className="text-center py-16 border border-surface-200 bg-surface-50/20">
          <ShieldCheck className="h-10 w-10 text-success-650 mx-auto mb-2" />
          <p className="text-xs text-surface-450 font-bold">Workspace clean. No reported posts outstanding.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {flaggedPosts.map((post) => (
            <Card key={post.id} className="border-2 border-danger-100 bg-white">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-danger-700 bg-danger-50 px-2 py-0.5 rounded border border-danger-100 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Flagged: {post.reportsCount} reports
                    </span>
                    <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2 py-0.5 rounded">
                      Category: {post.category}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePinPost(post.id)} className="h-8 text-xs">
                      <Pin className="h-3.5 w-3.5 mr-1" />
                      {post.isPinned ? 'Unpin' : 'Pin'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleLockThread(post.id)} className="h-8 text-xs">
                      <Lock className="h-3.5 w-3.5 mr-1" />
                      {post.isLocked ? 'Unlock' : 'Lock'}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm md:text-base font-bold text-surface-900 leading-snug">{post.title}</h4>
                  <p className="text-xs text-surface-550 leading-relaxed font-semibold mt-1.5">{post.content}</p>
                  <p className="text-[10px] text-surface-450 font-bold mt-2">
                    Author: {post.authorName} ({post.authorRole}) &bull; Date: {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="border-t border-surface-150 pt-3 flex flex-wrap gap-2 justify-end bg-surface-50 p-2.5 rounded-xl">
                  <Button variant="ghost" onClick={() => handleWarnUser(post.authorName)} className="h-8 text-xs font-black text-orange-600">
                    Warn User
                  </Button>
                  <Button variant="ghost" onClick={() => handleMuteUser(post.authorName)} className="h-8 text-xs font-black text-orange-600">
                    Mute 24h
                  </Button>
                  <Button variant="danger" onClick={() => handleRemovePost(post.id)} className="h-8 text-xs">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove Content
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
