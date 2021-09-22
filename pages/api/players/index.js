import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const playersHandler = async (req, res) => {
   const result = await getDocs(collection(db, "players"));

   // if (result.length) {
   let players = [];

   result.forEach((doc) => {
      players.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(players);
   // }

   // return res.status(400).json(result);
};

export default playersHandler;
