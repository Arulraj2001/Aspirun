'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { GraduationCap, Lock, AlertTriangle } from 'lucide-react';

export default function AlertProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomAlert = (e: CustomEvent<string>) => {
      setModalData({ isOpen: true, message: e.detail });
    };

    window.addEventListener('custom-alert' as any, handleCustomAlert);

    // Override the default browser window.alert
    window.alert = (message: string) => {
      window.dispatchEvent(new CustomEvent('custom-alert', { detail: message }));
    };

    return () => {
      window.removeEventListener('custom-alert' as any, handleCustomAlert);
    };
  }, []);

  const isLoginMessage = modalData.message.toLowerCase().includes('login');
  const isAccessDenied = modalData.message.toLowerCase().includes('access denied') || 
                          modalData.message.toLowerCase().includes('permission');

  const handleConfirm = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
    if (isLoginMessage) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  };

  return (
    <Modal
      isOpen={modalData.isOpen}
      onClose={() => setModalData(prev => ({ ...prev, isOpen: false }))}
      title={isLoginMessage ? "Sign In Required" : isAccessDenied ? "Security Guard" : "Aspirav Notice"}
      size="sm"
      footer={
        <div className="flex gap-2.5 w-full justify-end">
          {isLoginMessage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalData(prev => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
          )}
          <Button
            variant={isAccessDenied ? "danger" : "primary"}
            size="sm"
            onClick={handleConfirm}
          >
            {isLoginMessage ? "Sign In Now" : "Understood"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center p-3">
        {isLoginMessage ? (
          <span className="p-3.5 bg-brand-50 rounded-2xl text-brand-600 mb-4 shadow-sm">
            <Lock className="h-6 w-6 animate-pulse" />
          </span>
        ) : isAccessDenied ? (
          <span className="p-3.5 bg-danger-50 rounded-2xl text-danger-600 mb-4 shadow-sm animate-bounce">
            <AlertTriangle className="h-6 w-6" />
          </span>
        ) : (
          <span className="p-3.5 bg-brand-50 rounded-2xl text-brand-500 mb-4 shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </span>
        )}
        
        <p className="text-sm font-semibold text-surface-650 leading-relaxed">
          {modalData.message}
        </p>
      </div>
    </Modal>
  );
}
