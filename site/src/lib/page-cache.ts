// How long Cloudflare can keep a public page. A public page changes when a Manager saves a change,
// and when the clock passes a time that the page compares with the Utah time.

import { utahTime } from "./game-format";
import { CURRENT_DAYS } from "./stats";

/** The cache tag of each page that shows the site data. A Manager save purges it. */
export const SITE_DATA_TAG = "site-data";

const DAY_MINUTES = 24 * 60;

/** Minutes since 1970 of a Utah time "YYYY-MM-DD HH:MM", counted on the clock face. */
function clockMinutes(time: string): number {
  return Date.parse(`${time.replace(" ", "T")}:00Z`) / 60_000;
}

/**
 * The seconds until the next Utah time at which a public page can change: the start of a Game,
 * the end of a current League Season (CURRENT_DAYS after a Game), or midnight.
 * Each page compares the minute of a Game start with "<" or ">", so both that minute and the next count.
 */
export function secondsUntilChange(startTimes: string[], moment: Date): number {
  const now = clockMinutes(utahTime(moment));
  let next = clockMinutes(`${utahTime(moment).slice(0, 10)} 00:00`) + DAY_MINUTES;
  for (const startsAt of startTimes) {
    const start = clockMinutes(startsAt);
    for (const change of [start, start + 1, start + CURRENT_DAYS * DAY_MINUTES, start + CURRENT_DAYS * DAY_MINUTES + 1]) {
      if (change > now && change < next) next = change;
    }
  }
  return Math.max(1, (next - now) * 60 - moment.getUTCSeconds());
}
