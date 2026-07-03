'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCommunityPosts } from '@/data/mockData';
import { CommunityPost, CommunityReply } from '@/types';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Trash
} from 'lucide-react';

interface ReportItem {
  id: string;
  postId: string; // for replies
  contentType: 'Thread' | 'Reply';
  content: string;
  authorName: string;
  authorRole: string;
  reportsCount: number;
  date: string;
  title?: string;
  reason: string;
  reporter: string;
}

export default function ReportsQueuePage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Sync threads
    let threadsSaved = localStorage.getItem('community_threads_db');
    if (!threadsSaved) {
      localStorage.setItem('community_threads_db', JSON.stringify(mockCommunityPosts));
      threadsSaved = JSON.stringify(mockCommunityPosts);
    }
    const threads: CommunityPost[] = JSON.parse(threadsSaved);

    // 2. Sync replies
    const repliesSaved = localStorage.getItem('community_replies_db') || '[]';
    const replies: CommunityReply[] = JSON.parse(repliesSaved);

    // 3. Compile report list
    const threadReports: ReportItem[] = threads
      .filter((t) => t.reportsCount > 0)
      .map((t) => ({
        id: t.id,
        postId: t.id,
        contentType: 'Thread',
        content: t.content,
        authorName: t.authorName,
        authorRole: t.authorRole,
        reportsCount: t.reportsCount,
        date: t.date,
        title: t.title,
        reason: t.reportsCount >= 3 ? 'Profanity / Harassment' : 'Spam Links Sharing',
        reporter: 'Aspirant_Safety_Bot'
      }));

    const replyReports: ReportItem[] = replies
      .filter((r) => r.reportsCount > 0)
      .map((r) => ({
        id: r.id,
        postId: r.postId,
        contentType: 'Reply',
        content: r.content,
        authorName: r.authorName,
        authorRole: r.authorRole,
        reportsCount: r.reportsCount,
        date: r.date,
        reason: 'Off-topic Discussion',
        reporter: 'Peer_User_Reporter'
      }));

    setTimeout(() => {
      setReports([...threadReports, ...replyReports]);
      setLoading(false);
    }, 0);
  }, []);

  const handleDismissReport = (item: ReportItem) => {
    if (item.contentType === 'Thread') {
      const threadsSaved = localStorage.getItem('community_threads_db') || '[]';
      const threads: CommunityPost[] = JSON.parse(threadsSaved);
      const updated = threads.map((t) => (t.id === item.id ? { ...t, reportsCount: 0 } : t));
      localStorage.setItem('community_threads_db', JSON.stringify(updated));
    } else {
      const repliesSaved = localStorage.getItem('community_replies_db') || '[]';
      const replies: CommunityReply[] = JSON.parse(repliesSaved);
      const updated = replies.map((r) => (r.id === item.id ? { ...r, reportsCount: 0 } : r));
      localStorage.setItem('community_replies_db', JSON.stringify(updated));
    }

    setReports((prev) => prev.filter((r) => r.id !== item.id));
    alert('Report dismissed. Flags cleared successfully.');
  };

  const handleRemoveContent = (item: ReportItem) => {
    if (item.contentType === 'Thread') {
      const threadsSaved = localStorage.getItem('community_threads_db') || '[]';
      const threads: CommunityPost[] = JSON.parse(threadsSaved);
      const updated = threads.filter((t) => t.id !== item.id);
      localStorage.setItem('community_threads_db', JSON.stringify(updated));
    } else {
      const repliesSaved = localStorage.getItem('community_replies_db') || '[]';
      const replies: CommunityReply[] = JSON.parse(repliesSaved);
      const updated = replies.filter((r) => r.id !== item.id);
      localStorage.setItem('community_replies_db', JSON.stringify(updated));

      // Decrement repliesCount on post
      const threadsSaved = localStorage.getItem('community_threads_db') || '[]';
      const threads: CommunityPost[] = JSON.parse(threadsSaved);
      const updatedThreads = threads.map((t) => {
        if (t.id === item.postId) {
          return { ...t, repliesCount: Math.max(0, t.repliesCount - 1) };
        }
        return t;
      });
      localStorage.setItem('community_threads_db', JSON.stringify(updatedThreads));
    }

    setReports((prev) => prev.filter((r) => r.id !== item.id));
    alert('Violation Content Removed from public forum catalogs.');
  };

  const handleWarnUser = (authorName: string) => {
    alert(`Official Warning notice sent to user: "${authorName}".`);
  };

  const handleMuteUser = (authorName: string) => {
    localStorage.setItem('community_status', 'muted');
    alert(`User "${authorName}" has been MUTED for 24 hours.`);
  };

  const handleBanUser = (authorName: string) => {
    localStorage.setItem('community_status', 'banned');
    alert(`User "${authorName}" has been PERMANENTLY BANNED from Aspirav.`);
  };

  const handleLockThread = (item: ReportItem) => {
    if (item.contentType !== 'Thread') return;

    const threadsSaved = localStorage.getItem('community_threads_db') || '[]';
    const threads: CommunityPost[] = JSON.parse(threadsSaved);
    const updated = threads.map((t) => (t.id === item.id ? { ...t, isLocked: true } : t));
    localStorage.setItem('community_threads_db', JSON.stringify(updated));
    
    alert('Doubt Thread Locked. No further replies allowed.');
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Syncing reports queue...</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">Analyzing flagged doubt statements and solution comments.</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back to admin community dashboard */}
      <div className="mb-6">
        <Link href="/admin/community" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Moderation Hub
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-xl md:text-3.5xl font-black text-surface-900 leading-snug">
          Moderation Audit Queue
        </h1>
        <p className="text-xs text-surface-500 font-semibold mt-1">
          Review threads and reply comments flagged by aspirants or safety filters.
        </p>
      </div>

      {reports.length === 0 ? (
        <Card className="text-center py-16 border border-surface-200">
          <ShieldCheck className="h-10 w-10 text-success-600 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">All Clear!</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">No pending doubt reports or reported comments flagged in queue.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {reports.map((item) => (
            <Card key={item.id} className="border-2 border-danger-100 bg-white">
              <div className="flex flex-col gap-4">
                
                {/* Header indicators */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded border ${
                      item.contentType === 'Thread'
                        ? 'bg-brand-50 border-brand-100 text-brand-700'
                        : 'bg-orange-50 border-orange-100 text-orange-700'
                    }`}>
                      {item.contentType}
                    </span>
                    <span className="text-[10px] font-black uppercase text-danger-700 bg-danger-50 border border-danger-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Flags: {item.reportsCount}
                    </span>
                  </div>

                  <div className="flex gap-2.5 text-xs text-surface-400 font-bold">
                    <span>Flagged by: <strong>{item.reporter}</strong></span>
                    <span>&bull;</span>
                    <span>Reason: <strong>{item.reason}</strong></span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  {item.title && (
                    <h3 className="text-sm md:text-base font-extrabold text-surface-900 mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                  )}
                  <p className="text-xs md:text-sm font-semibold text-surface-650 leading-relaxed bg-surface-50 p-3.5 rounded-xl border border-surface-150 whitespace-pre-line">
                    {item.content}
                  </p>
                  <p className="text-[10px] text-surface-450 font-bold mt-3">
                    Posted by: <strong>{item.authorName}</strong> ({item.authorRole}) &bull; Date: {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Moderate Audit Actions panel */}
                <div className="border-t border-surface-150 pt-3 flex flex-wrap gap-2 justify-between items-center bg-surface-50/50 p-3 rounded-2xl">
                  
                  {/* Left: User penalties */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => handleWarnUser(item.authorName)} className="h-8 text-[11px] font-black text-orange-600">
                      Warn User
                    </Button>
                    <Button variant="ghost" onClick={() => handleMuteUser(item.authorName)} className="h-8 text-[11px] font-black text-orange-600">
                      Mute
                    </Button>
                    <Button variant="ghost" onClick={() => handleBanUser(item.authorName)} className="h-8 text-[11px] font-black text-danger-600">
                      Ban User
                    </Button>
                  </div>

                  {/* Right: Content actions */}
                  <div className="flex gap-2">
                    {item.contentType === 'Thread' && (
                      <Button variant="outline" onClick={() => handleLockThread(item)} className="h-8 text-xs">
                        <Lock className="h-3.5 w-3.5 mr-1" /> Lock Thread
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => handleDismissReport(item)} className="h-8 text-xs text-success-700 hover:text-success-800">
                      Dismiss
                    </Button>
                    <Button variant="danger" onClick={() => handleRemoveContent(item)} className="h-8 text-xs">
                      <Trash className="h-3.5 w-3.5 mr-1" /> Remove Content
                    </Button>
                  </div>

                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
