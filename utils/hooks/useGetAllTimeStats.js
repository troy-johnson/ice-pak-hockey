import useSWR from "swr";

const useGetAllTimeStats = () => {
   const { data, error } = useSWR(`/api/all-time-stats`);

   return {
      stats: data,
      statsLoading: !error && !data,
      statsError: error,
   };
};

export default useGetAllTimeStats;
