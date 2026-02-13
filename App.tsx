import React, { useState, useEffect, useMemo } from 'react';
import { 
  ContentItem, 
  Idea, 
  TabView, 
  SheetConfig,
  Brief
} from './types';
import { parseCSV, parseSheetUrl, buildIdeaDraft } from './services/csvService';
import PresentationView from './components/PresentationView';
import BuilderView from './components/BuilderView';
import ArchiveView from './components/ArchiveView';
import BriefsView from './components/BriefsView';
import NewsTicker from './components/NewsTicker';
import IdeaModal from './components/IdeaModal';
import EditAssetModal from './components/EditAssetModal';
import { Maximize2, Moon, Sun, Plus, Target, Link as LinkIcon } from 'lucide-react';

// Default data with placeholder PR items
const SEED_ROWS = [
  { status: "Published", title: "6 HR Best Practices for AI Compliance", type: "External", keyword: "HR AI compliance", owner: "Co-marketing", date: "2026-02-14" },
  { status: "Published", title: "Behavioral Assessment video", type: "Video", keyword: "behavioral assessment", owner: "PI", date: "2026-02-10" },
  { status: "Planned", title: "The New Manager Essentials", type: "Webinar", keyword: "new manager essentials", owner: "Co-marketing", date: "2026-03-01" },
  // PR Placeholders
  { status: "Published", title: "HR Tactics For Creating Resilient Work-Life And Wellness Culture", type: "PR", keyword: "culture", owner: "Forbes", date: "2026-01-02", link: "https://www.forbes.com" },
  { status: "Published", title: "2 Forces That Will Determine Who Wins At AI In 2026", type: "PR", keyword: "AI", owner: "Forbes", date: "2026-01-07", link: "https://www.forbes.com" },
  { status: "Published", title: "Closing the Skills Gap: How to Hire Strategically Minded Leaders", type: "PR", keyword: "skills gap", owner: "HR Daily Advisor", date: "2026-01-23" },
  { status: "Published", title: "If You Hear These 11 Phrases At Work, Someone's About To Make Your Life Hell", type: "PR", keyword: "workplace", owner: "Your Tango", date: "2026-01-24" },
  { status: "Published", title: "Hiring for empathy", type: "PR", keyword: "hiring", owner: "Springfield Business Journal", date: "2026-01-28" },
  { status: "Published", title: "How AI is changing the job search — and how to make it work for you", type: "PR", keyword: "AI job search", owner: "Quartz", date: "2026-02-02" },
];

const STORAGE_KEY = "pi_content_items_v6";
const IDEAS_KEY = "pi_content_ideas_v6";
const SETTINGS_KEY = "pi_settings_v6";
const CAMPAIGN_KEY = "pi_campaign_v6";
const BRIEFS_KEY = "pi_briefs_v6";

