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
 * The Part-Time Fee is rounded up to a cent, and the Full-Time Fee is two times that amount,
 * so the Players never pay less than the League Fee.
 */
export function proposePlayerFees(leagueFee: number, roster: RosterStatus[]): PlayerFees {
  const fullTimeCount = Math.max(
    MIN_FULL_TIME_COUNT,
    roster.filter((status) => status === "full-time").length,
  );
  const partTimeCount = roster.filter((status) => status === "part-time").length;

  const partTime = Math.ceil(leagueFee / (2 * fullTimeCount + partTimeCount));

  return { fullTime: 2 * partTime, partTime };
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
