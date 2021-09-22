import { useRouter } from "next/router";
import { getAllGames, getSeasons } from "../../utils";

const Season = () => {
   const router = useRouter();
   const { id } = router.query;

   const { seasons, seasonsLoading, seasonsError } = getSeasons();
   const { games, gamesLoading, gamesError } = getAllGames();

   const season = seasons?.filter((season) => season?.id === id)[0];
   const seasonGames = games?.filter((game) => game?.seasonId === id);

   const isLoading = seasonsLoading | gamesLoading;
   const isError = seasonsError | gamesError;

   if (isLoading) {
      return <div>Loading...</div>;
   } else if (isError) {
      return <div>An error occurred. Please try again.</div>;
   }

   return (
      <>
         <h1>{`${season?.leagueName} ${season?.name}`}</h1>
         {seasonGames
            ?.sort(
               (a, b) => new Date(a.date.seconds) - new Date(b.date.seconds)
            )
            .map((game) => {
               return (
                  <div key={game.id}>
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
               );
            })}
      </>
   );
};

export default Season;
