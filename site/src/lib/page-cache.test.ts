import { describe, expect, it } from "vitest";
import { secondsUntilChange } from "./page-cache";

// 12:30:15 in Utah (MST, UTC-7).
const moment = new Date("2026-11-17T19:30:15Z");

describe("secondsUntilChange", () => {
  it("keeps a page until Utah midnight when no Game time comes first", () => {
    expect(secondsUntilChange([], moment)).toBe(11 * 3600 + 29 * 60 + 45);
  });

  it("keeps a page until the start of the next Game", () => {
    expect(secondsUntilChange(["2026-11-17 20:00", "2026-11-24 20:00"], moment)).toBe(7 * 3600 + 29 * 60 + 45);
  });

  it("keeps a page until the minute after a Game that starts this minute", () => {
    expect(secondsUntilChange(["2026-11-17 12:30"], moment)).toBe(45);
  });

  it("keeps a page until a League Season stops being current", () => {
    // 60 days after 2026-09-18 13:00 is 2026-11-17 13:00.
    expect(secondsUntilChange(["2026-09-18 13:00"], moment)).toBe(29 * 60 + 45);
  });

  it("ignores the Game times that have passed", () => {
    expect(secondsUntilChange(["2026-11-10 20:00", "2025-01-01 20:00"], moment)).toBe(11 * 3600 + 29 * 60 + 45);
  });
});
