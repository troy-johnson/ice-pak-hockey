import { collection, getDocs } from "firebase/firestore";
// import { Client } from "@googlemaps/google-maps-services-js";
import { db } from "../../config";

const locationsHandler = async (req, res) => {
   const result = await getDocs(collection(db, "locations"));
   let results = [];
   // let locations = [];

   result.forEach((doc) => {
      results.push({ ...doc.data(), id: doc.id });
   });

   // TODO: Decide if location images are necessary
   // await Promise.all(
   //    results.map(async (location) => {

   //       const client = new Client({});

   //       await client
   //          .placePhoto({
   //             params: {
   //                maxheight: "300",
   //                maxwidth: "760",
   //                photoreference: location?.googlePhotoReference,
   //                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
   //             },
   //          })
   //          .then((res) => {
   //             locations.push({
   //                ...location,
   //                image: res.data.toString("base64"),
   //             });
   //          })
   //          .catch((err) => {
   //             console.log("error obtaining image");
   //             locations.push({
   //                ...location,
   //                image: null,
   //             });
   //          });
   //    })
   // );

   return res.status(200).json(results);
};

export default locationsHandler;
