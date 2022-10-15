import { prisma } from "../../../config";

const recordsHandler = async (req, res) => {
   try {
      const games = await prisma.games.findMany({});
      const players = await prisma.players.findMany({});
      const goals = await prisma.goals.findMany({});
      const penaltyMinutes = await prisma.penalties.groupBy({
         by: ["playerId"],
         _sum: {
            minutes: true,
         },
         orderBy: {
            _count: {
               playerId: "desc",
            },
         },
      });

      const statList = players.map((player) => {
         return {
            id: player.id,
            gamesPlayed: games.filter((game) => game.roster.includes(player.id)).length,
            goals: goals.filter((goal) => goal.playerId === player.id)?.length,
            assists: goals.filter((goal) => goal?.assists.includes(player.id))?.length,
            points:
               goals.filter((goal) => goal.playerId === player.id)?.length +
               goals.filter((goal) => goal?.assists.includes(player.id))?.length,
            pointsPerGame:
               (goals.filter((goal) => goal.playerId === player.id)?.length +
                  goals.filter((goal) => goal?.assists.includes(player.id))?.length) /
               games.filter((game) => game.roster.includes(player.id)).length,
            penaltyMinutes: penaltyMinutes.filter((penalty) => penalty.playerId === player.id)?.[0]
               ?._sum?.minutes,
            firstName: players.filter((res) => res.id === player.id)?.[0]?.firstName,
            nickname: players.filter(res => res.id === player.id)?.[0]?.nickname,
            lastName: players.filter((res) => res.id === player.id)?.[0]?.lastName,
         };
      });

      console.log("goals", { statList });

      return res.status(200).json(statList);
   } catch (error) {
      console.log(error);
      return res.status(400).json(error);
   }
};

export default recordsHandler;
