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
         id: game.id,
         icePakGoals: goals?.filter((goal) => goal.pgGameId === game.id && goal.pgPlayerId).length,
         opponentGoals: goals?.filter((goal) => goal.pgGameId === game.id && goal.pgOpponentId).length,
         locationName: locations?.filter((location) => game.pgLocationId === location.id)[0]?.name,
         // locationImage: locations?.filter(
         //    (location) => location.id === game.locationId
         // )[0]?.image,
         locationMapLink: locations?.filter((location) => location.id === game.pgLocationId)[0]
            ?.googleMapsLink,
         opponentName: opponents?.filter((opponent) => opponent.id === game.pgOpponentId)[0]
            ?.teamName,
         seasonName: `${seasons?.filter((season) => season.id === game.pgSeasonId)[0]?.leagueName} ${
            seasons?.filter((season) => season.id === game.pgSeasonId)[0]?.name
         } ${seasons?.filter((season) => season.id === game.pgSeasonId)[0]?.type}`,
      });
   });

   const isError = error | goalsError | opponentsError | locationsError | seasonsError;
   const isLoading =
      goalsLoading | opponentsLoading | locationsLoading | seasonsLoading | !error && !data;

   console.log("games", games)

   return {
      games,
      gamesLoading: isLoading,
      gamesError: isError,
   };
};

export default useGetAllGames;
