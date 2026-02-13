import React, { useState } from 'react';
import { ContentItem } from '../types';
import { Search, Tag } from 'lucide-react';

interface ArchiveViewProps {
  items: ContentItem[];
}

type GroupMode = 'month' | 'keyword';

const ArchiveView: React.FC<ArchiveViewProps> = ({ items }) => {
  const [groupMode, setGroupMode] = useState<GroupMode>('month');
  const [filterText, setFilterText] = useState('');

  // 1. Filter first
  const filtered = items.filter(item => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (
        item.assetTitle.toLowerCase().includes(q) ||
        item.keyword.toLowerCase().includes(q) ||
        item.responsible.toLowerCase().includes(q)
    );
  });

  // 2. Group items
  const grouped = filtered.reduce((acc, item) => {
    let key = '';
    if (groupMode === 'month') {
        key = item.publicationDate.slice(0, 7); // YYYY-MM
    } else {
        // Pull from keyword field, use first comma separated value
        const kw = item.keyword.split(',')[0].trim();
        key = kw ? kw.charAt(0).toUpperCase() + kw.slice(1) : 'Uncategorized';
    }

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  // 3. Sort groups
  const groupKeys = Object.keys(grouped).sort((a, b) => {
      if (groupMode === 'month') return b.localeCompare(a); // Newest month first
      return a.localeCompare(b); // Alphabetical keywords
  });

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('publish')) return 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800';
    return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white dark:bg-[#171f2d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
         <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button 
                onClick={() => setGroupMode('month')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-bold transition-all ${groupMode === 'month' ? 'bg-white dark:bg-slate-800 text-brand-purple shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
                <CalendarIcon />
                By Month
            </button>
            <button 
                onClick={() => setGroupMode('keyword')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-bold transition-all ${groupMode === 'keyword' ? 'bg-white dark:bg-slate-800 text-brand-purple shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
                <Tag size={18} />
                By Keyword
            </button>
         </div>

         <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Search archive..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base focus:ring-2 focus:ring-brand-purple outline-none shadow-sm"
            />
         </div>
      </div>

      {/* Grouped Tables */}
      <div className="space-y-10">
        {groupKeys.length === 0 ? (
           <div className="text-center py-20 text-slate-400 text-lg">No content matches your filter.</div>
        ) : (
           groupKeys.map(group => {
               let groupTitle = group;
               if (groupMode === 'month') {
                   const date = new Date(`${group}-02`);
                   if (!isNaN(date.getTime())) {
                       groupTitle = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                   }
               }

               return (
                   <section key={group} className="bg-white dark:bg-[#171f2d] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                       <div className="bg-slate-50/50 dark:bg-slate-900/50 px-8 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
                           <div className="w-2 h-6 bg-brand-purple rounded-full" />
                           <h3 className="font-black text-slate-800 dark:text-slate-100 text-2xl">{groupTitle}</h3>
                           <span className="text-sm font-bold font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{grouped[group].length}</span>
                       </div>
                       
                       <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-[#131a26] text-slate-500 dark:text-slate-400 text-sm uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-8 py-4 w-1/2">Asset Details</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Type</th>
                                    <th className="px-8 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {grouped[group].map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 dark:text-slate-100 text-xl mb-2 leading-snug">{item.assetTitle}</span>
                                                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.responsible}</span>
                                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                                    <span className="italic flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                                                        <Tag size={12} />
                                                        {item.keyword}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide border ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-slate-700 dark:text-slate-300 font-bold text-base">{item.assetType}</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-sm">
                                            {new Date(item.publicationDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                       </div>
                   </section>
               );
           })
        )}
      </div>
    </div>
  );
};

const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

export default ArchiveView;