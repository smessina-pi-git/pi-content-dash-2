import { STATUSES, bodyFont } from "../config/constants";
import Icons from "./Icons";
import ContentTable from "./ContentTable";

export default function ContentPage({
  items,
  onClickItem,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  theme,
  mode,
}) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px 60px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search content"
              style={{
                padding: "8px 10px 8px 32px",
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                fontSize: 12,
                width: 220,
                outline: "none",
                background: theme.inputBg,
                color: theme.text,
                ...bodyFont,
              }}
              onFocus={(e) => (e.target.style.borderColor = theme.accentP)}
              onBlur={(e) => (e.target.style.borderColor = theme.border)}
            />
            <div
              style={{
                position: "absolute",
                left: 9,
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.textMuted,
              }}
            >
              {Icons.search(14)}
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              fontSize: 12,
              color: theme.textSecondary,
              background: theme.inputBg,
              cursor: "pointer",
              outline: "none",
              ...bodyFont,
            }}
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <span style={{ fontSize: 12, color: theme.textMuted, ...bodyFont }}>
          {items.length} items
        </span>
      </div>
      <ContentTable items={items} onClickItem={onClickItem} theme={theme} mode={mode} />
    </div>
  );
}
