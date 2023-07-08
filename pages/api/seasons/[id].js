import { prisma } from "../../../config";

const seasonsHandler = async (req, res) => {
   const { id } = req.query;

   console.log("id", id)

   switch (req.method) {
      case "GET":
         try {
            const season = await prisma.seasons.findUnique({ where: { id } });

            return res.status(200).send(season);
         } catch (error) {
            return res.status(400).send(error);
         }
      case "PUT":
         try {
            await prisma.seasons.update({
               where: { id },
               data: {
                  ...req.body,
               },
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            await prisma.seasons.delete({
               where: {
                  id,
               },
            });

            return res.status(200).json({ message: `Season ${id} deleted`});
         } catch (error) {
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default seasonsHandler;
