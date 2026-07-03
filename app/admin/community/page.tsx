'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { mockCommunityPosts } from '@/data/mockData';
import { CommunityPost, CommunityReply } from '@/types';
import {
  ShieldAlert,
  AlertTriangle,
  FolderOpen,
  Users,
  Settings,
  ArrowLeft,
  EyeOff,
  Lock
} from 'lucide-react';

export default function AdminCommunityDashboard() {
  const [stats, setStats] = useState({
    pendingReports: 0,
    flaggedPosts: 0,
    hiddenPosts: 0,
    mutedUsers: 0,
    bannedUsers: 0,
    lockedThreads: 0
  });

  useEffect(() => {
    // 1. Load threads
    let threadsSaved = localStorage.getItem('community_threads_db');
    if (!threadsSaved) {
      localStorage.setItem('community_threads_db', JSON.stringify(mockCommunityPosts));
      threadsSaved = JSON.stringify(mockCommunityPosts);
    }
    const threads: CommunityPost[] = JSON.parse(threadsSaved);

    // 2. Load replies
    const repliesSaved = localStorage.getItem('community_replies_db') || '[]';
    const replies: CommunityReply[] = JSON.parse(repliesSaved);

    // 3. Load users/profiles to count bans/mutes
    const usersSaved = localStorage.getItem('profiles_db') || '[]';
    const users: { community_status: string }[] = JSON.parse(usersSaved);

    // 4. Calculate stats
    const threadFlags = threads.filter((t) => t.reportsCount > 0).length;
    const replyFlags = replies.filter((r) => r.reportsCount > 0).length;
    const hiddenThreads = threads.filter((t) => t.reportsCount >= 3).length;
    const hiddenReplies = replies.filter((r) => r.reportsCount >= 3).length;

    const locked = threads.filter((t) => t.isLocked).length;

    // Default simulation fallback values for banned/muted users if profiles are empty
    let mutes = users.filter((u) => u.community_status === 'muted').length;
    let bans = users.filter((u) => u.community_status === 'banned').length;
    if (users.length === 0) {
      mutes = 2; // Simulated default
      bans = 1;
    }

    setTimeout(() => {
      setStats({
        pendingReports: threadFlags + replyFlags,
        flaggedPosts: threadFlags + replyFlags,
        hiddenPosts: hiddenThreads + hiddenReplies,
        mutedUsers: mutes,
        bannedUsers: bans,
        lockedThreads: locked
      });
    }, 0);
  }, []);

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back to admin center */}
      <div className="mb-6">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Center
        </Link>
      </div>

      <div className="bg-danger-50 border border-danger-150 p-4 rounded-2xl flex items-center gap-3 mb-8 text-xs md:text-sm font-semibold text-danger-850">
        <ShieldAlert className="h-5 w-5 text-danger-650 shrink-0" />
        <span>Simulating Community Moderation System. Audit reported doubts, manage categories, mute toxic users, and configure safety settings.</span>
      </div>

      <SectionHeader
        title="Student Community Moderation Dashboard"
        subtitle="Manage peer doubt discussions, rules violations, category settings, and auto-moderator blocks."
      />

      {/* Stats panels */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Pending Reports Flagged"
          value={String(stats.pendingReports)}
          icon={<AlertTriangle className="h-5 w-5 text-danger-650" />}
          description="Doubt/replies flags awaiting audit"
        />
        <StatCard
          title="Auto-Hidden Content"
          value={String(stats.hiddenPosts)}
          icon={<EyeOff className="h-5 w-5 text-orange-500" />}
          description="Content with 3+ reports hidden"
        />
        <StatCard
          title="Locked Threads"
          value={String(stats.lockedThreads)}
          icon={<Lock className="h-5 w-5 text-surface-500" />}
          description="Locked from further comments"
        />
        <StatCard
          title="Muted Aspirants"
          value={String(stats.mutedUsers)}
          icon={<Users className="h-5 w-5 text-orange-650" />}
          description="Temporary forum mute suspensions"
        />
        <StatCard
          title="Permanently Banned"
          value={String(stats.bannedUsers)}
          icon={<ShieldAlert className="h-5 w-5 text-danger-600" />}
          description="Severe violation hardware bans"
        />
      </div>

      {/* Moderation Actions Quick Grid Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Reports Queue link */}
        <Card hoverable className="border border-surface-200 flex flex-col justify-between">
          <div>
            <span className="p-3 bg-danger-50 text-danger-600 border border-danger-100 rounded-xl inline-flex mb-3.5">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <h3 className="text-sm md:text-base font-black text-surface-900">Reports Audit Queue</h3>
            <p className="text-xs text-surface-450 mt-1 font-semibold leading-relaxed">
              Verify doubt thread reports, dismiss flags, warn violators, or remove spam content.
            </p>
          </div>
          <div className="pt-4 border-t mt-4">
            <Link href="/admin/community/reports">
              <Button size="sm" variant="danger" className="w-full justify-center text-xs">
                Enter Queue
              </Button>
            </Link>
          </div>
        </Card>

        {/* Categories Link */}
        <Card hoverable className="border border-surface-200 flex flex-col justify-between">
          <div>
            <span className="p-3 bg-brand-50 text-brand-650 border border-brand-100 rounded-xl inline-flex mb-3.5">
              <FolderOpen className="h-5 w-5" />
            </span>
            <h3 className="text-sm md:text-base font-black text-surface-900">Category Configs</h3>
            <p className="text-xs text-surface-450 mt-1 font-semibold leading-relaxed">
              Manage exam categories slug mapping, pin categories, and add category safety tips.
            </p>
          </div>
          <div className="pt-4 border-t mt-4">
            <Link href="/admin/community/categories">
              <Button size="sm" variant="primary" className="w-full justify-center text-xs">
                Manage Categories
              </Button>
            </Link>
          </div>
        </Card>

        {/* Users Moderation Link */}
        <Card hoverable className="border border-surface-200 flex flex-col justify-between">
          <div>
            <span className="p-3 bg-orange-50 text-orange-600 border border-orange-100 rounded-xl inline-flex mb-3.5">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="text-sm md:text-base font-black text-surface-900">User Moderation</h3>
            <p className="text-xs text-surface-450 mt-1 font-semibold leading-relaxed">
              Track student posting activities, warning sheets, temporary mutes, and ban removals.
            </p>
          </div>
          <div className="pt-4 border-t mt-4">
            <Link href="/admin/community/users">
              <Button size="sm" variant="outline" className="w-full justify-center text-xs">
                Manage Users
              </Button>
            </Link>
          </div>
        </Card>

        {/* Community Settings */}
        <Card hoverable className="border border-surface-200 flex flex-col justify-between">
          <div>
            <span className="p-3 bg-surface-50 text-surface-650 border border-surface-200 rounded-xl inline-flex mb-3.5">
              <Settings className="h-5 w-5" />
            </span>
            <h3 className="text-sm md:text-base font-black text-surface-900">Safety Policy Settings</h3>
            <p className="text-xs text-surface-450 mt-1 font-semibold leading-relaxed">
              Configure rule checklist enforcement, spam link blocks, post/reply limits, and word blacklists.
            </p>
          </div>
          <div className="pt-4 border-t mt-4">
            <Link href="/admin/community/settings">
              <Button size="sm" variant="outline" className="w-full justify-center text-xs">
                Configure Rules
              </Button>
            </Link>
          </div>
        </Card>

      </div>
    </Container>
  );
}
