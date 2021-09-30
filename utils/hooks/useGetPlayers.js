import useSWR from "swr";

const useGetPlayers = () => {
   const { data, error } = useSWR(`/api/players`);

   return {
      players: data,
      playersLoading: !error && !data,
      playersError: error,
   };
};

export default useGetPlayers;
