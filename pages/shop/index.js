import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import {
   Box,
   Card,
   CardActions,
   CardContent,
   CardMedia,
   IconButton,
   Button,
   Stack,
   SwipeableDrawer,
   Typography,
   useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { PageContainer } from "../../components";
import { useGetProducts } from "../../utils";

const StyledOpenCartNav = ({ className, onClick }) => {
   return (
      <IconButton className={className} onClick={onClick}>
         <ShoppingCartIcon />
      </IconButton>
   );
};

const OpenCartNav = styled(StyledOpenCartNav)`
   svg {
      color: ${(props) => props.theme.palette.black};
      height: 24px;
      width: 24px;
   }
`;

const CartBox = styled(Box)`
   background-color: ${(props) => props.theme.palette.white};
   width: ${(props) => (props.desktop ? 300 : "500px")};
   height: 100%;
`;

const Shop = () => {
   const [cartOpen, setCartOpen] = useState(false);
   const { products, productsLoading, productsError } = useGetProducts();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   console.log("products", products);

   return (
      <PageContainer pageTitle="Shop">
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
         <Stack direction={desktop ? "row" : "column"} sx={{ ml: 2, mb: 2 }} spacing={2}>
            {products?.map((product) => {
               console.log("product", product);
               return (
                  <Box sx={{ maxWidth: 345 }} key={product?.sync_product.id}>
                     <Card variant="outlined">
                        <CardContent>
                           <Image
                              src={product?.sync_product.thumbnail_url}
                              height={125}
                              width={125}
                              alt={product?.sync_product.name}
                           />
                           <Typography variant="h6" gutterBottom>
                              {product?.sync_product.name}
                           </Typography>
                           <Typography variant="h6">
                              {`$${product?.sync_variants?.[0].retail_price}`}
                           </Typography>
                        </CardContent>
                        <CardActions>
                           <Link href={`shop/${product.sync_product.id}`} passHref>
                              <Button size="small">View Item</Button>
                           </Link>
                        </CardActions>
                     </Card>
                  </Box>
               );
            })}
         </Stack>
      </PageContainer>
   );
};

export default Shop;