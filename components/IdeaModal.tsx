import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

const IdeaModal: React.FC<IdeaModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1b2434] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all animate-fade-in">
        <div className="bg-gradient-to-r from-brand-red to-brand-purple p-1 h-2"></div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-brand-purple" size={20} />
                Generate Content Asset
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Jot down a rough idea. Our AI will format it into a structured content brief.
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              autoFocus
              className="w-full h-32 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none resize-none mb-4"
              placeholder="e.g. Write a blog post about how psychometrics can improve team retention in hybrid workplaces..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!text.trim()}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white bg-brand-purple hover:bg-purple-800 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                Generate Asset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IdeaModal;