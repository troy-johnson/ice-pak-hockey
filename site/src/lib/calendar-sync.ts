// Reads the Calendar Feed into the Games: a coming Game gets its date, opponent, side, and rink from the feed.
// The Cron Trigger in src/worker.ts runs it each hour, and a Manager can run it from the Player Bank page.

import { env } from "cloudflare:workers";
import { feedGames, opponentKey, type FeedGame } from "./calendar";
import { utahTime } from "./game-format";

const FETCH_TIMEOUT_MS = 10_000;

async function all<T>(sql: string, ...values: unknown[]): Promise<T[]> {
  const { results } = await env.DB.prepare(sql).bind(...values).all<T>();
  return results;
}

export interface SyncResult {
  added: number;
  changed: number;
  removed: number;
}

/** Reads the feed and changes the Games. It throws when the feed does not answer. */
export async function syncCalendar(): Promise<SyncResult> {
  const url = env.CALENDAR_FEED_URL;
  if (!url) throw new Error("The Worker secret CALENDAR_FEED_URL is not set.");
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`The Calendar Feed answered ${response.status}.`);
  return applyFeed(feedGames(await response.text()));
}

interface KnownGame {
  id: number;
  benchappEventId: number | null;
  calendarUid: string | null;
  startsAt: string;
  opponentId: number | null;
  side: string | null;
  rinkId: number | null;
  hasBoxScore: number;
}

async function applyFeed(feed: FeedGame[]): Promise<SyncResult> {
  const now = utahTime(new Date());
  const [games, opponents, rinks, seasons] = await Promise.all([
    all<KnownGame>(
      `SELECT id, benchapp_event_id AS benchappEventId, calendar_uid AS calendarUid, starts_at AS startsAt,
              opponent_id AS opponentId, ice_pak_side AS side, rink_id AS rinkId,
              (ice_pak_score IS NOT NULL OR hhg_game_id IS NOT NULL
               OR EXISTS (SELECT 1 FROM goals WHERE game_id = games.id)) AS hasBoxScore
       FROM games`,
    ),
    all<{ id: number; name: string }>("SELECT id, name FROM opponents"),
    all<{ id: number; name: string; leagueId: number | null }>("SELECT id, name, league_id AS leagueId FROM rinks"),
    // The newest League Season of each League. A League Season with no start date is a coming one.
    all<{ id: number; leagueId: number }>(
      "SELECT id, league_id AS leagueId FROM league_seasons ORDER BY starts_on IS NOT NULL, starts_on DESC, id DESC",
    ),
  ]);

  const opponentIds = new Map(opponents.map((opponent) => [opponentKey(opponent.name), opponent.id]));
  const statements: D1PreparedStatement[] = [];
  const result: SyncResult = { added: 0, changed: 0, removed: 0 };
  const seen = new Set<string>();

  for (const game of feed) {
    if (!game.opponent) continue;
    seen.add(game.uid);
    let opponentId = opponentIds.get(opponentKey(game.opponent));
    if (opponentId === undefined) {
      const row = await env.DB.prepare("INSERT INTO opponents (name) VALUES (?) RETURNING id")
        .bind(game.opponent)
        .first<{ id: number }>();
      opponentId = row!.id;
      opponentIds.set(opponentKey(game.opponent), opponentId);
    }
    const rink = rinks.find((each) => each.name === game.rink);
    const known = games.find(
      (each) => (game.benchappEventId !== null && each.benchappEventId === game.benchappEventId) || each.calendarUid === game.uid,
    );

    if (known) {
      // A past Game or a Game with a Box Score keeps its values. The feed changes only the coming Games.
      const coming = !known.hasBoxScore && known.startsAt >= now;
      const rinkId = rink?.id ?? known.rinkId;
      const differs =
        known.calendarUid !== game.uid ||
        (coming &&
          (known.startsAt !== game.startsAt || known.opponentId !== opponentId || known.side !== game.side || known.rinkId !== rinkId));
      if (!differs) continue;
      result.changed += 1;
      statements.push(
        coming
          ? env.DB.prepare(
              "UPDATE games SET calendar_uid = ?, starts_at = ?, opponent_id = ?, ice_pak_side = ?, rink_id = ? WHERE id = ?",
            ).bind(game.uid, game.startsAt, opponentId, game.side, rinkId, known.id)
          : env.DB.prepare("UPDATE games SET calendar_uid = ? WHERE id = ?").bind(game.uid, known.id),
      );
      continue;
    }

    // A new Game goes to the newest League Season of the League of its rink.
    const leagueSeason = rink?.leagueId ? seasons.find((season) => season.leagueId === rink.leagueId) : undefined;
    if (!leagueSeason) {
      console.warn("A Calendar Feed Game has no League", game.uid, game.startsAt);
      continue;
    }
    result.added += 1;
    statements.push(
      env.DB.prepare(
        `INSERT INTO games (league_season_id, starts_at, opponent_id, rink_id, ice_pak_side, calendar_uid, benchapp_event_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).bind(leagueSeason.id, game.startsAt, opponentId, rink!.id, game.side, game.uid, game.benchappEventId),
    );
  }

  // A coming Game from the feed with no Box Score goes when BenchApp deletes it.
  for (const game of games) {
    if (game.calendarUid && !seen.has(game.calendarUid) && !game.hasBoxScore && game.startsAt >= now) {
      result.removed += 1;
      statements.push(env.DB.prepare("DELETE FROM games WHERE id = ?").bind(game.id));
    }
  }
  if (statements.length) await env.DB.batch(statements);
  return result;
}
