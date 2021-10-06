import useSWR from "swr";

const useGetAllPenalties = () => {
   const { data, error } = useSWR(`/api/penalties`);

   return {
      penalties: data,
      penaltiesLoading: !error && !data,
      penaltiesError: error,
   };
};

export default useGetAllPenalties;
