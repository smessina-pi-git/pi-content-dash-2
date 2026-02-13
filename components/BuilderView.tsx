import React, { useState, useRef } from 'react';
import { ContentItem, SheetConfig } from '../types';
import { Upload, RefreshCw, Trash2, Image as ImageIcon, AlertCircle, FileSpreadsheet, Plus, Link } from 'lucide-react';
import { parseSheetUrl } from '../services/csvService';

interface BuilderViewProps {
  items: ContentItem[];
  sheets: SheetConfig[];
  autoSync: boolean;
  syncInterval: number;
  onSyncOne: (sheet: SheetConfig) => Promise<void>;
  onSyncAll: () => Promise<void>;
  onAddSheet: (url: string) => void;
  onRemoveSheet: (id: string) => void;
  onFileUpload: (files: FileList) => Promise<void>;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, file: File) => Promise<void>;
  onClearAll: () => void;
  onUpdateSettings: (auto: boolean, interval: number) => void;
}

const BuilderView: React.FC<BuilderViewProps> = (props) => {
  const [newSheetUrl, setNewSheetUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageId, setPendingImageId] = useState<string | null>(null);

  const handleAddSheet = () => {
    if (!newSheetUrl) return;
    const parsed = parseSheetUrl(newSheetUrl);
    if (!parsed) {
        setSyncMessage({ type: 'error', text: 'Invalid Google Sheet URL' });
        return;
    }
    props.onAddSheet(newSheetUrl);
    setNewSheetUrl('');
    setSyncMessage(null);
  };

  const handleSyncAll = async () => {
    if (props.sheets.length === 0) {
        setSyncMessage({ type: 'error', text: 'No sheets connected.' });
        return;
    }
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      await props.onSyncAll();
      setSyncMessage({ type: 'success', text: 'All sheets synced successfully!' });
    } catch (e) {
      setSyncMessage({ type: 'error', text: 'Failed to sync some sheets.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncOne = async (sheet: SheetConfig) => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
        await props.onSyncOne(sheet);
        setSyncMessage({ type: 'success', text: `Synced ${sheet.name || 'sheet'}!` });
    } catch (e) {
        setSyncMessage({ type: 'error', text: 'Failed to sync sheet.' });
    } finally {
        setIsSyncing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      props.onFileUpload(e.dataTransfer.files);
    }
  };

  const handleImageClick = (id: string) => {
    setPendingImageId(id);
    imageInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && pendingImageId) {
      await props.onImageUpload(pendingImageId, e.target.files[0]);
    }
    setPendingImageId(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-fade-in items-start">
      
      {/* Sidebar: Sheet Management */}
      <aside className="w-full xl:w-80 shrink-0 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#171f2d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Link size={18} /> Connected Sheets
            </h2>
            
            <div className="flex flex-col gap-3 mb-6">
                {props.sheets.map(sheet => (
                    <div key={sheet.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 group">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Google Sheet</span>
                            <button 
                                onClick={() => props.onRemoveSheet(sheet.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mb-2" title={sheet.url}>
                            {sheet.name || sheet.id}
                        </div>
                        <button 
                             onClick={() => handleSyncOne(sheet)}
                             disabled={isSyncing}
                             className="w-full py-1.5 text-xs font-bold text-brand-purple bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                        >
                            {isSyncing ? <RefreshCw className="animate-spin" size={12} /> : <RefreshCw size={12} />}
                            Sync Now
                        </button>
                    </div>
                ))}
                {props.sheets.length === 0 && (
                    <div className="text-sm text-slate-400 text-center py-4 italic">No sheets connected</div>
                )}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex gap-2 mb-4">
                    <input 
                        type="url" 
                        placeholder="Paste Google Sheet URL..."
                        className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-purple outline-none"
                        value={newSheetUrl}
                        onChange={(e) => setNewSheetUrl(e.target.value)}
                    />
                    <button 
                        onClick={handleAddSheet}
                        className="p-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                 <button 
                    onClick={handleSyncAll}
                    disabled={isSyncing || props.sheets.length === 0}
                    className="w-full py-2.5 rounded-lg bg-brand-purple text-white font-bold hover:bg-purple-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Sync All Sources
                </button>
                
                {syncMessage && (
                    <div className={`flex items-center gap-2 text-xs mt-3 ${syncMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        <AlertCircle size={12} />
                        <span>{syncMessage.text}</span>
                    </div>
                )}
            </div>
          </div>

          {/* Settings Box */}
           <div className="bg-white dark:bg-[#171f2d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Sync Settings</h3>
                <div className="flex flex-col gap-4">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                        type="checkbox" 
                        checked={props.autoSync}
                        onChange={(e) => props.onUpdateSettings(e.target.checked, props.syncInterval)}
                        className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple border-slate-300"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Auto-sync enabled</span>
                    </label>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Interval</span>
                        <select 
                            value={props.syncInterval}
                            onChange={(e) => props.onUpdateSettings(props.autoSync, Number(e.target.value))}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                            <option value={5}>5 min</option>
                            <option value={15}>15 min</option>
                            <option value={30}>30 min</option>
                            <option value={60}>60 min</option>
                        </select>
                    </div>
                </div>
           </div>
      </aside>

      {/* Main Area: Content Table */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <section className="bg-white dark:bg-[#171f2d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Imported Content</h2>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full">{props.items.length}</span>
            </div>
            <div className="flex gap-2">
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <Upload size={14} />
                    Import File
                </button>
                <button 
                    onClick={() => { if(confirm('Are you sure you want to clear all data?')) props.onClearAll() }}
                    className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    Clear All
                </button>
            </div>
            </div>

            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Image</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {props.items.length === 0 ? (
                    <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                        <FileSpreadsheet size={32} className="opacity-20" />
                        <span>No items imported yet. Connect a sheet or upload a file.</span>
                    </td>
                    </tr>
                ) : (
                    props.items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate" title={item.assetTitle}>{item.assetTitle}</td>
                        <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                            {item.status}
                        </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.assetType}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{new Date(item.publicationDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                            {item.imageUrl ? (
                            <img src={item.imageUrl} alt="" className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700" />
                            ) : (
                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                                <ImageIcon size={14} />
                            </div>
                            )}
                            <button 
                            onClick={() => handleImageClick(item.id)}
                            className="text-xs text-brand-purple hover:underline"
                            >
                            {item.imageUrl ? 'Edit' : 'Add'}
                            </button>
                        </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                        <button 
                            onClick={() => props.onDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </section>

        {/* Drag Drop Area */}
        <div 
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-white dark:hover:bg-slate-800/50 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/20"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="text-brand-purple mb-3 opacity-50" size={32} />
          <p className="font-bold text-slate-700 dark:text-slate-300">Drag & Drop Files</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supports CSV, TSV, JSON</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept=".csv,.tsv,.json,.txt"
            onChange={(e) => e.target.files && props.onFileUpload(e.target.files)} 
          />
        </div>
      </div>
      
      {/* Hidden inputs */}
      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
    </div>
  );
};

export default BuilderView;