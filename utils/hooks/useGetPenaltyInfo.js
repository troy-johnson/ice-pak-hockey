import useSWR from "swr";

const useGetPenaltyInfo = (penaltyId) => {
   const { data, error } = useSWR(`/api/penalties/${penaltyId}`);

   return {
      penalty: data,
      penaltyLoading: !error && !data,
      penaltyError: error,
   };
};

export default useGetPenaltyInfo;
