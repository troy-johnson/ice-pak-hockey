import { prisma } from "../../../config";

const penaltyHandler = async (req, res) => {
   const { id } = req.query;

   console.log("id", id);

   switch (req.method) {
      case "GET":
         try {
            const penalty = prisma.penalties.findUnique({ where: { id } });

            return res.status(200).json(penalty);
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "PUT":
         const { minutes, team, penaltyType, period, time, ytLink, teamId, gameId, playerId } =
            req.body;

         try {
            await prisma.penalties.update({
               where: { id },
               data: {
                  minutes,
                  team,
                  penaltyType,
                  period,
                  time,
                  ytLink,
                  teamId,
                  gameId,
                  playerId,
               },
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            await prisma.penalties.delete({
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

export default penaltyHandler;
