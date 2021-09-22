import useSWR from "swr";

const getPenalties = () => {
   const { data, error } = useSWR(`/api/penalties`);

   return {
      penalties: data,
      penaltiesLoading: !error && !data,
      penaltiesError: error,
   };
};

export default getPenalties;
