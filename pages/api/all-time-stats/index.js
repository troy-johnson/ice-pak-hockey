import { db, prisma } from "../../../config";
import dayjs from "dayjs";

const allTimeStatsHandler = async (req, res) => {
   const { id } = req.query;

   switch (req.method) {
      case "GET":
         try {
            let stats = [];
            let allAssists = [];
            // let seasonRoster = new Set();
            // let seasonGames = new Set();

            // const seasons = await prisma.games.findMany({
            //    select: {
            //       id: true,
            //       date: true,
            //       roster: true,
            //       goals: true,
            //    },
            // });

            // console.log('seasons', seasons)

            const allGoals = await prisma.goals.findMany({
               select: {
                  id: true,
                  playerId: true,
                  assists: true,
               },
            });

            const allPlayers = await prisma.players.findMany({
               where: {
                  NOT: {
                     id: "6aca0d5e-2896-4ea7-b42c-9d683ff8adce",
                  },
                  // AND: {
                  //    id: { in: Array.from(seasonRoster) },
                  // },
               },
               select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  nickname: true,
                  number: true,
                  image: true,
                  penalties: {
                     select: {
                        minutes: true,
                        id: true,
                        penaltyType: true,
                        period: true,
                        time: true,
                        ytLink: true,
                        playerId: true,
                        gameId: true,
                     },
                  },
               },
            });

            const allGames = await prisma.games.findMany({
               select: {
                  id: true,
                  roster: true
            }});

            allPlayers.forEach((player) => {
               const goals = allGoals.filter((goal) => goal.playerId === player.id).length;
               const assists = allGoals.filter((goal) => goal.assists.includes(player.id)).length;

               stats.push({
                  id: player.id,
                  firstName: player.firstName,
                  lastName: player.lastName,
                  fullName: `${player.firstName} ${player.lastName}`,
                  image: player.image,
                  authProviderImage: player.authProviderImage,
                  jerseyNumber: player.jerseyNumber ?? player.number,
                  goals,
                  assists,
                  points: goals + assists,
                  pointsPerGame: Number(((goals + assists) / allGames.filter((game) => game.roster.includes(player.id)).length).toFixed(2)),
                  gamesPlayed: allGames.filter((game) => game.roster.includes(player.id)).length,
                  penaltyMinutes: player?.penalties?.reduce((sum, currentValue) => {
                     if (currentValue?.playerId === player.id) {
                        return sum + parseFloat(currentValue?.minutes);
                     }
                     return sum;
                  }, 0),
               });
            });

            const leaderStats = (stat) => {
               return stats?.sort((a, b) => {
                  if (b[stat] === a[stat]) {
                     return b.points - a.points;
                  }
                  return b[stat] - a[stat];
               })[0];
            };

            const leaders = {
               gamesPlayed: leaderStats("gamesPlayed"),
               goals: leaderStats("goals"),
               assists: leaderStats("assists"),
               points: leaderStats("points"),
               penaltyMinutes: leaderStats("penaltyMinutes"),
               pointsPerGame: leaderStats("pointsPerGame"),
            };

            return res.status(200).send({ leaders, stats });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default allTimeStatsHandler;
