import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import { PageContainer } from "../components";

const OrderStatus = () => {
   const router = useRouter();
   const { status } = router.query;

   console.log("router query", router.query)

   if (status === "success") {
      return (
         <PageContainer small pageTitle="Order Status">
            <Typography variant="h2">Order successful!</Typography>
         </PageContainer>
      );
   } else if (status === "cancelled") {
      return (
         <PageContainer small pageTitle="Order Status">
            <Typography variant="h2">Order cancelled!</Typography>
         </PageContainer>
      );
   }

   return <PageContainer small pageTitle="Order Status"></PageContainer>;
};

export default OrderStatus;
