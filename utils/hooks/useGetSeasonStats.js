import useSWR from "swr";

const useGetSeasonStats = (seasonId) => {
   const { data, error } = useSWR(`/api/season-stats/${seasonId}`);

   return {
      seasonStats: data,
      seasonStatsLoading: !error && !data,
      seasonStatsError: error,
   };
};

export default useGetSeasonStats;
