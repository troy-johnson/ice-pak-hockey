import { getAllGames } from "../../utils";

const Games = () => {
   const { games, gamesLoading, gamesError } = getAllGames();

   return (
      <>
         <h1>Games</h1>
         {games
            ? games?.sort((a, b) => new Date(a.date.seconds) - new Date(b.date.seconds)).map((game) => {
                 return (
                    <div key={game.id}>
                       {new Date(
                          game.date.seconds * 1000
                       ).toLocaleDateString() +
                          " @ " +
                          new Date(game.date.seconds * 1000).toLocaleTimeString(
                             [],
                             { hour: "2-digit", minute: "2-digit" }
                          ) +
                          " vs. " +
                          game?.opponentName}
                    </div>
                 );
              })
            : null}
      </>
   );
};

export default Games;
