import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const penaltiesHandler = async(req, res) => {
   const result = await getDocs(collection(db, "penalties"));

   let penalties = [];

   result.forEach((doc) => {
      penalties.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(penalties);
}


export default penaltiesHandler;
