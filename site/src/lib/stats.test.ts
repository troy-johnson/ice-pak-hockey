import { describe, expect, it } from "vitest";
import {
  byStat,
  formatPointsPerGame,
  formatRecord,
  currentLeagueSeasons,
  leaders,
  only,
  played,
  result,
  skaterLines,
  teamRecord,
  type StatData,
  type StatGame,
} from "./stats";

const game = (id: number, startsAt: string, icePakScore: number | null, opponentScore: number | null): StatGame => ({
  id,
  leagueSeasonId: 1,
  startsAt,
  icePakScore,
  opponentScore,
});

// Players 1 to 3. Game 3 is in the future.
const data: StatData = {
  games: [game(1, "2026-07-28 23:00", 7, 2), game(2, "2026-08-25 23:15", 1, 5), game(3, "2026-12-01 20:00", null, null)],
  goals: [
    { gameId: 1, team: "ice-pak", scorerId: 1, assist1Id: 2, assist2Id: 3 },
    { gameId: 1, team: "ice-pak", scorerId: 1, assist1Id: 2, assist2Id: null },
    // An Ice Pak goal with no known scorer, as the Old Site player "Ice Pak".
    { gameId: 1, team: "ice-pak", scorerId: null, assist1Id: 3, assist2Id: null },
    { gameId: 2, team: "opponent", scorerId: null, assist1Id: null, assist2Id: null },
    { gameId: 2, team: "ice-pak", scorerId: 2, assist1Id: null, assist2Id: null },
  ],
  penalties: [
    { gameId: 1, team: "ice-pak", playerId: 3, minutes: 2 },
    { gameId: 2, team: "ice-pak", playerId: 3, minutes: 1.5 },
    { gameId: 2, team: "opponent", playerId: null, minutes: 10 },
  ],
  gamePlayers: [
    { gameId: 1, playerId: 1 },
    { gameId: 1, playerId: 2 },
    { gameId: 1, playerId: 3 },
    { gameId: 2, playerId: 2 },
    { gameId: 2, playerId: 3 },
    { gameId: 3, playerId: 1 },
  ],
};

const lineOf = (lines: ReturnType<typeof skaterLines>, playerId: number) =>
  lines.find((line) => line.playerId === playerId);

describe("currentLeagueSeasons", () => {
  const at = (leagueSeasonId: number, league: string, startsAt: string) => ({ leagueSeasonId, league, startsAt });
  const games = [
    at(1, "UHL", "2021-09-14 17:00"),
    at(2, "MIC", "2026-07-02 20:00"),
    at(3, "MIC", "2026-11-15 18:45"),
    at(4, "County", "2026-11-08 18:30"),
    at(4, "County", "2026-11-22 15:30"),
  ];

  it("gives the newest League Season of each League that played lately", () => {
    expect(currentLeagueSeasons(games, "2026-11-16 12:00").sort()).toEqual([3, 4]);
  });

  it("drops a League Season 60 days after its last Game, unless it has a coming Game", () => {
    expect(currentLeagueSeasons(games, "2027-02-01 12:00")).toEqual([]);
    expect(currentLeagueSeasons([...games, at(4, "County", "2027-02-07 21:00")], "2027-02-01 12:00")).toEqual([4]);
  });
});

describe("result", () => {
  it("compares the final score", () => {
    expect(result(game(1, "", 4, 3))).toBe("win");
    expect(result(game(1, "", 3, 4))).toBe("loss");
    expect(result(game(1, "", 2, 2))).toBe("tie");
  });

  it("gives no result for a Game with no final score", () => {
    expect(result(game(1, "", null, null))).toBeNull();
  });
});

describe("teamRecord", () => {
  it("counts only the Games with a final score in the record and the goals", () => {
    const record = teamRecord([game(1, "", 7, 2), game(2, "", 1, 5), game(3, "", 3, 3), game(4, "", null, null)]);

    expect(record).toEqual({ wins: 1, losses: 1, ties: 1, gamesPlayed: 4, goalsFor: 11, goalsAgainst: 10 });
    expect(formatRecord(record)).toBe("1-1-1");
  });
});

describe("skaterLines", () => {
  const lines = skaterLines(played(data, "2026-11-16 12:00"));

  it("counts goals, assists, and points as the Old Site does", () => {
    expect(lineOf(lines, 1)).toMatchObject({ goals: 2, assists: 0, points: 2 });
    expect(lineOf(lines, 2)).toMatchObject({ goals: 1, assists: 2, points: 3 });
    expect(lineOf(lines, 3)).toMatchObject({ goals: 0, assists: 2, points: 2 });
  });

  it("counts a Game played for each Game Player row, in the past only", () => {
    expect(lineOf(lines, 1)?.gamesPlayed).toBe(1);
    expect(lineOf(lines, 2)?.gamesPlayed).toBe(2);
  });

  it("adds penalty minutes, with the 1.5-minute penalties of the Old Site", () => {
    expect(lineOf(lines, 3)?.penaltyMinutes).toBe(3.5);
  });

  it("counts no stat for an opponent goal or penalty, or for an unknown scorer", () => {
    expect(lines.map((line) => line.playerId).sort()).toEqual([1, 2, 3]);
    expect(lines.reduce((total, line) => total + line.goals, 0)).toBe(3);
  });

  it("gives points for each Game played, and 0 with no Game", () => {
    expect(lineOf(lines, 2)?.pointsPerGame).toBe(1.5);
    expect(formatPointsPerGame(2 / 3)).toBe("0.67");

    const noGames = skaterLines({ ...data, gamePlayers: [] });
    expect(lineOf(noGames, 1)?.pointsPerGame).toBe(0);
  });
});

describe("only", () => {
  it("keeps the Box Scores of the Games in the scope", () => {
    const august = only(data, (each) => each.startsAt >= "2026-08-01");

    expect(august.games.map((each) => each.id)).toEqual([2, 3]);
    expect(august.goals).toHaveLength(2);
    expect(august.penalties).toHaveLength(2);
  });
});

describe("leaders", () => {
  it("breaks a tie with points, as the Old Site does", () => {
    const lines = skaterLines(played(data, "2026-11-16 12:00"));

    // Players 2 and 3 have 2 assists each. Player 2 has more points.
    expect(leaders(lines, "assists", 2).map((line) => line.playerId)).toEqual([2, 3]);
    expect([...lines].sort(byStat("points"))[0].playerId).toBe(2);
  });
});
