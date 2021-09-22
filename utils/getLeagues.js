import useSWR from "swr";

const getLeagues = () => {
   const { data, error } = useSWR(`/api/leagues`);

   return {
      leagues: data,
      leaguesLoading: !error && !data,
      leaguesError: error,
   };
};

export default getLeagues;
