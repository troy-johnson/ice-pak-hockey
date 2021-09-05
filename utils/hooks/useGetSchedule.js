import useSWR from "swr";

const useGetSchedule = () => {
   const { data, error } = useSWR(`/api/games`);

   console.log('schedule', data, error)

   return {
      roster: data,
      isLoading: !error && !data,
      isError: error,
   };
};

export default useGetSchedule;
