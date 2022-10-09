import { prisma } from "../../../config";

const penaltiesHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         const {
            minutes,
            team,
            penaltyType,
            period,
            time,
            ytLink,
            teamId,
            gameId,
            playerId,
            firebaseGameId,
            firebaseId,
            firebasePlayerId,
         } = req.body;

         try {
            await prisma.penalties.create({
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
                  firebaseGameId,
                  firebaseId,
                  firebasePlayerId,
               },
            });

            console.log("penalty body", req.body);

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "GET":
         try {
            const penaltyData = await prisma.penalties.findMany();

            return res.status(200).json(penaltyData);
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
   }
};

export default penaltiesHandler;
