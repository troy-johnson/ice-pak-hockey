import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config";

const gamesHandler = async(req, res) => {
   const querySnapshot = await getDocs(collection(db, "games"));

   let currentGames = [];

   querySnapshot.forEach((doc) => {
      currentGames.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(currentGames);
}


export default gamesHandler;
