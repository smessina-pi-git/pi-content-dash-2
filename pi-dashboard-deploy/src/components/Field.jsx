import { bodyFont } from "../config/constants";

export default function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  theme,
}) {
  return (
    <div>
      <label
        style={{
          fontSize: 11,
          color: theme.textMuted,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          display: "block",
          marginBottom: 5,
          ...bodyFont,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: 8,
          border: `1px solid ${theme.border}`,
          fontSize: 13,
          color: theme.text,
          outline: "none",
          boxSizing: "border-box",
          background: theme.inputBg,
          ...bodyFont,
        }}
        onFocus={(e) => (e.target.style.borderColor = theme.accentP)}
        onBlur={(e) => (e.target.style.borderColor = theme.border)}
      />
    </div>
  );
}
