import useSWR from "swr";

const useGetRecentGames = () => {
   const { data, error } = useSWR(`/api/games/recent`);

   const isError = error
   const isLoading = !data && !error;

   return {
      games: data,
      gamesLoading: isLoading,
      gamesError: isError,
   };
};

export default useGetRecentGames;
