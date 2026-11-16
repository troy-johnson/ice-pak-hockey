// The reads of the public pages.

import { env } from "cloudflare:workers";
import type { GameSummary, GameType, Opponent, Side } from "./game-format";
import type { Position } from "./roster";
import type { StatData, Team } from "./stats";

async function all<T>(sql: string, ...values: unknown[]): Promise<T[]> {
  const { results } = await env.DB.prepare(sql)
    .bind(...values)
    .all<T>();
  return results;
}

interface GameRow {
  id: number;
  startsAt: string;
  leagueSeasonId: number;
  leagueSeason: string;
  league: string;
  gameType: GameType;
  opponentName: string | null;
  logo: string | null;
  color: string | null;
  color2: string | null;
  rink: string | null;
  side: Side | null;
  icePakScore: number | null;
  opponentScore: number | null;
  shootout: number;
  headline: string;
  recapUrl: string;
  recapImage: string;
  videoCount: number;
  shortCount: number;
  goalCount: number;
}

function toSummary(row: GameRow): GameSummary {
  const opponent: Opponent | null = row.opponentName
    ? { name: row.opponentName, logo: row.logo ?? "", color: row.color ?? "", color2: row.color2 ?? "" }
    : null;
  return {
    id: row.id,
    startsAt: row.startsAt,
    leagueSeasonId: row.leagueSeasonId,
    leagueSeason: row.leagueSeason,
    league: row.league,
    gameType: row.gameType,
    opponent,
    rink: row.rink,
    side: row.side,
    icePakScore: row.icePakScore,
    opponentScore: row.opponentScore,
    shootout: row.shootout === 1,
    headline: row.headline,
    recapUrl: row.recapUrl,
    recapImage: row.recapImage,
    videoCount: row.videoCount,
    shortCount: row.shortCount,
    goalCount: row.goalCount,
  };
}

/** All Games, oldest first. */
export async function listGames(): Promise<GameSummary[]> {
  const rows = await all<GameRow>(
    `SELECT games.id, starts_at AS startsAt, league_season_id AS leagueSeasonId,
            league_seasons.name AS leagueSeason, leagues.short_name AS league, game_type AS gameType,
            opponents.name AS opponentName, opponents.logo, opponents.color, opponents.color_2 AS color2,
            rinks.name AS rink, ice_pak_side AS side, ice_pak_score AS icePakScore,
            opponent_score AS opponentScore, shootout, headline, recap_url AS recapUrl,
            recap_image AS recapImage,
            (SELECT COUNT(*) FROM goals WHERE game_id = games.id AND video_url <> '') AS videoCount,
            (SELECT COUNT(*) FROM goals WHERE game_id = games.id AND video_is_short = 1) AS shortCount,
            (SELECT COUNT(*) FROM goals WHERE game_id = games.id) AS goalCount
     FROM games
     JOIN league_seasons ON league_seasons.id = league_season_id
     JOIN leagues ON leagues.id = league_seasons.league_id
     LEFT JOIN opponents ON opponents.id = opponent_id
     LEFT JOIN rinks ON rinks.id = rink_id
     ORDER BY starts_at, games.id`,
  );
  return rows.map(toSummary);
}

/** All Games, read one time for each request. */
export function gamesOf(locals: App.Locals): Promise<GameSummary[]> {
  locals.games ??= listGames();
  return locals.games;
}

/** The Box Scores and the Game Players of all Games, for the stats. */
export async function statData(games: GameSummary[]): Promise<StatData> {
  const [goals, penalties, gamePlayers] = await Promise.all([
    all<StatData["goals"][number]>(
      `SELECT game_id AS gameId, team, scorer_id AS scorerId, assist_1_id AS assist1Id, assist_2_id AS assist2Id
       FROM goals`,
    ),
    all<StatData["penalties"][number]>(
      "SELECT game_id AS gameId, team, player_id AS playerId, minutes FROM penalties",
    ),
    all<StatData["gamePlayers"][number]>("SELECT game_id AS gameId, player_id AS playerId FROM game_players"),
  ]);
  return { games, goals, penalties, gamePlayers };
}

export interface PublicPlayer {
  id: number;
  firstName: string;
  lastName: string;
  position: Position | null;
  number: number | null;
}

