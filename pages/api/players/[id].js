import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db, prisma } from "../../../config";

const playerHandler = async (req, res) => {
   // console.log("req", { method: req.method, body: req.body });
   switch (req.method) {
      case "GET":
         const { id } = req.query;

         try {
            const profile = prisma.players.findUnique({ where: { id } });

            return res.status(200).json(profile);
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
      case "PUT":
         try {
            // console.log("req.body", req.body);
            await setDoc(doc(db, "players", req.body.id), {
               ...req.body,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
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

export default playerHandler;
