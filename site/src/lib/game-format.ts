// Labels and orders for the public pages. A time is local time in Utah, 'YYYY-MM-DD HH:MM'.

import { result, type Result } from "./stats";

export type Side = "home" | "away";
export type GameType = "regular" | "playoff" | "preseason";

export interface Opponent {
  name: string;
  logo: string;
  color: string;
  color2: string;
}

export interface GameSummary {
  id: number;
  startsAt: string;
  leagueSeasonId: number;
  leagueSeason: string;
  league: string;
  gameType: GameType;
  opponent: Opponent | null;
  rink: string | null;
  side: Side | null;
  icePakScore: number | null;
  opponentScore: number | null;
  shootout: boolean;
  headline: string;
  recapUrl: string;
  recapImage: string;
  /** The goals with a Short or another video. */
  videoCount: number;
  /** The goals with an HHG Short. */
  shortCount: number;
  goalCount: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parts(startsAt: string) {
  const [year, month, day] = startsAt.slice(0, 10).split("-").map(Number);
  // The weekday of a calendar date does not depend on the time zone, so UTC gives the right day.
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { year, month, day, weekday };
}

/** "Sun, Nov 8, 2026" */
export function longDate(startsAt: string): string {
  const { year, month, day, weekday } = parts(startsAt);
  return `${DAYS[weekday]}, ${MONTHS[month - 1]} ${day}, ${year}`;
}

/** "Sun, Nov 8" */
export function shortDate(startsAt: string): string {
  const { month, day, weekday } = parts(startsAt);
  return `${DAYS[weekday]}, ${MONTHS[month - 1]} ${day}`;
}

/** "Nov 8, 2026" */
export function plainDate(startsAt: string): string {
  const { year, month, day } = parts(startsAt);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** "6:45 PM" */
export function clockTime(startsAt: string): string {
  const [hour, minute] = startsAt.slice(11, 16).split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

/** A moment as local time in Utah, 'YYYY-MM-DD HH:MM'. */
export function utahTime(moment: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Denver",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(moment)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1];
}

/** "vs" for a home Game and "at" for an away Game. A Game with no side is a home Game. */
export function versus(side: Side | null): "vs" | "at" {
  return side === "away" ? "at" : "vs";
}

export function opponentName(opponent: Opponent | null): string {
  return opponent?.name ?? "Unknown opponent";
}

/** "Ice Pak at Night Owls" */
export function gameTitle(game: Pick<GameSummary, "side" | "opponent">): string {
  return `Ice Pak ${versus(game.side)} ${opponentName(game.opponent)}`;
}

/** The headline from HHG, or the Game title. */
export function headline(game: GameSummary): string {
  return game.headline || gameTitle(game);
}

/** The initials of a name, for an avatar or an opponent chip: "Buzz Light Beer" gives "BLB". */
export function initials(name: string, max = 3): string {
  const words = name.replace(/^the\s+/i, "").split(/\s+/).filter((word) => /[a-z0-9]/i.test(word));
  return words
    .slice(0, max)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function periodName(period: number): string {
  return ["1st period", "2nd period", "3rd period"][period - 1] ?? (period === 4 ? "Overtime" : `Period ${period}`);
}

export function periodShort(period: number): string {
  return ["1st", "2nd", "3rd"][period - 1] ?? (period === 4 ? "OT" : String(period));
}

export const GAME_TYPE_LABELS: Record<GameType, string> = {
  regular: "Regular season",
  playoff: "Playoffs",
  preseason: "Preseason",
};

export const RESULT_LETTERS: Record<Result, string> = { win: "W", loss: "L", tie: "T" };

/** "W 4-3", with Ice Pak first, or null for a Game with no final score. */
export function resultLabel(game: Pick<GameSummary, "icePakScore" | "opponentScore" | "shootout">): string | null {
  const outcome = result({ id: 0, leagueSeasonId: 0, startsAt: "", ...game });
  if (!outcome) return null;
  return `${RESULT_LETTERS[outcome]} ${game.icePakScore}-${game.opponentScore}${game.shootout ? " SO" : ""}`;
}

export interface BugRow {
  team: "ice-pak" | "opponent";
  /** The side label, or null when the Game has no side. */
  side: Side | null;
  score: number | null;
  lost: boolean;
}

/**
 * The rows of a score bug. The home team is the first row.
 * A Game with no side has Ice Pak in the first row and no labels.
 */
export function bugRows(game: Pick<GameSummary, "side" | "icePakScore" | "opponentScore">): BugRow[] {
  const known = game.icePakScore !== null && game.opponentScore !== null;
  const icePak: BugRow = {
    team: "ice-pak",
    side: game.side,
    score: game.icePakScore,
    lost: known && game.icePakScore! < game.opponentScore!,
  };
  const opponent: BugRow = {
    team: "opponent",
    side: game.side === null ? null : game.side === "home" ? "away" : "home",
    score: game.opponentScore,
    lost: known && game.opponentScore! < game.icePakScore!,
  };
  return game.side === "away" ? [opponent, icePak] : [icePak, opponent];
}

/**
 * The goals of each team in each period, or null when the goals do not add up to the final score.
 * The line score always has the three periods, and overtime when a goal was scored in it.
 */
export function lineScore(
  goals: { team: "ice-pak" | "opponent"; period: number }[],
  game: Pick<GameSummary, "icePakScore" | "opponentScore" | "shootout">,
): { periods: number[]; icePak: number[]; opponent: number[] } | null {
  if (game.icePakScore === null || game.opponentScore === null || game.shootout) return null;
  const last = Math.max(3, ...goals.map((goal) => goal.period));
  const periods = Array.from({ length: last }, (_, index) => index + 1);
  const count = (team: string) => periods.map((period) => goals.filter((goal) => goal.team === team && goal.period === period).length);
  const icePak = count("ice-pak");
  const opponent = count("opponent");
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  if (sum(icePak) !== game.icePakScore || sum(opponent) !== game.opponentScore) return null;
  return { periods, icePak, opponent };
}

/** The id of a YouTube video, from a watch, short, embed, or youtu.be address. */
export function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return match ? match[1] : null;
}

/** The image of a video: the image from HHG, or the thumbnail that YouTube gives each video. */
export function videoImage(url: string, image = ""): string | null {
  if (image) return image;
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
