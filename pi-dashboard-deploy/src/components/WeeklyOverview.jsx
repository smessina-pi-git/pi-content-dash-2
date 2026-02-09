import { headingFont, bodyFont, STATUSES } from "../config/constants";
import { STATUS_COLORS } from "../config/theme";
import { formatShortDate, formatDate, getWeekRange, isToday } from "../utils/dates";
import Icons from "./Icons";
import Logo from "./Logo";
import StatusBadge from "./StatusBadge";
import TypeChip from "./TypeChip";

export default function WeeklyOverview({ items, onClickItem, theme, mode }) {
  const wk = getWeekRange();

  const weekItems = items
    .filter((i) => i.publishDate >= wk.start && i.publishDate <= wk.end)
    .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));

  const published = items
    .filter((i) => i.status === "Published")
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, 5);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(wk.startDate);
    d.setDate(wk.startDate.getDate() + i);
    days.push(d);
  }

  const statusCounts = {};
  STATUSES.forEach((s) => (statusCounts[s] = items.filter((i) => i.status === s).length));

  const SC = STATUS_COLORS[mode];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 60px" }}>
      {/* Slide Header */}
      <div
        style={{
          background:
            mode === "dark"
              ? "linear-gradient(135deg,#110E1C 0%,#1A1528 50%,#0D0B14 100%)"
              : "linear-gradient(135deg,#111827 0%,#1F2937 100%)",
          borderRadius: 24,
          padding: "48px 56px 44px",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
          border: mode === "dark" ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,77,94,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: 80,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(168,85,247,0.06)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Logo size={22} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                ...bodyFont,
              }}
            >
              Weekly Content Overview
            </span>
          </div>
          <h1
            style={{
              ...headingFont,
              fontSize: 36,
              color: "#fff",
              margin: "0 0 8px",
              letterSpacing: -0.5,
            }}
          >
            {formatShortDate(wk.start)} &ndash; {formatShortDate(wk.end)}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0, ...bodyFont }}>
            {weekItems.length} items scheduled this week &middot; {statusCounts.Published}{" "}
            published total
          </p>
          <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
            {STATUSES.map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: SC[s].dot,
                    boxShadow: `0 0 6px ${SC[s].dot}40`,
                  }}
                />
                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", ...headingFont }}>
                  {statusCounts[s]}
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", ...bodyFont }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ ...headingFont, fontSize: 18, color: theme.text, margin: "0 0 14px" }}>
          This Week
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,minmax(0,1fr))",
            gap: 8,
          }}
        >
          {days.map((d, i) => {
            const ds = d.toISOString().split("T")[0];
            const dayItems = items.filter((it) => it.publishDate === ds);
            const today = isToday(d);

            return (
              <div
                key={i}
                style={{
                  borderRadius: 14,
                  padding: 12,
                  minHeight: 140,
                  background: today
                    ? mode === "dark"
                      ? "rgba(255,77,94,0.06)"
                      : "#FEF2F2"
                    : theme.surface,
                  border: today
                    ? `2px solid ${theme.accent}`
                    : `1px solid ${theme.border}`,
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: today ? theme.accent : theme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    ...bodyFont,
                  }}
                >
                  {dayNames[i]}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    ...headingFont,
                    color: today ? theme.accent : theme.text,
                    marginBottom: 8,
                  }}
                >
                  {d.getDate()}
                </div>
                {dayItems.map((it) => (
                  <div
                    key={it.id}
                    onClick={() => onClickItem(it)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${it.title}`}
                    onKeyDown={(e) => e.key === "Enter" && onClickItem(it)}
                    style={{
                      padding: "5px 7px",
                      borderRadius: 8,
                      marginBottom: 4,
                      cursor: "pointer",
                      background: SC[it.status]?.bg || theme.surfaceAlt,
                      borderLeft: `3px solid ${SC[it.status]?.dot || theme.textMuted}`,
                      fontSize: 10,
                      fontWeight: 600,
                      color: theme.text,
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      ...bodyFont,
                    }}
                  >
                    {it.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recently Published */}
      <section>
        <h2 style={{ ...headingFont, fontSize: 18, color: theme.text, margin: "0 0 14px" }}>
          Recently Published
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 14,
          }}
        >
          {published.map((it) => (
            <div
              key={it.id}
              onClick={() => onClickItem(it)}
              role="button"
              tabIndex={0}
              aria-label={`View ${it.title}`}
              onKeyDown={(e) => e.key === "Enter" && onClickItem(it)}
              style={{
                background: theme.surface,
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${theme.border}`,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: theme.cardGlow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = theme.accentGlowP;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.cardGlow;
              }}
            >
              <div
                style={{
                  height: 120,
                  background:
                    mode === "dark"
                      ? "linear-gradient(135deg,#1A1528,#110E1C)"
                      : "linear-gradient(135deg,#F9FAFB,#F3F4F6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {it.image ? (
                  <img
                    src={it.image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      color: theme.textMuted,
                    }}
                  >
                    {Icons.img(24)}
                    <span style={{ fontSize: 10, ...bodyFont }}>Featured image</span>
                  </div>
                )}
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                  <StatusBadge status={it.status} small mode={mode} />
                </div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <TypeChip type={it.contentType} mode={mode} />
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    ...headingFont,
                    color: theme.text,
                    margin: "0 0 6px",
                    lineHeight: 1.3,
                  }}
                >
                  {it.title}
                </h3>
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
                  <span style={{ fontSize: 11, color: theme.textMuted, ...bodyFont }}>
                    {formatDate(it.publishDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
