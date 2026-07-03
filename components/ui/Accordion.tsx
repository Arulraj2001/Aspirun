import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  defaultActiveId?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
  defaultActiveId,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultActiveId ? [defaultActiveId] : []);

  const handleToggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => handleToggle(item.id)}
              className="w-full flex items-center justify-between p-4 font-bold text-sm md:text-base text-surface-800 text-left hover:bg-surface-50 cursor-pointer transition-colors"
            >
              <span>{item.title}</span>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-surface-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-surface-500" />
              )}
            </button>
            {isOpen && (
              <div className="p-4 border-t border-surface-100 bg-surface-50/20 text-xs md:text-sm text-surface-600 leading-relaxed font-medium">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
