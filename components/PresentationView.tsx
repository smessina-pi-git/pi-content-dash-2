import React, { useRef, useState } from 'react';
import { ContentItem, Idea } from '../types';
import { Lightbulb, Image as ImageIcon, ArrowRight, ExternalLink, Newspaper, PartyPopper, Calendar, Upload, BarChart3 } from 'lucide-react';

interface PresentationViewProps {
  items: ContentItem[];
  ideas: Idea[];
  onSwitchToBuilder: () => void;
  onImageUpload: (id: string, file: File) => Promise<void>;
  onEditItem: (item: ContentItem) => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ 
  items, 
  ideas, 
  onSwitchToBuilder, 
  onImageUpload, 
  onEditItem, 
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pendingImageId, setPendingImageId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (id: string) => {
    setPendingImageId(id);
    imageInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && pendingImageId) {
      await onImageUpload(pendingImageId, e.target.files[0]);
    }
    setPendingImageId(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };
  
  // Recent / Published: Sort Descending (Newest date first)
  const published = items
    .filter(item => (item.status.toLowerCase().includes("published") || new Date(item.publicationDate) < today) && !item.assetType.toLowerCase().includes("pr"))
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
    .slice(0, 3);

  const upcoming = items
    .filter(item => new Date(item.publicationDate) >= today && !item.status.toLowerCase().includes("published") && !item.assetType.toLowerCase().includes("pr"))
    .sort((a, b) => a.publicationDate.localeCompare(b.publicationDate))
    .slice(0, 6);
  
  // PR Coverage: Filter for items with 'PR', 'Press', 'Coverage' in type
  const prCoverage = items
    .filter(item => {
        const t = item.assetType.toLowerCase();
        return t.includes("pr") || t.includes("press") || t.includes("coverage");
    })
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
    .slice(0, 5);

