import useSWR from "swr";

const useGetAllGames = () => {
   const { data, error } = useSWR(`/api/games`);

   const isError = error
   const isLoading = !data && !error;

   return {
      allGames: data,
      allGamesLoading: isLoading,
      allGamesError: isError,
   };
};

export default useGetAllGames;
