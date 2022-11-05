import useSWR from "swr";

const useGetSeason = (id) => {
   const { data, error } = useSWR(`/api/seasons/${id}`);

   console.log("uGS", data, id)

   return {
      season: data,
      seasonLoading: !error && !data,
      seasonError: error,
   };
};

export default useGetSeason;
