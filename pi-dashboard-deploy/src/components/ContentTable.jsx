import { bodyFont } from "../config/constants";
import { formatDate } from "../utils/dates";
import StatusBadge from "./StatusBadge";
import SourceBadge from "./SourceBadge";
import TypeChip from "./TypeChip";

const HEADERS = ["Title", "Author", "Status", "Type", "Category", "Publish Date", "Keyword", "Source"];

export default function ContentTable({ items, onClickItem, theme, mode }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        overflow: "hidden",
        background: theme.surface,
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, ...bodyFont }}
        role="table"
      >
        <thead>
          <tr style={{ background: theme.surfaceAlt }}>
            {HEADERS.map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  fontSize: 9,
                  fontWeight: 700,
                  color: theme.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr
              key={it.id}
              onClick={() => onClickItem(it)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${it.title}`}
              onKeyDown={(e) => e.key === "Enter" && onClickItem(it)}
              style={{
                cursor: "pointer",
                background: i % 2 === 0 ? theme.surface : theme.surfaceAlt,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  mode === "dark" ? "rgba(168,85,247,0.06)" : "#FEF2F2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i % 2 === 0 ? theme.surface : theme.surfaceAlt)
              }
            >
              <td
                style={{
                  padding: "10px 12px",
                  fontWeight: 600,
                  color: theme.text,
                  maxWidth: 240,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {it.title}
              </td>
              <td style={{ padding: "10px 12px", color: theme.textSecondary }}>
                {it.author}
              </td>
              <td style={{ padding: "10px 12px" }}>
                <StatusBadge status={it.status} small mode={mode} />
              </td>
              <td style={{ padding: "10px 12px" }}>
                <TypeChip type={it.contentType} mode={mode} />
              </td>
              <td style={{ padding: "10px 12px", color: theme.textSecondary, fontSize: 12 }}>
                {it.category}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  color: theme.textSecondary,
                  whiteSpace: "nowrap",
                  fontSize: 12,
                }}
              >
                {formatDate(it.publishDate)}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  color: theme.textMuted,
                  fontSize: 11,
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {it.targetKeyword || "\u2014"}
              </td>
              <td style={{ padding: "10px 12px" }}>
                <SourceBadge source={it.addedVia} mode={mode} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: theme.textMuted,
            fontSize: 13,
            ...bodyFont,
          }}
        >
          No content matches your filters
        </div>
      )}
    </div>
  );
}
