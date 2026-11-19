import { describe, expect, it } from "vitest";
import {
  bugRows,
  clockTime,
  gameTitle,
  initials,
  leagueLabel,
  leagueSeasonLabel,
  lineScore,
  longDate,
  periodName,
  resultLabel,
  seasonLabel,
  shortDate,
  utahTime,
  versus,
  videoImage,
  youtubeId,
} from "./game-format";

const nightOwls = { name: "Night Owls", logo: "nightowls.png", color: "#6608A1", color2: "#A3D60A" };

describe("dates", () => {
  it("writes the dates of the mockups", () => {
    expect(longDate("2026-11-08 18:45")).toBe("Sun, Nov 8, 2026");
    expect(shortDate("2025-03-18 20:30")).toBe("Tue, Mar 18");
    expect(clockTime("2026-11-08 18:45")).toBe("6:45 PM");
    expect(clockTime("2026-11-08 00:05")).toBe("12:05 AM");
  });

  it("gives the time in Utah, with summer time", () => {
    expect(utahTime(new Date("2026-11-16T19:30:00Z"))).toBe("2026-11-16 12:30");
    expect(utahTime(new Date("2026-07-01T03:15:00Z"))).toBe("2026-06-30 21:15");
  });
});

describe("gameTitle", () => {
  it("uses 'at' for an away Game and 'vs' for a home Game", () => {
    expect(gameTitle({ side: "away", opponent: nightOwls })).toBe("Ice Pak at Night Owls");
    expect(gameTitle({ side: "home", opponent: nightOwls })).toBe("Ice Pak vs Night Owls");
  });

  it("treats a Game with no side as a home Game (Troy, 2026-11-16)", () => {
    expect(versus(null)).toBe("vs");
  });

  it("names a missing opponent", () => {
    expect(gameTitle({ side: null, opponent: null })).toBe("Ice Pak vs Unknown opponent");
  });
});

describe("initials", () => {
  it("makes the opponent chip and the avatar", () => {
    expect(initials("Buzz Light Beer")).toBe("BLB");
    expect(initials("Ned White", 2)).toBe("NW");
    expect(initials("Skate & Score")).toBe("SS");
  });
});

describe("bugRows", () => {
  it("puts the home team first", () => {
    const rows = bugRows({ side: "away", icePakScore: 4, opponentScore: 3 });
    expect(rows.map((row) => [row.team, row.side, row.lost])).toEqual([
      ["opponent", "home", true],
      ["ice-pak", "away", false],
    ]);
  });

  it("puts Ice Pak first with no labels when the Game has no side", () => {
    const rows = bugRows({ side: null, icePakScore: 2, opponentScore: 5 });
    expect(rows.map((row) => [row.team, row.side, row.lost])).toEqual([
      ["ice-pak", null, true],
      ["opponent", null, false],
    ]);
  });

  it("marks no loser with no final score", () => {
    expect(bugRows({ side: "home", icePakScore: null, opponentScore: null }).some((row) => row.lost)).toBe(false);
  });
});

describe("lineScore", () => {
  const goals = [
    { team: "ice-pak" as const, period: 1 },
    { team: "opponent" as const, period: 2 },
    { team: "ice-pak" as const, period: 3 },
  ];

  it("counts the goals of each period", () => {
    expect(lineScore(goals, { icePakScore: 2, opponentScore: 1, shootout: false })).toEqual({
      periods: [1, 2, 3],
      icePak: [1, 0, 1],
      opponent: [0, 1, 0],
    });
  });

  it("gives no line score when the goals miss part of the final score", () => {
    expect(lineScore(goals, { icePakScore: 2, opponentScore: 4, shootout: false })).toBeNull();
  });

  it("gives no line score after a shootout", () => {
    expect(lineScore(goals, { icePakScore: 3, opponentScore: 1, shootout: true })).toBeNull();
  });
});

describe("labels", () => {
  it("writes the result with Ice Pak first", () => {
    expect(resultLabel({ icePakScore: 4, opponentScore: 3, shootout: false })).toBe("W 4-3");
    expect(resultLabel({ icePakScore: 4, opponentScore: 5, shootout: true })).toBe("L 4-5 SO");
    expect(resultLabel({ icePakScore: null, opponentScore: null, shootout: false })).toBeNull();
  });

  it("names the periods", () => {
    expect(periodName(2)).toBe("2nd period");
    expect(periodName(4)).toBe("Overtime");
  });
});

describe("youtubeId", () => {
  it("reads each address form", () => {
    expect(youtubeId("https://www.youtube.com/watch?v=akh50MMs8lI")).toBe("akh50MMs8lI");
    expect(youtubeId("https://youtube.com/shorts/GcInEZXuiL0")).toBe("GcInEZXuiL0");
    expect(youtubeId("https://youtu.be/akh50MMs8lI?t=30")).toBe("akh50MMs8lI");
    expect(youtubeId("https://example.com/video")).toBeNull();
  });

  it("prefers the image from HHG", () => {
    expect(videoImage("https://youtu.be/akh50MMs8lI", "/img/recap.jpg")).toBe("/img/recap.jpg");
    expect(videoImage("https://youtu.be/akh50MMs8lI")).toBe("https://i.ytimg.com/vi/akh50MMs8lI/hqdefault.jpg");
  });
});

describe("League labels", () => {
  it("names the League as the visitor knows it", () => {
    expect(leagueLabel("County")).toBe("SLC County");
    expect(leagueLabel("MIC")).toBe("Mammoth");
    expect(leagueLabel("UHL")).toBe("UHL");
  });

  it("splits the Season from a League Season name", () => {
    expect(seasonLabel("County Winter '26-27")).toBe("Winter '26-27");
    expect(leagueSeasonLabel("MIC Spring '26", "MIC")).toBe("Mammoth Spring '26");
  });
});
