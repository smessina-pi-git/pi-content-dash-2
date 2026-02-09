import { NEON, bodyFont } from "../config/constants";
import { formatShortDate } from "../utils/dates";

export default function Ticker({ items, theme }) {
  const published = items
    .filter((i) => i.status === "Published" && i.url)
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  if (!published.length) return null;

  const doubled = [...published, ...published];

  return (
    <div
      style={{
        background: theme.tickerBg,
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        height: 38,
        display: "flex",
        alignItems: "center",
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: `linear-gradient(to right,${theme.tickerBg},transparent)`,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: `linear-gradient(to left,${theme.tickerBg},transparent)`,
          zIndex: 2,
        }}
      />
      <div
        className="ticker-track"
        style={{
          display: "inline-flex",
          gap: 44,
          animation: `ticker ${published.length * 6}s linear infinite`,
          paddingLeft: 40,
        }}
      >
        {doubled.map((it, i) => (
          <a
            key={`${it.id}-${i}`}
            href={it.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(255,255,255,0.55)",
              transition: "color 0.15s",
              ...bodyFont,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
            }
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: NEON,
                flexShrink: 0,
                boxShadow: `0 0 6px ${NEON}`,
              }}
            />
            <span
              style={{
                fontWeight: 700,
                color: NEON,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                textShadow: "0 0 10px rgba(255,77,94,0.4)",
              }}
            >
              LIVE
            </span>
            {it.title}
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>
              {formatShortDate(it.publishDate)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
