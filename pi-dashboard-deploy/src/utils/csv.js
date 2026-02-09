export function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        currentRow.push(cell.trim());
        cell = "";
      } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        currentRow.push(cell.trim());
        cell = "";
        if (currentRow.some((c) => c !== "")) rows.push(currentRow);
        currentRow = [];
        if (ch === "\r") i++;
      } else {
        cell += ch;
      }
    }
  }

  currentRow.push(cell.trim());
  if (currentRow.some((c) => c !== "")) rows.push(currentRow);
  return rows;
}

// Smart column mapper: finds the best match for each field by checking common header names
export function buildColumnMap(headers) {
  const normalized = headers.map((x) =>
    x.toLowerCase().replace(/[^a-z0-9]/g, "")
  );

  const find = (...terms) => {
    for (const term of terms) {
      const idx = normalized.findIndex((x) => x.includes(term));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  return {
    title: find("title", "headline", "topic", "name", "blogtitle", "posttitle", "articletitle"),
    author: find("author", "writer", "assignedto", "owner", "createdby", "assignee"),
    status: find("status", "state", "stage", "progress", "workflow"),
    publishDate: find("publishdate", "pubdate", "dateposted", "datepublished", "goliveda", "livedate", "date", "duedate", "targetdate", "deadline"),
    contentType: find("contenttype", "type", "format", "assettype", "content"),
    targetKeyword: find("targetkeyword", "keyword", "seokey", "primarykeyword", "focuskey", "keyphrase"),
    url: find("url", "link", "liveurl", "blogurl", "pageurl", "permalink"),
    category: find("category", "channel", "team", "department", "source", "pillar"),
  };
}
