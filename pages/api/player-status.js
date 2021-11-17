import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config";

const playerStatusHandler = async (req, res) => {
   const { playerId, gameId, status } = req.body.data;

   // console.log("req.body", req.body)

   const gameResult = await getDoc(doc(db, "games", gameId));

   // if (gameResult.exists()) {
   //    console.log("Document data:", gameResult.data());
   //  } else {
   //    // doc.data() will be undefined in this case
   //    console.log("No such document!");
   //  }

   const currentGameRoster = gameResult.data().roster;

   console.log("cGR", currentGameRoster);

   const isPlayerRostered = currentGameRoster.includes(playerId);

   if (status === "in") {
      if (isPlayerRostered) {
         return res.status(200).json({ message: "Player already rostered." });
      }

      try {
         await updateDoc(doc(db, "games", gameId), {
            roster: [...currentGameRoster, playerId],
         });

         return res.status(200).json({ message: "Player successfully rostered." });
      } catch (error) {
         console.log("error", error);
         return res.status(400).send(error);
      }
   } else {
      if (!isPlayerRostered) {
         return res.status(200).json({ message: "Player already scratched." });
      }

      try {
         await updateDoc(doc(db, "games", gameId), {
            roster: currentGameRoster.filter((el) => el !== playerId),
         });

         return res.status(200).json({ message: "Player successfully scratched." });
      } catch (error) {
         console.log("error", error);
         return res.status(400).send(error);
      }
   }
};

export default playerStatusHandler;
