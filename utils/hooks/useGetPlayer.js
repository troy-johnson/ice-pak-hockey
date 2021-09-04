import useSWR from "swr";
import fetcher from "./fetcher";

const useGetPlayer = ({ id }) => {
   const { data, error } = useSWR(`/api/player/${id}`, fetcher);

   return {
      player: data,
      isLoading: !error && !data,
      isError: error,
   };
};

export default useGetPlayer;
