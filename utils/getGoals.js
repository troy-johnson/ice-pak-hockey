import useSWR from "swr";

const getGoals = () => {
   const { data, error } = useSWR(`/api/goals`);

   return {
      goals: data,
      goalsLoading: !error && !data,
      goalsError: error,
   };
};

export default getGoals;
