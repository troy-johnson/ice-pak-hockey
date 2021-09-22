import useSWR from "swr";
import {
   getGoals,
   getOpponents,
   getPenalties,
   getPlayers,
   getSeasons,
} from ".";

const getAllGames = () => {
   const { data, error } = useSWR(`/api/games`);

   const { goals, goalsLoading, goalsError } = getGoals();
   const { opponents, opponentsLoading, opponentsError } = getOpponents();
   const { penalties, penaltiesLoading, penaltiesError } = getPenalties();
   const { players, playersLoading, playersError } = getPlayers();
   const { seasons, seasonsLoading, seasonsError } = getSeasons();

   let games = [];

   data?.forEach((game) =>
      games.push({
         ...game,
         goals: game?.goals.map((goal) => goals[goal.id]),
         penalties: game?.penalties.map((penalty) => penalties[penalty.id]),
         roster: game?.roster.map((player) => players[player.id]),
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
   );

   const isError =
      error |
      goalsError |
      opponentsError |
      penaltiesError |
      playersError |
      seasonsError;
   const isLoading =
      goalsLoading |
         opponentsLoading |
         penaltiesLoading |
         playersLoading |
         seasonsLoading |
         !error && !data;

   return {
      games,
      gamesLoading: isLoading,
      gamesError: isError,
   };
};

export default getAllGames;
