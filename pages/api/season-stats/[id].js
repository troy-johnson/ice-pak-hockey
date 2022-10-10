import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, prisma } from "../../../config";
import dayjs from "dayjs";

const seasonStatsHandler = async (req, res) => {
   const { id } = req.query;
   console.log("id", id);

   switch (req.method) {
      case "GET":
         try {
            let stats = [];
            let allAssists = [];
            let seasonRoster = new Set();
            let seasonGames = new Set();

            const season = await prisma.games.findMany({
               where: { seasonId: id },
               select: {
                  id: true,
                  date: true,
                  roster: true,
                  goals: true,
               },
            });

            season.forEach((game) => {
               seasonGames.add(game.id);
               game.roster.forEach((playerId) => seasonRoster.add(playerId));
               game.goals.forEach((goal) =>
                  goal.assists.forEach((playerId) => allAssists.push(playerId))
               );
            });

            const allPlayers = await prisma.players.findMany({
               where: {
                  NOT: {
                     id: "6aca0d5e-2896-4ea7-b42c-9d683ff8adce",
                  },
                  AND: {
                     id: { in: Array.from(seasonRoster) },
                  },
               },
               select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  nickname: true,
                  number: true,
                  image: true,
                  goals: {
                     where: {
                        gameId: { in: Array.from(seasonGames) },
                     },
                     select: {
                        period: true,
                        time: true,
                        ytLink: true,
                        assists: true,
                        id: true,
                        playerId: true,
                        gameId: true,
                     },
                  },
                  penalties: {
                     where: {
                        gameId: { in: Array.from(seasonGames) },
                     },
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

            console.log("season", { allAssists });

            if (!season?.games && season?.statBypass) {
               season.statBypass.forEach((player) => stats.push(player));
               return res.status(200).json({
                  ...season,
                  seasonName: `${season.leagueName} ${season.name} ${season.type}`,
                  stats,
               });
            }

            allPlayers.forEach((player) => {
               stats.push({
                  playerId: player.playerId,
                  firstName: player.firstName,
                  lastName: player.lastName,
                  fullName: `${player.firstName} ${player.lastName}`,
                  image: player.image,
                  authProviderImage: player.authProviderImage,
                  jerseyNumber: player.jerseyNumber ?? player.number,
                  goals: player?.goals?.length,
                  assists: allAssists.filter((playerId) => playerId === player.id).length,
                  points:
                     player?.goals?.length +
                     allAssists.filter((playerId) => playerId === player.id).length,
                  gamesPlayed: season.filter(
                     (game) =>
                        game?.roster?.includes(player.id) && dayjs().isAfter(dayjs(game.date))
                  ).length,
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

export default seasonStatsHandler;