const App: React.FC = () => {
  // State
  const [items, setItems] = useState<ContentItem[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [activeTab, setActiveTab] = useState<TabView>('presentation');
  const [theme, setTheme] = useState<'light'|'dark'>('dark');
  const [sheets, setSheets] = useState<SheetConfig[]>([]);
  const [autoSync, setAutoSync] = useState(false);
  const [syncInterval, setSyncInterval] = useState(15);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  
  // Campaign State
  const [campaignTopic, setCampaignTopic] = useState("The Empty Workplace");
  const [campaignLink, setCampaignLink] = useState("");
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  
  // Edit Modal State
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Init
  useEffect(() => {
    // Theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    // Load Data
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        // Seed initial
        const seeds: ContentItem[] = SEED_ROWS.map((row, i) => ({
          id: `seed-${i}`,
          assetTitle: row.title,
          status: row.status,
          assetType: row.type,
          keyword: row.keyword,
          excerpt: row.type === 'PR' ? '' : `${row.title} is in the calendar.`,
          responsible: row.owner,
          publicationDate: row.date,
          link: row.link
        }));
        setItems(seeds);
      }
    } catch (e) {
      console.error("Error loading items", e);
    }

    try {
      const storedIdeas = localStorage.getItem(IDEAS_KEY);
      if (storedIdeas) setIdeas(JSON.parse(storedIdeas));
    } catch (e) { console.error("Error loading ideas", e); }

    try {
      const storedBriefs = localStorage.getItem(BRIEFS_KEY);
      if (storedBriefs) setBriefs(JSON.parse(storedBriefs));
    } catch (e) { console.error("Error loading briefs", e); }
    
    try {
      const storedCampaign = localStorage.getItem(CAMPAIGN_KEY);
      if (storedCampaign) {
          const parsed = JSON.parse(storedCampaign);
          setCampaignTopic(parsed.topic || "The Empty Workplace");
          setCampaignLink(parsed.link || "");
      }
    } catch (e) {}

    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSheets(parsed.sheets || []);
        setAutoSync(parsed.auto || false);
        setSyncInterval(parsed.interval || 15);
      }
    } catch (e) { console.error("Error loading settings", e); }
  }, []);

  // Update Persistance
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("LocalStorage Save Failed (likely quota exceeded)", e);
    }
  }, [items]);
  
  useEffect(() => {
    try {
      localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
    } catch (e) { console.error("LocalStorage Save Failed", e); }
  }, [ideas]);

  useEffect(() => {
    try {
      localStorage.setItem(BRIEFS_KEY, JSON.stringify(briefs));
    } catch (e) { console.error("LocalStorage Save Failed", e); }
  }, [briefs]);

  useEffect(() => {
    try {
      localStorage.setItem(CAMPAIGN_KEY, JSON.stringify({ topic: campaignTopic, link: campaignLink }));
    } catch (e) {}
  }, [campaignTopic, campaignLink]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ sheets, auto: autoSync, interval: syncInterval }));
    } catch (e) { console.error("LocalStorage Save Failed", e); }
    
    let timer: number;
    if (autoSync && sheets.length > 0) {
      timer = window.setInterval(() => {
        handleSyncAll();
      }, syncInterval * 60 * 1000);
    }
    return () => clearInterval(timer);
  }, [sheets, autoSync, syncInterval]);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', newTheme);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  // Logic
  const fetchSheetData = async (url: string): Promise<ContentItem[]> => {
    const parsed = parseSheetUrl(url);
    if (!parsed) throw new Error("Invalid URL");

    const urls = [
      `https://docs.google.com/spreadsheets/d/${parsed.id}/export?format=csv${parsed.gid ? `&gid=${parsed.gid}` : ""}`,
      `https://docs.google.com/spreadsheets/d/${parsed.id}/gviz/tq?tqx=out:csv${parsed.gid ? `&gid=${parsed.gid}` : ""}`,
    ];

    let csvText = "";
    for (const endpoint of urls) {
      try {
        const res = await fetch(endpoint);
        if (res.ok) {
           csvText = await res.text();
           break;
        }
      } catch (e) {}
    }

    if (!csvText) throw new Error("Fetch failed");
    return parseCSV(csvText);
  };

  const mergeItems = (newItems: ContentItem[]) => {
      setItems(prev => {
        const map = new Map();
        
        // Index existing items by Title (lowercase) to detect duplicates
        prev.forEach(p => map.set(p.assetTitle.toLowerCase().trim(), p));
        
        // Merge new items
        newItems.forEach(n => {
            const key = n.assetTitle.toLowerCase().trim();
            const existing = map.get(key);
            
            if (existing) {
                // Overwrite existing item with new data
                // Preserve ID and Image if the new one doesn't have an image
                map.set(key, { 
                    ...n, 
                    id: existing.id, 
                    imageUrl: n.imageUrl || existing.imageUrl 
                });
            } else {
                // Add new item
                map.set(key, n);
            }
        });
        
        return Array.from(map.values());
      });
  };

  const handleSyncOne = async (sheet: SheetConfig) => {
     const data = await fetchSheetData(sheet.url);
     if (data.length > 0) mergeItems(data);
     
     // Update last synced
     setSheets(prev => prev.map(s => s.id === sheet.id ? { ...s, lastSynced: new Date().toISOString() } : s));
  };

  const handleSyncAll = async () => {
     let allData: ContentItem[] = [];
     for (const sheet of sheets) {
         try {
             const data = await fetchSheetData(sheet.url);
             allData = [...allData, ...data];
         } catch(e) { console.error(`Failed to sync ${sheet.url}`, e); }
     }
     if (allData.length > 0) mergeItems(allData);
  };

  const handleAddSheet = (url: string) => {
      const parsed = parseSheetUrl(url);
      if (!parsed) return;
      const newSheet: SheetConfig = {
          id: parsed.id, // Use sheet ID as config ID
          url,
          name: `Sheet ${sheets.length + 1}`
      };
      // Avoid duplicates
      if (!sheets.find(s => s.id === newSheet.id)) {
          setSheets(prev => [...prev, newSheet]);
      }
  };

  const handleRemoveSheet = (id: string) => {
      setSheets(prev => prev.filter(s => s.id !== id));
  };

  const handleFileUpload = async (files: FileList) => {
     const newItems: ContentItem[] = [];
     for (let i=0; i<files.length; i++) {
        const text = await files[i].text();
        if (files[i].name.endsWith('.json')) {
           try {
             const json = JSON.parse(text);
             if (Array.isArray(json)) newItems.push(...json);
           } catch(e) {}
        } else {
           newItems.push(...parseCSV(text));
        }
     }
     
     if (newItems.length > 0) {
        mergeItems(newItems);
     }
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleImageUpload = async (id: string, file: File) => {
    // 1MB Limit to prevent LocalStorage crashing
    if (file.size > 1024 * 1024) {
        alert("Image too large. Please upload an image smaller than 1MB or paste an image URL in the edit menu instead.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
       const url = e.target?.result as string;
       setItems(prev => prev.map(item => item.id === id ? { ...item, imageUrl: url } : item));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveItem = (updated: ContentItem) => {
    setItems(prev => prev.map(item => item.id === updated.id ? updated : item));
    setEditingItem(null);
  };

  const handleSubmitIdea = (text: string) => {
    const draft = buildIdeaDraft(text);
    const newIdea: Idea = {
      id: crypto.randomUUID(),
      text,
      title: draft.title,
      subhead: draft.subhead,
      createdAt: new Date().toISOString()
    };
    setIdeas(prev => [newIdea, ...prev]);
  };

  const handleAddBrief = (title: string, url: string) => {
      setBriefs(prev => [...prev, {
          id: crypto.randomUUID(),
          title,
          url,
          createdAt: new Date().toISOString()
      }]);
  };

  const handleDeleteBrief = (id: string) => {
      setBriefs(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0e121a]">
      <NewsTicker />
      
      <main className="max-w-[1600px] mx-auto p-6 sm:p-10 pb-20 font-sans text-slate-900 dark:text-slate-100">
        
        {/* Background Decor */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
           <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-brand-red/5 dark:bg-brand-red/10 rounded-full blur-3xl opacity-50" />
           <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-brand-purple/5 dark:bg-brand-purple/10 rounded-full blur-3xl opacity-50" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-8 mb-12 mt-4">
          <div className="flex items-center gap-8">
             <img 
                 src="https://images.g2crowd.com/uploads/product/image/social_landscape/social_landscape_40e470684e3b4e23753f7bd8b57bba9e/the-predictive-index.png" 
                 alt="PI Logo" 
                 className="h-20 w-20 rounded-full object-cover shadow-lg"
               />
            <div>
                 <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-3">
                    Brand Marketing Dashboard
                 </h1>
                 <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                   Ongoing and upcoming projects to build the brand.
                 </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsIdeaModalOpen(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-red hover:bg-red-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus size={24} strokeWidth={3} />
                    <span>Submit Idea</span>
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={toggleFullscreen}
                      className="p-2.5 rounded-lg text-slate-400 hover:text-brand-purple hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      title="Toggle Fullscreen"
                    >
                      <Maximize2 size={20} />
                    </button>
                    
                    <button 
                      onClick={toggleTheme}
                      className="p-2.5 rounded-lg text-slate-400 hover:text-brand-purple hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      title="Toggle Theme"
                    >
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                  </div>
              </div>

              {/* Subtle Campaign Pill */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-sm">
                  <Target size={14} className="text-brand-purple" />
                  <span className="text-xs font-bold uppercase text-slate-400">Current Campaign:</span>
                  
                  {isEditingCampaign ? (
                     <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs outline-none w-32"
                            value={campaignTopic}
                            onChange={(e) => setCampaignTopic(e.target.value)}
                            placeholder="Campaign Topic"
                        />
                         <input 
                            type="text" 
                            className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs outline-none w-24"
                            value={campaignLink}
                            onChange={(e) => setCampaignLink(e.target.value)}
                            placeholder="Brief URL"
                        />
                        <button onClick={() => setIsEditingCampaign(false)} className="text-xs font-bold text-green-500">OK</button>
                     </div>
                  ) : (
                     <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingCampaign(true)}>
                         <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{campaignTopic}</span>
                         {campaignLink && (
                             <a href={campaignLink} target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline" onClick={(e) => e.stopPropagation()}>
                                <LinkIcon size={12} />
                             </a>
                         )}
                         <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                     </div>
                  )}
              </div>
          </div>
        </header>

        {/* Tabs */}
        <nav className="relative z-10 flex gap-4 mb-10 border-b-2 border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
          {[
            { id: 'presentation', label: 'Snapshot' },
            { id: 'archive', label: 'Full Archive' },
            { id: 'builder', label: 'Data Manager' },
            { id: 'briefs', label: 'Project Briefs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabView)}
              className={`
                px-6 py-3 text-lg font-bold whitespace-nowrap transition-all
                ${activeTab === tab.id 
                  ? 'text-brand-purple border-b-4 border-brand-purple mb-[-3px]' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="relative z-10 min-h-[500px]">
          {activeTab === 'presentation' && (
            <PresentationView 
              items={items} 
              ideas={ideas} 
              onSwitchToBuilder={() => setActiveTab('builder')} 
              onImageUpload={handleImageUpload}
              onEditItem={setEditingItem}
            />
          )}
          
          {activeTab === 'builder' && (
            <BuilderView 
              items={items}
              sheets={sheets}
              autoSync={autoSync}
              syncInterval={syncInterval}
              onSyncOne={handleSyncOne}
              onSyncAll={handleSyncAll}
              onAddSheet={handleAddSheet}
              onRemoveSheet={handleRemoveSheet}
              onFileUpload={handleFileUpload}
              onDelete={handleDelete}
              onImageUpload={handleImageUpload}
              onClearAll={() => { setItems([]); setIdeas([]); }}
              onUpdateSettings={(auto, int) => {
                setAutoSync(auto);
                setSyncInterval(int);
              }}
            />
          )}
          
          {activeTab === 'archive' && (
            <ArchiveView items={items} />
          )}

          {activeTab === 'briefs' && (
              <BriefsView 
                briefs={briefs}
                onAddBrief={handleAddBrief}
                onDeleteBrief={handleDeleteBrief}
              />
          )}
        </div>

        <IdeaModal 
          isOpen={isIdeaModalOpen} 
          onClose={() => setIsIdeaModalOpen(false)} 
          onSubmit={handleSubmitIdea} 
        />
        
        <EditAssetModal 
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
        />
      </main>
    </div>
  );
};

export default App;