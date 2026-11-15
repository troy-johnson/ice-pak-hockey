import { describe, expect, it } from "vitest";
import {
  byPriority,
  chaseList,
  chaseMessage,
  isOnRoster,
  oneOf,
  positionCounts,
  rosterStatus,
  rosterStatuses,
  ROSTER_ANSWERS,
  type BoardPlayer,
} from "./roster";

let nextId = 1;
const player = (name: string, fields: Partial<BoardPlayer> = {}): BoardPlayer => {
  const [firstName, lastName] = name.split(" ");
  return {
    id: nextId++,
    firstName,
    lastName,
    position: "forward",
    priorityTier: "core",
    priorityOrder: 0,
    answer: null,
    isGoalie: false,
    ...fields,
  };
};

describe("rosterStatus", () => {
  it("gives the status of each Roster Answer", () => {
    expect(rosterStatus("full-time", false)).toBe("full-time");
    expect(rosterStatus("part-time", false)).toBe("part-time");
    expect(rosterStatus("sub-only", false)).toBe("sub");
    expect(rosterStatus("out", false)).toBeNull();
    expect(rosterStatus(null, false)).toBeNull();
  });

  it("gives a goalie who is in the Goalie status", () => {
    expect(rosterStatus("full-time", true)).toBe("goalie");
    expect(rosterStatus("part-time", true)).toBe("goalie");
    expect(rosterStatus("sub-only", true)).toBe("sub");
    expect(rosterStatus("out", true)).toBeNull();
  });
});

describe("the Roster", () => {
  const players = [
    player("Ann Able", { answer: "full-time" }),
    player("Bo Baker", { answer: "part-time", position: "defense" }),
    player("Cy Cole", { answer: "full-time", position: "goalie", isGoalie: true }),
    player("Di Dunn", { answer: "sub-only" }),
    player("Ed East", { answer: "out" }),
    player("Flo Ford"),
    player("Gus Gray", { answer: "full-time", position: null }),
    // A goalie in the Player Bank who is a skater in this League Season, as in the Fee Sheet.
    player("Hal Hart", { answer: "full-time", position: "goalie" }),
  ];

  it("has the Players who are in, and no Subs", () => {
    expect(players.filter(isOnRoster).map((p) => p.firstName)).toEqual([
      "Ann",
      "Bo",
      "Cy",
      "Gus",
      "Hal",
    ]);
  });

  it("counts the Roster by position", () => {
    expect(positionCounts(players)).toEqual({ forward: 1, defense: 1, goalie: 1, unknown: 2 });
  });

  it("gives the statuses for the fee formula", () => {
    expect(rosterStatuses(players)).toEqual([
      "full-time",
      "part-time",
      "goalie",
      "sub",
      "full-time",
      "full-time",
    ]);
  });
});

describe("byPriority", () => {
  it("orders by tier, then by the Manager's order, then by name", () => {
    const players = [
      player("Zed Young", { priorityTier: null }),
      player("Sam Sub", { priorityTier: "occasional-sub" }),
      player("Rae Reg", { priorityTier: "regular-sub" }),
      player("Cal Zane", { priorityOrder: 2 }),
      player("Cam Able", { priorityOrder: 2 }),
      player("Cat First", { priorityOrder: 1 }),
      player("Cy Unset", { priorityOrder: 0 }),
    ];

    expect(players.sort(byPriority).map((p) => p.lastName)).toEqual([
      "First",
      "Able",
      "Zane",
      "Unset",
      "Reg",
      "Sub",
      "Young",
    ]);
  });
});

describe("the chase", () => {
  const players = [
    player("Ann Able", { answer: "full-time" }),
    player("Bo Baker", { priorityOrder: 2 }),
    player("Cy Cole", { priorityOrder: 1 }),
    player("Di Dunn", { priorityTier: "regular-sub" }),
    player("Ed East", { priorityTier: null }),
  ];

  it("lists the core Players with no answer", () => {
    expect(chaseList(players).map((p) => p.firstName)).toEqual(["Cy", "Bo"]);
  });

  it("writes a message for the BenchApp chat", () => {
    expect(chaseMessage("MIC Winter '27", players)).toBe(
      [
        "Ice Pak roster for MIC Winter '27: we need your answer.",
        "Are you in full-time, in part-time, a sub only, or out?",
        "Still waiting on: Cy Cole, Bo Baker.",
      ].join("\n"),
    );
  });

  it("writes no message when each core Player has answered", () => {
    expect(chaseMessage("MIC Winter '27", [player("Ann Able", { answer: "out" })])).toBe("");
  });
});

describe("oneOf", () => {
  it("accepts only an allowed value", () => {
    expect(oneOf("part-time", ROSTER_ANSWERS)).toBe("part-time");
    expect(oneOf("maybe", ROSTER_ANSWERS)).toBeNull();
    expect(oneOf(null, ROSTER_ANSWERS)).toBeNull();
  });
});
