export function normalizeDate(raw) {
  if (!raw) return "";

  const iso = Date.parse(raw);
  if (!isNaN(iso)) {
    const d = new Date(iso);
    return d.toISOString().split("T")[0];
  }

  // Try MM/DD/YYYY
  const parts = raw.split("/");
  if (parts.length === 3) {
    const [m, d, y] = parts;
    const yr = y.length === 2 ? "20" + y : y;
    return `${yr}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return "";
}

export function formatDate(s) {
  if (!s) return "\u2014";
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(s) {
  if (!s) return "";
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeDate(s) {
  if (!s) return "";
  const d = new Date(s + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((d - now) / 86400000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 0 && diff <= 7) return `In ${diff} days`;
  if (diff < 0 && diff >= -7) return `${Math.abs(diff)}d ago`;
  return formatDate(s);
}

export function isToday(d) {
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

export function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
    startDate: new Date(monday),
    endDate: sunday,
  };
}

export function addDays(date, n) {
  const x = new Date(date);
  x.setDate(x.getDate() + n);
  return x.toISOString().split("T")[0];
}
