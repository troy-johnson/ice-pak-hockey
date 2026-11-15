import type { RosterStatus } from "./fees";

export const POSITIONS = ["forward", "defense", "goalie"] as const;
export type Position = (typeof POSITIONS)[number];

export const PRIORITY_TIERS = ["core", "regular-sub", "occasional-sub"] as const;
export type PriorityTier = (typeof PRIORITY_TIERS)[number];

export const ROSTER_ANSWERS = ["full-time", "part-time", "sub-only", "out"] as const;
export type RosterAnswer = (typeof ROSTER_ANSWERS)[number];

export const LABELS: Record<Position | PriorityTier | RosterAnswer, string> = {
  forward: "Forward",
  defense: "Defense",
  goalie: "Goalie",
  core: "Core",
  "regular-sub": "Regular sub",
  "occasional-sub": "Occasional sub",
  "full-time": "Full-time",
  "part-time": "Part-time",
  "sub-only": "Sub only",
  out: "Out",
};

export interface BoardPlayer {
  id: number;
  firstName: string;
  lastName: string;
  position: Position | null;
  priorityTier: PriorityTier | null;
  priorityOrder: number;
  answer: RosterAnswer | null;
  /** The Player is a goalie in this League Season. A Manager sets it. */
  isGoalie: boolean;
}

type Prioritized = Pick<BoardPlayer, "firstName" | "lastName" | "priorityTier" | "priorityOrder">;

export type PositionCounts = Record<Position | "unknown", number>;

/** Returns `value` when it is one of `allowed`, and null for all other form input. */
export function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? (value as T) : null;
}

/**
 * The Roster Status that a Roster Answer gives. A goalie who is in has the Goalie status.
 * A Player who is out, or who gave no answer, has no status.
 */
export function rosterStatus(answer: RosterAnswer | null, isGoalie: boolean): RosterStatus | null {
  if (answer === null || answer === "out") return null;
  if (answer === "sub-only") return "sub";
  return isGoalie ? "goalie" : answer;
}

/** A Sub is not on the Roster. */
export function isOnRoster(player: BoardPlayer): boolean {
  const status = rosterStatus(player.answer, player.isGoalie);
  return status !== null && status !== "sub";
}

export function rosterStatuses(players: BoardPlayer[]): RosterStatus[] {
  return players
    .map((player) => rosterStatus(player.answer, player.isGoalie))
    .filter((status): status is RosterStatus => status !== null);
}

/** A goalie in the Player Bank who is a skater in this League Season has no known position. */
function rosterPosition(player: BoardPlayer): Position | "unknown" {
  if (player.isGoalie) return "goalie";
  return player.position === null || player.position === "goalie" ? "unknown" : player.position;
}

/** Counts the Players on the Roster by position, to compare with the Target Count. */
export function positionCounts(players: BoardPlayer[]): PositionCounts {
  const counts: PositionCounts = { forward: 0, defense: 0, goalie: 0, unknown: 0 };
  for (const player of players.filter(isOnRoster)) counts[rosterPosition(player)] += 1;
  return counts;
}

/** Orders Players by Priority Tier, then by the Manager's order in the tier, then by name. */
export function byPriority(a: Prioritized, b: Prioritized): number {
  const tier = (player: Prioritized) =>
    player.priorityTier === null ? PRIORITY_TIERS.length : PRIORITY_TIERS.indexOf(player.priorityTier);

  // An order of 0 means that the Manager has set no order. Those Players come last in the tier.
  const order = (player: Prioritized) => player.priorityOrder || Number.MAX_SAFE_INTEGER;

  return (
    tier(a) - tier(b) ||
    order(a) - order(b) ||
    a.lastName.localeCompare(b.lastName) ||
    a.firstName.localeCompare(b.firstName)
  );
}

/** The core Players with no Roster Answer: the Players a Manager must chase. */
export function chaseList(players: BoardPlayer[]): BoardPlayer[] {
  return players
    .filter((player) => player.answer === null && player.priorityTier === "core")
    .sort(byPriority);
}

/** A message for the BenchApp chat. The site sends nothing. */
export function chaseMessage(leagueSeasonName: string, players: BoardPlayer[]): string {
  const names = chaseList(players).map((player) => `${player.firstName} ${player.lastName}`);
  if (names.length === 0) return "";

  return [
    `Ice Pak roster for ${leagueSeasonName}: we need your answer.`,
    "Are you in full-time, in part-time, a sub only, or out?",
    `Still waiting on: ${names.join(", ")}.`,
  ].join("\n");
}
