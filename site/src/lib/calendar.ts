// The Calendar Feed: the BenchApp calendar of the team's games, as iCalendar text.

import { utahTime, type Side } from "./game-format";

export interface FeedEvent {
  uid: string;
  /** The BenchApp event number, from a UID such as '3747391@benchapp.com'. */
  benchappEventId: number | null;
  /** Local time in Utah, 'YYYY-MM-DD HH:MM'. */
  startsAt: string;
  summary: string;
  location: string;
  description: string;
}

export interface FeedGame {
  uid: string;
  benchappEventId: number | null;
  startsAt: string;
  opponent: string | null;
  side: Side | null;
  /** The name of a rink on the site, or null for a rink that the site does not know. */
  rink: string | null;
}

/** The unfolded lines: a line that starts with a space or a tab continues the line before it. */
function lines(text: string): string[] {
  return text.replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "").split("\n");
}

function unescape(value: string): string {
  return value.replace(/\\([nN,;\\])/g, (_, char: string) => (char.toLowerCase() === "n" ? "\n" : char));
}

/** '20261213T153000' in the time zone of the feed, or '20261213T223000Z' in UTC. */
function feedTime(value: string): string | null {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})\d{2}(Z?)$/);
  if (!match) return null;
  const [, year, month, day, hour, minute, utc] = match;
  if (utc) return utahTime(new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`));
  // BenchApp writes the team time zone, America/Boise. It has the same clock as Utah.
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function parseFeed(text: string): FeedEvent[] {
  const events: FeedEvent[] = [];
  let current: Record<string, string> | null = null;
  for (const line of lines(text)) {
    if (line === "BEGIN:VEVENT") current = {};
    else if (line === "END:VEVENT" && current) {
      const startsAt = feedTime(current.DTSTART ?? "");
      if (current.UID && startsAt) {
        const id = current.UID.match(/^(\d+)@benchapp\.com$/);
        events.push({
          uid: current.UID,
          benchappEventId: id ? Number(id[1]) : null,
          startsAt,
          summary: unescape(current.SUMMARY ?? ""),
          location: unescape(current.LOCATION ?? ""),
          description: unescape(current.DESCRIPTION ?? ""),
        });
      }
      current = null;
    } else if (current) {
      const colon = line.indexOf(":");
      if (colon > 0) current[line.slice(0, colon).split(";")[0]] = line.slice(colon + 1);
    }
  }
  return events;
}

const ICE_PAK = /^ice pak$/i;

/**
 * The opponent and the side of Ice Pak. The description has "Home: X" and "Visitor: Y" when the League
 * gives them. The summary is "Visitor vs. Home", the order of BenchApp.
 */
export function teams(event: Pick<FeedEvent, "summary" | "description">): { opponent: string | null; side: Side | null } {
  const home = event.description.match(/^Home:\s*(.+)$/m)?.[1].trim();
  const visitor = event.description.match(/^Visitor:\s*(.+)$/m)?.[1].trim();
  if (home && visitor) {
    if (ICE_PAK.test(home)) return { opponent: visitor, side: "home" };
    if (ICE_PAK.test(visitor)) return { opponent: home, side: "away" };
  }
  const parts = event.summary.split(/\s+vs\.?\s+/i).map((part) => part.trim());
  if (parts.length === 2) {
    if (ICE_PAK.test(parts[1])) return { opponent: parts[0] || null, side: "home" };
    if (ICE_PAK.test(parts[0])) return { opponent: parts[1] || null, side: "away" };
  }
  return { opponent: null, side: null };
}

/** The rink of the site for a BenchApp location. */
export function rinkName(location: string): string | null {
  const text = location.toLowerCase();
  if (text.includes("mammoth") || text.includes("sandy") || /^(north|south) rink/.test(text)) return "Mammoth Ice Center";
  if (text.includes("sports complex") || text.includes("guardsman")) return "SLC Sports Complex";
  if (text.includes("acord")) return "West Valley Acord Ice Center";
  if (text.includes("county ice center") || text.includes("murray")) return "County Ice Center";
  return null;
}

export function feedGames(text: string): FeedGame[] {
  return parseFeed(text).map((event) => ({
    uid: event.uid,
    benchappEventId: event.benchappEventId,
    startsAt: event.startsAt,
    ...teams(event),
    rink: rinkName(event.location),
  }));
}

/** A name key for an opponent: "Puck off", "Puck Off", and "The Puck Off" are the same team. */
export function opponentKey(name: string): string {
  return name
    .replace(/\s*\(.*\)\s*$/, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]/g, "");
}
