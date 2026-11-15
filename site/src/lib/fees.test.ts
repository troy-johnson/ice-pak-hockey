import { describe, expect, it } from "vitest";
import { balance, playerFee, proposePlayerFees, shortfall, type RosterStatus } from "./fees";

const roster = (counts: Partial<Record<RosterStatus, number>>): RosterStatus[] =>
  Object.entries(counts).flatMap(([status, count]) => Array(count).fill(status as RosterStatus));

describe("proposePlayerFees", () => {
  it("matches the Fee Sheet for MIC Winter '26", () => {
    const fees = proposePlayerFees(360000, roster({ "full-time": 16, "part-time": 4, goalie: 1 }));

    expect(fees).toEqual({ fullTime: 20000, partTime: 10000 });
  });

  it("makes the Players cover the League Fee (MIC Summer '26)", () => {
    const players = roster({ "full-time": 12, "part-time": 5, goalie: 2 });
    const fees = proposePlayerFees(370000, players);

    // The Fee Sheet shows $255.1724138 and $127.5862069.
    expect(fees).toEqual({ fullTime: 25518, partTime: 12759 });

    const collected = players.reduce((total, status) => total + playerFee(status, fees), 0);
    expect(collected).toBeGreaterThanOrEqual(370000);
    expect(collected - 370000).toBeLessThan(players.length * 2);
  });

  it("rounds each fee up to the nearest cent", () => {
    // $1,200.01 for 12 full-time Players is $100.000833 for each, and $50.000417 for a part-time Player.
    const fees = proposePlayerFees(120001, roster({ "full-time": 12 }));

    expect(fees).toEqual({ fullTime: 10001, partTime: 5001 });
  });

  it("matches the Fee Sheet for County Summer '26, before the manual amount of the sheet", () => {
    const fees = proposePlayerFees(275000, roster({ "full-time": 12, "part-time": 6 }));

    // The Fee Sheet shows $183.3333.
    expect(fees).toEqual({ fullTime: 18334, partTime: 9167 });
  });

  it("counts at least 12 full-time players", () => {
    const fees = proposePlayerFees(360000, roster({ "full-time": 8 }));

    expect(fees.fullTime).toBe(30000);
  });

  it("ignores Goalies and Subs in the count", () => {
    const withExtras = roster({ "full-time": 14, goalie: 2, sub: 5 });

    expect(proposePlayerFees(350000, withExtras)).toEqual(
      proposePlayerFees(350000, roster({ "full-time": 14 })),
    );
  });
});

describe("playerFee", () => {
  const fees = { fullTime: 20000, partTime: 10000 };

  it("sets the fee by Roster Status", () => {
    expect(playerFee("full-time", fees)).toBe(20000);
    expect(playerFee("part-time", fees)).toBe(10000);
    expect(playerFee("goalie", fees)).toBe(0);
    expect(playerFee("sub", fees)).toBe(0);
  });
});

describe("balance", () => {
  it("is one number across Leagues: a credit in one reduces a debt in another", () => {
    // Two Player Fees, one Sub Charge, and an overpayment on the first League.
    expect(balance([20000, 18334], [2000], [21500, 10000])).toBe(8834);
  });

  it("is negative when the Player has a credit", () => {
    expect(balance([20000], [], [21500])).toBe(-1500);
  });
});

describe("shortfall", () => {
  it("matches the Fee Sheet for MIC Winter '26", () => {
    expect(shortfall(360000, [353500])).toBe(6500);
  });

  it("is negative for a surplus", () => {
    expect(shortfall(360000, [365000])).toBe(-5000);
  });
});
