import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const gamesHandler = async (req, res) => {
   const result = await getDocs(collection(db, "games"));

   let games = [];

   result.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(games);
};

export default gamesHandler;
