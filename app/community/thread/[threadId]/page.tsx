'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockCommunityPosts, mockReplies } from '@/data/mockData';
import { CommunityPost, CommunityReply, UserRole } from '@/types';
import {
  ArrowLeft,
  ThumbsUp,
  AlertTriangle,
  Send,
  Bookmark,
  CheckCircle,
  ShieldAlert,
  Award
} from 'lucide-react';

interface PageProps {
  params: Promise<{ threadId: string }>;
}

export default function ThreadDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { threadId } = use(params);

  const checkGuest = () => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return true;
    }
    return false;
  };

  const [thread, setThread] = useState<CommunityPost | null>(null);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Student');
  const [currentUsername, setCurrentUsername] = useState('Aspirant');

  const [hasAcceptedRules, setHasAcceptedRules] = useState(false);
  const [showRulesError, setShowRulesError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [safetySettings, setSafetySettings] = useState({
    requireRulesAcceptance: true,
    newUserLinkRestriction: true,
    autoHideReportThreshold: 3,
    dailyPostLimit: 3,
    dailyReplyLimit: 5,
    blockedWordsText: 'telegram, group, contact, money, sell, buy, pirated, whatsapp'
  });

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

    // 2. Load threads database
    let savedThreads = localStorage.getItem('community_threads_db');
    if (!savedThreads) {
      localStorage.setItem('community_threads_db', JSON.stringify(mockCommunityPosts));
      savedThreads = JSON.stringify(mockCommunityPosts);
    }
    const threadsList: CommunityPost[] = JSON.parse(savedThreads);
    const matchedPost = threadsList.find((t) => t.id === threadId);

    // 3. Load replies database
    let savedReplies = localStorage.getItem('community_replies_db');
    if (!savedReplies) {
      // Map seed replies into a flat array in storage
      const flatList: CommunityReply[] = [];
      Object.entries(mockReplies).forEach(([postId, list]) => {
        list.forEach((r) => {
          flatList.push({
            ...r,
            postId
          });
        });
      });
      localStorage.setItem('community_replies_db', JSON.stringify(flatList));
      savedReplies = JSON.stringify(flatList);
    }
    const allReplies: CommunityReply[] = JSON.parse(savedReplies);
    const matchedReplies = allReplies.filter((r) => r.postId === threadId);

    // 4. Load safety settings
    const settingsSaved = localStorage.getItem('community_settings');
    let settingsObj = null;
    if (settingsSaved) {
      settingsObj = JSON.parse(settingsSaved);
    }

    setTimeout(() => {
      setCurrentUserRole(role);
      setCurrentUsername(username);
      if (matchedPost) {
        setThread(matchedPost);
      }
      setReplies(matchedReplies);
      if (settingsObj) {
        setSafetySettings(settingsObj);
      }
      setLoading(false);
    }, 0);
  }, [threadId]);

  const handleUpvoteThread = () => {
    if (checkGuest()) return;
    if (!thread) return;
    
    // Save to threads db
    const savedThreads = localStorage.getItem('community_threads_db') || '[]';
    const threadsList: CommunityPost[] = JSON.parse(savedThreads);
    const hasUpvoted = !thread.hasUpvoted;

    const updated = threadsList.map((t) => {
      if (t.id === thread.id) {
        return {
          ...t,
          upvotes: hasUpvoted ? t.upvotes + 1 : t.upvotes - 1,
          hasUpvoted
        };
      }
      return t;
    });

    localStorage.setItem('community_threads_db', JSON.stringify(updated));
    setThread({
      ...thread,
      upvotes: hasUpvoted ? thread.upvotes + 1 : thread.upvotes - 1,
      hasUpvoted
    });
  };

  const handleReportThread = () => {
    if (checkGuest()) return;
    if (!thread) return;

    const savedThreads = localStorage.getItem('community_threads_db') || '[]';
    const threadsList: CommunityPost[] = JSON.parse(savedThreads);

    const updated = threadsList.map((t) => {
      if (t.id === thread.id) {
        return { ...t, reportsCount: t.reportsCount + 1 };
      }
      return t;
    });

    localStorage.setItem('community_threads_db', JSON.stringify(updated));
    setThread({ ...thread, reportsCount: thread.reportsCount + 1 });
    alert('Thread reported. Posts with 3 reports auto-hide pending administrative audit.');
  };

  const handleFollowThread = () => {
    if (checkGuest()) return;
    if (!thread) return;

    const savedThreads = localStorage.getItem('community_threads_db') || '[]';
    const threadsList: CommunityPost[] = JSON.parse(savedThreads);

    const followers = thread.followers || [];
    const isFollowing = followers.includes(currentUsername);
    const updatedFollowers = isFollowing 
      ? followers.filter((u) => u !== currentUsername) 
      : [...followers, currentUsername];

    const updated = threadsList.map((t) => {
      if (t.id === thread.id) {
        return { ...t, followers: updatedFollowers };
      }
      return t;
    });

    localStorage.setItem('community_threads_db', JSON.stringify(updated));
    setThread({ ...thread, followers: updatedFollowers });
    alert(isFollowing ? 'Unfollowed thread updates.' : 'Following thread. You will receive milestone alerts.');
  };

  const handleMarkSolved = () => {
    if (checkGuest()) return;
    if (!thread) return;

    const savedThreads = localStorage.getItem('community_threads_db') || '[]';
    const threadsList: CommunityPost[] = JSON.parse(savedThreads);

    const updated = threadsList.map((t) => {
      if (t.id === thread.id) {
        return { ...t, isSolved: true };
      }
      return t;
    });

    localStorage.setItem('community_threads_db', JSON.stringify(updated));
    setThread({ ...thread, isSolved: true });
    alert('Thread marked as Solved.');
  };

  // Reply operations
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkGuest()) return;

    const isMuted = localStorage.getItem('simulated_muted') === 'true';
    const isBanned = localStorage.getItem('simulated_banned') === 'true';
    const profileStatus = localStorage.getItem('community_status') || 'active';
    if (isBanned || isMuted || profileStatus === 'muted' || profileStatus === 'banned') {
      alert('Muted or Banned users are restricted from participating in discussion threads.');
      return;
    }

    // Safety: rules checkbox validation
    if (safetySettings.requireRulesAcceptance && !hasAcceptedRules) {
      setShowRulesError(true);
      return;
    }

    // Safety: check blocked keywords list
    const words = safetySettings.blockedWordsText
      .split(',')
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean);
    const containsBadWords = words.some((word) => newReplyContent.toLowerCase().includes(word));
    if (containsBadWords) {
      alert('Posting blocked: Your reply contains forbidden words blacklisted by moderation safety policies.');
      return;
    }

    if (currentUserRole === 'New User') {
      // Limit replies/day
      const todayStr = new Date().toDateString();
      const userTodayRepliesCount = replies.filter(
        (r) => r.authorName === currentUsername && new Date(r.date).toDateString() === todayStr
      ).length;

      if (userTodayRepliesCount >= safetySettings.dailyReplyLimit) {
        alert(`Daily Limits Triggered: New users are limited to ${safetySettings.dailyReplyLimit} replies per day.`);
        return;
      }

      // Check links
      if (safetySettings.newUserLinkRestriction) {
        const hasLinks = /(http|https|www|\.com)/gi.test(newReplyContent);
        if (hasLinks) {
          alert('Posting Restriction: New users cannot post links in replies.');
          return;
        }
      }
    }

    if (!newReplyContent.trim()) return;

    const newReply: CommunityReply = {
      id: `rep-cust-${Date.now()}`,
      postId: threadId,
      content: newReplyContent,
      authorName: currentUsername,
      authorRole: currentUserRole,
      date: new Date().toISOString(),
      upvotes: 0,
      reportsCount: 0,
      isHelpful: false
    };

    // Save to replies db
    const savedReplies = localStorage.getItem('community_replies_db') || '[]';
    const allReplies: CommunityReply[] = JSON.parse(savedReplies);
    const updatedReplies = [...allReplies, newReply];
    localStorage.setItem('community_replies_db', JSON.stringify(updatedReplies));

    // Update repliesCount inside threads list
    const savedThreads = localStorage.getItem('community_threads_db') || '[]';
    const threadsList: CommunityPost[] = JSON.parse(savedThreads);
    const updatedThreads = threadsList.map((t) => {
      if (t.id === threadId) {
        return { ...t, repliesCount: t.repliesCount + 1 };
      }
      return t;
    });
    localStorage.setItem('community_threads_db', JSON.stringify(updatedThreads));

    setReplies([...replies, newReply]);
    setNewReplyContent('');
    setHasAcceptedRules(false);
    setShowRulesError(false);
  };

  const handleMarkHelpful = (replyId: string) => {
    if (checkGuest()) return;
    const savedReplies = localStorage.getItem('community_replies_db') || '[]';
    const allReplies: CommunityReply[] = JSON.parse(savedReplies);

    const updated = allReplies.map((r) => {
      if (r.id === replyId) {
        return { ...r, isHelpful: !r.isHelpful };
      }
      return r;
    });

    localStorage.setItem('community_replies_db', JSON.stringify(updated));
    setReplies(replies.map((r) => (r.id === replyId ? { ...r, isHelpful: !r.isHelpful } : r)));
    alert('Answer helpful status toggled.');
  };

  const handleReportReply = (replyId: string) => {
    if (checkGuest()) return;
    const savedReplies = localStorage.getItem('community_replies_db') || '[]';
    const allReplies: CommunityReply[] = JSON.parse(savedReplies);

    const updated = allReplies.map((r) => {
      if (r.id === replyId) {
        return { ...r, reportsCount: r.reportsCount + 1 };
      }
      return r;
    });

    localStorage.setItem('community_replies_db', JSON.stringify(updated));
    setReplies(replies.map((r) => (r.id === replyId ? { ...r, reportsCount: r.reportsCount + 1 } : r)));
    alert('Reply reported. Hidden from other students if 3 reports accumulate.');
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Syncing discussions...</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">Structuring original thread statement and reply sheets.</p>
      </Container>
    );
  }

  // Safety hide check: hide thread if reported above threshold
  const isThreadHidden = thread && thread.reportsCount >= safetySettings.autoHideReportThreshold;

  if (!thread || isThreadHidden) {
    return (
      <Container size="xl" className="py-16 text-center">
        <ShieldAlert className="h-10 w-10 text-danger-650 mx-auto mb-3" />
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Thread Content Hidden</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">
          {isThreadHidden 
            ? 'This post has been hidden pending administrative safety audits.' 
            : 'We could not locate this discussion thread in the database.'}
        </p>
        <Link href="/community">
          <Button>Back to Community Homepage</Button>
        </Link>
      </Container>
    );
  }

  const isOwner = thread.authorName === currentUsername;
  const isFollowing = (thread.followers || []).includes(currentUsername);

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Forums
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Thread & Replies */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thread Card statement */}
          <Card className="border border-surface-200 bg-white">
            <div className="space-y-4">
              
              {/* Category, solve labels */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100 uppercase">
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

                <div className="flex gap-2">
                  <button
                    onClick={handleFollowThread}
                    className={`text-[10px] font-black uppercase px-2 py-1 border rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      isFollowing 
                        ? 'bg-brand-50 border-brand-200 text-brand-600' 
                        : 'bg-white border-surface-250 text-surface-550'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {isFollowing ? 'Following' : 'Follow Thread'}
                  </button>

                  <button
                    onClick={handleReportThread}
                    className="text-xs font-semibold text-danger-600 hover:bg-danger-50 px-2.5 py-1 rounded-lg border border-transparent hover:border-danger-100 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" /> Report
                  </button>
                </div>
              </div>

              {/* Title & Content */}
              <h1 className="text-base md:text-xl font-black text-surface-900 leading-snug">
                {thread.title}
              </h1>

              <p className="text-xs md:text-sm font-semibold text-surface-600 leading-relaxed pt-2 whitespace-pre-line">
                {thread.content}
              </p>

              {/* Footer specs */}
              <div className="flex justify-between items-center gap-4 pt-4 border-t border-surface-150 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-bold text-surface-450">
                  <span>Posted by <strong className="text-surface-750">{thread.authorName}</strong></span>
                  <span className="bg-surface-150 text-surface-650 px-1.5 py-0.5 rounded text-[9px] font-black">
                    {thread.authorRole}
                  </span>
                  <span>&bull; {new Date(thread.date).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2.5 items-center">
                  <button
                    onClick={handleUpvoteThread}
                    className={`flex items-center gap-1.5 px-3 py-1 border rounded-xl cursor-pointer text-xs font-bold transition-colors ${
                      thread.hasUpvoted
                        ? 'bg-brand-50 border-brand-200 text-brand-600'
                        : 'bg-white border-surface-200 text-surface-500 hover:text-surface-850'
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{thread.upvotes}</span>
                  </button>

                  {isOwner && !thread.isSolved && (
                    <Button onClick={handleMarkSolved} size="sm" variant="outline" className="h-8">
                      Mark Solved
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </Card>

          {/* Replies Section list */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider">
              Replies & Solutions ({replies.filter((r) => r.reportsCount < safetySettings.autoHideReportThreshold).length})
            </h3>

            {replies.filter((r) => r.reportsCount < safetySettings.autoHideReportThreshold).length === 0 ? (
              <p className="text-xs text-surface-450 font-semibold italic p-4 text-center bg-white border border-surface-200 rounded-2xl">
                No replies or solution tips posted yet. Be the first to resolve this academic query!
              </p>
            ) : (
              <div className="space-y-4">
                {replies
                  .filter((r) => r.reportsCount < safetySettings.autoHideReportThreshold)
                  .map((reply) => {
                    
                    return (
                      <Card key={reply.id} className={`border ${
                        reply.isHelpful ? 'border-success-400 bg-success-50/10' : 'border-surface-200'
                      }`}>
                        <div className="space-y-3">
                          
                          {/* Header info */}
                          <div className="flex justify-between items-center gap-2 border-b border-surface-100 pb-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-surface-450">
                              <strong className="text-surface-750">{reply.authorName}</strong>
                              <span className="bg-surface-150 text-surface-650 px-1 py-0.2 rounded text-[8px] font-black uppercase">
                                {reply.authorRole}
                              </span>
                              <span>&bull; {new Date(reply.date).toLocaleDateString()}</span>
                            </div>

                            <div className="flex gap-2">
                              {/* Helpful tagging toggles (shown to thread owner or admins) */}
                              {(isOwner || currentUserRole === 'Admin') && (
                                <button
                                  onClick={() => handleMarkHelpful(reply.id)}
                                  className={`text-[9px] font-black uppercase px-2 py-0.5 border rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                                    reply.isHelpful
                                      ? 'bg-success-50 border-success-200 text-success-700'
                                      : 'bg-white border-surface-250 text-surface-550'
                                  }`}
                                >
                                  <Award className="h-3 w-3" />
                                  {reply.isHelpful ? 'Helpful Answer' : 'Mark Helpful'}
                                </button>
                              )}

                              <button
                                onClick={() => handleReportReply(reply.id)}
                                className="text-surface-450 hover:text-danger-600 p-1"
                                title="Report reply"
                              >
                                <AlertTriangle className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs md:text-sm font-medium text-surface-650 leading-relaxed whitespace-pre-line">
                            {reply.content}
                          </p>

                          {reply.isHelpful && (
                            <div className="mt-2.5 p-2 bg-success-50 text-success-850 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-success-100 self-start">
                              <CheckCircle className="h-3.5 w-3.5 text-success-600" /> Helpful Answer Marked by Owner
                            </div>
                          )}

                        </div>
                      </Card>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Add Reply Form */}
          {thread.isLocked ? (
            <div className="p-4 bg-surface-100 text-surface-500 border border-surface-200 rounded-2xl text-center text-xs font-black">
              🔒 This thread is locked by safety moderators. Additional replies are disabled.
            </div>
          ) : (
            <Card className="border border-surface-200">
              <h4 className="text-xs md:text-sm font-black text-surface-850 mb-3 uppercase tracking-wider">
                Post Solution Reply
              </h4>

              <form onSubmit={handleReplySubmit} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  value={newReplyContent}
                  onChange={(e) => setNewReplyContent(e.target.value)}
                  placeholder="Type your academic solution, routine suggestion, or doubt explanation..."
                  className="w-full px-4 py-3 text-xs md:text-sm font-medium border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500 bg-white"
                />

                {/* Terms agreement checkbox */}
                <div className="pt-2 border-t border-surface-150">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAcceptedRules}
                      onChange={(e) => {
                        setHasAcceptedRules(e.target.checked);
                        if (e.target.checked) setShowRulesError(false);
                      }}
                      className="mt-0.5"
                    />
                    <span className="text-xs font-semibold text-surface-550">
                      I accept the <Link href="/community/rules" target="_blank" className="text-brand-650 underline font-black">Community guidelines</Link> and pledge to keep replies exam-related.
                    </span>
                  </label>
                  {showRulesError && (
                    <p className="text-[10px] text-danger-600 font-extrabold mt-1">
                      You must agree to safety guidelines before replying.
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" size="sm" icon={<Send className="h-4 w-4" />}>
                    Post Reply
                  </Button>
                </div>
              </form>
            </Card>
          )}

        </div>

        {/* Right Column: rules check */}
        <div className="space-y-6">
          <Card className="border border-surface-200 bg-surface-50/50">
            <h3 className="text-sm font-black text-surface-850 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="h-5 w-5 text-brand-650" />
              Guidelines reminder
            </h3>
            <p className="text-xs text-surface-550 leading-relaxed font-semibold">
              Avoid posting links or commercial job alerts. Severe violations lead to mutable lockout profiles.
            </p>
          </Card>
        </div>

      </div>
    </Container>
  );
}
