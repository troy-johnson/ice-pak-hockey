import type { LeagueSeasonFields, PlayerFields } from "./db";
import { cents, count, date, text } from "./forms";
import { oneOf, POSITIONS, PRIORITY_TIERS } from "./roster";

export function playerFields(data: FormData): PlayerFields {
  return {
    firstName: text(data, "firstName"),
    lastName: text(data, "lastName"),
    position: oneOf(text(data, "position"), POSITIONS),
    priorityTier: oneOf(text(data, "priorityTier"), PRIORITY_TIERS),
    priorityOrder: count(data, "priorityOrder"),
    note: text(data, "note"),
  };
}

export function leagueSeasonFields(data: FormData): LeagueSeasonFields {
  return {
    leagueId: count(data, "leagueId"),
    name: text(data, "name"),
    startsOn: date(data, "startsOn"),
    leagueFee: cents(data, "leagueFee"),
    targetForwards: count(data, "targetForwards"),
    targetDefense: count(data, "targetDefense"),
    targetGoalies: count(data, "targetGoalies"),
  };
}
