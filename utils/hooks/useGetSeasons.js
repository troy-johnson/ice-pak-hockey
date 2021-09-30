import useSWR from "swr";

const useGetSeasons = () => {
   const { data, error } = useSWR(`/api/seasons`);

   return {
      seasons: data,
      seasonsLoading: !error && !data,
      seasonsError: error,
   };
};

export default useGetSeasons;
