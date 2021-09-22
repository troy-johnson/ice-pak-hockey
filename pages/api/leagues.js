import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config";

const leaguesHandler = async(req, res) => {
   const result = await getDocs(collection(db, "leagues"));

   let leagues = [];

   result.forEach((doc) => {
      leagues.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(leagues);
}


export default leaguesHandler;
