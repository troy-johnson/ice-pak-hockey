import useSWR from "swr";
import {
   useGetGoals,
   useGetLocations,
   useGetOpponents,
   useGetPenalties,
   useGetPlayers,
   useGetSeasons,
} from "..";

const useGetAllGames = () => {
   const { data, error } = useSWR(`/api/games`);

   const { goals, goalsLoading, goalsError } = useGetGoals();
   const { opponents, opponentsLoading, opponentsError } = useGetOpponents();
   const { penalties, penaltiesLoading, penaltiesError } = useGetPenalties();
   const { players, playersLoading, playersError } = useGetPlayers();
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const { locations, locationsLoading, locationsError } = useGetLocations();

   let games = [];

      data?.forEach((game) => 

         games.push({
            ...game,
            // goals: game?.goals.map((goal) => goals[goal.id]),
            // penalties: game?.penalties.map((penalty) => penalties[penalty.id]),
            // roster: game?.roster.map((player) => players?.[player.id]),
            locationName: locations?.filter(
               (location) => location.id === game.locationId
            )[0]?.name,
            // locationImage: locations?.filter(
            //    (location) => location.id === game.locationId
            // )[0]?.image,
            locationMapLink: locations?.filter(
               (location) => location.id === game.locationId
            )[0]?.googleMapsLink,
            opponentName: opponents?.filter(
               (opponent) => opponent.id === game.opponentId
            )[0]?.teamName,
            seasonName: `${
               seasons?.filter((season) => season.id === game.seasonId)[0]
                  ?.leagueName
            } ${
               seasons?.filter((season) => season.id === game.seasonId)[0]?.name
            }`,
         })
      )

   const isError =
      error |
      goalsError |
      opponentsError |
      penaltiesError |
      locationsError |
      playersError |
      seasonsError;
   const isLoading =
      goalsLoading |
         opponentsLoading |
         penaltiesLoading |
         playersLoading |
         locationsLoading |
         seasonsLoading |
         !error && !data;

   return {
      games,
      gamesLoading: isLoading,
      gamesError: isError,
   };
};

export default useGetAllGames;
