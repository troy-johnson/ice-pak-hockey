import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const goalsHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            await addDoc(collection(db, "goals"), {
               ...req.body,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "GET":
         const result = await getDocs(collection(db, "goals"));

         let goals = [];

         result.forEach((doc) => {
            goals.push({ id: doc.id, ...doc.data() });
         });

         return res.status(200).json(goals);
   }
};

export default goalsHandler;
