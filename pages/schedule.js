import Link from "next/link";
import { getAllGames } from "../utils";

const Schedule = () => {
   const { games, gamesLoading, gamesError } = getAllGames();

   return (
      <>
         <h1>Schedule</h1>
         {games
            ? games
                 ?.sort(
                    (a, b) =>
                       new Date(a.date.seconds) - new Date(b.date.seconds)
                 )
                 .map((game) => {
                    return (
                       <Link key={game.id} href={`/games/${game.id}`}>
                          <div>
                             {new Date(
                                game.date.seconds * 1000
                             ).toLocaleDateString() +
                                " @ " +
                                new Date(
                                   game.date.seconds * 1000
                                ).toLocaleTimeString([], {
                                   hour: "2-digit",
                                   minute: "2-digit",
                                }) +
                                " vs. " +
                                game?.opponentName}
                          </div>
                       </Link>
                    );
                 })
            : null}
      </>
   );
};

export default Schedule;
