import Image from "next/image";
import Link from "next/link";
import {
   Box,
   Card,
   CardActions,
   CardContent,
   CardMedia,
   Button,
   Stack,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { PageContainer } from "../../components";
import { useGetProducts } from "../../utils";

const Shop = () => {
   const { products, productsLoading, productsError } = useGetProducts();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   console.log("products", products);

   return (
      <PageContainer pageTitle="Shop">
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
