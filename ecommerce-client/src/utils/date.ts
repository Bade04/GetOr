export function formatLongDate(timestampMs: number) {
  return new Date(timestampMs).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(timestampMs: number) {
  return new Date(timestampMs).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
