import useSWR from "swr";

const useGetGameInfo = (gameId) => {
   const { data, error } = useSWR(`/api/games/${gameId}`);

   return {
      game: data,
      gameLoading: !error && !data,
      gameError: error,
   };
};

export default useGetGameInfo;
