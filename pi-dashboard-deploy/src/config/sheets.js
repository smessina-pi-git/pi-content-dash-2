// Your public Google Sheets. The dashboard auto-detects column headers.
// Make sure both sheets are set to: Share > Anyone with the link > Viewer
export const SHEET_SOURCES = [
  {
    id: "main",
    name: "SEO Content Calendar",
    sheetId: "1QxKiWyW6t5-VhtDNVTA9z85t-5mZ8bE--ARpFQUs3Ms",
    gid: "1119805524",
    defaultCategory: "SEO Agency",
  },
  {
    id: "secondary",
    name: "PR / Editorial Calendar",
    sheetId: "1F-AbiPiQyX5vm2Bh3e9mKrLZXtQ2yDStY3174Lw6zxE",
    gid: "595694338",
    defaultCategory: "PR",
  },
];

export const AUTO_SYNC_INTERVAL_MS = 300000; // 5 minutes
