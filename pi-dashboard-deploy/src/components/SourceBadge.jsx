import { bodyFont } from "../config/constants";
import Icons from "./Icons";

export default function SourceBadge({ source, mode }) {
  const isChat = source === "chat";
  const dark = mode === "dark";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "2px 7px",
        borderRadius: 10,
        fontSize: 9,
        fontWeight: 700,
        background: dark
          ? isChat
            ? "rgba(56,189,248,0.1)"
            : "rgba(52,211,153,0.1)"
          : isChat
            ? "#F0F9FF"
            : "#F0FDF4",
        color: dark
          ? isChat
            ? "#7DD3FC"
            : "#6EE7B7"
          : isChat
            ? "#0369A1"
            : "#15803D",
        border: `1px solid ${
          dark
            ? isChat
              ? "rgba(56,189,248,0.2)"
              : "rgba(52,211,153,0.2)"
            : isChat
              ? "#BAE6FD"
              : "#BBF7D0"
        }`,
        textTransform: "uppercase",
        ...bodyFont,
      }}
    >
      {isChat ? Icons.chat(10) : Icons.cloud(10)}
      {isChat ? "Chat" : "Sheets"}
    </span>
  );
}
