import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../config";

const penaltyHandler = async (req, res) => {
   const { id } = req.query;

   switch (req.method) {
      case "GET":
         // console.log("id", id);

         try {
            const result = await getDoc(doc(db, "penalties", id));

            const penalty = { ...result.data() };

            if (penalty) {
               return res.status(200).json(penalty);
            }

            return res.status(200).send("Penalty not found!");
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "PUT":
         try {
            await setDoc(doc(db, "penalties", id), {
               ...req.body,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            await deleteDoc(doc(db, "penalties", id), {
               ...req.body,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default penaltyHandler;
