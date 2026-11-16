// The stats rules. They follow the Old Site (git tag `old-site`, pages/api/*-stats), with the changes
// that Troy confirmed: shootout goals are not stored, so they never count.

export type Team = "ice-pak" | "opponent";
export type Result = "win" | "loss" | "tie";

export interface StatGame {
  id: number;
  leagueSeasonId: number;
  /** Local time in Utah, 'YYYY-MM-DD HH:MM'. */
  startsAt: string;
  icePakScore: number | null;
  opponentScore: number | null;
  /** The shots on goal of the opponent, or null when the Scoresheet has no shots. */
  opponentShots?: number | null;
  /** A shootout gives the winner one goal in the final score. */
  shootout?: boolean;
}

export interface StatGoal {
  gameId: number;
  team: Team;
  scorerId: number | null;
  assist1Id: number | null;
  assist2Id: number | null;
}

export interface StatPenalty {
  gameId: number;
  team: Team;
  playerId: number | null;
  minutes: number;
}

export interface StatGamePlayer {
  gameId: number;
  playerId: number;
  /** The Player played goalie in this Game. */
  isGoalie?: boolean;
}

export interface StatData {
  games: StatGame[];
  goals: StatGoal[];
  penalties: StatPenalty[];
  gamePlayers: StatGamePlayer[];
}

export interface SkaterLine {
  playerId: number;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  penaltyMinutes: number;
  /** Points for each Game played, or 0 for a Player with no Game. */
  pointsPerGame: number;
}

export interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
  /** All Games played, with or without a Box Score. */
  gamesPlayed: number;
  goalsFor: number;
  goalsAgainst: number;
}

/** A League Season stays current for this many days after its last Game. */
export const CURRENT_DAYS = 60;

/**
 * The current League Seasons, one at most for each League: the League Season of the newest Game
 * that has started. It is current while it has a coming Game, or for CURRENT_DAYS after its last Game.
 */
export function currentLeagueSeasons(
  games: { leagueSeasonId: number; league: string; startsAt: string }[],
  now: string,
): number[] {
  const days = (from: string, to: string) => (Date.parse(`${to.replace(" ", "T")}Z`) - Date.parse(`${from.replace(" ", "T")}Z`)) / 86_400_000;
  const newest = new Map<string, { leagueSeasonId: number; startsAt: string }>();
  for (const game of games) {
    if (game.startsAt >= now) continue;
    const known = newest.get(game.league);
    if (!known || game.startsAt > known.startsAt) newest.set(game.league, game);
  }
  return [...newest.values()]
    .filter(
      (last) =>
        days(last.startsAt, now) <= CURRENT_DAYS ||
        games.some((game) => game.leagueSeasonId === last.leagueSeasonId && game.startsAt >= now),
    )
    .map((last) => last.leagueSeasonId);
}

/** The result for Ice Pak, or null for a Game with no final score. */
export function result(game: StatGame): Result | null {
  if (game.icePakScore === null || game.opponentScore === null) return null;
  if (game.icePakScore > game.opponentScore) return "win";
  if (game.icePakScore < game.opponentScore) return "loss";
  return "tie";
}

/** Only the Games that started before `now`, with their Box Scores. */
export function played(data: StatData, now: string): StatData {
  return only(data, (game) => game.startsAt < now);
}

/** Only the Games that `keep` accepts, with their Box Scores. */
export function only(data: StatData, keep: (game: StatGame) => boolean): StatData {
  const games = data.games.filter(keep);
  const ids = new Set(games.map((game) => game.id));
  return {
    games,
    goals: data.goals.filter((goal) => ids.has(goal.gameId)),
    penalties: data.penalties.filter((penalty) => ids.has(penalty.gameId)),
    gamePlayers: data.gamePlayers.filter((gamePlayer) => ids.has(gamePlayer.gameId)),
  };
}

/** The record is win-loss-tie. It counts only the Games with a final score. */
export function teamRecord(games: StatGame[]): TeamRecord {
  const record: TeamRecord = { wins: 0, losses: 0, ties: 0, gamesPlayed: games.length, goalsFor: 0, goalsAgainst: 0 };
  for (const game of games) {
    const outcome = result(game);
    if (!outcome) continue;
    record[outcome === "win" ? "wins" : outcome === "loss" ? "losses" : "ties"] += 1;
    record.goalsFor += game.icePakScore ?? 0;
    record.goalsAgainst += game.opponentScore ?? 0;
  }
  return record;
}

export function formatRecord(record: TeamRecord): string {
  return `${record.wins}-${record.losses}-${record.ties}`;
}

/**
 * One line for each Player with a Game, a goal, an assist, or a penalty.
 * - Games played: the Games where the Player is a Game Player.
 * - A goal and each assist count one. Opponent goals and penalties count for nobody.
 * - Penalty minutes: the sum of the minutes, so a 1.5-minute penalty gives 1.5.
 */
