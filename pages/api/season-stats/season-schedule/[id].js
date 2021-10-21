import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../config";

const seasonScheduleHandler = async (req, res) => {
   switch (req.method) {
      case "GET":
         const { id } = req.query;

         try {
            const result = await getDoc(db, "players", id);

            if (result.exists()) {
               return res.status(200).json(req.data());
            }

            return res.status(200).send("Player not found!");
         } catch (error) {
            return res.status(400).send(error);
         }
      case "POST":
         try {
            await setDoc(doc(db, "players", req.body.id), {
               email: req.body.email,
               firstName: req.body.firstName,
               jerseyNumber: req.body.jerseyNumber,
               lastName: req.body.lastName,
               phoneNumber: req.body.phoneNumber,
               position: req.body.position,
               roles: req.body.roles,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            await deleteDoc(doc(db, "players", req.body.id));

            return res.status(200).json();
         } catch (error) {
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default seasonScheduleHandler;
