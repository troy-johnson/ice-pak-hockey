import useSWR from "swr";

const useGetPenalties = () => {
   const { data, error } = useSWR(`/api/penalties`);

   return {
      penalties: data,
      penaltiesLoading: !error && !data,
      penaltiesError: error,
   };
};

export default useGetPenalties;