  const propelUrl = "https://app.propelmypr.com/app-client/coverage?t=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50SWQiOjE0NDU0LCJpc3MiOiJQcm9wZWwiLCJpYXQiOjE3MzQxMDQ3ODB9.tafTK2tNLck8NP10qCzX4stNTmH5jGRg64BDCjIfdiQ";
  const analyticsUrl = "https://analytics.google.com/analytics/web/#/a1550594p344515454/reports/explorer?params=_u..comparisons%3D%5B%7B%22name%22:%22Page%20path%20%2B%20query%20string%20includes%20%252Fblog%252F%22,%22isEnabled%22:true,%22filters%22:%5B%7B%22fieldName%22:%22pagePath%22,%22expression%22:%22%252Fblog%252F%22%7D%5D%7D%5D%26_u.date00%3D20260110%26_u.date01%3D20260209&r=13591401105&discardConfirmed=true";

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('publish')) return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20';
    if (s.includes('plan')) return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20';
    if (s.includes('draft')) return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20';
    return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  };

  const AssetLinkWrapper: React.FC<{ item: ContentItem, children: React.ReactNode }> = ({ item, children }) => {
    if (item.link) {
      return (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group/link">
          {children}
        </a>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      
      {/* 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Column 1: Recent */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b-2 border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <PartyPopper size={28} className="text-brand-purple" />
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Recent</h2>
            </div>
            <button 
              onClick={onSwitchToBuilder}
              className="text-base font-bold text-brand-purple flex items-center gap-1 opacity-80 hover:opacity-100"
            >
              Archive <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {published.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <ImageIcon size={48} className="mb-4 opacity-20" />
                <p className="text-lg">No recent stories found.</p>
              </div>
            ) : (
              published.map((item) => (
                <article key={item.id} className="flex flex-col bg-white dark:bg-[#1b2434] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <AssetLinkWrapper item={item}>
                      <div 
                        className={`h-48 w-full bg-cover bg-center overflow-hidden group/image ${!item.imageUrl ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                        style={item.imageUrl ? { backgroundImage: `url('${item.imageUrl}')` } : {}}
                      >
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        {!item.imageUrl && (
                            <div className="flex items-center justify-center h-full text-slate-300 dark:text-slate-600">
                              <ImageIcon size={32} />
                            </div>
                        )}
                        <span className="absolute top-4 left-4 px-2 py-1 bg-white/95 dark:bg-black/80 backdrop-blur-md text-xs font-bold uppercase tracking-wider rounded shadow-sm text-slate-900 dark:text-slate-100">
                          {item.assetType}
                        </span>
                      </div>
                    </AssetLinkWrapper>
                     
                     {/* Image Upload Button Trigger */}
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         handleImageClick(item.id);
                       }}
                       className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover/image:opacity-100 transition-opacity backdrop-blur-sm z-10"
                       title="Change Image"
                     >
                       <Upload size={16} />
                     </button>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <AssetLinkWrapper item={item}>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover/link:text-brand-purple transition-colors">
                            {item.assetTitle}
                        </h3>
                    </AssetLinkWrapper>
                    {item.excerpt && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                            {item.excerpt}
                        </p>
                    )}
                    <div className="mt-auto flex justify-between items-center text-sm pt-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{new Date(item.publicationDate).toLocaleDateString()}</span>
                        <div className="flex gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(item.status)}`}>
                                {item.status}
                            </span>
                            <button onClick={() => onEditItem(item)} className="text-xs font-bold text-slate-400 hover:text-brand-purple">Edit</button>
                        </div>
                    </div>
                  </div>
                </article>
              ))
            )}
            
            {/* Analytics Block - Moved Here */}
             <a 
                href={analyticsUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/50 group hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors mt-auto"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg text-white shadow-sm">
                        <BarChart3 size={20} />
                    </div>
                    <span className="font-bold text-blue-900 dark:text-blue-100">Blog Analytics Report</span>
                </div>
                <ExternalLink size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        {/* Column 2: Upcoming */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b-2 border-slate-200 dark:border-slate-800 pb-4">
             <Calendar size={28} className="text-brand-purple" />
             <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Upcoming</h2>
             <span className="ml-auto text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{upcoming.length} Next Up</span>
          </div>

          <div className="flex flex-col gap-4">
            {upcoming.length === 0 ? (
               <div className="p-10 text-center text-slate-400 text-base italic border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  Nothing currently scheduled.
               </div>
            ) : (
               upcoming.map(item => (
                 <div 
                    key={item.id} 
                    onClick={() => onEditItem(item)}
                    className="flex gap-5 p-5 rounded-xl bg-white dark:bg-[#1b2434] border border-slate-200 dark:border-slate-700 shadow-sm items-center hover:border-brand-purple/50 cursor-pointer transition-colors group"
                 >
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform">
                       <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">{new Date(item.publicationDate).toLocaleDateString('en-US', {month: 'short'})}</span>
                       <span className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">{new Date(item.publicationDate).getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                       {/* Keyword Chip from 'keyword' column */}
                       {item.keyword && (
                         <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-2 truncate max-w-full">
                           {item.keyword}
                         </span>
                       )}
                       <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight mb-2 truncate group-hover:text-brand-purple transition-colors">
                         {item.assetTitle}
                       </h4>
                       <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                             {item.status}
                          </span>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.assetType}</span>
                       </div>
                    </div>
                 </div>
               ))
            )}
          </div>
        </div>

        {/* Column 3: PR Coverage */}
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end border-b-2 border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <Newspaper size={28} className="text-brand-red" />
                    <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">PR Coverage</h2>
                </div>
                <a 
                  href={propelUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base font-bold text-brand-purple flex items-center gap-1 opacity-80 hover:opacity-100"
                >
                  Propel Dashboard <ExternalLink size={16} />
                </a>
            </div>
            
            <div className="flex flex-col gap-4">
                {prCoverage.length === 0 ? (
                     <div className="p-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        No coverage data found. Add rows with Asset Type "PR" or "Coverage" to your sheet, or check the Propel link above.
                     </div>
                ) : (
                    prCoverage.map((pr) => (
                        <a 
                            key={pr.id} 
                            href={pr.link || '#'} 
                            target={pr.link ? "_blank" : "_self"}
                            className="flex flex-col p-5 bg-white dark:bg-[#1b2434] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold uppercase text-brand-purple tracking-wider bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded max-w-full truncate">
                                    {pr.responsible !== 'Unassigned' ? pr.responsible : 'Publication'}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-snug mb-3 group-hover:text-brand-red transition-colors">
                                {pr.assetTitle}
                            </h4>
                            <div className="mt-auto pt-3 flex justify-between items-center border-t border-slate-100 dark:border-slate-800/50">
                                <span className="text-xs font-medium text-slate-400">{new Date(pr.publicationDate).toLocaleDateString()}</span>
                                <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-500" />
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>

      </div>

      {/* Bottom Section: Ideas Bin */}
      <section className="bg-slate-100/50 dark:bg-[#131a26]/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 mt-8">
         <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-yellow-400 rounded-xl shadow-md transform rotate-3">
               <Lightbulb className="text-white" size={28} fill="currentColor" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">The Ideas Bin</h2>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium">Rough concepts and drafts.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ideas.length === 0 ? (
               <div className="col-span-full py-16 text-center text-slate-500 text-lg">
                  The bin is empty. Add a new idea above!
               </div>
            ) : (
               ideas.map(idea => (
                 <article key={idea.id} className="bg-white dark:bg-[#1b2434] p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col hover:border-brand-purple/40 hover:shadow-lg transition-all">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-lg leading-snug">{idea.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4 mb-4 flex-1">{idea.subhead}</p>
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                       <span className="text-slate-400">
                          {new Date(idea.createdAt).toLocaleDateString()}
                       </span>
                       <span className="text-brand-purple bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">Draft</span>
                    </div>
                 </article>
               ))
            )}
         </div>
      </section>

      {/* Hidden inputs */}
      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

    </div>
  );
};

export default PresentationView;