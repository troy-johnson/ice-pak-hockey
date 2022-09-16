import { collection, addDoc, getDoc, getDocs, setDoc, Timestamp, doc } from "firebase/firestore";
import { db } from "../../../config";

const gamesHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            const result = await addDoc(collection(db, "games"), {
               ...req.body,
               date: Timestamp.fromDate(new Date(req.body.date))
            });

            const seasonData = await getDoc(doc(db, "seasons", req.body.seasonId));

            await setDoc(doc(db, 'seasons', req.body.seasonId), { games: [...seasonData.data().games, result.id] }, { merge: true });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            // console.log("error", error);
            return res.status(400).send(error);
         }
      case "GET":
         const result = await getDocs(collection(db, "games"));

         let games = [];
      
         result.forEach((doc) => {
            games.push({ ...doc.data(), firebaseId: doc.id });
         });
      
         return res.status(200).json(games);
   }
};

export default gamesHandler;
