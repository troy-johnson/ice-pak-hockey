import { prisma } from "../../../config";

const goalHandler = async (req, res) => {
   const { id } = req.query;

   switch (req.method) {
      case "GET":
         // console.log("id", id);

         try {
            const goal = prisma.goals.findUnique({ where: { id } });

            return res.status(200).json(goal);
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "PUT":
         const { assists, gameId, period, playerId, team, teamId, time, ytLink } = req.body;

         try {
            await prisma.goals.update({
               where: { id },
               data: { assists, gameId, period, playerId, team, teamId, time, ytLink },
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            console.log("id", id)

            await prisma.goals.delete({
               where: { id },
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default goalHandler;
