import { useState } from "react";
import { headingFont, bodyFont } from "../config/constants";
import { buildSheetUrl, parseSheetUrl } from "../utils/sheets";
import Icons from "./Icons";
import Field from "./Field";

export default function SheetsModal({ sources, onSave, onClose, theme, mode }) {
  // Convert internal source format (sheetId/gid) to editable format (URL-based)
  const [editSources, setEditSources] = useState(
    sources.map((s) => ({
      id: s.id,
      name: s.name,
      sheetId: s.sheetId,
      gid: s.gid,
      defaultCategory: s.defaultCategory,
      sheetUrl: buildSheetUrl(s.sheetId, s.gid),
    }))
  );

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

  const handleSave = () => {
    // Parse URLs back into sheetId/gid before saving
    const parsed = editSources.map((s) => {
      const { sheetId, gid } = s.sheetUrl
        ? parseSheetUrl(s.sheetUrl)
        : { sheetId: s.sheetId, gid: s.gid };
      return {
        id: s.id,
        name: s.name,
        sheetId: sheetId || s.sheetId,
        gid: gid || s.gid || "0",
        defaultCategory: s.defaultCategory || "Editorial",
      };
    });
    onSave(parsed);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="Configure Google Sheets sources"
      style={{
        position: "fixed",
        inset: 0,
        background: theme.glassOverlay,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: theme.surface,
          borderRadius: 16,
          padding: 28,
          width: 520,
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: `0 20px 50px rgba(0,0,0,${mode === "dark" ? 0.5 : 0.15})`,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ ...headingFont, fontSize: 16, margin: 0, color: theme.text }}>
            Google Sheets Sources
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            style={{ ...smallBtnStyle, padding: 6 }}
          >
            {Icons.x()}
          </button>
        </div>

        {editSources.map((s, i) => (
          <div
            key={i}
            style={{
              padding: 14,
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              marginBottom: 10,
              background: theme.surfaceAlt,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, ...bodyFont }}>
                Source {i + 1}
              </span>
              {editSources.length > 1 && (
                <button
                  onClick={() => setEditSources((x) => x.filter((_, idx) => idx !== i))}
                  style={{
                    fontSize: 10,
                    color: theme.accent,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Field
                label="Name"
                value={s.name}
                onChange={(v) =>
                  setEditSources((x) => x.map((y, idx) => (idx === i ? { ...y, name: v } : y)))
                }
                theme={theme}
              />
              <Field
                label="Sheet URL"
                value={s.sheetUrl}
                onChange={(v) =>
                  setEditSources((x) => x.map((y, idx) => (idx === i ? { ...y, sheetUrl: v } : y)))
                }
                placeholder="https://docs.google.com/spreadsheets/d/..."
                theme={theme}
              />
              <Field
                label="Default Category"
                value={s.defaultCategory}
                onChange={(v) =>
                  setEditSources((x) =>
                    x.map((y, idx) => (idx === i ? { ...y, defaultCategory: v } : y))
                  )
                }
                theme={theme}
              />
            </div>
          </div>
        ))}

        <button
          onClick={() =>
            setEditSources((x) => [
              ...x,
              {
                id: "s-" + Date.now(),
                name: "",
                sheetId: "",
                gid: "0",
                defaultCategory: "Editorial",
                sheetUrl: "",
              },
            ])
          }
          style={{
            width: "100%",
            padding: 9,
            borderRadius: 8,
            border: `1.5px dashed ${theme.border}`,
            background: "none",
            fontSize: 12,
            fontWeight: 600,
            color: theme.textMuted,
            cursor: "pointer",
            marginBottom: 14,
            ...bodyFont,
          }}
        >
          + Add Source
        </button>

        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "11px 20px",
            borderRadius: 8,
            border: "none",
            background: theme.accent,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            ...bodyFont,
            boxShadow: theme.accentGlow,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
