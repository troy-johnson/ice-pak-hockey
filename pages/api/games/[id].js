import { getSession } from "next-auth/react";
import { prisma } from "../../../config";

const gameHandler = async (req, res) => {
   const session = await getSession({ req });

   const { id } = req.query;

   switch (req.method) {
      case "GET":
         try {
            const gameData = await prisma.games.findUnique({
               where: {
                  id,
               },
               select: {
                  date: true,
                  embedLink: true,
                  video: true,
                  roster: true,
                  locationId: true,
                  seasonId: true,
                  opponentId: true,
                  goals: {
                     select: {
                        period: true,
                        team: true,
                        time: true,
                        ytLink: true,
                        assists: true,
                        teamId: true,
                        playerId: true,
                        gameId: true,
                        players: {
                           select: {
                              firstName: true,
                              lastName: true,
                              nickname: true,
                              number: true,
                              jerseyNumber: true,
                           },
                        },
                        teams: {
                           select: {
                              teamName: true,
                           },
                        },
                     },
                  },
                  penalties: {
                     select: {
                        minutes: true,
                        team: true,
                        gameId: true,
                        teamId: true,
                        playerId: true,
                        penaltyType: true,
                        period: true,
                        time: true,
                        ytLink: true,
                        players: {
                           select: {
                              firstName: true,
                              lastName: true,
                              nickname: true,
                              number: true,
                              jerseyNumber: true,
                           },
                        },
                        teams: {
                           select: {
                              teamName: true,
                           },
                        },
                     },
                  },
                  teams: {
                     select: {
                        id: true,
                        logo: true,
                        teamName: true,
                     },
                  },
                  seasons: {
                     select: {
                        leagueName: true,
                        type: true,
                        name: true,
                     },
                  },
                  locations: {
                     select: {
                        name: true,
                        code: true,
                        googleMapsLink: true,
                     },
                  },
               },
            });

            const rosterData = await prisma.players.findMany({
               where: {
                  id: { in: gameData.roster },
               },
               select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  nickname: true,
                  number: true,
                  jerseyNumber: true,
                  position: true,
               },
            });

            const icePakData = await prisma.teams.findUnique({
               where: {
                  id: "3683b632-c5c3-4e97-a7d4-6002a72839e1",
               },
               select: {
                  id: true,
                  logo: true,
                  teamName: true,
               },
            });

            const newRoster = gameData.roster.map((rosterPlayer) => {
               return {
                  firstName: rosterData.filter((player) => player.id === rosterPlayer)[0].firstName,
                  lastName: rosterData.filter((player) => player.id === rosterPlayer)[0].lastName,
                  nickname: rosterData.filter((player) => player.id === rosterPlayer)[0].nickname,
                  jerseyNumber: rosterData.filter((player) => player.id === rosterPlayer)[0]
                     .jerseyNumber,
                  goals: gameData.goals.filter((goal) => goal.playerId === rosterPlayer).length,
                  assists: gameData.goals.filter((goal) => goal.assists?.includes(rosterPlayer))
                     .length,
                  penaltyMinutes: gameData.penalties
                     .filter((penalty) => penalty.playerId === rosterPlayer)
                     .reduce((sum, currentValue) => {
                        if (currentValue?.playerId === rosterPlayer) {
                           return sum + parseFloat(currentValue?.minutes);
                        }
                        return sum;
                     }, 0),
               };
            });

            const newGoals = gameData.goals.map((goal) => {
               let newAssists = [];

               goal.assists.forEach((assist) =>
                  newAssists.push({
                     firstName: rosterData.filter((player) => player.id === assist)[0].firstName,
                     lastName: rosterData.filter((player) => player.id === assist)[0].lastName,
                     nickname: rosterData.filter((player) => player.id === assist)[0].nickname,
                     jerseyNumber: rosterData.filter((player) => player.id === assist)[0]
                        .jerseyNumber,
                  })
               );

               return {
                  ...goal,
                  assists: newAssists,
               };
            });

            // console.log("gameData", gameData);
            // console.log("rosterData", { rosterData, length: rosterData.length });

            const gameInfo = {
               ...gameData,
               gameId: gameData.id,
               locationName: gameData.locations.name,
               seasonName: `${gameData.seasons.leagueName} ${gameData.seasons.name} ${gameData.seasons.type}`,
               goals: newGoals,
               roster: newRoster,
               teams: [
                  {
                     id: gameData.teams.id,
                     logo: gameData.teams.logo,
                     teamName: gameData.teams.teamName,
                  },
                  icePakData,
               ],
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
            await prisma.games.update({
               where: {
                  id: id,
               },
               data: {
                  ...req.body,
               },
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            await prisma.games.delete({
               where: {
                  id: id,
               },
            });

            return res.status(200).json();
         } catch (error) {
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default gameHandler;
