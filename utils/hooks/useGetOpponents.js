import useSWR from "swr";

const useGetOpponents = () => {
   const { data, error } = useSWR(`/api/opponents`);

   return {
      opponents: data,
      opponentsLoading: !error && !data,
      opponentsError: error,
   };
};

export default useGetOpponents;
