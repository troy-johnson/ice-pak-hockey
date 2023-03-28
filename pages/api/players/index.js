import { prisma } from "../../../config";

const playersHandler = async (req, res) => {
   try {
      const players = await prisma.players.findMany();

      return res.status(200).json(players);  
   } catch (error) {
      console.log(error)
      return res.status(400).json(error); 
   }
};

export default playersHandler;
