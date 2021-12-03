import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config";
import twilio from "twilio";

const textClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const printfulWebhookHandler = async (req, res) => {
   try {
      const { type, data } = req.body;

      console.log("event type", type)

      const orderResult = await getDoc(doc(db, "orders", data.order.external_id));

      const orderData = orderResult.data();

      if (type === "package_shipped") {
         await updateDoc(doc(db, "orders", data.order.external_id), {
            shippingStatus: "Package shipped",
            status: "Package shipped",
            shippingData: data.shipment,
            packingSlip: data.order.packing_slip,
         });

         await textClient.messages.create({
            from: "(714) 519-2916",
            to: orderData.contact.phone,
            body: `Ice Pak Hockey \n\n Order #${data.order.external_id} has shipped! \n\n Track your shipment: ${data.shipment.tracking_url} \n\n View your order: https://icepakhockey.com/order-status/${data.order.external_id} \n\n Thanks for shopping at the Ice Pak Hockey store! \n\n Need help? Text or email Troy at (801) 913-4614 or troy.johnson57@gmail.com `,
         });
      }
   } catch (error) {
      return res.status(400).send({ status: 400, message: error });
   }
};

export default printfulWebhookHandler;
