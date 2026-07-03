'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCommunityPosts } from '@/data/mockData';
import { CommunityPost, CommunityReply } from '@/types';
import {
  ArrowLeft,
  MessageSquare,
  AlertTriangle,
  Bookmark
} from 'lucide-react';

export default function StudentCommunityDashboard() {
  const [myThreads, setMyThreads] = useState<CommunityPost[]>([]);
  const [myReplies, setMyReplies] = useState<CommunityReply[]>([]);
  const [followedThreads, setFollowedThreads] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const studentUsername = 'Siddharth Mishra';

  useEffect(() => {
    // 1. Sync threads
    let threadsSaved = localStorage.getItem('community_threads_db');
    if (!threadsSaved) {
      localStorage.setItem('community_threads_db', JSON.stringify(mockCommunityPosts));
      threadsSaved = JSON.stringify(mockCommunityPosts);
    }
    const allThreads: CommunityPost[] = JSON.parse(threadsSaved);

    // 2. Sync replies
    const repliesSaved = localStorage.getItem('community_replies_db') || '[]';
    const allReplies: CommunityReply[] = JSON.parse(repliesSaved);

    // Filter personal activity
    const threads = allThreads.filter((t) => t.authorName === studentUsername);
    const replies = allReplies.filter((r) => r.authorName === studentUsername);
    const followed = allThreads.filter((t) => t.followers?.includes(studentUsername) && t.authorName !== studentUsername);

    setTimeout(() => {
      setMyThreads(threads);
      setMyReplies(replies);
      setFollowedThreads(followed);
      setLoading(false);
    }, 0);
  }, []);

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Syncing forum alerts...</h3>
      </Container>
    );
  }

  // Count total report penalties on student content
  const threadPenalties = myThreads.filter((t) => t.reportsCount > 0);
  const replyPenalties = myReplies.filter((r) => r.reportsCount > 0);
  const totalPenaltiesCount = threadPenalties.length + replyPenalties.length;

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back to student dashboard */}
      <div className="mb-6">
        <Link href="/student/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <SectionHeader
        title="My Forum Activity & Alerts"
        subtitle="Manage doubt threads, discussion replies, followed questions, and guidelines warning logs."
        action={
          <Link href="/community">
            <Button size="sm" icon={<MessageSquare className="h-4.5 w-4.5" />}>
              Go to Forums Portal
            </Button>
          </Link>
        }
      />

      {/* Safety Alert Warnings Banner if content flagged */}
      {totalPenaltiesCount > 0 && (
        <div className="p-4.5 bg-danger-50 border border-danger-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="h-5.5 w-5.5 text-danger-650 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs md:text-sm font-extrabold text-danger-850">Community Guidelines Alert</h4>
            <p className="text-xs text-danger-700 leading-relaxed font-semibold mt-1">
              You have {totalPenaltiesCount} posts flagged by community members. Please check study safety rules. Posts with 3 reports auto-hide pending moderation audits.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Threads & My Replies */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* My Threads list */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-surface-850 uppercase tracking-wider">
              My Mapped doubts ({myThreads.length})
            </h3>

            {myThreads.length === 0 ? (
              <p className="text-xs text-surface-450 italic p-4 text-center bg-surface-50 border rounded-2xl">
                No doubt threads created yet.
              </p>
            ) : (
              <div className="space-y-4">
                {myThreads.map((thread) => (
                  <Card key={thread.id} className="border border-surface-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                          {thread.category}
                        </span>
                        {thread.isSolved && (
                          <span className="text-[10px] font-black bg-success-50 text-success-700 border border-success-100 px-2 py-0.5 rounded">
                            Solved
                          </span>
                        )}
                        {thread.reportsCount > 0 && (
                          <span className="text-[10px] font-black bg-danger-50 text-danger-700 border border-danger-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Flagged ({thread.reportsCount} reports)
                          </span>
                        )}
                      </div>

                      <Link href={`/community/thread/${thread.id}`}>
                        <h4 className="text-sm md:text-base font-black text-surface-900 leading-snug hover:text-brand-650 hover:underline cursor-pointer">
                          {thread.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-surface-500 font-semibold line-clamp-2 leading-relaxed">
                        {thread.content}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* My Replies history list */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-surface-850 uppercase tracking-wider">
              My Solutions & Replies ({myReplies.length})
            </h3>

            {myReplies.length === 0 ? (
              <p className="text-xs text-surface-450 italic p-4 text-center bg-surface-50 border rounded-2xl">
                No replies or solution comments posted yet.
              </p>
            ) : (
              <div className="space-y-4">
                {myReplies.map((reply) => (
                  <Card key={reply.id} className="border border-surface-200">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-surface-400">
                          Replied on {new Date(reply.date).toLocaleDateString()}
                        </span>
                        
                        {reply.isHelpful && (
                          <span className="text-[10px] font-black bg-success-50 text-success-700 border border-success-100 px-2 py-0.5 rounded">
                            Marked Helpful
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-surface-650 leading-relaxed font-semibold">
                        {reply.content}
                      </p>

                      <div className="pt-2 flex justify-between items-center">
                        <span className="text-[10px] text-surface-400">Upvotes: {reply.upvotes}</span>
                        <Link href={`/community/thread/${reply.postId}`}>
                          <span className="text-xs font-black text-brand-650 hover:underline">
                            View Thread &rarr;
                          </span>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Followed Threads alerts */}
        <div className="space-y-6">
          <Card className="border border-surface-200 bg-white">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Bookmark className="h-4.5 w-4.5 text-brand-650" />
              Followed Threads ({followedThreads.length})
            </h3>

            {followedThreads.length === 0 ? (
              <p className="text-xs text-surface-450 italic font-semibold">No followed threads tracked.</p>
            ) : (
              <div className="space-y-3.5">
                {followedThreads.map((thread) => (
                  <div key={thread.id} className="p-3 bg-surface-50 border rounded-xl flex flex-col gap-1.5 hover:border-surface-200 transition-colors">
                    <h4 className="text-xs font-black text-surface-800 line-clamp-1 leading-snug">
                      {thread.title}
                    </h4>
                    <div className="flex justify-between items-center text-[10px] font-bold text-surface-450">
                      <span>Total Replies: {thread.repliesCount}</span>
                      <Link href={`/community/thread/${thread.id}`} className="text-brand-650 hover:underline font-black">
                        Enter thread
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>

    </Container>
  );
}
