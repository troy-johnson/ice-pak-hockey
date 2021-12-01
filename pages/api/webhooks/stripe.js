import { buffer } from "micro";
import Stripe from "stripe";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
   apiVersion: "2020-08-27",
});

// const endpointSecret = "whsec_NKCtywOBX8mUjrbXwq0e6n5pwsI9KVvC";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
   api: {
      bodyParser: false,
   },
};

const stripeWebhookHandler = async (req, res) => {
   const buf = await buffer(req);
   const sig = req.headers["stripe-signature"];

   let event;

   try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
   } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
   }

   if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);

      const { id, client_reference_id, shipping } = paymentIntent;

      if (client_reference_id) {
         await setDoc(doc(db, "orders", client_reference_id), {
            status: paymentIntent.status,
            shipping,
         });

         const submitOrderResult = await fetch(
            `${
               process.env.NODE_ENV === "development"
                  ? "http://localhost:3000"
                  : "https://icepakhockey.com"
            }/api/orders/${client_reference_id}`
         );

         console.log("submit-order", submitOrderResult);

         return res.status(200).send({ message: "Payment success! Submitting order..." });
      } else {
         await setDoc(doc(db, "orders", id), {
            status: paymentIntent.status,
            shipping,
         });

         return res.status(200).send({
            message: `Payment success! No order ID. Please contact troy.johnson57@gmail.com for help (provide this ID: ${id}).`,
         });
      }
   } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`);

      const { client_reference_id } = paymentIntent;

      if (client_reference_id) {
         await setDoc(doc(db, "orders", client_reference_id), {
            status: paymentIntent.status,
         });

         return res.status(202).send("Payment failure.");
      }
   } else if (event.type === "charge.succeeded") {
      const charge = event.data.object;
      console.log(`💵 Charge id: ${charge.id}`);
      return res.status(202).send("Received event. No handling necessary.")
   } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      return res.status(202).send("Received event. No handling necessary.")
   }

   // Return a response to acknowledge receipt of the event.
   res.json({ received: true });
};

export default stripeWebhookHandler;
