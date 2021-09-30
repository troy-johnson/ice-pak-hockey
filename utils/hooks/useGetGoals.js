import useSWR from "swr";

const useGetGoals = () => {
   const { data, error } = useSWR(`/api/goals`);

   return {
      goals: data,
      goalsLoading: !error && !data,
      goalsError: error,
   };
};

export default useGetGoals;
