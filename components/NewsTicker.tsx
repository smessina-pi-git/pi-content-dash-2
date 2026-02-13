import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
}

const NewsTicker: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.hrdive.com%2Ffeeds%2Fnews%2F');
        const data = await res.json();
        if (data.items) {
          setNews(data.items.slice(0, 5));
        }
      } catch (e) {
        console.error("Failed to fetch news", e);
        setNews([
            { title: "AI in recruitment has increased efficiency by 40%", link: "#" },
            { title: "Hybrid work models are now the standard for 85% of tech companies", link: "#" },
            { title: "Employee wellbeing programs see a 3x ROI", link: "#" }
        ]);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-brand-dark border-b border-white/10 relative z-50 flex h-12">
      {/* Persistent Label */}
      <div className="bg-brand-red text-white text-sm font-black px-6 flex items-center shrink-0 tracking-widest z-10 shadow-lg">
        HR NEWS
      </div>
      
      {/* Ticker Area */}
      <div className="flex-1 overflow-hidden relative flex items-center bg-brand-dark/50 backdrop-blur-sm">
        <div className="flex items-center gap-10 animate-ticker whitespace-nowrap absolute left-full pl-4">
           {news.length > 0 ? news.map((item, i) => (
             <React.Fragment key={i}>
               <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-medium text-slate-200 hover:text-white transition-colors">
                  <FileText size={14} className="text-brand-red/70" />
                  {item.title}
               </a>
               <span className="text-brand-red/50 text-xs">•</span>
             </React.Fragment>
           )) : (
              <span className="text-sm text-slate-400">Loading industry updates...</span>
           )}
           <span className="font-bold text-brand-purple ml-4 text-sm">PI UPDATE</span>
           <span className="text-base text-slate-300">New "Team Discovery" module launching next month.</span>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;