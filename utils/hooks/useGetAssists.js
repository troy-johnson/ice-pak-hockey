import useSWR from "swr";

const useGetAssists = () => {
   const { data, error } = useSWR(`/api/assists`);

   return {
      assists: data,
      assistsLoading: !error && !data,
      assistsError: error,
   };
};

export default useGetAssists;
