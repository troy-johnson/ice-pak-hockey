import useSWR from "swr";

const useGetLeagues = () => {
   const { data, error } = useSWR(`/api/leagues`);

   return {
      leagues: data,
      leaguesLoading: !error && !data,
      leaguesError: error,
   };
};

export default useGetLeagues;
