import useSWR from "swr";

const getPlayers = () => {
   const { data, error } = useSWR(`/api/players`);

   return {
      players: data,
      playersLoading: !error && !data,
      playersError: error,
   };
};

export default getPlayers;
