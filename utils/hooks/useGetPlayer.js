import useSWR from "swr";
import fetcher from "./fetcher";

const useGetPlayer = (id) => {
   const { data, error } = useSWR(`/api/players/${id}`, fetcher);

   console.log('player info', { data, error })

   return {
      player: data,
      isLoading: !error && !data,
      isError: error,
   };
};

export default useGetPlayer;
