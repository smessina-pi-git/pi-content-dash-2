import { NEON_PURPLE } from "../config/constants";
import Icons from "./Icons";

export default function ThemeToggle({ mode, setMode }) {
  const dark = mode === "dark";
  return (
    <button
      onClick={() => setMode(dark ? "light" : "dark")}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: dark
          ? "linear-gradient(135deg,#2A2440,#3D3556)"
          : "linear-gradient(135deg,#E5E7EB,#D1D5DB)",
        padding: 0,
        transition: "background 0.3s",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: dark ? 22 : 2,
          top: 2,
          width: 20,
          height: 20,
          borderRadius: 10,
          background: dark ? "#0D0B14" : "#fff",
          transition: "left 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: dark
            ? `0 0 8px ${NEON_PURPLE}`
            : "0 1px 3px rgba(0,0,0,0.2)",
          color: dark ? NEON_PURPLE : "#F59E0B",
        }}
      >
        {dark ? Icons.moon(11) : Icons.sun(11)}
      </div>
    </button>
  );
}
