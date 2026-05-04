import { describe, it, expect } from "vitest";
import { formatLongDate, formatShortDate } from "./date";

describe("formatLongDate", () => {
  it("formats timestamp to long date string", () => {
    const timestamp = new Date("2023-10-15").getTime();
    expect(formatLongDate(timestamp)).toBe("Sunday, October 15, 2023");
  });
});

describe("formatShortDate", () => {
  it("formats timestamp to short date string", () => {
    const timestamp = new Date("2023-10-15").getTime();
    expect(formatShortDate(timestamp)).toBe("October 15, 2023");
  });
});