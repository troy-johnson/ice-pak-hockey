import Stripe from "stripe";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config";
import crypto from "crypto";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
   apiVersion: "2020-08-27",
});

const checkoutHandler = async (req, res) => {
   try {
      const { user, items } = req.body;
      console.log("req body", req.body);

      const redirectURL =
         process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://www.icepakhockey.com";

      const productList = await stripe.products.list();
      const pricesList = await stripe.prices.list();

      console.log("productList", productList);
      console.log("pricesList", pricesList);

      // console.log("productList md", productList.map(el => console.log("metadata", el.metadata)))

      const orderedItems = [];

      const lineItems = items.map((item) => {

         console.log("item", item)
   
         const currentProductId = productList.data.find(
            (el) => el.metadata.printfulId === item.syncProductId
         ).id;
         const description = item.name.split("-")[1];
         console.log("item", { description, currentProductId });
         orderedItems.push({
            ...item,
            stripePriceId: pricesList.data.find((el) => el.product === currentProductId).id,
         });
         return {
            price: pricesList.data.find((el) => el.product === currentProductId).id,
            quantity: item.quantity,
            description,
         };
      });

      const clientReferenceId = crypto.randomBytes(10).toString("hex");

      const checkoutSession = await stripe.checkout.sessions.create({
         shipping_address_collection: {
            allowed_countries: ["US"],
         },
         phone_number_collection: {
            enabled: true,
         },
         cancel_url: redirectURL + `/order-status/${clientReferenceId}`,
         mode: "payment",
         success_url: redirectURL + `/order-status/${clientReferenceId}`,
         submit_type: "pay",
         payment_method_types: ["card"],
         line_items: lineItems,
         mode: "payment",
         client_reference_id: clientReferenceId,
      });

      console.log("checkoutSession", clientReferenceId);

      await setDoc(doc(db, "orders", clientReferenceId), {
         orderedItems,
         paymentStatus: "Pending payment",
         orderStatus: "Pending payment",
         shippingStatus: "Pending payment",
         status: "Pending payment",
         orderAmount: Number(
            items.reduce((prev, curr) => {
               return prev + Number(curr.price) * curr.quantity;
            }, 0)
         ),
         referenceId: clientReferenceId,
         user: {
            fullName: user?.fullName ?? "", 
            email: user?.email ?? "",
         },
      });

      res.status(200).json(checkoutSession);
   } catch (err) {
      console.log("error", err);
      res.status(500).json({ statusCode: 500, message: err.message });
   }
};

export default checkoutHandler;
