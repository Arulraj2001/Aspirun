'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { mockCommunityPosts } from '@/data/mockData';
import { CommunityPost, UserRole } from '@/types';
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  Plus,
  HelpCircle
} from 'lucide-react';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export default function CategoryThreadsPage({ params }: PageProps) {
  const router = useRouter();
  const { categorySlug } = use(params);

  const handleOpenNewPost = () => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const isMuted = localStorage.getItem('simulated_muted') === 'true';
    const isBanned = localStorage.getItem('simulated_banned') === 'true';
    if (isBanned || isMuted) {
      alert('Muted or Banned users are restricted from creating new discussion threads.');
      return;
    }
    setIsNewPostOpen(true);
  };

  const [threads, setThreads] = useState<CommunityPost[]>([]);
  const [subFilter, setSubFilter] = useState('all');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Student');
  const [currentUsername, setCurrentUsername] = useState('Aspirant');
  const [safetySettings, setSafetySettings] = useState({
    requireRulesAcceptance: true,
    newUserLinkRestriction: true,
    autoHideReportThreshold: 3,
    dailyPostLimit: 3,
    dailyReplyLimit: 5,
    blockedWordsText: 'telegram, group, contact, money, sell, buy, pirated, whatsapp'
  });

  // Form states for creating a new post
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSubtype, setNewPostSubtype] = useState<'Doubts' | 'Strategy' | 'Mock Discussion' | 'Materials'>('Doubts');
  
  // Rules acceptance validation
  const [hasAcceptedRules, setHasAcceptedRules] = useState(false);
  const [showRulesCheckboxError, setShowRulesCheckboxError] = useState(false);

  // Map categorySlug to Category Name
  const slugMap: Record<string, string> = {
    'ssc': 'SSC Exams',
    'railway': 'Railway Exams',
    'police': 'Police Exams',
    'banking': 'Banking Exams',
    'state-exams': 'State Exams',
    'study-routine': 'Study Routine',
    'motivation': 'Motivation',
    'mock-discussion': 'Mock Discussion'
  };

  const categoryName = slugMap[categorySlug] || 'General Discussion';

  useEffect(() => {
    // 1. Sync simulated user attributes
    const savedRole = localStorage.getItem('simulated_role') as 'guest' | 'student' | 'admin' | null;
    let role: UserRole = 'Student';
    let username = 'Siddharth Mishra';

    if (savedRole === 'admin') {
      role = 'Admin';
      username = 'Admin Moderator';
    } else if (savedRole === 'guest') {
      role = 'New User';
      username = 'Guest Aspirant';
    }

    // 2. Load threads from localStorage or seed
    let saved = localStorage.getItem('community_threads_db');
    if (!saved) {
      localStorage.setItem('community_threads_db', JSON.stringify(mockCommunityPosts));
      saved = JSON.stringify(mockCommunityPosts);
    }
    const data: CommunityPost[] = JSON.parse(saved);

    // 3. Load safety settings
    const settingsSaved = localStorage.getItem('community_settings');
    let settingsObj = null;
    if (settingsSaved) {
      settingsObj = JSON.parse(settingsSaved);
    }
    
    setTimeout(() => {
      setCurrentUserRole(role);
      setCurrentUsername(username);
      setThreads(data);
      if (settingsObj) {
        setSafetySettings(settingsObj);
      }
    }, 0);
  }, []);

  // Filter threads based on category AND subfilter
  const filteredThreads = threads.filter((t) => {
    // Category match
    const categoryMatch = 
      t.category.toLowerCase().includes(categorySlug.replace('-', ' ')) ||
      categoryName.toLowerCase().includes(t.category.toLowerCase());

    if (!categoryMatch) return false;

    // Safety hide rule: auto-hide posts with reports above report threshold
    if (t.reportsCount >= safetySettings.autoHideReportThreshold) return false;

    // Sub-filters match
    if (subFilter === 'all') return true;
    if (subFilter === 'solved') return t.isSolved === true;
    
    // Check subtype/tags by searching in content or category
    return t.content.toLowerCase().includes(subFilter.toLowerCase()) || 
           t.title.toLowerCase().includes(subFilter.toLowerCase()) ||
           t.category.toLowerCase().includes(subFilter.toLowerCase());
  });

  const handleUpvote = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = threads.map((t) => {
      if (t.id === postId) {
        const hasUpvoted = !t.hasUpvoted;
        return {
          ...t,
          upvotes: hasUpvoted ? t.upvotes + 1 : t.upvotes - 1,
          hasUpvoted
        };
      }
      return t;
    });

    localStorage.setItem('community_threads_db', JSON.stringify(updated));
    setThreads(updated);
  };

  const handleReportPost = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = threads.map((t) => {
      if (t.id === postId) {
        return { ...t, reportsCount: t.reportsCount + 1 };
      }
      return t;
    });

    localStorage.setItem('community_threads_db', JSON.stringify(updated));
    setThreads(updated);
    alert('Post reported. If a post receives 3 reports, it will be automatically hidden pending moderator audit.');
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Safety: guest user cannot post (login required)
    if (currentUserRole === 'New User' && currentUsername === 'Guest Aspirant') {
      alert('Login Required: You must be logged in to participate in the student forums.');
      return;
    }

    // Safety: banned/muted users cannot post
    const profileStatus = localStorage.getItem('community_status') || 'active';
    if (profileStatus === 'muted' || profileStatus === 'banned') {
      alert(`Posting Blocked: Your community privilege is currently: ${profileStatus}.`);
      return;
    }

    // Safety: rules checkbox validation
    if (safetySettings.requireRulesAcceptance && !hasAcceptedRules) {
      setShowRulesCheckboxError(true);
      return;
    }

    // Safety: check blocked keywords list
    const wordsList = safetySettings.blockedWordsText
      .split(',')
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);
    const containsBadWords = wordsList.some(
      (word) => newPostTitle.toLowerCase().includes(word) || newPostContent.toLowerCase().includes(word)
    );
    if (containsBadWords) {
      alert('Posting blocked: Your post contains forbidden words blacklisted by moderation safety policies.');
      return;
    }

    // Safety: new users limits check
    if (currentUserRole === 'New User') {
      const todayStr = new Date().toDateString();
      const userTodayThreadsCount = threads.filter(
        (t) => t.authorName === currentUsername && new Date(t.date).toDateString() === todayStr
      ).length;

      if (userTodayThreadsCount >= safetySettings.dailyPostLimit) {
        alert(`Daily Limits Triggered: New users are limited to ${safetySettings.dailyPostLimit} thread posts per day.`);
        return;
      }

      // Safety: check links restriction for new users
      if (safetySettings.newUserLinkRestriction) {
        const hasLinks = /(http|https|www|\.com)/gi.test(newPostTitle + ' ' + newPostContent);
        if (hasLinks) {
          alert('Posting Restriction: New users cannot post links in discussions.');
          return;
        }
      }
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-cust-${Date.now()}`,
      title: newPostTitle,
      content: newPostContent,
      category: `${categoryName} - ${newPostSubtype}`,
      authorName: currentUsername,
      authorRole: currentUserRole,
      date: new Date().toISOString(),
      upvotes: 1,
      repliesCount: 0,
      reportsCount: 0,
      isLocked: false,
      isPinned: false,
      hasUpvoted: true,
      isSolved: false,
      followers: [currentUsername]
    };

    const updated = [newPost, ...threads];
    localStorage.setItem('community_threads_db', JSON.stringify(updated));
    setThreads(updated);

    setIsNewPostOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
    setHasAcceptedRules(false);
    setShowRulesCheckboxError(false);
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Forum Categories
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Threads list */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100 uppercase">
                {categorySlug.replace('-', ' ')}
              </span>
              <h1 className="text-xl md:text-3xl font-black text-surface-900 leading-snug mt-1.5">
                {categoryName} Discussion Board
              </h1>
            </div>

            <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={handleOpenNewPost}>
              Ask a Doubt
            </Button>
          </div>

          {/* Sub-Filters Tabs Toolbar */}
          <div className="flex gap-2 border-b border-surface-200 pb-3 overflow-x-auto text-xs font-bold">
            {[
              { id: 'all', label: 'All Discussions' },
              { id: 'doubts', label: 'Doubts' },
              { id: 'strategy', label: 'Strategy' },
              { id: 'mock', label: 'Mock Discussions' },
              { id: 'materials', label: 'Study Guides' },
              { id: 'solved', label: 'Solved Threads' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSubFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  subFilter === tab.id 
                    ? 'bg-brand-600 text-white font-extrabold' 
                    : 'bg-surface-100 text-surface-550 hover:bg-surface-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Threads Loop list */}
          {filteredThreads.length === 0 ? (
            <Card className="text-center py-12 border border-surface-200 bg-surface-50/20">
              <HelpCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
              <h4 className="text-sm font-extrabold text-surface-850">No Threads Open</h4>
              <p className="text-xs text-surface-450 mt-1 font-semibold">Be the first to post a study doubt or preparation query!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredThreads.map((post) => (
                <Card key={post.id} hoverable className="border border-surface-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                          {post.category}
                        </span>
                        {post.isPinned && (
                          <span className="text-[10px] font-black bg-success-50 text-success-700 border border-success-100 px-2 py-0.5 rounded">
                            Pinned
                          </span>
                        )}
                        {post.isSolved && (
                          <span className="text-[10px] font-black bg-success-50 text-success-700 border border-success-100 px-2 py-0.5 rounded">
                            Solved
                          </span>
                        )}
                        {post.isLocked && (
                          <span className="text-[10px] font-black bg-surface-150 text-surface-600 px-2 py-0.5 rounded">
                            Locked
                          </span>
                        )}
                      </div>

                      <Link href={`/community/thread/${post.id}`}>
                        <h3 className="text-sm md:text-base font-black text-surface-900 leading-snug hover:text-brand-600 cursor-pointer pt-1 hover:underline">
                          {post.title}
                        </h3>
                      </Link>
                    </div>

                    <button
                      onClick={(e) => handleReportPost(post.id, e)}
                      className="text-xs font-semibold text-danger-600 hover:bg-danger-50 px-2 py-1 rounded-lg border border-transparent hover:border-danger-100 flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                      title="Report guidelines violation"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> Report
                    </button>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-surface-550 leading-relaxed mt-3 line-clamp-2">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-surface-150 flex-wrap">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-surface-450">
                      <span>Posted by <strong className="text-surface-750">{post.authorName}</strong></span>
                      <span className="bg-surface-150 text-surface-650 px-1.5 py-0.5 rounded text-[9px] font-black">
                        {post.authorRole}
                      </span>
                      <span>&bull; {new Date(post.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold">
                      <button
                        onClick={(e) => handleUpvote(post.id, e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                          post.hasUpvoted
                            ? 'bg-brand-50 border-brand-200 text-brand-600'
                            : 'bg-white border-surface-200 text-surface-500 hover:text-surface-850 hover:bg-surface-50'
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{post.upvotes}</span>
                      </button>

                      <div className="flex items-center gap-1 text-surface-500 bg-surface-50 border border-surface-200 px-2.5 py-1 rounded-lg">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{post.repliesCount}</span>
                      </div>
                    </div>
                  </div>

                </Card>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Rules reminder sidebar card */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="border border-surface-200 bg-gradient-to-b from-brand-50/20 to-white">
            <h3 className="text-sm font-black uppercase text-brand-850 tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldAlert className="h-5 w-5 text-brand-550 shrink-0" />
              Guidelines Reminder
            </h3>
            <p className="text-xs text-surface-550 font-semibold leading-relaxed mb-4">
              We moderation forums daily. Avoid off-topic debates, adverts, or piracy.
            </p>
            <Link href="/community/rules">
              <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                Read Strict rules
              </Button>
            </Link>
          </Card>
        </div>

      </div>

      {/* Create New Post Modal */}
      <Modal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        title={`Post Thread in ${categoryName}`}
        size="md"
      >
        <form onSubmit={handleCreatePostSubmit} className="space-y-4">
          <Input
            label="Doubt Title"
            required
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="e.g., Simplification short-tricks query"
            hint="Describe your doubt or strategical question in a short sentence."
          />

          <Select
            label="Discussion Subtype"
            value={newPostSubtype}
            onChange={(e) => setNewPostSubtype(e.target.value as 'Doubts' | 'Strategy' | 'Mock Discussion' | 'Materials')}
            options={[
              { value: 'Doubts', label: 'Academic Doubt' },
              { value: 'Strategy', label: 'Preparation Strategy' },
              { value: 'Mock Discussion', label: 'Mock Performance Discussion' },
              { value: 'Materials', label: 'Study Materials & Resources' }
            ]}
          />

          <Textarea
            label="Detailed Statement"
            required
            rows={5}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Outline your question step-by-step. Avoid pasting contact information or external links."
            hint="Forums are admin moderated. Ensure guidelines compliance."
          />

          {/* Rules Acceptance Checkbox (Safety requirement) */}
          <div className="pt-2 border-t border-surface-150">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAcceptedRules}
                onChange={(e) => {
                  setHasAcceptedRules(e.target.checked);
                  if (e.target.checked) setShowRulesCheckboxError(false);
                }}
                className="mt-0.5"
              />
              <span className="text-xs font-semibold text-surface-550">
                I accept the <Link href="/community/rules" target="_blank" className="text-brand-600 underline font-black">Community Safety Rules</Link> and understand that off-topic posts or links will lead to muting/bans.
              </span>
            </label>
            {showRulesCheckboxError && (
              <p className="text-[10px] text-danger-600 font-extrabold mt-1">
                You must accept the safety guidelines before posting.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-surface-100 flex justify-end gap-2.5">
            <Button variant="ghost" type="button" onClick={() => setIsNewPostOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish Thread
            </Button>
          </div>

        </form>
      </Modal>
    </Container>
  );
}
