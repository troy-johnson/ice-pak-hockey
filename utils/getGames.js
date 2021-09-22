import useSWR from "swr";

const getGames = () => {
   const { data, error } = useSWR(`/api/games`);

   return {
      games: data,
      gamesLoading: !error && !data,
      gamesError: error,
   };
};

export default getGames;
