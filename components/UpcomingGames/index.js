import Link from "next/link";
import { getAllGames } from "../../utils";

const UpcomingGames = () => {
   const { games, gamesLoading, gamesError } = getAllGames();

   const gamesToShow = games
      .filter(game => game.date.seconds * 1000 > new Date().getTime() / 1000)
      .sort((a, b) => new Date(a.date.seconds) - new Date(b.date.seconds))
      .slice(0, 3);

   return (
      <div>
         {gamesToShow?.map((game) => {
            return (
               <Link key={game.id} href={`/games/${game.id}`}>
                  <div>
                     {new Date(game.date.seconds * 1000).toLocaleDateString() +
                        " @ " +
                        new Date(game.date.seconds * 1000).toLocaleTimeString(
                           [],
                           {
                              hour: "2-digit",
                              minute: "2-digit",
                           }
                        ) +
                        " vs. " +
                        game?.opponentName}
                  </div>
               </Link>
            );
         })}
      </div>
   );
};

export default UpcomingGames;
