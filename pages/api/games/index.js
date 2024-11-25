import { prisma } from "../../../config";

const gamesHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            const createGame = await prisma.games.create({
               data: {
                  ...req.body,
               },
            });

            await prisma.seasons.update({
               where: { id: req.body.seasonId },
               data: {
                  games: {
                     push: createGame.id,
                  },
               },
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            return res.status(400).send(error);
         }
      case "GET":
         try {
            const gamesData = await prisma.games.findMany({
               select: {
                  id: true,
                  date: true,
                  locationId: true,
                  seasonId: true,
                  opponentId: true,
                  roster: true,
                  goals: {
                     select: {
                        id: true,
                        team: true,
                        teamId: true,
                        gameId: true,
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

            const teamsData = await prisma.teams.findMany({
               select: {
                  id: true,
                  logo: true,
                  teamName: true,
               },
            });

            const gameInfo = {
               gamesData,
               teamsData,
            };

            if (gameInfo) {
               return res.status(200).json(gameInfo);
            }
         } catch (error) {
            return res.status(400).send(error);
         }
   }
};

export default gamesHandler;
