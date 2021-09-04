import useSWR from "swr";
import fetcher from "./fetcher";

const useGetSchedule = () => {
   const { data, error } = useSWR(`/api/games`, fetcher);

   return {
      roster: data,
      isLoading: !error && !data,
      isError: error,
   };
};

export default useGetSchedule;
