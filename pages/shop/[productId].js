import { useEffect, useState } from "react";
import { Loading, PageContainer } from "../../components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, useGetProducts } from "../../utils";
import {
   Box,
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

   const { products, productsLoading, productsError } = useGetProducts();

   const product = products?.filter((product) => Number(productId) === product.sync_product.id)[0];

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
      if (
         product?.sync_product?.name === "Wordmark Trucker Hat" ||
         product?.sync_product?.name === "Toque"
      ) {
         return "One Size Fits All";
      }
      return variant?.product?.name?.split("(")?.[1]?.split("/")?.[1]?.split(")")?.[0].trim();
   };

   const [color, setColor] = useState("Black" ?? "White");
   const [size, setSize] = useState("M");
   const [quantity, setQuantity] = useState(1);

   const dispatch = useDispatch();

   const [images, setImages] = useState([]);
   const [currentImage, setCurrentImage] = useState(
      images?.find((image) => image.type === "preview")
   );

   // console.log("currentImage", currentImage);
   console.log("product", product);
   // console.log("color", color, getVariantColor(product?.sync_variants[0]));

   const getImages = (variant) => variant.files.filter((file) => file.type !== "default");

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
            images: getImages(variant),
            blurImage: variant.files.filter((file) => file.type === "preview")[0].thumbnail_url,
            brandName: variant.product.name.split("(")[0].trim(),
         });
      }
   });

   const handleColorChange = (event) => {
      // console.log(
      //    "test",
      //    options.find((el) => el.color === event.target.value)
      // );
      setColor(event.target.value);
      if (
         product?.sync_product?.name !== "Wordmark Trucker Hat" &&
         product?.sync_product?.name !== "Toque"
      ) {
         setSize("M");
      }
      setImages(
         options
            .find((el) => el.color === event.target.value)
            ?.images?.filter((image) => image.type !== "default")
      );
      setCurrentImage(
         options
            .find((el) => el.color === event.target.value)
            ?.images?.find((image) => image.type === "preview")
      );
   };

   // const handleImageChange = () => {
   //    if (currentImage.type === "preview") {
   //       setCurrentImage(images?.find((image) => image.type === "back"));
   //    } else setCurrentImage(images?.find((image) => image.type === "preview"));
   // };

   const handleSizeChange = (event) => {
      setSize(event.target.value);
   };

   // const handleQuantityChange = (event) => {
   //    console.log("handle", event.target.value)
   //    setQuantity(event.target.value);
   // };

   const addProductToCart = () => {
      let variant;

      console.log("color", color);

      if (
         product?.sync_product?.name === "Wordmark Trucker Hat" ||
         product?.sync_product?.name === "Toque"
      ) {
         variant = product.sync_variants.find((el) => getVariantColor(el).includes(color));
         setSize("One Size Fits All");
      } else if (
         product?.sync_product?.name === "Ice Pak Hockey Sticker" ||
         product?.sync_product?.name === "Jersey Logo Sticker"
      ) {
         variant = product.sync_variants.find((el) => getVariantColor(el).includes(color));
         setSize("");
      } else if (
         product?.sync_product?.name !== "Wordmark Trucker Hat" ||
         product?.sync_product?.name === "Toque"
      ) {
         variant = product.sync_variants.find(
            (el) => getVariantColor(el).includes(color) && getVariantSize(el).includes(size)
         );
      }

      console.log("variant", variant);
      console.log("productId", productId);
      dispatch(
         addToCart({
            id: variant.id,
            externalId: variant.external_id,
            variantId: variant.variant_id,
            syncVariantId: variant.sync_variant_id,
            externalVariantId: variant.external_variant_id,
            warehouseProductVariantId: variant.warehouse_product_variant_id,
            quantity,
            price: parseFloat(variant.retail_price).toFixed(2),
            retailPrice: variant.retail_price,
            name: variant.name,
            product: variant.product,
            files: variant.files,
            options: variant.options,
            sku: variant.sku,
            image: variant.files.filter((file) => file.type === "preview")[0].thumbnail_url,
            syncProductId: productId,
            color,
            size,
         })
      );
   };

   useEffect(() => {
      setImages(product?.sync_variants?.[0]?.files.filter((file) => file.type !== "default"));
      setCurrentImage(product?.sync_variants?.[0]?.files.find((file) => file.type === "preview"));
      if (getVariantColor(product?.sync_variants?.[0])) {
         setColor(getVariantColor(product?.sync_variants?.[0]));
      }
      if (
         product?.sync_product?.name === "Wordmark Trucker Hat" ||
         product?.sync_product?.name === "Toque"
      ) {
         setSize("One Size Fits All");
      }
   }, [product]);

   if (productsLoading) {
      return <Loading />;
   } else if (productsError) {
      return <PageContainer>Error loading product. Please try again later.</PageContainer>;
   }

   // console.log("images", images);

   return (
      <PageContainer pageTitle={product?.sync_product.name}>
         <Typography sx={{ ml: 3 }} variant="h5">
            {`$${product?.sync_variants?.[0]?.retail_price}`}
         </Typography>
         <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            {currentImage ? (
               <Stack direction="column" alignItems="center" spacing={2}>
                  <Image
                     blurDataURL={currentImage?.thumbnail_url}
                     placeholder="blur"
                     src={currentImage?.preview_url}
                     height={500}
                     width={500}
                     alt={product?.sync_product.name}
                  />
                  <Typography variant="caption">
                     {currentImage.type[0].toUpperCase() + currentImage.type.substring(1)}
                  </Typography>
                  <Stack direction="row" spacing={1} style={{ cursor: "pointer" }}>
                     {images.map((image, index) => (
                        <Image
                           key={image.id}
                           onClick={() => setCurrentImage(images[index])}
                           src={image?.thumbnail_url}
                           height={35}
                           width={35}
                           alt={product?.sync_product.name}
                        />
                     ))}
                  </Stack>
               </Stack>
            ) : (
               <Skeleton variant="rectangular" width={500} height={500} />
            )}
            <Typography sx={{ pl: 3, pr: 3 }} variant="caption">
               {product?.sync_variants?.[0]?.product?.name.split("(")[0].trim()}
            </Typography>
            <Stack direction={desktop ? "row" : "column"} alignItems={"center"} spacing={1}>
               <FormControl>
                  <InputLabel id="color-select-label">{product?.sync_product?.name?.includes("Sticker") ? "Size" : "Color"}</InputLabel>
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
                  {product?.sync_product?.name === "Wordmark Trucker Hat" ||
                  product?.sync_product?.name === "Toque" ||
                  product?.sync_product?.name === "Ice Pak Hockey Sticker" ||
                  product?.sync_product?.name === "Jersey Logo Sticker" ? null : (
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
                  {/* <TextField
                     id="outlined-number"
                     label="Quantity"
                     type="number"
                     sx={{ width: 75 }}
                     value={quantity}
                     onChange={handleQuantityChange}
                  /> */}
               </Stack>
            </Stack>
            <Button variant="contained" onClick={addProductToCart}>
               Add to Cart
            </Button>
         </Stack>
      </PageContainer>
   );
};

export default ProductPage;
