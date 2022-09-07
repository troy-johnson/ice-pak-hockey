import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config";
import dayjs from "dayjs";

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
            let seasons = [];

            const playerResult = await getDocs(collection(db, "players"));
            const seasonsResult = await getDocs(collection(db, "seasons"));

            seasonsResult.forEach((doc) => seasons.push({ ...doc.data(), firebaseId: doc.id }));

            const seasonData = seasons.filter((season) => season.id == id)[0];

            if (!seasonData.games && seasonData.statBypass) {
               console.log("seasonData");
               seasonData.statBypass.forEach((player) => stats.push(player));
               return res.status(200).json({
                  ...seasonData,
                  seasonName: `${seasonData.leagueName} ${seasonData.name} ${seasonData.type}`,
                  stats,
               });
            }

            // console.log("seasonData", seasonData)

            let gameBatches = [
               seasonData?.games.slice(0, 10),
               seasonData?.games.slice(10, 20),
               seasonData?.games.slice(20, 30),
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

            console.log("gameBatches", gameBatches);

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
               players.push({ ...player.data(), firebaseId: player.id })
            );

            goalBatchOne?.forEach((goal) => {
               goals.push({ ...goal.data(), firebaseId: goal.id });
            });

            goalBatchTwo?.forEach((goal) => {
               goals.push({ ...goal.data(), firebaseId: goal.id });
            });

            goalBatchThree?.forEach((goal) => {
               goals.push({ ...goal.data(), firebaseId: goal.id });
            });

            gameBatchOne?.forEach((game) => {
               games.push({ ...game.data(), firebaseId: game.id });
            });

            gameBatchTwo?.forEach((game) => {
               games.push({ ...game.data(), firebaseId: game.id });
            });

            gameBatchThree?.forEach((game) => {
               games.push({ ...game.data(), firebaseId: game.id });
            });

            penaltyBatchOne?.forEach((penalty) => {
               penalties.push({ ...penalty.data(), firebaseId: penalty.id });
            });

            penaltyBatchTwo?.forEach((penalty) => {
               penalties.push({ ...penalty.data(), firebaseId: penalty.id });
            });

            penaltyBatchThree?.forEach((penalty) => {
               penalties.push({ ...penalty.data(), firebaseId: penalty.id });
            });

            let seasonRoster = players?.filter((player) => {
               if (games.find((game) => game?.roster?.includes(player.firebaseId))) {
                  return player;
               }
            });

            seasonRoster
               ?.filter((player) => player.id !== 12)
               .forEach((player) =>
                  stats.push({
                     pgPlayerId: player.id,
                     playerId: player.playerId,
                     firstName: player.firstName,
                     lastName: player.lastName,
                     nickname: player.nickname,
                     position: player.position,
                     shoots: player.shoots,
                     fullName: `${player.firstName} ${player.lastName}`,
                     image: player.image,
                     authProviderImage: player.authProviderImage,
                     jerseyNumber: player.jerseyNumber ?? player.number,
                     goals: goals.filter((goal) => goal.pgPlayerId === player.id).length,
                     assists: goals.filter((goal) => goal?.pgAssists?.includes(player.id)).length,
                     points:
                        goals.filter((goal) => goal.pgPlayerId === player.id).length +
                        goals.filter((goal) => goal?.pgAssists?.includes(player.id)).length,
                     gamesPlayed: games.filter(
                        (game) =>
                           game?.pgRoster?.includes(player.id) &&
                           dayjs().isAfter(dayjs.unix(game.date.seconds))
                     ).length,
                     penaltyMinutes: penalties?.reduce((sum, currentValue) => {
                        if (currentValue?.pgPlayerId === player.id) {
                           return sum + parseFloat(currentValue?.minutes);
                        }
                        return sum;
                     }, 0),
                  })
               );

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
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default seasonStatsHandler;
