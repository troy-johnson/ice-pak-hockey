import useSWR from "swr";

const useGetProducts = () => {
   const { data, error } = useSWR(`/api/products`);

   return {
      products: data,
      productsLoading: !error && !data,
      productsError: error,
   };
};

export default useGetProducts;
