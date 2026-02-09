import { useMemo } from "react";
import { STATUSES, headingFont, bodyFont } from "../config/constants";
import { STATUS_COLORS } from "../config/theme";
import { formatDate, formatRelativeDate } from "../utils/dates";
import Icons from "./Icons";
import TypeChip from "./TypeChip";
import StatusBadge from "./StatusBadge";

export default function HomePage({ items, onClickItem, brandBotUrl, theme, mode }) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const thirtyAgo = new Date(now);
  thirtyAgo.setDate(thirtyAgo.getDate() - 30);

  const upcoming = items
    .filter((i) => i.status !== "Published" && new Date(i.publishDate + "T00:00:00") >= now)
    .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
    .slice(0, 6);

  const recent = items
    .filter(
      (i) =>
        i.status === "Published" && new Date(i.publishDate + "T00:00:00") >= thirtyAgo
    )
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  const statusCounts = useMemo(() => {
    const c = {};
    STATUSES.forEach((s) => (c[s] = items.filter((i) => i.status === s).length));
    return c;
  }, [items]);

  const SC = STATUS_COLORS[mode];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 60px" }}>
      {/* Hero */}
      <div style={{ padding: "52px 0 44px", textAlign: "center", position: "relative" }}>
        {mode === "dark" && (
          <>
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "20%",
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "radial-gradient(circle,rgba(168,85,247,0.06),transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 40,
                right: "15%",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "radial-gradient(circle,rgba(255,77,94,0.04),transparent 70%)",
                pointerEvents: "none",
              }}
            />
          </>
        )}
        <h1
          style={{
            ...headingFont,
            fontSize: 44,
            color: theme.text,
            margin: "0 0 12px",
            lineHeight: 1.1,
            letterSpacing: -1.5,
            position: "relative",
          }}
        >
          PI Content Dashboard
        </h1>
        <p
          style={{
            fontSize: 16,
            color: theme.textSecondary,
            margin: "0 auto",
            maxWidth: 540,
            lineHeight: 1.6,
            ...bodyFont,
            position: "relative",
          }}
        >
          A read-only view of everything in production across SEO, PR, Editorial, and
          Video. See what's live, what's next, and what's in the pipeline.
        </p>

        {/* Mini status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 28,
            position: "relative",
          }}
        >
          {STATUSES.map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: SC[s].dot,
                  boxShadow: mode === "dark" ? `0 0 8px ${SC[s].dot}40` : "none",
                }}
              />
              <span style={{ fontSize: 13, color: theme.text, fontWeight: 600, ...bodyFont }}>
                {statusCounts[s]}
              </span>
              <span style={{ fontSize: 12, color: theme.textMuted, ...bodyFont }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* UP NEXT */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                ...headingFont,
                fontSize: 24,
                color: theme.accent,
                margin: 0,
                letterSpacing: -0.5,
                textTransform: "uppercase",
              }}
            >
              Up Next
            </h2>
            <span style={{ fontSize: 12, color: theme.textMuted, ...bodyFont }}>
              {upcoming.length} in pipeline
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.map((it, idx) => (
              <div
                key={it.id}
                onClick={() => onClickItem(it)}
                role="button"
                tabIndex={0}
                aria-label={`View ${it.title}`}
                onKeyDown={(e) => e.key === "Enter" && onClickItem(it)}
                style={{
                  background: theme.surface,
                  borderRadius: 14,
                  padding: "16px 18px",
                  border: `1px solid ${theme.border}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: theme.cardGlow,
                  borderLeft: idx === 0 ? `3px solid ${theme.accent}` : `3px solid ${theme.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accentP;
                  e.currentTarget.style.boxShadow = theme.accentGlowP;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.boxShadow = theme.cardGlow;
                  if (idx === 0) e.currentTarget.style.borderLeftColor = theme.accent;
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <TypeChip type={it.contentType} mode={mode} />
                  <StatusBadge status={it.status} small mode={mode} />
                </div>
                <div
                  style={{
                    fontSize: idx === 0 ? 16 : 14,
                    fontWeight: 700,
                    color: theme.text,
                    marginBottom: 6,
                    lineHeight: 1.3,
                    ...bodyFont,
                  }}
                >
                  {it.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: theme.textSecondary, ...bodyFont }}>
                    {it.author}
                  </span>
                  <span
                    style={{ fontSize: 11, color: theme.accent, fontWeight: 600, ...bodyFont }}
                  >
                    {formatRelativeDate(it.publishDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 16,
            }}
          >
            <h2 style={{ ...headingFont, fontSize: 20, color: theme.text, margin: 0 }}>
              Recently Published
            </h2>
            <span style={{ fontSize: 11, color: theme.textMuted, ...bodyFont }}>
              Last 30 days
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {recent.map((it) => (
              <a
                key={it.id}
                href={it.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: theme.surface,
                  borderRadius: 12,
                  padding: "13px 16px",
                  border: `1px solid ${theme.border}`,
                  cursor: "pointer",
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  boxShadow: theme.cardGlow,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accentG;
                  e.currentTarget.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 44,
                    borderRadius: 2,
                    background: theme.accentG,
                    flexShrink: 0,
                    boxShadow: mode === "dark" ? `0 0 6px ${theme.accentG}40` : "none",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: theme.text,
                      marginBottom: 3,
                      ...bodyFont,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {it.title}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <TypeChip type={it.contentType} mode={mode} />
                    <span style={{ fontSize: 11, color: theme.textMuted, ...bodyFont }}>
                      {it.author}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: theme.textSecondary, ...bodyFont }}>
                    {formatRelativeDate(it.publishDate)}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: theme.accentG,
                      fontWeight: 600,
                      marginTop: 2,
                      ...bodyFont,
                    }}
                  >
                    LIVE
                  </div>
                </div>
              </a>
            ))}
            {recent.length === 0 && (
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: theme.textMuted,
                  fontSize: 13,
                  ...bodyFont,
                }}
              >
                No published content in the last 30 days
              </div>
            )}
          </div>

          {/* Brand Bot */}
          <a
            href={brandBotUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 18px",
              borderRadius: 14,
              background:
                mode === "dark"
                  ? "rgba(168,85,247,0.08)"
                  : "linear-gradient(135deg,#F5F0FF,#EDE9FE)",
              border: `1px solid ${mode === "dark" ? "rgba(168,85,247,0.2)" : "#DDD6FE"}`,
              textDecoration: "none",
              transition: "all 0.2s",
              marginBottom: 14,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: mode === "dark" ? "rgba(168,85,247,0.2)" : theme.accentP,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: mode === "dark" ? theme.accentP : "#fff",
                flexShrink: 0,
              }}
            >
              {Icons.spark(20)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.accentP, ...bodyFont }}>
                PI Brand Bot
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: mode === "dark" ? "#C4B5FD" : "#7C3AED",
                  ...bodyFont,
                }}
              >
                Voice, tone & content guidance
              </div>
            </div>
            <span style={{ color: theme.textMuted }}>{Icons.ext(14)}</span>
          </a>

          {/* Read-only info */}
          <div
            style={{
              background: theme.surface,
              borderRadius: 14,
              border: `1px solid ${theme.border}`,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: theme.textMuted,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 10,
                ...bodyFont,
              }}
            >
              This Dashboard
            </div>
            <p
              style={{
                fontSize: 13,
                color: theme.textSecondary,
                lineHeight: 1.6,
                margin: 0,
                ...bodyFont,
              }}
            >
              This is a <strong style={{ color: theme.text }}>read-only view</strong> of all
              content in production. Task management, assignments, and edits happen in your
              Google Sheets and project tools. Use this to see the big picture.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
