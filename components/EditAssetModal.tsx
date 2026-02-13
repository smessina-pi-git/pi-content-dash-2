import React, { useState, useEffect } from 'react';
import { X, Save, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { ContentItem } from '../types';

interface EditAssetModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ContentItem) => void;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({ item, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof ContentItem, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1b2434] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-brand-red to-brand-purple p-1 h-2 shrink-0"></div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Edit Asset
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Update content details manually. Note: Syncing may overwrite these changes if the source sheet is updated.
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>
          </div>

          <form id="edit-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Asset Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none"
                value={formData.assetTitle}
                onChange={(e) => handleChange('assetTitle', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Date</label>
                    <input
                        type="date"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none"
                        value={formData.publicationDate}
                        onChange={(e) => handleChange('publicationDate', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                    <select
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="Planned">Planned</option>
                        <option value="Draft">Draft</option>
                        <option value="In Review">In Review</option>
                        <option value="Published">Published</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Type</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none"
                        value={formData.assetType}
                        onChange={(e) => handleChange('assetType', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Owner / Source</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none"
                        value={formData.responsible}
                        onChange={(e) => handleChange('responsible', e.target.value)}
                    />
                </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Hub Topic / Keyword</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none"
                value={formData.keyword}
                onChange={(e) => handleChange('keyword', e.target.value)}
                placeholder="e.g. Talent Optimization"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Meta / Excerpt</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none resize-none h-20"
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
              />
            </div>

             <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-2">
                    Image URL (Recommended) <ImageIcon size={12} />
                </label>
                <input
                    type="url"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                />
                <p className="text-[10px] text-slate-500 mt-1">Paste a direct link to an image (ends in .jpg or .png) to avoid file size limits.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-2">
                 Asset Link <ExternalLink size={12} />
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-purple outline-none text-blue-500"
                value={formData.link || ''}
                onChange={(e) => handleChange('link', e.target.value)}
                placeholder="https://..."
              />
            </div>

          </form>
        </div>
        
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#131a26] flex justify-end gap-3 shrink-0">
            <button 
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
            Cancel
            </button>
            <button 
                type="submit"
                form="edit-form"
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white bg-brand-purple hover:bg-purple-800 shadow-lg shadow-purple-500/20 transition-all"
            >
            <Save size={16} />
            Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssetModal;