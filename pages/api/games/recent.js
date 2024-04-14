import { prisma } from "../../../config";

const recentGamesHandler = async (req, res) => {
   switch (req.method) {
      case "GET":
         try {
            const gamesData = await prisma.games.findMany({
               orderBy: {
                  date: "desc",
               },
               take: 4,
               select: {
                  id: true,
                  date: true,
                  opponentId: true,
                  goals: {
                     select: {
                        id: true,
                        team: true,
                        teamId: true,
                     },
                  },
                  teams: {
                     select: {
                        id: true,
                        teamName: true,
                        logo: true,
                     },
                  },
               },
            });

            const games = gamesData
               .sort((a, b) => new Date(a.date) - new Date(b.date))
               .map((game) => {
                  return {
                     id: game.id,
                     date: game.date,
                     opponent: game.teams,
                     opponentGoals: game.goals.filter((goal) => goal.teamId === game.teams.id)
                        .length,
                     icePakGoals: game.goals.filter((goal) => goal.teamId !== game.teams.id).length,
                  };
               });

            if (games) {
               return res.status(200).json(games);
            }
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
   }
};

export default recentGamesHandler;
