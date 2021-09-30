import { collection, getDocs } from "firebase/firestore";
import {Client} from "@googlemaps/google-maps-services-js";
import { db } from "../../config";

const locationsHandler = async(req, res) => {
   const result = await getDocs(collection(db, "locations"));

   let locations = [];

   result.forEach((doc) => {
      locations.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(locations);
}

export default locationsHandler;
