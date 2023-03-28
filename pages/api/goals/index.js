import { prisma } from "../../../config";

const goalsHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         const { assists, gameId, period, playerId, team, teamId, time, ytLink } = req.body;

         try {
            await prisma.goals.create({
               data: {
                  assists,
                  gameId,
                  period,
                  playerId,
                  team,
                  teamId,
                  time,
                  ytLink,
               },
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "GET":
         const goalData = await prisma.goals.findMany();
         const rosterData = await prisma.players.findMany();

         const newGoals = goalData.map((goal) => {
            let newAssists = [];

            goal.assists.forEach((assist) =>
               newAssists.push({
                  playerId: rosterData.filter((player) => player.id === assist)[0].id,
                  firstName: rosterData.filter((player) => player.id === assist)[0].firstName,
                  lastName: rosterData.filter((player) => player.id === assist)[0].lastName,
                  nickname: rosterData.filter((player) => player.id === assist)[0].nickname,
                  jerseyNumber: rosterData.filter((player) => player.id === assist)[0].jerseyNumber,
               })
            );

            return {
               ...goal,
               assists: newAssists,
            };
         });

         return res.status(200).json(newGoals);
   }
};

export default goalsHandler;
