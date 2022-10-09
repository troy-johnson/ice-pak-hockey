import { prisma } from "../../config";

const leaguesHandler = async(req, res) => {
   try {
      const leagues = await prisma.leagues.findMany();

      return res.status(200).json(leagues);
   } catch (error) {
      return res.status(400).send(error)
   }
}


export default leaguesHandler;
