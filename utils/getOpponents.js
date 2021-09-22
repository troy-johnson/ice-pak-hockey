import useSWR from "swr";

const getOpponents = () => {
   const { data, error } = useSWR(`/api/opponents`);

   return {
      opponents: data,
      opponentsLoading: !error && !data,
      opponentsError: error,
   };
};

export default getOpponents;
