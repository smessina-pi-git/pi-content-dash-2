import { useState } from "react";
import { headingFont, bodyFont } from "../config/constants";
import Icons from "./Icons";

export default function IdeaModal({ onClose, onSubmit, theme, mode }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="Submit a content idea"
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
          borderRadius: 20,
          padding: 32,
          width: 480,
          boxShadow: `0 25px 60px rgba(0,0,0,${mode === "dark" ? 0.5 : 0.2})`,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: mode === "dark" ? "rgba(168,85,247,0.12)" : "#F5F0FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.accentP,
            }}
          >
            {Icons.bulb(20)}
          </div>
          <h2 style={{ ...headingFont, fontSize: 18, color: theme.text, margin: 0 }}>
            Submit a Quick Idea
          </h2>
        </div>
        <p
          style={{
            fontSize: 13,
            color: theme.textMuted,
            margin: "0 0 20px",
            lineHeight: 1.5,
            ...bodyFont,
          }}
        >
          Drop your content idea here. It'll be sent to the content team for review and
          added to the backlog.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Blog post about using behavioral data for remote team building..."
          rows={4}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            fontSize: 14,
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            background: theme.inputBg,
            color: theme.text,
            lineHeight: 1.5,
            ...bodyFont,
          }}
          onFocus={(e) => (e.target.style.borderColor = theme.accentP)}
          onBlur={(e) => (e.target.style.borderColor = theme.border)}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
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
          <button
            onClick={submit}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: text.trim() ? theme.accent : "rgba(255,255,255,0.06)",
              color: text.trim() ? "#fff" : theme.textMuted,
              fontSize: 13,
              fontWeight: 700,
              cursor: text.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              gap: 6,
              ...bodyFont,
              boxShadow: text.trim() ? theme.accentGlow : "none",
            }}
          >
            {Icons.send(14)} Submit Idea
          </button>
        </div>
      </div>
    </div>
  );
}