/** Each Player by id. The public pages show the name, the position, and the number only. */
export async function playersById(): Promise<Map<number, PublicPlayer>> {
  const rows = await all<PublicPlayer>(
    "SELECT id, first_name AS firstName, last_name AS lastName, position, number FROM players",
  );
  return new Map(rows.map((player) => [player.id, player]));
}

export interface BoxGoal {
  team: Team;
  period: number;
  clock: string;
  scorerId: number | null;
  assistIds: number[];
  videoUrl: string;
  videoIsShort: boolean;
}

export interface BoxPenalty {
  team: Team;
  period: number;
  clock: string;
  playerId: number | null;
  infraction: string;
  minutes: number;
}

export async function boxScore(gameId: number): Promise<{ goals: BoxGoal[]; penalties: BoxPenalty[]; players: number[] }> {
  const [goals, penalties, players] = await Promise.all([
    all<Omit<BoxGoal, "assistIds" | "videoIsShort"> & { assist1Id: number | null; assist2Id: number | null; videoIsShort: number }>(
      `SELECT team, period, clock, scorer_id AS scorerId, assist_1_id AS assist1Id, assist_2_id AS assist2Id,
              video_url AS videoUrl, video_is_short AS videoIsShort
       FROM goals WHERE game_id = ? ORDER BY period, id`,
      gameId,
    ),
    all<BoxPenalty>(
      `SELECT team, period, clock, player_id AS playerId, infraction, minutes
       FROM penalties WHERE game_id = ? ORDER BY period, id`,
      gameId,
    ),
    all<{ playerId: number }>("SELECT player_id AS playerId FROM game_players WHERE game_id = ?", gameId),
  ]);
  return {
    goals: goals.map(({ assist1Id, assist2Id, videoIsShort, ...goal }) => ({
      ...goal,
      assistIds: [assist1Id, assist2Id].filter((id): id is number => id !== null),
      videoIsShort: videoIsShort === 1,
    })),
    penalties,
    players: players.map((row) => row.playerId),
  };
}

export interface RosterEntry {
  leagueSeasonId: number;
  playerId: number;
  isGoalie: boolean;
}

/** The Rosters: the Players with a full-time or part-time Roster Answer. A Sub is not on the Roster. */
export async function rosters(): Promise<RosterEntry[]> {
  const rows = await all<{ leagueSeasonId: number; playerId: number; isGoalie: number }>(
    `SELECT league_season_id AS leagueSeasonId, player_id AS playerId, is_goalie AS isGoalie
     FROM roster_answers WHERE answer IN ('full-time', 'part-time')`,
  );
  return rows.map((row) => ({ ...row, isGoalie: row.isGoalie === 1 }));
}

export interface PublicLeagueSeason {
  id: number;
  name: string;
  league: string;
  startsOn: string | null;
}

/** The League Seasons, newest first. A League Season with no start date is a coming one. */
export function leagueSeasons(): Promise<PublicLeagueSeason[]> {
  return all(
    `SELECT league_seasons.id, league_seasons.name, leagues.short_name AS league, starts_on AS startsOn
     FROM league_seasons JOIN leagues ON leagues.id = league_id
     ORDER BY starts_on IS NOT NULL, starts_on DESC, league_seasons.id DESC`,
  );
}

export interface PlayerGoal {
  gameId: number;
  period: number;
  clock: string;
  assistIds: number[];
  videoUrl: string;
  videoIsShort: boolean;
}

/** The goals that a Player scored, newest first. */
export async function playerGoals(playerId: number): Promise<PlayerGoal[]> {
  const rows = await all<{
    gameId: number;
    period: number;
    clock: string;
    assist1Id: number | null;
    assist2Id: number | null;
    videoUrl: string;
    videoIsShort: number;
  }>(
    `SELECT game_id AS gameId, period, clock, assist_1_id AS assist1Id, assist_2_id AS assist2Id,
            video_url AS videoUrl, video_is_short AS videoIsShort
     FROM goals JOIN games ON games.id = game_id
     WHERE scorer_id = ? AND team = 'ice-pak'
     ORDER BY starts_at DESC, period DESC, goals.id DESC`,
    playerId,
  );
  return rows.map(({ assist1Id, assist2Id, videoIsShort, ...goal }) => ({
    ...goal,
    assistIds: [assist1Id, assist2Id].filter((assistId): assistId is number => assistId !== null),
    videoIsShort: videoIsShort === 1,
  }));
}
