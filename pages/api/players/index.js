import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const playersHandler = async(req, res) => {
   const querySnapshot = await getDocs(collection(db, "players"));

   let currentRoster = [];

   querySnapshot.forEach((doc) => {
      currentRoster.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(currentRoster);
}


export default playersHandler;
