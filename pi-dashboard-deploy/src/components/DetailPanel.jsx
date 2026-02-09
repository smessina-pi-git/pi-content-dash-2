import { useState } from "react";
import { STATUSES, TYPES, CATEGORIES, headingFont, bodyFont } from "../config/constants";
import { formatDate } from "../utils/dates";
import Icons from "./Icons";
import StatusBadge from "./StatusBadge";
import SourceBadge from "./SourceBadge";
import TypeChip from "./TypeChip";
import Field from "./Field";
import SelectField from "./SelectField";

export default function DetailPanel({ item, onClose, onUpdate, theme, mode }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...item });

  if (!item) return null;

  const save = () => {
    onUpdate(draft);
    setEditing(false);
  };

  const detailLabelStyle = {
    fontSize: 10,
    color: theme.textMuted,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    display: "block",
    marginBottom: 3,
    ...bodyFont,
  };

  const smallBtnStyle = {
    padding: "5px 12px",
    borderRadius: 6,
    border: `1px solid ${theme.border}`,
    background: theme.surface,
    fontSize: 12,
    fontWeight: 600,
    color: theme.textSecondary,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    ...bodyFont,
  };

  const DetailRow = ({ label, value }) => (
    <div>
      <span style={detailLabelStyle}>{label}</span>
      <span style={{ fontSize: 14, color: theme.text, fontWeight: 500, ...bodyFont }}>
        {value}
      </span>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-label="Content details"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 400,
        background: theme.surface,
        boxShadow: `-4px 0 30px rgba(0,0,0,${mode === "dark" ? 0.4 : 0.1})`,
        zIndex: 1000,
        overflowY: "auto",
        borderLeft: `1px solid ${theme.border}`,
      }}
    >
      <div style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: theme.textMuted,
              textTransform: "uppercase",
              letterSpacing: 1,
              ...bodyFont,
            }}
          >
            Content Details
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {!editing && (
              <button
                onClick={() => {
                  setEditing(true);
                  setDraft({ ...item });
                }}
                style={smallBtnStyle}
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close details panel"
              style={{ ...smallBtnStyle, padding: 6 }}
            >
              {Icons.x()}
            </button>
          </div>
        </div>

        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Title" value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} theme={theme} />
            <Field label="Author" value={draft.author} onChange={(v) => setDraft((d) => ({ ...d, author: v }))} theme={theme} />
            <SelectField label="Status" value={draft.status} options={STATUSES} onChange={(v) => setDraft((d) => ({ ...d, status: v }))} theme={theme} />
            <Field label="Publish Date" value={draft.publishDate} onChange={(v) => setDraft((d) => ({ ...d, publishDate: v }))} type="date" theme={theme} />
            <SelectField label="Content Type" value={draft.contentType} options={TYPES} onChange={(v) => setDraft((d) => ({ ...d, contentType: v }))} theme={theme} />
            <SelectField label="Category" value={draft.category} options={CATEGORIES} onChange={(v) => setDraft((d) => ({ ...d, category: v }))} theme={theme} />
            <Field label="Target Keyword" value={draft.targetKeyword} onChange={(v) => setDraft((d) => ({ ...d, targetKeyword: v }))} theme={theme} />
            <Field label="URL" value={draft.url} onChange={(v) => setDraft((d) => ({ ...d, url: v }))} theme={theme} />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button
                onClick={save}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: theme.accent,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  ...bodyFont,
                }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  background: theme.surface,
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.textSecondary,
                  cursor: "pointer",
                  ...bodyFont,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <TypeChip type={item.contentType} mode={mode} />
              <h3
                style={{
                  fontSize: 18,
                  ...headingFont,
                  color: theme.text,
                  margin: "8px 0 0",
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </h3>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <StatusBadge status={item.status} mode={mode} />
              <SourceBadge source={item.addedVia} mode={mode} />
            </div>
            <DetailRow label="Author" value={item.author} />
            <DetailRow label="Publish Date" value={formatDate(item.publishDate)} />
            <DetailRow label="Category" value={item.category} />
            {item.targetKeyword && (
              <DetailRow label="Target Keyword" value={item.targetKeyword} />
            )}
            {item.url && (
              <div>
                <span style={detailLabelStyle}>URL</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13,
                    color: theme.accentP,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    ...bodyFont,
                  }}
                >
                  {Icons.link()}
                  {item.url.replace(/^https?:\/\//, "").substring(0, 40)}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
