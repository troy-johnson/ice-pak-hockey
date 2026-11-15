import { prisma } from "../../../config";
import { getApiUser, playerForUser } from "../../../utils/apiAuth";

const playersHandler = async (req, res) => {
   try {
      const user = await getApiUser(req);
      const players = await prisma.players.findMany();

      return res.status(200).json(players.map((player) => playerForUser(user, player)));
   } catch (error) {
      console.log(error)
      return res.status(400).json(error); 
   }
};

export default playersHandler;
