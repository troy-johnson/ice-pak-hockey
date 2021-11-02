import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../../../config";

const playerStatsHandler = async (req, res) => {
   switch (req.method) {
      case "GET":
         const { id } = req.query;

         try {
            const playerResult = await getDoc(doc(db, "players", id));
            const playerData = playerResult.data();

            const seasonResult = await getDocs(collection(db, "seasons"));
            const gamesResult = await getDocs(collection(db, "games"));
            const goalsResult = await getDocs(collection(db, "goals"));
            const penaltiesResult = await getDocs(collection(db, "penalties"));

            let seasonData = [];

            seasonResult.forEach((season) =>
               seasonData.push({ seasonId: season.id, ...season.data() })
            );

            let goalData = [];

            goalsResult.forEach((goal) => goalData.push({ goalId: goal.id, ...goal.data() }));

            let penaltyData = [];

            penaltiesResult.forEach((penalty) =>
               penaltyData.push({ penaltyId: penalty.id, ...penalty.data() })
            );

            let gamesData = [];

            gamesResult.forEach((game) => gamesData.push({ gameId: game.id, ...game.data() }));

            let careerGoals = goalData?.filter((goal) => goal.playerId === id);
            let careerAssists = goalData?.filter((goal) => goal?.assists?.includes(id));
            let careerPenalties = penaltyData.filter((penalty) => penalty.playerId === id);

            const seasonYear = (season) => season?.name.split(" ")[1];

            let seasonStats = seasonData
               .sort((a, b) => dayjs.unix(b.endDate.seconds) - dayjs.unix(a.endDate.seconds))
               .map((season) => {
                  return {
                     ...season,
                     shortYear: `${season?.name.split(" ")[0]} ${
                        seasonYear(season).includes("-")
                           ? seasonYear(season).slice(2, 4) + "-" + seasonYear(season).slice(6 - 8)
                           : seasonYear(season)
                     }`,
                     gamesPlayed: gamesData.filter(
                        (game) => game.seasonId === season.seasonId && game?.roster?.includes(id)
                     ).length,
                     goals: careerGoals.filter((goal) => season?.games?.includes(goal.gameId))
                        .length,
                     assists: careerAssists.filter((goal) => season?.games?.includes(goal.gameId))
                        .length,
                     penaltyMinutes: careerPenalties
                        .filter((penalty) => season?.games?.includes(penalty.gameId))
                        ?.reduce((sum, currentValue) => sum + parseFloat(currentValue.minutes), 0),
                  };
               });

            const gameLog = gamesData
               .sort((a, b) => dayjs.unix(b.date.seconds) - dayjs.unix(a.date.seconds))
               .filter((game) => game.roster.includes(id))
               .map((game) => {
                  return {
                     date: game.date,
                     opponentName: game.opponentName,
                     goals: careerGoals.filter((goal) => goal.gameId === game.gameId).length,
                     assists: careerGoals.filter(
                        (goal) => goal?.assists?.includes(id) && goal.gameId === game.gameId
                     ).length,
                     penaltyMinutes: careerPenalties
                        .filter(
                           (penalty) => penalty.gameId === game.gameId && penalty.playerId === id
                        )
                        ?.reduce((sum, currentValue) => sum + parseFloat(currentValue.minutes), 0),
                  };
               });

            const careerStats = {
               gamesPlayed: seasonStats?.reduce((sum, currentValue) => {
                  return sum + currentValue.gamesPlayed;
               }, 0),
               goals: seasonStats?.reduce((sum, currentValue) => {
                  return sum + currentValue.goals;
               }, 0),
               assists: seasonStats?.reduce((sum, currentValue) => {
                  return sum + currentValue.assists;
               }, 0),
               penaltyMinutes: seasonStats?.reduce((sum, currentValue) => {
                  return sum + parseFloat(currentValue.penaltyMinutes);
               }, 0),
            };

            let finalResult = {
               player: playerData,
               careerStats,
               seasonStats,
               gameLog,
            };

            return res.status(200).json(finalResult);
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default playerStatsHandler;