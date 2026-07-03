'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Save, Settings, CreditCard } from 'lucide-react';

interface GeneralSettings {
  requireRulesAcceptance: boolean;
  blockLinksFromNewUsers: boolean;
  dailyPostLimit: number;
  autoHideReportThreshold: number;
  blacklistedKeywords: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings>({
    requireRulesAcceptance: true,
    blockLinksFromNewUsers: true,
    dailyPostLimit: 15,
    autoHideReportThreshold: 5,
    blacklistedKeywords: 'scam, cheat, leak, buy answers'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('community_safety_settings');
    setTimeout(() => {
      if (saved) {
        setSettings(JSON.parse(saved));
      }
      setLoading(false);
    }, 0);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('community_safety_settings', JSON.stringify(settings));
    alert('Global safety specifications saved.');
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-bold">Syncing platform values...</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-6">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-150 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
            Platform Safety Settings
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Configure community guidelines filters and anti-spam protocols.
          </p>
        </div>

        <Link href="/admin/settings/payment">
          <Button size="sm" icon={<CreditCard className="h-4.5 w-4.5" />}>
            UPI Billing Settings
          </Button>
        </Link>
      </div>

      <Card className="border border-surface-200">
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="text-xs font-black uppercase text-surface-850 tracking-wider mb-4 flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-brand-650" />
            Spam & Moderation Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Require Community Rules Acceptance"
              value={settings.requireRulesAcceptance ? 'true' : 'false'}
              onChange={(e) => setSettings({ ...settings, requireRulesAcceptance: e.target.value === 'true' })}
              options={[
                { value: 'true', label: 'Mandatory (Modal locks threads catalog until accepted)' },
                { value: 'false', label: 'Disabled (Aspirants can read forums instantly)' }
              ]}
            />
            <Select
              label="Restricted URLs sharing for new profiles"
              value={settings.blockLinksFromNewUsers ? 'true' : 'false'}
              onChange={(e) => setSettings({ ...settings, blockLinksFromNewUsers: e.target.value === 'true' })}
              options={[
                { value: 'true', label: 'Block Links (Restricts external URLs in thread drafts)' },
                { value: 'false', label: 'Allow Links (Unrestricted URLs posting)' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Daily Replies/Threads limit per User"
              type="number"
              value={settings.dailyPostLimit}
              onChange={(e) => setSettings({ ...settings, dailyPostLimit: parseInt(e.target.value) || 10 })}
              required
            />
            <Input
              label="Auto-Hide Report Flags Threshold"
              type="number"
              value={settings.autoHideReportThreshold}
              onChange={(e) => setSettings({ ...settings, autoHideReportThreshold: parseInt(e.target.value) || 5 })}
              required
            />
          </div>

          <Textarea
            label="Blacklisted keywords (Comma separated)"
            value={settings.blacklistedKeywords}
            onChange={(e) => setSettings({ ...settings, blacklistedKeywords: e.target.value })}
            placeholder="scam, cheat, leaks"
            rows={3}
            required
          />

          <div className="flex justify-end pt-4 border-t mt-6">
            <Button type="submit" icon={<Save className="h-4.5 w-4.5" />}>
              Save Safety Settings
            </Button>
          </div>
        </form>
      </Card>
    </Container>
  );
}
