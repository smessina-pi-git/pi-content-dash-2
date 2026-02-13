import React from 'react';
import { DashboardStats } from '../types';

interface SummaryPillsProps {
  stats: DashboardStats;
}

const SummaryPills: React.FC<SummaryPillsProps> = ({ stats }) => {
  // Helpers for cleaner JSX
  const Pill = ({ label, value, colorClass }: { label: string, value: string | number, colorClass: string }) => (
    <div className={`flex flex-col px-5 py-3 rounded-xl border ${colorClass} min-w-[120px]`}>
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">{label}</span>
        <span className="text-3xl font-bold tracking-tighter">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <Pill 
        label="Total Assets" 
        value={stats.total} 
        colorClass="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100" 
      />
      <Pill 
        label="Published" 
        value={stats.published} 
        colorClass="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400" 
      />
      <Pill 
        label="Upcoming" 
        value={stats.upcoming30d} 
        colorClass="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" 
      />
      <Pill 
        label="Next Drop" 
        value={stats.nextDate ? new Date(stats.nextDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "--"} 
        colorClass="bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/50 text-brand-purple dark:text-purple-300" 
      />
    </div>
  );
};

export default SummaryPills;