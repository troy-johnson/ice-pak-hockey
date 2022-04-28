import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import {
   Box,
   Card,
   CardActions,
   CardContent,
   // CardMedia,
   // IconButton,
   // Fab,
   Button,
   Stack,
   // SwipeableDrawer,
   Typography,
   useMediaQuery,
} from "@mui/material";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Loading, PageContainer } from "../../components";
import { useGetProducts } from "../../utils";

const FlexStack = styled(Stack)`
   flex-wrap: wrap;
`;

const Shop = () => {
   // const [cartOpen, setCartOpen] = useState(false);
   const { products, productsLoading, productsError } = useGetProducts();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   console.log("products", products);

   if (productsLoading) {
      return <Loading />;
   }

   return (
      <PageContainer pageTitle="Shop" sx={{ m: 2 }}>
         <FlexStack
            direction={desktop ? "row" : "column"}
            justifyContent="flex-start"
            sx={{ m: 2 }}
         >
            {products?.map((product) => {
               // console.log("product", product);
               return (
                  <Box
                     sx={{
                        width: 200,
                        minHeight: 265,
                        m: 1,
                     }}
                     key={product?.sync_product.id}
                  >
                     <Card
                        sx={{
                           minHeight: 265,
                           cursor: "pointer",
                           transition: "0.3s",
                           "&:hover": {
                              color: "white",
                              backgroundColor: "#1D315F",
                           },
                        }}
                        variant="outlined"
                     >
                        <Link href={`shop/${product.sync_product.id}`} passHref>
                           <CardContent>
                              <Typography sx={{ height: 50 }} variant="subtitle1" gutterBottom>
                                 {product?.sync_product.name}
                              </Typography>
                              <Typography variant="subtitle2">
                                 {`$${product?.sync_variants?.[0].retail_price}`}
                              </Typography>
                              <Stack alignItems="center" sx={{ m: 1 }}>
                                 <Image
                                    src={product?.sync_product?.thumbnail_url}
                                    height={125}
                                    width={125}
                                    alt={product?.sync_product.name}
                                 />
                              </Stack>
                           </CardContent>
                        </Link>
                     </Card>
                  </Box>
               );
            })}
         </FlexStack>
         {/* <FixedFab>
            <OpenCartNav onClick={() => setCartOpen(true)} />
            <SwipeableDrawer
               anchor="right"
               onOpen={() => {}}
               open={cartOpen}
               onClose={() => setCartOpen(false)}
            >
               <CartBox
                  role="presentation"
                  onClick={() => setCartOpen(false)}
                  onKeyDown={() => setCartOpen(false)}
                  desktop={desktop}
               >
                  <Typography>Cart</Typography>
               </CartBox>
            </SwipeableDrawer>
         </FixedFab> */}
      </PageContainer>
   );
};

export default Shop;
