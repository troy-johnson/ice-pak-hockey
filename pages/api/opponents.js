import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config";

const opponentsHandler = async(req, res) => {
   const result = await getDocs(collection(db, "opponents"));

   let opponents = [];

   result.forEach((doc) => {
      opponents.push({ firebaseId: doc.id, ...doc.data() });
   });

   return res.status(200).json(opponents);
}


export default opponentsHandler;
