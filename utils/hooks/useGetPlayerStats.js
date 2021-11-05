import useSWR from "swr";

const useGetPlayerStats = (id) => {

   // console.log("uGPS", id)
   const { data, error } = useSWR(`/api/player-stats/${id}`);

   return {
      playerStats: data,
      playerStatsLoading: !error && !data,
      playerStatsError: error,
   };
};

export default useGetPlayerStats;
