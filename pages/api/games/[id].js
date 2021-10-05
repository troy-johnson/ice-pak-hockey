import {
   collection,
   deleteDoc,
   doc,
   documentId,
   getDoc,
   getDocs,
   query,
   setDoc,
   where,
} from "firebase/firestore";
import { db } from "../../../config";

const gameHandler = async (req, res) => {
   const { id } = req.query;

   switch (req.method) {
      case "GET":
         try {
            const gameResult = await getDoc(doc(db, "games", id));
            const gameData = gameResult.data();

            const locationResult = await getDoc(doc(db, "locations", gameData?.locationId));
            const locationData = locationResult?.data();

            const seasonResult = await getDoc(doc(db, "seasons", gameData?.seasonId));
            const seasonData = seasonResult?.data();

            const opponentResult = await getDoc(doc(db, "opponents", gameData?.opponentId));
            const opponentData = opponentResult?.data();

            let roster = [];
            let goals = [];
            let penalties = [];

            if (gameData?.roster.length >= 1) {
               const goalsResult = await getDocs(
                  query(collection(db, "goals"), where("gameId", "==", id))
               );

               const penaltiesResult = await getDocs(
                  query(collection(db, "penalties"), where("gameId", "==", id))
               );

               const playersResult = await getDocs(
                  query(collection(db, "players"), where(documentId(), "in", gameData?.roster))
               );

               playersResult?.forEach((player) =>
                  roster.push({
                     playerName: `${player.data().firstName} ${
                        player.data().nickname
                           ? `"${player.data().nickname}" ${player.data().lastName}`
                           : player.data().lastName
                     }`,
                     jerseyNumber: player.data().jerseyNumber,
                     image: player.data().image,
                     playerId: player.id,
                  })
               );

               goalsResult?.forEach((goal) => {
                  let assists = [];

                  goal.data().assists?.forEach((assist) => {
                     assists.push({
                        playerId: assist,
                        playerName: roster.filter((player) => player.playerId === assist)[0]
                           .playerName,
                        playerJerseyNumber: roster.filter((player) => player.playerId === assist)[0]
                           .jerseyNumber,
                        playerImage: roster.filter((player) => player.playerId === assist)[0].image,
                     });
                  });

                  goals.push({
                     ...goal.data(),
                     assists,
                     goalId: goal.id,
                     playerName: roster.filter(
                        (player) => player.playerId === goal.data().playerId
                     )?.[0]?.playerName,
                     playerJerseyNumber: roster.filter(
                        (player) => player.playerId === goal.data().playerId
                     )?.[0]?.jerseyNumber,
                     playerImage: roster.filter(
                        (player) => player.playerId === goal.data().playerId
                     )?.[0]?.image,
                  });
               });

               penaltiesResult?.forEach((penalty) => {
                  penalties.push({
                     ...penalty.data(),
                     playerName: roster.filter(
                        (player) => player.playerId === penalty.data().playerId
                     )[0].playerName,
                     playerJerseyNumber: roster.filter(
                        (player) => player.playerId === penalty.data().playerId
                     )[0].jerseyNumber,
                     playerImage: roster.filter(
                        (player) => player.playerId === penalty.data().playerId
                     )[0].image,
                  });
               });
            }

            const gameInfo = {
               ...gameData,
               locationName: locationData.name,
               opponentName: opponentData.teamName,
               seasonName: `${seasonData.leagueName} ${seasonData.name}`,
               penalties,
               goals,
               roster,
            };

            if (gameInfo) {
               return res.status(200).json(gameInfo);
            }

            return res.status(200).send("Game not found!");
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "PUT":
         try {
            await setDoc(doc(db, "games", id), {
               ...req.body,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            await deleteDoc(doc(db, "games", id));

            return res.status(200).json();
         } catch (error) {
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default gameHandler;
