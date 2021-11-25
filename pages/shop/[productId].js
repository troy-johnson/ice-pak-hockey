import { useEffect, useState } from "react";
import { Loading, PageContainer } from "../../components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useGetProducts } from "../../utils";
import {
   Button,
   TextField,
   InputLabel,
   FormControl,
   MenuItem,
   Select,
   Skeleton,
   Stack,
   Tooltip,
   Typography,
   useMediaQuery,
} from "@mui/material";

const ProductPage = () => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const router = useRouter();
   const { productId } = router.query;
   const [color, setColor] = useState("White");
   const [size, setSize] = useState("M");
   const [quantity, setQuantity] = useState(1);

   const { products, productsLoading, productsError } = useGetProducts();

   const product = products?.filter((product) => Number(productId) === product.sync_product.id)[0];

   const [productImage, setProductImage] = useState(product?.sync_product?.preview_url);
   const [blurImage, setBlurImage] = useState(product?.product?.sync_product?.preview_url);

   console.log("product", product);

   const getVariantColor = (variant) => {
      if (product?.sync_product?.name === "Wordmark Trucker Hat") {
         return variant?.product?.name
            ?.split("(")[1]
            .split(")")[0]
            .trim()
            .split("")
            .filter((el) => el !== " ")
            .join("");
      }
      return variant?.product?.name?.split("(")?.[1]?.split("/")?.[0]?.split(")")?.[0].trim();
   };

   const getVariantSize = (variant) => {
      if (product?.sync_product?.name === "Wordmark Trucker Hat") {
         return "One Size Fits All";
      }
      return variant?.product?.name?.split("(")?.[1]?.split("/")?.[1]?.split(")")?.[0].trim();
   };
   const getIndexOfOption = (color) => options.findIndex((el) => el.color === color);

   const options = [];

   product?.sync_variants.forEach((variant) => {
      const currentColor = options.findIndex((el) => el.color === getVariantColor(variant));
      // console.log("currColor", currentColor);
      if (currentColor > -1) {
         // console.log("match", options[currentColor]);
         const oldSizes = options[currentColor].sizes;
         options[currentColor].sizes = [...oldSizes, getVariantSize(variant)];
      } else {
         options.push({
            color: getVariantColor(variant),
            sizes: [getVariantSize(variant)],
            image: variant.files[1].preview_url,
            blurImage: variant.files[1].thumbnail_url,
            brandName: variant.product.name.split("(")[0].trim(),
         });
      }
   });

   const handleColorChange = (event) => {
      console.log(
         "test",
         options.find((el) => el.color === event.target.value)
      );
      setColor(event.target.value);
      setSize("M");
      setProductImage(options.find((el) => el.color === event.target.value).image);
      setBlurImage(options.find((el) => el.color === event.target.value).blurImage);
   };

   const handleSizeChange = (event) => {
      setSize(event.target.value);
   };

   const handleQuantityChange = (event) => {
      setQuantity(event.target.value);
   };

   const addToCart = () => {
      const storage = window.localStorage;
      const cart = JSON.parse(storage.getItem("icePakCart"));
      console.log("LS ", cart);

      let variant;

      if (product?.sync_product?.name === "Wordmark Trucker Hat") {
         variant = product.sync_variants.find((el) => getVariantColor(el).includes(color));
      } else if (product?.sync_product?.name !== "Wordmark Trucker Hat") {
         variant = product.sync_variants.find(
            (el) => getVariantColor(el).includes(color) && getVariantSize(el).includes(size)
         );
      }

      console.log("variant", variant);

      if (!cart || cart.length === 0) {
         storage.setItem(
            "icePakCart",
            JSON.stringify([
               {
                  syncProductId: productId,
                  externalId: variant.external_id,
                  variantId: variant.variant_id,
                  id: variant.id,
                  name: variant.name,
                  color,
                  size,
                  price: quantity * parseFloat(variant.retail_price).toFixed(2),
                  sku: variant.sku,
                  quantity: Number(quantity),
               },
            ])
         );
      } else {
         storage.setItem(
            "icePakCart",
            JSON.stringify([
               ...cart,
               {
                  syncProductId: productId,
                  externalId: variant.external_id,
                  variantId: variant.variant_id,
                  id: variant.id,
                  color,
                  size,
                  price: Number(quantity) * Number(variant.retail_price),
                  sku: variant.sku,
                  quantity: Number(quantity),
               },
            ])
         );
      }
   };

   useEffect(() => {
      console.log("color", getVariantColor(product?.sync_variants?.[0]));
      setProductImage(product?.sync_variants?.[0]?.files?.[1]?.preview_url);
      setBlurImage(product?.sync_variants?.[0]?.files?.[1]?.thumpnail_url);
      if (getVariantColor(product?.sync_variants?.[0])) {
         setColor(getVariantColor(product?.sync_variants?.[0]));
      }
      if (product?.sync_product?.name === "Wordmark Trucker Hat") {
         setSize("One Size Fits All")
      }
   }, [product]);

   if (productsLoading) {
      return <Loading />;
   } else if (productsError) {
      return <PageContainer>Error loading product. Please try again later.</PageContainer>;
   }

   console.log("options", options);

   return (
      <PageContainer pageTitle={product?.sync_product.name}>
         <Typography sx={{ ml: 3 }} variant="h5">
            {`$${product?.sync_variants?.[0]?.retail_price}`}
         </Typography>
         <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            {productImage ? (
               <Image
                  blurDataURL={blurImage ?? productImage}
                  placeholder="blur"
                  src={productImage}
                  height={500}
                  width={500}
                  alt={product?.sync_product.name}
               />
            ) : (
               <Skeleton variant="rectangular" width={500} height={500} />
            )}
            <Typography sx={{ pl: 3, pr: 3 }} variant="caption">
               {product?.sync_variants?.[0]?.product?.name.split("(")[0].trim()}
            </Typography>
            <Stack direction={desktop ? "row" : "column"} alignItems={"center"} spacing={1}>
               <FormControl>
                  <InputLabel id="color-select-label">Color</InputLabel>
                  <Select
                     labelId="color-select-label"
                     id="color-select"
                     value={color}
                     label="Color"
                     sx={{ width: 225 }}
                     onChange={handleColorChange}
                  >
                     {options.sort().map((el) => (
                        <MenuItem key={el.color} value={el.color}>
                           {el.color}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
               <Stack display="flex" direction="row" justifyItems="center" spacing={1}>
                  {product?.sync_product?.name === "Wordmark Trucker Hat" ? null : (
                     <FormControl>
                        <InputLabel id="size-select-label">Size</InputLabel>
                        <Select
                           labelId="size-select-label"
                           id="size-select"
                           value={size}
                           label="Size"
                           sx={{ width: 75 }}
                           onChange={handleSizeChange}
                        >
                           {options[options.findIndex((el) => el.color === color)]?.sizes
                              .sort()
                              .map((el) => (
                                 <MenuItem key={el} value={el}>
                                    {el}
                                 </MenuItem>
                              ))}
                        </Select>
                     </FormControl>
                  )}
                  <TextField
                     id="outlined-number"
                     label="Quantity"
                     type="number"
                     sx={{ width: 75 }}
                     value={quantity}
                     onChange={handleQuantityChange}
                  />
               </Stack>
            </Stack>
            <Button variant="contained" onClick={addToCart}>
               Add to Cart
            </Button>
         </Stack>
      </PageContainer>
   );
};

export default ProductPage;
