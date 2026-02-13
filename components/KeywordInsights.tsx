import React, { useState } from 'react';
import { Sparkles, Search, X } from 'lucide-react';

interface KeywordInsightsProps {
  onSearch: (query: string) => void;
  resultCount: number;
}

const KeywordInsights: React.FC<KeywordInsightsProps> = ({ onSearch, resultCount }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const clear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red to-brand-purple rounded-full opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="pl-4 text-brand-purple">
            <Sparkles size={16} />
          </div>
          <input
            type="text"
            className="w-full bg-transparent border-none focus:ring-0 text-sm py-2.5 px-3 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            placeholder="Ask AI: What posts cover [keyword]?"
            value={query}
            onChange={handleChange}
          />
          {query ? (
            <button onClick={clear} className="pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={16} />
            </button>
          ) : (
            <div className="pr-4 text-slate-300 dark:text-slate-600">
              <Search size={16} />
            </div>
          )}
        </div>
      </div>
      {query && (
        <div className="absolute mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 animate-fade-in pl-4">
          {resultCount === 0 
            ? "No matching content found." 
            : `Found ${resultCount} assets covering "${query}"`}
        </div>
      )}
    </div>
  );
};

export default KeywordInsights;