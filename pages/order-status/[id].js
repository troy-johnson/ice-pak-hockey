import { useRouter } from "next/router";
import Image from "next/image";
import { useSession } from "next-auth/client";
import { Divider, Link, Stack, Typography, useMediaQuery } from "@mui/material";
import { Loading, PageContainer } from "../../components";
import { useGetOrder } from "../../utils";

const OrderStatus = () => {
   const router = useRouter();
   const { id } = router.query;
   const { order, orderLoading, orderError } = useGetOrder(id);
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const [session, loading] = useSession();

   console.log("order", order);

   if (orderLoading) {
      return <Loading />;
   } else if (orderError) {
      return (
         <PageContainer small pageTitle="Order Information">
            <Typography variant="h4">Error retrieving order! Please try again.</Typography>
         </PageContainer>
      );
   }

   return (
      <PageContainer small pageTitle="Order Status">
         <Stack
            display="flex"
            direction={desktop ? "row" : "column"}
            justifyContent="center"
            divider={
               <Divider
                  sx={{ m: 1, mr: 2 }}
                  orientation={desktop ? "vertical" : "horizontal"}
                  flexItem
               />
            }
            spacing={2}
            sx={{ ml: 2, mr: 2 }}
         >
            <Stack direction="column" sx={{ width: 1 }}>
               <Typography variant="h6">Order Information</Typography>
               <Typography variant="subtitle1">Order #: {id}</Typography>
               <Typography variant="subtitle1">
                  Payment Status:{" "}
                  {order.paymentStatus[0].toUpperCase() + order.paymentStatus.substring(1)}
               </Typography>
               <Typography variant="subtitle1">
                  Order Amount: {`$${Number(order.orderAmount).toFixed(2)}`}
               </Typography>
               {order?.receipt ? (
                  <Typography variant="subtitle1">
                     <Link href={order?.receipt} target="_blank" rel="noopener noreferrer">
                        Receipt
                     </Link>
                  </Typography>
               ) : null}
            </Stack>
            <Stack direction="column" sx={{ width: 1 }}>
               <Typography variant="h6">Shipping Information</Typography>
               <Typography variant="subtitle1">
                  Shipping Status:{" "}
                  {order.shippingStatus[0].toUpperCase() + order.shippingStatus.substring(1)}
               </Typography>
               {order?.shippingData?.shipment?.tracking_url ? (
                  <Typography variant="subtitle1">
                     <Link
                        href={order?.shippingData?.shipment?.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        Track your order!
                     </Link>
                  </Typography>
               ) : null}
               <Typography variant="subtitle1">Shipping Address:</Typography>
               <Typography variant="subtitle2">{order.shipping.name}</Typography>
               <Typography variant="subtitle2">{order.shipping.address.line1}</Typography>
               <Typography variant="subtitle2">{`${order.shipping.address.city}, ${order.shipping.address.state} ${order.shipping.address.postal_code}`}</Typography>
            </Stack>
         </Stack>
         <Divider sx={{ m: 2 }} />
         <Stack direction="column" sx={{ ml: 2, mb: 2 }} spacing={2}>
            <Typography variant="h6">Items Purchased</Typography>
            {/* <Stack direction="column"> */}
            {order?.orderedItems?.map((item, index) => (
               <Stack key={item.sku} direction="row" alignItems="center" spacing={1}>
                  <Image
                     layout="fixed"
                     alt={item.name}
                     src={item.files.find((file) => file.type === "preview").preview_url}
                     width={100}
                     height={100}
                  />
                  <Stack direction="column">
                     <Typography variant="body1">{item.name.split("-")[0].trim()}</Typography>
                     <Typography variant="body2">Color: {item.color}</Typography>
                     {item?.size ? (
                        <Typography variant="body2">Size: {item.size}</Typography>
                     ) : null}
                     <Typography variant="body2">Price/unit: {`$${item.price}`}</Typography>
                     <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  </Stack>
                  {order.orderedItems.length >= 2 && index !== order.orderedItems.length ? (
                     <Divider />
                  ) : null}
               </Stack>
            ))}
         </Stack>
         <Divider sx={{ m: 2 }} />
         <Stack direction="column" sx={{ ml: 2, mb: 2 }}>
            <Typography variant="caption">
               Need help? Contact us at (801) 913-4614 or at{" "}
               <Link href="mailto:troy.johnson57@gmail.com">troy.johnson57@gmail.com</Link>.
            </Typography>
         </Stack>
      </PageContainer>
   );
};

export default OrderStatus;
