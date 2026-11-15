// All money is in whole cents.

export type RosterStatus = "full-time" | "part-time" | "goalie" | "sub";

export interface PlayerFees {
  fullTime: number;
  partTime: number;
}

// The Fee Sheet counts at least 12 full-time players, so a short Roster does not raise the fee.
export const MIN_FULL_TIME_COUNT = 12;

/**
 * Proposes the Player Fees of a League Season from the League Fee and the Roster.
 * Each fee is rounded up to the nearest cent, so the Players never pay less than the League Fee.
 */
export function proposePlayerFees(leagueFee: number, roster: RosterStatus[]): PlayerFees {
  const fullTimeCount = Math.max(
    MIN_FULL_TIME_COUNT,
    roster.filter((status) => status === "full-time").length,
  );
  const partTimeCount = roster.filter((status) => status === "part-time").length;

  // One share is half of a Full-Time Fee: a full-time Player pays two shares, a part-time Player one.
  const shares = 2 * fullTimeCount + partTimeCount;

  return {
    fullTime: Math.ceil((2 * leagueFee) / shares),
    partTime: Math.ceil(leagueFee / shares),
  };
}

export function playerFee(status: RosterStatus, fees: PlayerFees): number {
  if (status === "full-time") return fees.fullTime;
  if (status === "part-time") return fees.partTime;
  return 0;
}

/** What a Player owes: Player Fees and Charges minus Payments. A negative Balance is a credit. */
export function balance(playerFees: number[], charges: number[], payments: number[]): number {
  return sum(playerFees) + sum(charges) - sum(payments);
}

/** The part of a League Fee that the Players have not yet paid back. A negative Shortfall is a surplus. */
export function shortfall(leagueFee: number, payments: number[]): number {
  return leagueFee - sum(payments);
}

function sum(amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}
