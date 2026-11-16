import { env } from "cloudflare:workers";
import type { BoardPlayer, Position, PriorityTier, RosterAnswer } from "./roster";

export interface League {
  id: number;
  name: string;
  shortName: string;
}

export interface LeagueSeason {
  id: number;
  leagueId: number;
  leagueShortName: string;
  name: string;
  startsOn: string | null;
  leagueFee: number;
  targetForwards: number;
  targetDefense: number;
  targetGoalies: number;
}

export interface BankPlayer {
  id: number;
  firstName: string;
  lastName: string;
  position: Position | null;
  priorityTier: PriorityTier | null;
  priorityOrder: number;
  note: string;
  /** The newest League Season where the Player was on the Roster. */
  lastLeagueSeason: string | null;
}

export type PlayerFields = Pick<
  BankPlayer,
  "firstName" | "lastName" | "position" | "priorityTier" | "priorityOrder" | "note"
>;

export type LeagueSeasonFields = Omit<LeagueSeason, "id" | "leagueShortName">;

const LEAGUE_SEASON_COLUMNS = `
  league_seasons.id, league_id AS leagueId, leagues.short_name AS leagueShortName, league_seasons.name,
  starts_on AS startsOn, league_fee AS leagueFee, target_forwards AS targetForwards,
  target_defense AS targetDefense, target_goalies AS targetGoalies`;

// A League Season with no start date is the newest: a Manager has just made it.
const NEWEST_FIRST = "starts_on IS NOT NULL, starts_on DESC, league_seasons.id DESC";

async function all<T>(sql: string, ...values: unknown[]): Promise<T[]> {
  const { results } = await env.DB.prepare(sql)
    .bind(...values)
    .all<T>();
  return results;
}

async function run(sql: string, ...values: unknown[]): Promise<void> {
  await env.DB.prepare(sql)
    .bind(...values)
    .run();
}

export function listLeagues(): Promise<League[]> {
  return all("SELECT id, name, short_name AS shortName FROM leagues ORDER BY id");
}

export function listLeagueSeasons(): Promise<LeagueSeason[]> {
  return all(
    `SELECT ${LEAGUE_SEASON_COLUMNS} FROM league_seasons
     JOIN leagues ON leagues.id = league_id ORDER BY ${NEWEST_FIRST}`,
  );
}

export async function getLeagueSeason(id: number): Promise<LeagueSeason | null> {
  const [leagueSeason] = await all<LeagueSeason>(
    `SELECT ${LEAGUE_SEASON_COLUMNS} FROM league_seasons
     JOIN leagues ON leagues.id = league_id WHERE league_seasons.id = ?`,
    id,
  );
  return leagueSeason ?? null;
}

