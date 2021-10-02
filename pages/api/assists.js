import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config";

const assistsHandler = async(req, res) => {
   const result = await getDocs(collection(db, "assists"));

   let assists = [];

   result.forEach((doc) => {
      assists.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(assists);
}


export default assistsHandler;
