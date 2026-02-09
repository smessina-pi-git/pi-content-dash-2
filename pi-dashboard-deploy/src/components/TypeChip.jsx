import { bodyFont } from "../config/constants";
import { TYPE_COLORS } from "../config/theme";

export default function TypeChip({ type, mode }) {
  const dark = mode === "dark";
  const colorMap = TYPE_COLORS[mode] || TYPE_COLORS.dark;
  const v = colorMap[type] || {
    bg: dark ? "#1A1528" : "#F3F4F6",
    color: dark ? "#A8A0BF" : "#6B7280",
  };

  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 600,
        background: v.bg,
        color: v.color,
        ...bodyFont,
      }}
    >
      {type}
    </span>
  );
}
