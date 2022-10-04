import { prisma } from "../../../config";

const seasonHandler = async(req, res) => {
   try {
      const seasons = prisma.seasons.findMany();
      
      return res.status(200).json(seasons);
   } catch (error) {
      return res.status(400).json(error);
   }
}


export default seasonHandler;
