import { bodyFont } from "../config/constants";

export default function SelectField({ label, value, options, onChange, theme }) {
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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: 8,
          border: `1px solid ${theme.border}`,
          fontSize: 13,
          color: theme.text,
          outline: "none",
          background: theme.inputBg,
          cursor: "pointer",
          ...bodyFont,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
