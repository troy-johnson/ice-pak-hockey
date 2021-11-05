import useSWR from "swr";
import { useGetGoals, useGetLocations, useGetOpponents, useGetSeasons } from "..";

const useGetAllGames = () => {
   const { data, error } = useSWR(`/api/games`);

   const { goals, goalsLoading, goalsError } = useGetGoals();
   const { opponents, opponentsLoading, opponentsError } = useGetOpponents();
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const { locations, locationsLoading, locationsError } = useGetLocations();

   let games = [];

   data?.forEach((game) => {
      // console.log("game", {
      //    ...game,
      //    icePakGoals: goals?.filter((goal) => goal.gameId === game.id && goal.playerId)?.length,
      //    opponentGoals: goals?.filter((goal) => goal.gameId === game.id && goal.opponentId)?.length,
      // });
      games.push({
         ...game,
         icePakGoals: goals?.filter((goal) => goal.gameId === game.id && goal.playerId).length,
         opponentGoals: goals?.filter((goal) => goal.gameId === game.id && goal.opponentId).length,
         locationName: locations?.filter((location) => location.id === game.locationId)[0]?.name,
         // locationImage: locations?.filter(
         //    (location) => location.id === game.locationId
         // )[0]?.image,
         locationMapLink: locations?.filter((location) => location.id === game.locationId)[0]
            ?.googleMapsLink,
         opponentName: opponents?.filter((opponent) => opponent.id === game.opponentId)[0]
            ?.teamName,
         seasonName: `${seasons?.filter((season) => season.id === game.seasonId)[0]?.leagueName} ${
            seasons?.filter((season) => season.id === game.seasonId)[0]?.name
         } ${seasons?.filter((season) => season.id === game.seasonId)[0]?.type}`,
      });
   });

   // console.log("games", games)

   const isError = error | goalsError | opponentsError | locationsError | seasonsError;
   const isLoading =
      goalsLoading | opponentsLoading | locationsLoading | seasonsLoading | !error && !data;

   return {
      games,
      gamesLoading: isLoading,
      gamesError: isError,
   };
};

export default useGetAllGames;
