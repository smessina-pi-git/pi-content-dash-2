import { parseCSV, buildColumnMap } from "./csv";
import { normalizeDate } from "./dates";
import { normalizeStatus } from "./normalize";

export async function fetchSheetAsCSV(source, signal) {
  const url = `https://docs.google.com/spreadsheets/d/${source.sheetId}/gviz/tq?tqx=out:csv&gid=${source.gid}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Failed to fetch ${source.name}: ${res.status}`);

  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const headers = rows[0];
  const map = buildColumnMap(headers);
  const items = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const title = map.title >= 0 ? r[map.title] : "";
    if (!title) continue;

    items.push({
      id: `${source.id}-${i}`,
      title,
      author: map.author >= 0 ? r[map.author] || "" : "",
      status: normalizeStatus(map.status >= 0 ? r[map.status] : ""),
      publishDate: normalizeDate(map.publishDate >= 0 ? r[map.publishDate] : ""),
      contentType: map.contentType >= 0 ? r[map.contentType] || "Blog Post" : "Blog Post",
      targetKeyword: map.targetKeyword >= 0 ? r[map.targetKeyword] || "" : "",
      url: map.url >= 0 ? r[map.url] || "" : "",
      category: map.category >= 0 ? r[map.category] || source.defaultCategory : source.defaultCategory,
      addedVia: "google-sheets",
      image: "",
      _source: source.name,
    });
  }

  return items;
}

// Parse a full Google Sheets URL into sheetId and gid
export function parseSheetUrl(url) {
  const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  const gidMatch = url.match(/gid=(\d+)/);
  return {
    sheetId: sheetIdMatch ? sheetIdMatch[1] : "",
    gid: gidMatch ? gidMatch[1] : "0",
  };
}

// Build a Google Sheets URL from sheetId and gid
export function buildSheetUrl(sheetId, gid) {
  if (!sheetId) return "";
  return `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=${gid || "0"}`;
}
