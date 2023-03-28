import useSWR from "swr";

const useGetTeams = () => {
   const { data, error } = useSWR(`/api/teams`);

   return {
      teams: data,
      teamsLoading: !error && !data,
      teamsError: error,
   };
};

export default useGetTeams;
