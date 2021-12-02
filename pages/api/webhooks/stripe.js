import { buffer } from "micro";
import Stripe from "stripe";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

   try {
      let event;

      try {
         event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
      } catch (err) {
         res.status(400).send(`Webhook Error: ${err.message}`);
      }

      const dataObject = event.data.object;

      const { client_reference_id, customer_details, payment_status, shipping, status } =
         dataObject;

      if (event.type === "checkout.session.completed") {
         console.log(`💰 PaymentIntent status: ${dataObject.status}`);

         console.log("paymentIntent", event.data);

         if (client_reference_id) {
            await updateDoc(doc(db, "orders", client_reference_id), {
               stripeData: { ...event.data.object },
               contact: { ...customer_details },
               orderStatus: "Pending order confirmation",
               paymentStatus: payment_status,
               shippingStatus: "Pending order confirmation",
               status: "Pending order confirmation",
               shipping,
            });

            const submitOrderResult = await fetch(
               `${
                  process.env.NODE_ENV === "development"
                     ? "http://localhost:3000"
                     : "https://icepakhockey.com"
               }/api/orders/${client_reference_id}`,
               { method: "POST" }
            );

            return res.status(200).send({ message: "Payment success! Submitting order..." });
         }
      } else if (event.type === "payment_intent.payment_failed") {
         console.log(`❌ Payment failed: ${dataObject.last_payment_error?.message}`);

         if (client_reference_id) {
            await updateDoc(doc(db, "orders", client_reference_id), {
               stripeData: { ...event.data.object },
               paymentStatus: payment_status,
               status,
            });

            return res.status(202).send("Updated order status.");
         }
      } else if (event.type === "charge.succeeded") {
         if (dataObject.payment_intent) {
            const paymentIntent = await stripe.paymentIntents.retrieve(dataObject.payment_intent);

            const session = await stripe.checkout.sessions.list({
               payment_intent: dataObject.payment_intent,
            });

            await updateDoc(doc(db, "orders", session.data[0].client_reference_id), {
               receiptUrl: paymentIntent.data.receipt_url,
            });
         }
      } else {
         console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
         if (client_reference_id) {
            await updateDoc(doc(db, "orders", client_reference_id), {
               stripeData: { ...event.data.object },
               status,
            });

            return res.status(202).send("Updated order status.");
         }
      }

      res.json({ received: true });
   } catch (error) {
      return res.status(400).send({ status: 400, message: error });
   }
};

export default stripeWebhookHandler;
