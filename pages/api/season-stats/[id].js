import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config";

const seasonStatsHandler = async (req, res) => {
   const { id } = req.query;

   // console.log("id", id);

   switch (req.method) {
      case "GET":
         try {
            let stats = [];
            let goals = [];
            let games = [];
            let penalties = [];
            let players = [];

            const playerResult = await getDocs(collection(db, "players"));

            const seasonResult = await getDoc(doc(db, "seasons", id));
            const seasonData = seasonResult?.data();

            if (!seasonData.games) {
               seasonData.statBypass.forEach((player) => stats.push(player));
               return res
                  .status(200)
                  .json({
                     ...seasonData,
                     seasonName: `${seasonData.leagueName} ${seasonData.name} ${seasonData.type}`,
                     stats,
                  });
            }

            let gameBatches = [
               seasonData?.games.slice(0, 9),
               seasonData?.games.slice(10, 19),
               seasonData?.games.slice(20, 29),
            ];

            const goalBatchOne = await getDocs(
               query(collection(db, "goals"), where("gameId", "in", gameBatches[0]))
            );

            const gameBatchOne = await getDocs(
               query(collection(db, "games"), where(documentId(), "in", gameBatches[0]))
            );

            const penaltyBatchOne = await getDocs(
               query(collection(db, "penalties"), where("gameId", "in", gameBatches[0]))
            );

            let goalBatchTwo;
            let gameBatchTwo;
            let penaltyBatchTwo;

            if (gameBatches[1].length >= 1) {
               goalBatchTwo = await getDocs(
                  query(collection(db, "goals"), where("gameId", "in", gameBatches[1]))
               );
            }

            if (gameBatches[1].length >= 1) {
               gameBatchTwo = await getDocs(
                  query(collection(db, "games"), where(documentId(), "in", gameBatches[1]))
               );
            }

            if (gameBatches[1].length >= 1) {
               penaltyBatchTwo = await getDocs(
                  query(collection(db, "penalties"), where("gameId", "in", gameBatches[1]))
               );
            }

            let goalBatchThree;
            let gameBatchThree;
            let penaltyBatchThree;

            if (gameBatches[2].length >= 1) {
               goalBatchThree = await getDocs(
                  query(collection(db, "goals"), where("gameId", "in", gameBatches[2]))
               );
            }

            if (gameBatches[2].length >= 1) {
               gameBatchThree = await getDocs(
                  query(collection(db, "games"), where(documentId(), "in", gameBatches[2]))
               );
            }

            if (gameBatches[2].length >= 1) {
               penaltyBatchThree = await getDocs(
                  query(collection(db, "penalties"), where("gameId", "in", gameBatches[2]))
               );
            }

            playerResult?.forEach((player) =>
               players.push({ playerId: player.id, ...player.data() })
            );

            goalBatchOne?.forEach((goal) => {
               goals.push({ goalId: goal.id, ...goal.data() });
            });

            goalBatchTwo?.forEach((goal) => {
               goals.push({ goalId: goal.id, ...goal.data() });
            });

            goalBatchThree?.forEach((goal) => {
               goals.push({ goalId: goal.id, ...goal.data() });
            });

            gameBatchOne?.forEach((game) => {
               games.push({ gameId: game.id, ...game.data() });
            });

            gameBatchTwo?.forEach((game) => {
               games.push({ gameId: game.id, ...game.data() });
            });

            gameBatchThree?.forEach((game) => {
               games.push({ gameId: game.id, ...game.data() });
            });

            penaltyBatchOne?.forEach((penalty) => {
               penalties.push({ penaltyId: penalty.id, ...penalty.data() });
            });

            penaltyBatchTwo?.forEach((penalty) => {
               penalties.push({ penaltyId: penalty.id, ...penalty.data() });
            });

            penaltyBatchThree?.forEach((penalty) => {
               penalties.push({ penaltyId: penalty.id, ...penalty.data() });
            });

            let seasonRoster = players?.filter((player) => {
               if (games.find((game) => game?.roster?.includes(player.playerId))) {
                  return player;
               }
            });

            seasonRoster?.forEach((player) =>
               stats.push({
                  playerId: player.playerId,
                  firstName: player.firstName,
                  lastName: player.lastName,
                  nickname: player.nickname,
                  position: player.position,
                  shoots: player.shoots,
                  fullName: `${player.firstName} ${player.lastName}`,
                  image: player.image,
                  googleAvatarLink: player.googleAvatarLink,
                  jerseyNumber: player.jerseyNumber ?? player.number ,
                  goals: goals.filter((goal) => goal.playerId === player.playerId).length,
                  assists: goals.filter((goal) => goal?.assists?.includes(player.playerId)).length,
                  points:
                     goals.filter((goal) => goal.playerId === player.playerId).length +
                     goals.filter((goal) => goal?.assists?.includes(player.playerId)).length,
                  gamesPlayed: games.filter((game) => game?.roster?.includes(player.playerId))
                     .length,
                  penaltyMinutes: penalties?.reduce((sum, currentValue) => {
                     if (currentValue?.playerId === player.playerId) {
                        return sum + parseFloat(currentValue?.minutes);
                     }
                     return sum;
                  }, 0),
               })
            );

            // console.log("games", games.length);

            const seasonStats = {
               ...seasonData,
               seasonName: `${seasonData.leagueName} ${seasonData.name} ${seasonData.type}`,
               stats,
            };

            if (seasonStats) {
               return res.status(200).json(seasonStats);
            }

            return res.status(200).send("Game not found!");
         } catch (error) {
            // console.log("error", error);
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default seasonStatsHandler;
