import React from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-surface-200 overflow-x-auto ${className}`}>
      <div className="flex space-x-6 min-w-max px-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-surface-500 hover:text-surface-800 hover:border-surface-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'bg-surface-100 text-surface-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
