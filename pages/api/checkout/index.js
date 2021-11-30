import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
   apiVersion: "2020-08-27",
});

const CheckoutHandler = async (req, res) => {
   try {
      const { items } = req.body;
      console.log("req body", items);

      const redirectURL =
         process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://icepakhockey.com";

      const productList = await stripe.products.list();
      const pricesList = await stripe.prices.list();

      console.log("productList", productList);
      console.log("pricesList", pricesList);

      const lineItems = items.map((item) => {
         const currentProductId = productList.data.find(
            (el) => el.metadata.printfulId === item.syncProductId
         ).id;
         const description = item.name.split("-")[1];
         console.log("item", description);
         return {
            price: pricesList.data.find((el) => el.product === currentProductId).id,
            quantity: item.quantity,
            description,
         };
      });

      const checkoutSession = await stripe.checkout.sessions.create({
         cancel_url: redirectURL + "/order-status/?status=cancel",
         mode: "payment",
         success_url: redirectURL + "/order-status/?status=success",
         submit_type: "pay",
         payment_method_types: ["card"],
         line_items: lineItems,
         mode: "payment",
      });

      res.status(200).json(checkoutSession);
   } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
   }
};

export default CheckoutHandler;
