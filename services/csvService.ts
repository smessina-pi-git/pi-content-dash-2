import { ContentItem, STOP_WORDS } from '../types';

function safeId(): string {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeHeader(text: string): string {
  return String(text).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeDate(input: string): string {
  if (!input) return "";
  const raw = String(input).trim();
  
  // Helper to fix year
  const fixYear = (d: Date) => {
    if (Number.isNaN(d.getTime())) return null;
    let year = d.getFullYear();
    // If year is detected as < 2023 (e.g. 2001 from '01'), default to 2026 as requested
    if (year < 2023) {
        d.setFullYear(2026);
    }
    return d.toISOString().slice(0, 10);
  };

  const direct = new Date(raw);
  const fixedDirect = fixYear(direct);
  if (fixedDirect && !Number.isNaN(direct.getTime()) && raw.length > 5) return fixedDirect;

  const monthDay = raw.match(/^([A-Za-z]{3,9})\/?\s*(\d{1,2})$/);
  if (monthDay) {
    const withYear = new Date(`${monthDay[1]} ${monthDay[2]}, 2026`); // Default to 2026 if no year
    const fixed = fixYear(withYear);
    if (fixed) return fixed;
  }

  const slash = raw.match(/(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?/);
  if (slash) {
    let year = slash[3] ? Number(slash[3]) : 2026;
    if (year < 100) year += 2000;
    // Fix logic for the specific "2001" issue: if it parsed to something ancient or just wrong context
    if (year < 2023) year = 2026;
    
    const dt = new Date(year, Number(slash[1]) - 1, Number(slash[2]));
    const fixed = fixYear(dt);
    if (fixed) return fixed;
  }

  return "";
}

function normalizeAssetType(raw: string, owner: string): string {
  const type = String(raw || "").toLowerCase();
  const who = String(owner || "").toLowerCase();
  if (type.includes("video")) return "Video";
  if (type.includes("blog")) return "Blog";
  if (type.includes("site") || type.includes("page")) return "SitePage";
  if (type.includes("pr") || type.includes("press") || type.includes("coverage")) return "PR";
  if (type.includes("co") || who.includes("co-market")) return "CoMarketing";
  if (type.includes("webinar")) return "Webinar";
  return type.charAt(0).toUpperCase() + type.slice(1) || "Asset";
}

function deriveKeyword(title: string): string {
  return String(title || "").toLowerCase().split(/\s+/).slice(0, 3).join(" ");
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === delimiter && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  values.push(current);
  return values;
}

function mapRowToItem(row: Record<string, string>): ContentItem {
  const map = Object.entries(row).reduce((acc, [key, value]) => {
    acc[normalizeHeader(key)] = String(value || "").trim();
    return acc;
  }, {} as Record<string, string>);

  const get = (...keys: string[]) => {
    for (const key of keys) {
      if (map[key]) return map[key];
    }
    return "";
  };

  const title = get("assettitle", "title", "contenttitle", "headline");
  const status = get("status", "stage") || "Planned";
  // 'Source' or 'Publication' maps to responsible for PR items
  const owner = get("responsible", "contentowner", "owner", "assignee", "source", "publication", "outlet") || "Unassigned";
  const date = normalizeDate(get("publicationdate", "publishdatepi", "publishdate", "date"));

  return {
    id: safeId(),
    assetTitle: title,
    status,
    assetType: normalizeAssetType(get("assettype", "type", "page", "contenttype"), owner),
    // Map 'Hub Topic' specifically to keyword as requested
    keyword: get("hubtopic", "keyword", "topic", "primarykeyword") || deriveKeyword(title),
    excerpt: get("excerpt", "summary", "description", "metadescription") || "",
    responsible: owner,
    publicationDate: date,
    imageUrl: get("image", "imageurl", "imagelink"),
    link: get("assetlink", "link", "url", "landingpage", "articlelink"),
  };
}

export function parseCSV(text: string, delimiter = ','): ContentItem[] {
  const lines: string[] = [];
  let current = "";
  let inQuotes = false;

  // Split lines respecting quoted newlines
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      const next = text[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      lines.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (current) lines.push(current);

  if (!lines.length) return [];
  
  // Detect TSV if first line has tabs
  if (lines[0].includes('\t')) delimiter = '\t';

  const headers = splitCsvLine(lines[0], delimiter).map((h) => h.trim());
  const items: ContentItem[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    if (!lines[i].trim()) continue;
    const values = splitCsvLine(lines[i], delimiter);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = (values[idx] || "").trim();
    });
    
    const item = mapRowToItem(row);
    if (item.assetTitle && item.publicationDate) {
      items.push(item);
    }
  }

  return items;
}

export function parseSheetUrl(url: string): { id: string; gid: string } | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return null;
    return { id: match[1], gid: parsed.searchParams.get("gid") || "0" };
  } catch {
    return null;
  }
}

// AI Idea helpers
function capitalizeWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function summarizeIdea(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "No summary available.";
  return clean.length <= 92 ? clean : `${clean.slice(0, 89).trimEnd()}...`;
}

export function buildIdeaDraft(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentence = clean.split(/[.!?]/).find((part) => part.trim().length > 0)?.trim() || clean;
  const words = sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word));

  const titleTokens = words.slice(0, 6).map(capitalizeWord);
  const title = (titleTokens.length ? titleTokens.join(" ") : clean.slice(0, 48)).slice(0, 68).trim();
  return { title: title || "Content Idea", subhead: summarizeIdea(clean) };
}