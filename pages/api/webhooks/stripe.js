import { buffer } from "micro";
import Stripe from "stripe";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
   apiVersion: "2020-08-27",
});

const endpointSecret = "whsec_NKCtywOBX8mUjrbXwq0e6n5pwsI9KVvC";
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

   const dataObject = event.data.object;

   const { client_reference_id, customer_details, payment_status, shipping, status } = dataObject;

   if (event.type === "checkout.session.completed") {
      console.log(`💰 PaymentIntent status: ${dataObject.status}`);

      console.log("paymentIntent", event.data);

      if (client_reference_id) {
         await updateDoc(doc(db, "orders", client_reference_id), {
            stripeData: { ...event.data.object },
            contact: { ...customer_details },
            orderStatus: "pending order confirmation",
            paymentStatus: payment_status,
            shippingStatus: "pending order confirmation",
            status: "pending order confirmation",
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
   }
   // else if (event.type === "payment_intent.created") {
   //    console.log("pi created", event.data);

   //    const sessionData = await stripe.checkout.sessions.list({
   //       payment_intent: event.data.order.external_id,
   //    });

   //    const orderResult = await getDoc(doc(db, "orders", sessionData.data[0].client_reference_id));

   //    const orderData = orderResult.data();

   //    console.log("sessionData", sessionData);

   //    stripe.paymentIntents.update(event.data.id, {
   //       receipt_email: orderData.contact.email ?? user.email,
   //    });
   // }
   else {
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
};

export default stripeWebhookHandler;
