import { prisma } from "../../config";

const teamsHandler = async(req, res) => {
   try {
      const teams = await prisma.teams.findMany();

      return res.status(200).json(teams);
   } catch (error) {
      return res.status(400).json(error);
   }
}


export default teamsHandler;
