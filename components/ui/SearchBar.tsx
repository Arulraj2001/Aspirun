import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-surface-400">
        <Search className="h-5 w-5" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-white text-sm md:text-base border border-surface-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm transition-all text-surface-800 placeholder:text-surface-400"
      />
    </div>
  );
};
