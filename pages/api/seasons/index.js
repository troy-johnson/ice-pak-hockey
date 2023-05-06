import { prisma } from "../../../config";

const seasonHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            await prisma.seasons.create({
               data: {
                  ...req.body,
               },
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            return res.status(400).send(error);
         }
      case "GET":
         try {
            const seasonsData = await prisma.seasons.findMany();

            if (seasonsData) {
               return res.status(200).json(seasonsData);
            }
         } catch (error) {
            return res.status(400).send(error);
         }
   }
};

export default seasonHandler;
