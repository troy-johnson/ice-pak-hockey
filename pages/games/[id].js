import { useRouter } from "next/router";
import { useGetAllGames } from "../../utils";

const Game = () => {
   const { games, gamesLoading, gamesError } = useGetAllGames();

   const router = useRouter();
   const { id } = router.query;

   const game = games?.filter((game) => game.id === id);

   return (
      <>
         <h1>Game</h1>
         {game ? <div>{JSON.stringify(game)}</div> : null}
      </>
   );
};

export default Game;
