import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const playerHandler = async(req, res) => {
   const querySnapshot = await getDocs(collection(db, "players"));

   

   return res.status(200).json(player);
}


export default playerHandler;
