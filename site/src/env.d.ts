declare namespace App {
  interface Locals {
    /** The email of the signed-in Manager. Set only on manager pages. */
    manager?: string;
    /** The Games of this request, read one time. */
    games?: Promise<import("./lib/game-format").GameSummary[]>;
  }
}
