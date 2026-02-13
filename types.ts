export interface ContentItem {
  id: string;
  assetTitle: string;
  status: string;
  assetType: string;
  keyword: string;
  excerpt: string;
  responsible: string;
  publicationDate: string; // ISO Date string YYYY-MM-DD
  imageUrl?: string;
  link?: string;
}

export interface Idea {
  id: string;
  text: string;
  title: string;
  subhead: string;
  createdAt: string;
}

export interface Brief {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface SheetConfig {
  id: string;
  url: string;
  name: string;
  lastSynced?: string;
}

export type TabView = 'presentation' | 'builder' | 'archive' | 'briefs';

export interface DashboardStats {
  total: number;
  upcoming30d: number;
  published: number;
  ideas: number;
  nextDate: string | null;
}

export const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how", "in", 
  "is", "it", "of", "on", "or", "our", "that", "the", "this", "to", "we", "with", "your",
]);