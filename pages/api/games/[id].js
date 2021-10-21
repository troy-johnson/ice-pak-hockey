import {
   collection,
   deleteDoc,
   doc,
   documentId,
   getDoc,
   getDocs,
   query,
   setDoc,
   updateDoc,
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

            if (gameData?.roster?.length >= 1) {
               const goalsResult = await getDocs(
                  query(collection(db, "goals"), where("gameId", "==", id))
               );

               const penaltiesResult = await getDocs(
                  query(collection(db, "penalties"), where("gameId", "==", id))
               );

               let playerBatches = [gameData?.roster.slice(0, 10), gameData?.roster.slice(10, 20)];

               const batchResultOne = await getDocs(
                  query(collection(db, "players"), where(documentId(), "in", playerBatches[0]))
               );

               let batchResultTwo;

               if (playerBatches[1].length >= 1) {
                  batchResultTwo = await getDocs(
                     query(collection(db, "players"), where(documentId(), "in", playerBatches[1]))
                  );
               }

               batchResultOne?.forEach((player) => {
                  roster.push({
                     playerId: player?.id,
                     image: player?.data()?.image,
                     playerName: `${player?.data()?.firstName}${
                        player?.data()?.nickname ? ` "${player?.data()?.nickname}" ` : " "
                     }${player?.data()?.lastName}`,
                     playerJerseyNumber: player?.data()?.jerseyNumber,
                     position: player?.data()?.position
                  });
               });

               batchResultTwo?.forEach((player) => {
                  roster.push({
                     playerId: player?.id,
                     image: player?.data()?.image,
                     playerName: `${player?.data()?.firstName}${
                        player?.data()?.nickname ? ` "${player?.data()?.nickname}" ` : " "
                     }${player?.data()?.lastName}`,
                     playerJerseyNumber: player?.data()?.jerseyNumber,
                     position: player?.data()?.position
                  });
               });

               penaltiesResult?.forEach((penalty) => {
                  penalties.push({
                     ...penalty.data(),
                     penaltyId: penalty.id,
                     opponentName: penalty.data().opponentId ? opponentData?.teamName : undefined,
                     playerName: roster?.filter(
                        (player) => player?.playerId === penalty.data().playerId
                     )?.[0]?.playerName,
                     playerJerseyNumber: roster.filter(
                        (player) => player.playerId === penalty.data().playerId
                     )?.[0]?.jerseyNumber,
                     playerImage: roster.filter(
                        (player) => player.playerId === penalty.data().playerId
                     )?.[0]?.image,
                  });
               });

               goalsResult?.forEach((goal) => {
                  let assists = [];

                  goal.data().assists?.forEach((assist) => {
                     assists.push({
                        playerId: assist,
                        playerName: roster.filter((player) => player.playerId === assist)[0]
                           ?.playerName,
                        playerJerseyNumber: roster.filter((player) => player.playerId === assist)[0]
                           ?.jerseyNumber,
                        playerImage: roster.filter((player) => player.playerId === assist)[0]
                           ?.image,
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
            }

            const gameInfo = {
               ...gameData,
               gameId: gameResult.id,
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
            await updateDoc(doc(db, "games", id), {
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
