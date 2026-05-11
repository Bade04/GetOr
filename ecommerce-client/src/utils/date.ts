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

export function formatMonthYear(timestampMs: number) {
  return new Date(timestampMs).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getCurrentMonthYear() {
  return formatMonthYear(Date.now());
}
