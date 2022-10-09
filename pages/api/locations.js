import { prisma } from "../../config";

const locationsHandler = async (req, res) => {
   try {
      const locations = await prisma.locations.findMany()

      return res.status(200).json(locations);  
   } catch (error) {
      return res.status(400).json(error);  
   }
};

export default locationsHandler;
