import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config";

const playerStatusHandler = async (req, res) => {
   const { gameId, playerId, fullName, jerseyNumber, position, seasonStatus, gameStatus } =
      req.body.data;

   const gameResult = await getDoc(doc(db, "games", gameId));

   const currentGameRoster = gameResult.data().roster;
   const currentFullRoster = gameResult.data().fullRoster;

   const isPlayerRostered = currentGameRoster.includes(playerId);

   const fullRosterPlayerIndex = currentFullRoster.findIndex(
      (player) => player.playerId === playerId
   );

   const updatedFullRoster = currentFullRoster;

   updatedFullRoster[fullRosterPlayerIndex] = {
      playerId,
      fullName,
      jerseyNumber,
      position,
      gameStatus,
      seasonStatus,
   };

   if (gameStatus === "in") {
      if (isPlayerRostered) {
         return res.status(200).json({ message: "Player already rostered." });
      }

      try {
         await updateDoc(doc(db, "games", gameId), {
            roster: [...currentGameRoster, playerId],
            fullRoster: updatedFullRoster,
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
            fullRoster: updatedFullRoster,
         });

         return res.status(200).json({ message: "Player successfully scratched." });
      } catch (error) {
         console.log("error", error);
         return res.status(400).send(error);
      }
   }
};

export default playerStatusHandler;
