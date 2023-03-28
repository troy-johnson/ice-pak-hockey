import { prisma } from "../../../config";

const seasonScheduleHandler = async (req, res) => {
   switch (req.method) {
      case "GET":
         const { id } = req.query;

         try {
            return res.status(200).send();
         } catch (error) {
            return res.status(400).send(error);
         }
      case "POST":
         try {
            return res.status(200).json();
         } catch (error) {
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            return res.status(200).json();
         } catch (error) {
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default seasonScheduleHandler;
