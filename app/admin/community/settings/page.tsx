'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  ArrowLeft,
  Settings,
  Save
} from 'lucide-react';

interface SafetySettings {
  requireRulesAcceptance: boolean;
  newUserLinkRestriction: boolean;
  autoHideReportThreshold: number;
  attachmentReviewRequired: boolean;
  dailyPostLimit: number;
  dailyReplyLimit: number;
  blockedWordsText: string;
}

export default function SafetySettingsPage() {
  const [settings, setSettings] = useState<SafetySettings>({
    requireRulesAcceptance: true,
    newUserLinkRestriction: true,
    autoHideReportThreshold: 3,
    attachmentReviewRequired: true,
    dailyPostLimit: 3,
    dailyReplyLimit: 5,
    blockedWordsText: 'telegram, group, contact, money, sell, buy, pirated, whatsapp'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('community_settings');
    let parsedSettings: SafetySettings | null = null;
    if (saved) {
      parsedSettings = JSON.parse(saved);
    }
    setTimeout(() => {
      if (parsedSettings) {
        setSettings(parsedSettings);
      }
      setLoading(false);
    }, 0);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('community_settings', JSON.stringify(settings));
    alert('Community safety policies updated successfully.');
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Syncing policies config...</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">Structuring spam rules and keyword configurations.</p>
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
        <h1 className="text-xl md:text-3xl font-black text-surface-900 leading-snug">
          Safety Policies Configurator
        </h1>
        <p className="text-xs text-surface-500 font-semibold mt-1">
          Configure rule checklists, spam thresholds, and moderation filters.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="max-w-3xl space-y-6">
        <Card className="border border-surface-200 bg-white">
          <div className="space-y-4">
            
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-1.5">
              <Settings className="h-4.5 w-4.5 text-brand-650" />
              General Safety Settings
            </h3>

            <div className="space-y-4">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-surface-650">
                <input
                  type="checkbox"
                  checked={settings.requireRulesAcceptance}
                  onChange={(e) => setSettings({ ...settings, requireRulesAcceptance: e.target.checked })}
                  className="mt-0.5"
                />
                <div>
                  <span>Require Rules Acceptance Checkbox</span>
                  <p className="text-[10px] text-surface-400 font-semibold mt-0.5">Students must check rule agreements before submitting posts or replies.</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-surface-650">
                <input
                  type="checkbox"
                  checked={settings.newUserLinkRestriction}
                  onChange={(e) => setSettings({ ...settings, newUserLinkRestriction: e.target.checked })}
                  className="mt-0.5"
                />
                <div>
                  <span>Block link sharing for new users</span>
                  <p className="text-[10px] text-surface-400 font-semibold mt-0.5">New student accounts cannot post websites, groups, or url links.</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-surface-650">
                <input
                  type="checkbox"
                  checked={settings.attachmentReviewRequired}
                  onChange={(e) => setSettings({ ...settings, attachmentReviewRequired: e.target.checked })}
                  className="mt-0.5"
                />
                <div>
                  <span>Manual Attachment Audit Required</span>
                  <p className="text-[10px] text-surface-400 font-semibold mt-0.5">Uploaded doubt PDFs and figures must be audited by safety moderators before appearing public.</p>
                </div>
              </label>
            </div>

          </div>
        </Card>

        {/* Content thresholds */}
        <Card className="border border-surface-200 bg-white">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider mb-4 border-b pb-2">
              Posting Limits & Thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Auto-Hide Report Threshold"
                type="number"
                required
                value={String(settings.autoHideReportThreshold)}
                onChange={(e) => setSettings({ ...settings, autoHideReportThreshold: parseInt(e.target.value) || 3 })}
                hint="Posts hide if flagged N times"
              />

              <Input
                label="Daily Post Thread Limit"
                type="number"
                required
                value={String(settings.dailyPostLimit)}
                onChange={(e) => setSettings({ ...settings, dailyPostLimit: parseInt(e.target.value) || 3 })}
                hint="Max threads/day (New accounts)"
              />

              <Input
                label="Daily Reply Limit"
                type="number"
                required
                value={String(settings.dailyReplyLimit)}
                onChange={(e) => setSettings({ ...settings, dailyReplyLimit: parseInt(e.target.value) || 5 })}
                hint="Max replies/day (New accounts)"
              />
            </div>
          </div>
        </Card>

        {/* Filter word list */}
        <Card className="border border-surface-200 bg-white">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider mb-4 border-b pb-2">
              Moderation Keyword Blacklists
            </h3>

            <Textarea
              label="Blocked Words (comma separated)"
              rows={4}
              required
              value={settings.blockedWordsText}
              onChange={(e) => setSettings({ ...settings, blockedWordsText: e.target.value })}
              placeholder="e.g. telegram, whatsapp, links, pay"
              hint="Posts containing these substrings are automatically flagged or blocked."
            />
          </div>
        </Card>

        <div className="flex justify-end pt-3">
          <Button type="submit" size="sm" icon={<Save className="h-4.5 w-4.5" />}>
            Save Policies Config
          </Button>
        </div>
      </form>
    </Container>
  );
}