export function skaterLines(data: StatData): SkaterLine[] {
  const lines = new Map<number, SkaterLine>();
  const line = (playerId: number): SkaterLine => {
    let found = lines.get(playerId);
    if (!found) {
      found = { playerId, gamesPlayed: 0, goals: 0, assists: 0, points: 0, penaltyMinutes: 0, pointsPerGame: 0 };
      lines.set(playerId, found);
    }
    return found;
  };

  // A Game in goal counts in the goalie lines, not here.
  for (const gamePlayer of data.gamePlayers) {
    if (!gamePlayer.isGoalie) line(gamePlayer.playerId).gamesPlayed += 1;
  }
  for (const goal of data.goals) {
    if (goal.team !== "ice-pak") continue;
    if (goal.scorerId !== null) line(goal.scorerId).goals += 1;
    for (const assistId of [goal.assist1Id, goal.assist2Id]) {
      if (assistId !== null) line(assistId).assists += 1;
    }
  }
  for (const penalty of data.penalties) {
    if (penalty.team === "ice-pak" && penalty.playerId !== null) {
      line(penalty.playerId).penaltyMinutes += penalty.minutes;
    }
  }

  for (const found of lines.values()) {
    found.points = found.goals + found.assists;
    found.pointsPerGame = found.gamesPlayed ? found.points / found.gamesPlayed : 0;
  }
  return [...lines.values()];
}

export interface GoalieLine {
  playerId: number;
  /** The Games in goal. */
  gamesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  goalsAgainst: number;
  /** Goals against for each Game in goal with a final score. */
  goalsAgainstAverage: number;
  shotsAgainst: number;
  saves: number;
  /** Saves for each shot, or null with no Game that has shots. */
  savePercentage: number | null;
  shutouts: number;
  /** The Games in goal that have shots on the Scoresheet. */
  gamesWithShots: number;
}

/**
 * One line for each Player with a Game in goal.
 * - A Game with two goalies counts in the Games and the record of both, and in no goals or shots.
 * - Goals against: the opponent's final score, less the shootout goal of a shootout loss.
 * - Shots against, saves, and the save percentage use only the Games with shots on the Scoresheet.
 */
export function goalieLines(data: StatData): GoalieLine[] {
  const games = new Map(data.games.map((game) => [game.id, game]));
  const goaliesOf = new Map<number, number>();
  for (const row of data.gamePlayers) {
    if (row.isGoalie) goaliesOf.set(row.gameId, (goaliesOf.get(row.gameId) ?? 0) + 1);
  }
  const lines = new Map<number, GoalieLine & { scoredGames: number }>();
  for (const row of data.gamePlayers) {
    const game = games.get(row.gameId);
    if (!row.isGoalie || !game) continue;
    let found = lines.get(row.playerId);
    if (!found) {
      found = {
        playerId: row.playerId, gamesPlayed: 0, wins: 0, losses: 0, ties: 0, goalsAgainst: 0,
        goalsAgainstAverage: 0, shotsAgainst: 0, saves: 0, savePercentage: null, shutouts: 0,
        gamesWithShots: 0, scoredGames: 0,
      };
      lines.set(row.playerId, found);
    }
    found.gamesPlayed += 1;
    const outcome = result(game);
    if (outcome) found[outcome === "win" ? "wins" : outcome === "loss" ? "losses" : "ties"] += 1;
    if (!outcome || goaliesOf.get(row.gameId) !== 1) continue;

    const against = game.opponentScore! - (game.shootout && outcome === "loss" ? 1 : 0);
    found.scoredGames += 1;
    found.goalsAgainst += against;
    if (against === 0) found.shutouts += 1;
    if (game.opponentShots != null) {
      found.gamesWithShots += 1;
      found.shotsAgainst += game.opponentShots;
      found.saves += game.opponentShots - against;
    }
  }
  return [...lines.values()].map(({ scoredGames, ...line }) => ({
    ...line,
    goalsAgainstAverage: scoredGames ? line.goalsAgainst / scoredGames : 0,
    savePercentage: line.shotsAgainst ? line.saves / line.shotsAgainst : null,
  }));
}

/** ".912", as the NHL writes it. */
export function formatSavePercentage(value: number | null): string {
  return value === null ? "–" : value.toFixed(3).replace(/^0/, "");
}

export type StatKey = "gamesPlayed" | "goals" | "assists" | "points" | "penaltyMinutes" | "pointsPerGame";

/** The Old Site order: the highest value first, and the most points first for a tie. */
export function byStat(key: StatKey): (a: SkaterLine, b: SkaterLine) => number {
  return (a, b) => b[key] - a[key] || b.points - a.points || b.goals - a.goals;
}

/** The leader and the next Players for one stat. */
export function leaders(lines: SkaterLine[], key: StatKey, count = 4): SkaterLine[] {
  return [...lines].sort(byStat(key)).slice(0, count);
}

/** Points per Game played, with two decimals, as the Old Site shows it. */
export function formatPointsPerGame(value: number): string {
  return value.toFixed(2);
}
