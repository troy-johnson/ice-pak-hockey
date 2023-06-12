import dayjs from "dayjs";
import { prisma } from "../../../config";

// export const config = {
//    runtime: "edge",
// };

const playerStatsHandler = async (req, res) => {
   switch (req.method) {
      case "GET":
         const { id } = req.query;

         // console.log("id", id);

         try {
            const playerData = await prisma.players.findUnique({
               where: {
                  id,
               },
               select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  hometown: true,
                  image: true,
                  nickname: true,
                  number: true,
                  phoneNumber: true,
                  position: true,
                  roles: true,
                  auth0AccountId: true,
                  born: true,
                  favoriteNhlTeam: true,
                  favoritePlayer: true,
                  gameDayNotifications: true,
                  jerseySize: true,
                  preferredEmail: true,
                  preferredJerseyNumber: true,
                  preferredPhone: true,
                  tShirtSize: true,
                  handedness: true,
                  height: true,
                  notifications: true,
                  jerseyNumber: true,
                  penalties: {
                     select: {
                        id: true,
                        gameId: true,
                        penaltyType: true,
                        minutes: true,
                        games: {
                           select: {
                              seasonId: true,
                           },
                        },
                     },
                  },
               },
            });

            const goalsData = await prisma.goals.findMany({
               where: {
                  OR: [
                     {
                        playerId: id,
                     },
                     {
                        assists: { array_contains: id },
                     },
                  ],
               },
               select: {
                  gameId: true,
                  playerId: true,
                  teamId: true,
                  id: true,
                  assists: true,
                  games: {
                     select: {
                        seasons: true,
                     },
                  },
               },
            });

            const gamesData = await prisma.games.findMany({
               where: {
                  roster: { array_contains: id },
               },
               select: {
                  id: true,
                  date: true,
                  roster: true,
                  teams: true,
                  seasonId: true,
                  seasons: true,
               },
            });

            const seasonsData = await prisma.seasons.findMany({
               select: {
                  id: true,
                  leagueName: true,
                  name: true,
                  type: true,
                  games: true,
                  endDate: true,
               },
            });

            // console.log("player stats", { playerData, goalsData, gamesData });

            const seasonYear = (season) => season?.name.split(" ")[1];

            const seasonStats = seasonsData
               ?.sort((a, b) => dayjs(b.endDate) - dayjs(a.endDate))
               ?.map((season) => {
                  return {
                     assists: goalsData.filter(
                        (goal) =>
                           goal?.games?.seasons?.id === season.id && goal?.assists?.includes(id)
                     )?.length,
                     gamesPlayed: gamesData.filter(
                        (game) =>
                           game.roster?.includes(id) &&
                           game.seasonId === season.id &&
                           dayjs().isAfter(dayjs(game.date))
                     )?.length,
                     goals: goalsData.filter(
                        (goal) => goal?.games?.seasons?.id === season.id && goal.playerId === id
                     )?.length,
                     id: season.id,
                     leagueName: season.leagueName,
                     name: season.name,
                     penaltyMinutes: playerData?.penalties
                        ?.filter((penalty) => penalty?.games?.seasonId === season.id)
                        ?.reduce((sum, currentValue) => sum + parseFloat(currentValue.minutes), 0),
                     shortYear: `${season?.name.split(" ")[0]} ${
                        seasonYear(season)?.includes("-")
                           ? seasonYear(season).slice(2, 4) + "-" + seasonYear(season).slice(6 - 8)
                           : seasonYear(season)
                     }`,
                     type: season.type,
                  };
               });

            const gameLog = gamesData
               .sort((a, b) => dayjs(b.date) - dayjs(a.date))
               .filter(game => dayjs().isAfter(dayjs(game.date)))
               .map((game) => {
                  return {
                     date: game.date,
                     opponentName: game.teams.teamName,
                     goals: goalsData.filter(
                        (goal) => goal.gameId === game.id && goal.playerId === id
                     ).length,
                     assists: goalsData.filter(
                        (goal) => goal.gameId === game.id && goal?.assists?.includes(id)
                     ).length,
                     penaltyMinutes: playerData?.penalties
                        .filter((penalty) => penalty.gameId === game.id)
                        ?.reduce((sum, currentValue) => sum + parseFloat(currentValue.minutes), 0),
                  };
               });

            const careerStats = {
               gamesPlayed: gamesData.length,
               goals: goalsData.filter((goal) => goal.playerId === id).length,
               assists: goalsData.filter((goal) => goal?.assists?.includes(id)).length,
               penaltyMinutes: playerData?.penalties?.reduce((sum, currentValue) => {
                  return sum + parseFloat(currentValue.minutes);
               }, 0),
            };

            const finalResult = {
               player: playerData,
               careerStats,
               seasonStats,
               gameLog,
            };

            console.log("finalResult", finalResult);

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
