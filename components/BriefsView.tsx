import React, { useState } from 'react';
import { Brief } from '../types';
import { FileText, Plus, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';

interface BriefsViewProps {
  briefs: Brief[];
  onAddBrief: (title: string, url: string) => void;
  onDeleteBrief: (id: string) => void;
}

const BriefsView: React.FC<BriefsViewProps> = ({ briefs, onAddBrief, onDeleteBrief }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl) {
      onAddBrief(newTitle || newUrl, newUrl);
      setNewTitle('');
      setNewUrl('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    if (text && (text.startsWith('http') || text.startsWith('www'))) {
        onAddBrief('New Brief Document', text);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-5xl mx-auto">
        <div className="bg-white dark:bg-[#171f2d] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center">
             <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Project Briefs</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                Centralize your strategy documents. Drop Google Doc links here or add them manually.
             </p>

             <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
                <input 
                    type="text" 
                    placeholder="Brief Title (Optional)"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-purple outline-none"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <input 
                    type="url" 
                    placeholder="Paste URL..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-purple outline-none"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    required
                />
                <button type="submit" className="bg-brand-purple hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
                    <Plus size={20} />
                    Add
                </button>
             </form>
             
             <div 
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
             >
                <LinkIcon className="mx-auto mb-2 opacity-50" />
                <span className="text-sm font-medium">Drag and drop URL links here</span>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {briefs.map(brief => (
                <div key={brief.id} className="group bg-white dark:bg-[#1b2434] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <FileText size={24} />
                        </div>
                        <button onClick={() => onDeleteBrief(brief.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 line-clamp-2" title={brief.title}>
                        {brief.title}
                    </h3>
                    <div className="text-xs text-slate-400 mb-4 truncate">{brief.url}</div>
                    
                    <a 
                        href={brief.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        Open Doc <ExternalLink size={14} />
                    </a>
                </div>
            ))}
            {briefs.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-400 italic">
                    No briefs added yet.
                </div>
            )}
        </div>
    </div>
  );
};

export default BriefsView;