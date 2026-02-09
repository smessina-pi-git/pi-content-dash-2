import { bodyFont } from "../config/constants";
import { STATUS_COLORS } from "../config/theme";

const fallbackColors = {
  bg: "#1A1528",
  text: "#A8A0BF",
  border: "#2A2440",
  dot: "#6B6088",
};

export default function StatusBadge({ status, small, mode }) {
  const colors = STATUS_COLORS[mode] || STATUS_COLORS.dark;
  const c = colors[status] || fallbackColors;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: small ? "2px 8px" : "3px 10px",
        borderRadius: 20,
        fontSize: small ? 10 : 11,
        fontWeight: 600,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
        ...bodyFont,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}
