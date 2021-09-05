import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const playersHandler = async (req, res) => {
   const result = await getDocs(collection(db, "asf"));

   console.log("querySnapshot", result);

   // if (result.length) {
   let currentRoster = [];

   result.forEach((doc) => {
      currentRoster.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(currentRoster);
   // }

   // return res.status(400).json(result);
};

export default playersHandler;
