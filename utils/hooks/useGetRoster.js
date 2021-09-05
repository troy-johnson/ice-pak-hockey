import useSWR from "swr";

const useGetRoster = () => {
   const { data, error } = useSWR(`/api/players`);

   return {
      roster: data,
      isLoading: !error && !data,
      isError: error,
   };
};

export default useGetRoster;
