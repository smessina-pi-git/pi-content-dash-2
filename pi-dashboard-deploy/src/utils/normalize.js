export function normalizeStatus(raw) {
  if (!raw) return "Ideation";
  const s = raw.toLowerCase().trim();

  if (s.includes("publish") || s.includes("live") || s.includes("complete") || s.includes("done"))
    return "Published";
  if (s.includes("review") || s.includes("edit") || s.includes("approval"))
    return "Review";
  if (s.includes("progress") || s.includes("writing") || s.includes("draft") || s.includes("active") || s.includes("working"))
    return "In Progress";

  return "Ideation";
}
