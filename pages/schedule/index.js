import { useState } from "react";
import Link from "next/link";
import { GameCard } from './schedule.styled';
import { getAllGames } from "../../utils";

const Schedule = () => {
   const [date, setDate] = useState(new Date());
   const { games, gamesLoading, gamesError } = getAllGames();

   return (
      <>
         <h1>Schedule</h1>
         <h2>
            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(date)}{" "}
            {date.getFullYear()}
         </h2>
         {games
            ? games
                 ?.filter((game) => new Date(game.date.seconds) < date)
                 ?.sort(
                    (a, b) =>
                       new Date(a.date.seconds) - new Date(b.date.seconds)
                 )
                 .slice(0, 10)
                 .map((game) => {
                    return (
                       <GameCard key={game.id}>
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
                       </GameCard>
                    );
                 })
            : null}
      </>
   );
};

export default Schedule;
