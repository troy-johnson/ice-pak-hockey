import useSWR from "swr";

const useGetOrder = (orderId) => {
   const { data, error } = useSWR(`/api/orders/${orderId}`);

   return {
      order: data,
      orderLoading: !error && !data,
      orderError: error,
   };
};

export default useGetOrder;