export function createLeagueSeason(fields: LeagueSeasonFields): Promise<void> {
  return run(
    `INSERT INTO league_seasons
       (league_id, name, starts_on, league_fee, target_forwards, target_defense, target_goalies)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    fields.leagueId,
    fields.name,
    fields.startsOn,
    fields.leagueFee,
    fields.targetForwards,
    fields.targetDefense,
    fields.targetGoalies,
  );
}

export function updateLeagueSeason(id: number, fields: LeagueSeasonFields): Promise<void> {
  return run(
    `UPDATE league_seasons
     SET league_id = ?, name = ?, starts_on = ?, league_fee = ?,
         target_forwards = ?, target_defense = ?, target_goalies = ?
     WHERE id = ?`,
    fields.leagueId,
    fields.name,
    fields.startsOn,
    fields.leagueFee,
    fields.targetForwards,
    fields.targetDefense,
    fields.targetGoalies,
    id,
  );
}

export function listPlayers(): Promise<BankPlayer[]> {
  return all(
    `SELECT id, first_name AS firstName, last_name AS lastName, position,
            priority_tier AS priorityTier, priority_order AS priorityOrder, note,
            (SELECT league_seasons.name FROM roster_answers
             JOIN league_seasons ON league_seasons.id = league_season_id
             WHERE player_id = players.id AND answer IN ('full-time', 'part-time')
             ORDER BY ${NEWEST_FIRST} LIMIT 1) AS lastLeagueSeason
     FROM players ORDER BY last_name, first_name`,
  );
}

export function createPlayer(fields: PlayerFields): Promise<void> {
  return run(
    `INSERT INTO players (first_name, last_name, position, priority_tier, priority_order, note)
     VALUES (?, ?, ?, ?, ?, ?)`,
    fields.firstName,
    fields.lastName,
    fields.position,
    fields.priorityTier,
    fields.priorityOrder,
    fields.note,
  );
}

export function updatePlayer(id: number, fields: PlayerFields): Promise<void> {
  return run(
    `UPDATE players
     SET first_name = ?, last_name = ?, position = ?, priority_tier = ?, priority_order = ?, note = ?
     WHERE id = ?`,
    fields.firstName,
    fields.lastName,
    fields.position,
    fields.priorityTier,
    fields.priorityOrder,
    fields.note,
    id,
  );
}

/**
 * Deletes a Player with the Roster Answers and the Player Matches.
 * A Player with a Game, a goal, an assist, or a penalty stays, because the stats need the Player.
 */
export async function deletePlayer(id: number): Promise<boolean> {
  const [{ games }] = await all<{ games: number }>(
    `SELECT (SELECT COUNT(*) FROM game_players WHERE player_id = ?1)
          + (SELECT COUNT(*) FROM goals WHERE ?1 IN (scorer_id, assist_1_id, assist_2_id))
          + (SELECT COUNT(*) FROM penalties WHERE player_id = ?1) AS games`,
    id,
  );
  if (games > 0) {
    return false;
  }
  await env.DB.batch([
    env.DB.prepare("DELETE FROM roster_answers WHERE player_id = ?").bind(id),
    env.DB.prepare("DELETE FROM player_matches WHERE player_id = ?").bind(id),
    env.DB.prepare("DELETE FROM players WHERE id = ?").bind(id),
  ]);
  return true;
}

/** Each Player in the Player Bank, with the Roster Answer for one League Season. */
export async function listBoardPlayers(leagueSeasonId: number): Promise<BoardPlayer[]> {
  const players = await all<Omit<BoardPlayer, "isGoalie"> & { isGoalie: number }>(
    `SELECT id, first_name AS firstName, last_name AS lastName, position,
            priority_tier AS priorityTier, priority_order AS priorityOrder, answer,
            COALESCE(is_goalie, 0) AS isGoalie
     FROM players
     LEFT JOIN roster_answers ON player_id = players.id AND league_season_id = ?`,
    leagueSeasonId,
  );
  return players.map((player) => ({ ...player, isGoalie: player.isGoalie === 1 }));
}

/** A null answer removes the Roster Answer: the Player has then given no answer. */
export function setRosterAnswer(
  leagueSeasonId: number,
  playerId: number,
  answer: RosterAnswer | null,
): Promise<void> {
  if (answer === null) {
    return run(
      "DELETE FROM roster_answers WHERE league_season_id = ? AND player_id = ?",
      leagueSeasonId,
      playerId,
    );
  }

  // A goalie in the Player Bank starts as a goalie. A later answer keeps the Manager's choice.
  return run(
    `INSERT INTO roster_answers (league_season_id, player_id, answer, is_goalie)
     SELECT ?, id, ?, COALESCE(position = 'goalie', 0) FROM players WHERE id = ?
     ON CONFLICT (league_season_id, player_id) DO UPDATE SET answer = excluded.answer`,
    leagueSeasonId,
    answer,
    playerId,
  );
}

export function setRosterGoalie(
  leagueSeasonId: number,
  playerId: number,
  isGoalie: boolean,
): Promise<void> {
  return run(
    "UPDATE roster_answers SET is_goalie = ? WHERE league_season_id = ? AND player_id = ?",
    isGoalie ? 1 : 0,
    leagueSeasonId,
    playerId,
  );
}
