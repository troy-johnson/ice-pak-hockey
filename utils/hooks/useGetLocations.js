import useSWR from "swr";

const useGetLocations = () => {
   const { data, error } = useSWR(`/api/locations`);

   return {
      locations: data,
      locationsLoading: !error && !data,
      locationsError: error,
   };
};

export default useGetLocations;
