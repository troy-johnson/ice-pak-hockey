import { PageContainer } from "../../components";
import { useRouter } from "next/router";

const ProductPage = () => {
   const router = useRouter();
   const { productId } = router.query;

   return <PageContainer pageTitle="Product Page">Product ID: {productId}</PageContainer>;
};

export default ProductPage;
