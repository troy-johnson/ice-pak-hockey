import dayjs from "dayjs";
import { prisma } from "../../../config";

const playerStatsHandler = async (req, res) => {
   switch (req.method) {
      case "GET":
         const { id } = req.query;

         console.log("id", id);

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

            console.log("player stats", { playerData, goalsData, gamesData });

            // let seasonData = [];

            // seasonResult.forEach((season) =>
            //    seasonData.push({ seasonId: season.id, ...season.data() })
            // );

            // let goalData = [];

            // goalsResult.forEach((goal) => goalData.push({ goalId: goal.id, ...goal.data() }));

            // let penaltyData = [];

            // penaltiesResult.forEach((penalty) =>
            //    penaltyData.push({ penaltyId: penalty.id, ...penalty.data() })
            // );

            // // let gamesData = [];

            // gamesResult.forEach((game) => gamesData.push({ gameId: game.id, ...game.data() }));

            // let careerGoals = goalData?.filter((goal) => goal.playerId === id);
            // let careerAssists = goalData?.filter((goal) => goal?.assists?.includes(id));
            // let careerPenalties = penaltyData.filter((penalty) => penalty.playerId === id);

            // let opponentsData = [];

            // opponentsResult.forEach((opponent) =>
            //    opponentsData.push({ opponentId: opponent.id, ...opponent.data() })
            // );

            // const seasonYear = (season) => season?.name.split(" ")[1];

            // const seasonBypassStats = seasonData?.filter((season) => !!season.statBypass);

            // // console.log("seasonBypassStats", seasonBypassStats);

            // let seasonStats = seasonData
            //    .sort((a, b) => dayjs.unix(b.endDate.seconds) - dayjs.unix(a.endDate.seconds))
            //    .map((season) => {
            //       return {
            //          ...season,
            //          shortYear: `${season?.name.split(" ")[0]} ${
            //             seasonYear(season).includes("-")
            //                ? seasonYear(season).slice(2, 4) + "-" + seasonYear(season).slice(6 - 8)
            //                : seasonYear(season)
            //          }`,
            //          gamesPlayed:
            //             gamesData.filter(
            //                (game) =>
            //                   game.seasonId === season.seasonId &&
            //                   game?.roster?.includes(id) &&
            //                   dayjs().isAfter(dayjs.unix(game.date.seconds))
            //             ).length +
            //             (seasonBypassStats
            //                ?.filter(
            //                   (seasonBypass) => seasonBypass.seasonId === season.seasonId
            //                )?.[0]
            //                ?.statBypass?.filter((player) => player.playerId === id)?.[0]
            //                ?.gamesPlayed ?? 0),
            //          goals:
            //             careerGoals.filter((goal) => season?.games?.includes(goal.gameId)).length +
            //             (seasonBypassStats
            //                ?.filter(
            //                   (seasonBypass) => seasonBypass.seasonId === season.seasonId
            //                )?.[0]
            //                ?.statBypass?.filter((player) => player.playerId === id)?.[0]?.goals ??
            //                0),
            //          assists:
            //             careerAssists.filter((goal) => season?.games?.includes(goal.gameId))
            //                .length +
            //             (seasonBypassStats
            //                ?.filter(
            //                   (seasonBypass) => seasonBypass.seasonId === season.seasonId
            //                )?.[0]
            //                ?.statBypass?.filter((player) => player.playerId === id)?.[0]?.assists ??
            //                0),
            //          penaltyMinutes:
            //             careerPenalties
            //                .filter((penalty) => season?.games?.includes(penalty.gameId))
            //                ?.reduce(
            //                   (sum, currentValue) => sum + parseFloat(currentValue.minutes),
            //                   0
            //                ) +
            //             (seasonBypassStats
            //                ?.filter(
            //                   (seasonBypass) => seasonBypass.seasonId === season.seasonId
            //                )?.[0]
            //                ?.statBypass?.filter((player) => player.playerId === id)?.[0]
            //                ?.penaltyMinutes ?? 0),
            //       };
            //    });

            const gameLog = gamesData
               .sort((a, b) => dayjs(b.date) - dayjs(a.date))
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

            console.log("gameLog", gameLog);

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
               seasonStats: [],
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
