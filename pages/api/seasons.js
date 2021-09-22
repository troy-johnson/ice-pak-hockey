import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config";

const seasonsHandler = async(req, res) => {
   const result = await getDocs(collection(db, "seasons"));

   let seasons = [];

   result.forEach((doc) => {
      seasons.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(seasons);
}


export default seasonsHandler;
