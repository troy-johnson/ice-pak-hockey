import useSWR from "swr";

const useGetProductData = (productId) => {
   const { data, error } = useSWR(`/api/products/${productId}`);

   return {
      productData: data,
      productDataLoading: !error && !data,
      productDataError: error,
   };
};

export default useGetProductData;
