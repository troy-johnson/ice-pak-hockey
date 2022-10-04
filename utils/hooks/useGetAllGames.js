import useSWR from "swr";

const useGetAllGames = () => {
   const { data, error } = useSWR(`/api/games`);

   const isError = error
   const isLoading = !data && !error;

   console.log('data', data)

   return {
      allGames: data,
      allGamesLoading: isLoading,
      allGamesError: isError,
   };
};

export default useGetAllGames;
