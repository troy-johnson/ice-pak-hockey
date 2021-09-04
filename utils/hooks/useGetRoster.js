import useSWR from "swr";
import fetcher from "./fetcher";

const useGetRoster = () => {
   const { data, error } = useSWR(`/api/players`, fetcher);

   return {
      roster: data,
      isLoading: !error && !data,
      isError: error,
   };
};

export default useGetRoster;
