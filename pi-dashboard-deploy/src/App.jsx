import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { bodyFont, PAGES, CATEGORY_PAGE_MAP } from "./config/constants";
import { SHEET_SOURCES, AUTO_SYNC_INTERVAL_MS } from "./config/sheets";
import { themes } from "./config/theme";
import { addDays } from "./utils/dates";
import { fetchSheetAsCSV } from "./utils/sheets";
import Icons from "./components/Icons";
import Logo from "./components/Logo";
import ThemeToggle from "./components/ThemeToggle";
import Ticker from "./components/Ticker";
import DetailPanel from "./components/DetailPanel";
import IdeaModal from "./components/IdeaModal";
import SheetsModal from "./components/SheetsModal";
import HomePage from "./components/HomePage";
import WeeklyOverview from "./components/WeeklyOverview";
import ContentPage from "./components/ContentPage";

// Shown while sheets load or if fetch fails
const INITIAL_DATA = [
  {
    id: "s1",
    title: "Loading data from Google Sheets\u2026",
    author: "",
    status: "In Progress",
    publishDate: addDays(new Date(), 0),
    contentType: "Blog Post",
    targetKeyword: "",
    url: "",
    category: "Editorial",
    addedVia: "google-sheets",
    image: "",
  },
];

export default function PIContentDashboard() {
  const [items, setItems] = useState(INITIAL_DATA);
  const [page, setPage] = useState("home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showIdea, setShowIdea] = useState(false);
  const [showSheets, setShowSheets] = useState(false);
  const [sources, setSources] = useState(SHEET_SOURCES);
  const [lastSync, setLastSync] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chatItems, setChatItems] = useState([]);
  const [mode, setMode] = useState("dark");

  const BRAND_BOT_URL = "#"; // Replace with your Gemini custom gem URL
  const theme = themes[mode];

  // Use refs for values used inside the sync callback so that
  // changing chatItems or sources doesn't re-create sync and restart the interval
  const chatItemsRef = useRef(chatItems);
  chatItemsRef.current = chatItems;

  const sourcesRef = useRef(sources);
  sourcesRef.current = sources;

  const sync = useCallback(async (signal) => {
    setSyncing(true);
    setSyncError(null);
    try {
      const results = await Promise.allSettled(
        sourcesRef.current.map((src) => fetchSheetAsCSV(src, signal))
      );
      const allItems = [];
      const errors = [];
      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          allItems.push(...r.value);
        } else if (!signal?.aborted) {
          errors.push(`${sourcesRef.current[i].name}: ${r.reason.message}`);
        }
      });

      if (signal?.aborted) return;

      const merged = [...allItems, ...chatItemsRef.current];
      if (merged.length > 0) setItems(merged);
      else if (errors.length > 0) setSyncError(errors.join("; "));
      setLastSync(new Date());
    } catch (e) {
      if (!signal?.aborted) setSyncError(e.message);
    }
    if (!signal?.aborted) setSyncing(false);
  }, []);

  // Initial sync on mount with abort cleanup
  useEffect(() => {
    const controller = new AbortController();
    sync(controller.signal);
    return () => controller.abort();
  }, [sync]);

  // Auto-sync interval — stable because sync never changes identity
  useEffect(() => {
    const id = setInterval(() => sync(), AUTO_SYNC_INTERVAL_MS);
    return () => clearInterval(id);
  }, [sync]);

  // Re-sync when user saves new sheet sources
  const handleSaveSources = useCallback(
    (newSources) => {
      setSources(newSources);
      sourcesRef.current = newSources;
      sync();
    },
    [sync]
  );

  const filtered = useMemo(() => {
    let result = items;
    if (page !== "home" && page !== "all" && page !== "weekly" && CATEGORY_PAGE_MAP[page]) {
      result = result.filter((i) => i.category === CATEGORY_PAGE_MAP[page]);
    }
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.author.toLowerCase().includes(q) ||
          i.targetKeyword?.toLowerCase().includes(q) ||
          i.contentType.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
    return result;
  }, [items, page, statusFilter, search]);

  const submitIdea = (text) => {
    const newIdea = {
      id: `chat-${Date.now()}`,
      title: text,
      author: "Submitted via Chat",
      status: "Ideation",
      publishDate: new Date().toISOString().split("T")[0],
      contentType: "Blog Post",
      targetKeyword: "",
      url: "",
      category: "Editorial",
      addedVia: "chat",
      image: "",
    };
    setChatItems((prev) => [newIdea, ...prev]);
    setItems((prev) => [newIdea, ...prev]);
  };

  const updateItem = (updated) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelectedItem(updated);
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, transition: "background 0.3s", ...bodyFont }}>
      <Ticker items={items} theme={theme} />

      {/* Nav */}
      <nav
        aria-label="Main navigation"
        style={{
          background: theme.navBg,
          borderBottom: `1px solid ${theme.border}`,
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 52,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={24} />
            <span
              style={{
                fontSize: 13,
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                color: theme.text,
                letterSpacing: -0.3,
              }}
            >
              Content Dashboard
            </span>
          </div>

          <div role="tablist" style={{ display: "flex", gap: 0, height: 52, alignItems: "stretch" }}>
            {PAGES.map((p) => {
              const active = page === p.id;
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setPage(p.id);
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  style={{
                    padding: "0 14px",
                    border: "none",
                    background: "none",
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    color: active ? theme.accent : theme.textSecondary,
                    cursor: "pointer",
                    borderBottom: active
                      ? `2px solid ${theme.accent}`
                      : "2px solid transparent",
                    ...bodyFont,
                    transition: "color 0.15s",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {syncError && (
              <span
                style={{ fontSize: 10, color: theme.accent, fontWeight: 600, ...bodyFont }}
                title={syncError}
              >
                Sheets not public?
              </span>
            )}
            {lastSync && !syncError && (
              <span style={{ fontSize: 10, color: theme.textMuted, ...bodyFont }}>
                Synced{" "}
                {lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <ThemeToggle mode={mode} setMode={setMode} />
            <button
              onClick={() => sync()}
              disabled={syncing}
              title="Sync Sheets"
              aria-label="Sync Google Sheets data"
              style={{
                padding: 6,
                borderRadius: 6,
                border: `1px solid ${theme.border}`,
                background: theme.surface,
                cursor: syncing ? "default" : "pointer",
                display: "flex",
                opacity: syncing ? 0.4 : 1,
                color: theme.textSecondary,
              }}
            >
              <span
                style={{
                  animation: syncing ? "spin 1s linear infinite" : "none",
                  display: "flex",
                }}
              >
                {Icons.refresh(14)}
              </span>
            </button>
            <button
              onClick={() => setShowSheets(true)}
              title="Sources"
              aria-label="Configure sheet sources"
              style={{
                padding: 6,
                borderRadius: 6,
                border: `1px solid ${theme.border}`,
                background: theme.surface,
                cursor: "pointer",
                display: "flex",
                color: theme.textSecondary,
              }}
            >
              {Icons.settings(14)}
            </button>
            <button
              onClick={() => setShowIdea(true)}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: "none",
                background: theme.accent,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                ...bodyFont,
                boxShadow: theme.accentGlow,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,77,94,0.35)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = theme.accentGlow)}
            >
              {Icons.bulb(14)} Submit an Idea
            </button>
          </div>
        </div>
      </nav>

      {/* Pages */}
      {page === "home" && (
        <HomePage
          items={items}
          onClickItem={setSelectedItem}
          brandBotUrl={BRAND_BOT_URL}
          theme={theme}
          mode={mode}
        />
      )}
      {page === "weekly" && (
        <WeeklyOverview items={items} onClickItem={setSelectedItem} theme={theme} mode={mode} />
      )}
      {page !== "home" && page !== "weekly" && (
        <ContentPage
          items={filtered}
          onClickItem={setSelectedItem}
          searchQuery={search}
          setSearchQuery={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          theme={theme}
          mode={mode}
        />
      )}

      {/* Panels & Modals */}
      {selectedItem && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: theme.glassOverlay,
              zIndex: 999,
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setSelectedItem(null)}
          />
          <DetailPanel
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onUpdate={updateItem}
            theme={theme}
            mode={mode}
          />
        </>
      )}
      {showIdea && (
        <IdeaModal
          onClose={() => setShowIdea(false)}
          onSubmit={submitIdea}
          theme={theme}
          mode={mode}
        />
      )}
      {showSheets && (
        <SheetsModal
          sources={sources}
          onSave={handleSaveSources}
          onClose={() => setShowSheets(false)}
          theme={theme}
          mode={mode}
        />
      )}

      {/* Theme-dependent dynamic styles */}
      <style>{`
        body { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.scrollThumb}; }
        select option { background: ${theme.surface}; color: ${theme.text}; }
      `}</style>
    </div>
  );
}
