import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, prisma } from "../../../config";

const stateCodeToFullName = (code) => {
   const data = {
      AZ: "Arizona",
      AL: "Alabama",
      AK: "Alaska",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DC: "District of Columbia",
      DE: "Delaware",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
      AS: "American Samoa",
      GU: "Guam",
      MP: "Northern Mariana Islands",
      PR: "Puerto Rico",
      VI: "U.S. Virgin Islands",
      UM: "U.S. Minor Outlying Islands",
   };
   return data[code] ?? code;
};

const ordersHandler = async (req, res) => {
   const { id } = req.query;

   switch (req.method) {
      case "GET":
         try {
            // const orderResult = await getDoc(doc(db, "orders", id));

            const orderResult = await prisma.orders.findUnique({
               where: {
                  id
               }
            })

            const orderData = orderResult.data();

            return res.status(200).send(orderData);
         } catch (error) {
            return res.status(400).send("Order ID not found!");
         }

         break;
      case "POST":
         const orderResult = await getDoc(doc(db, "orders", id));

         const orderData = orderResult.data();

         try {
            const headers = new Headers();
            headers.append(
               "Authorization",
               `Basic ${Buffer.from(process.env.PRINTFUL_API_KEY).toString("base64")}`
            );

            console.log("body", {
               external_id: orderData.referenceId,
               recipient: {
                  name: orderData.shipping.name,
                  address1: orderData.shipping.address.line1,
                  address2: orderData.shipping.address.line2,
                  city: orderData.shipping.address.city,
                  state_code: orderData.shipping.address.state,
                  state_name: stateCodeToFullName(orderData.shipping.address.state),
                  country_code: "US",
                  country_name: "United States",
                  zip: Number(orderData.shipping.address.postal_code),
                  phone: orderData.contact.phone,
                  email: orderData.contact.email ?? orderData?.user?.email,
               },
               items: orderData.orderedItems.map((item) => {
                  return {
                     id: item.id,
                     external_id: item.externalId,
                     variant_id: item.variantId,
                     sync_variant_id: item.syncVariantId,
                     external_variant_id: item.externalVariantId,
                     warehouse_product_variant_id: item.warehouseProductVariantId,
                     quantity: item.quantity,
                     price: item.price,
                     retail_price: item.retailPrice,
                     name: item.name,
                     product: item.product,
                     files: item.files,
                     options: item.options,
                     sku: item.sku,
                  };
               }),
            });

            const threadColors = ["#FFFFFF", "#96A1A8", "#333366", "#3399FF"];

            const result = await fetch("https://api.printful.com/orders", {
               method: "POST",
               headers: headers,
               redirect: "follow",
               "Content-Type": "application/json",
               body: JSON.stringify({
                  external_id: orderData.referenceId,
                  recipient: {
                     name: orderData.shipping.name,
                     address1: orderData.shipping.address.line1,
                     address2: orderData.shipping.address.line2,
                     city: orderData.shipping.address.city,
                     state_code: orderData.shipping.address.state,
                     state_name: stateCodeToFullName(orderData.shipping.address.state),
                     country_code: "US",
                     country_name: "United States",
                     zip: Number(orderData.shipping.address.postal_code),
                     phone: orderData.contact.phone,
                     email: orderData.contact.email ?? orderData?.user?.email,
                  },
                  items: orderData.orderedItems.map((item) => {
                     return {
                        id: item.id,
                        external_id: item.externalId,
                        variant_id: item.variantId,
                        sync_variant_id: item.syncVariantId,
                        external_variant_id: item.externalVariantId,
                        warehouse_product_variant_id: item.warehouseProductVariantId,
                        quantity: item.quantity,
                        price: item.price,
                        retail_price: item.retailPrice,
                        name: item.name,
                        product: item.product,
                        files: item.files,
                        options:
                           item.name.includes("Hat") || item.name.includes("Toque")
                              ? item.options.map((option) => {
                                   if (option.id === "thread_colors") {
                                      return {
                                         id: option.id,
                                         value: threadColors,
                                      };
                                   }
                                   return option;
                                })
                              : item.options,
                        sku: item.sku,
                     };
                  }),
               }),
            });

            const data = await result.json();

            if (data.code === 200) {
               await updateDoc(doc(db, "orders", orderData.referenceId), {
                  orderStatus: "Pending order confirmation",
                  shippingStatus: "Pending order confirmation",
                  status: "Pending order confirmation",
                  costBreakdown: data.result.costs,
               });

               const confirmResult = await fetch(
                  `https://api.printful.com/orders/${data.result.id}/confirm`,
                  {
                     method: "POST",
                     headers: headers,
                     redirect: "follow",
                     "Content-Type": "application/json",
                  }
               );

               const confirmData = await confirmResult.json();

               console.log("order confirmation data", confirmData);

               if (confirmData.code === 200) {
                  await updateDoc(doc(db, "orders", orderData.referenceId), {
                     orderStatus: "Order confirmed",
                     shippingStatus: "Waiting for fulfillment",
                     status: "Order confirmed",
                     costBreakdown: data.result.costs,
                  });
               }
            } else {
               return res.status(data.code).json({ data });
            }
         } catch (error) {
            console.log("BOOOOOO ORDER ERROR", error);
            return res.status(400).send(error);
         }

      default:
         break;
   }
};

export default ordersHandler;
