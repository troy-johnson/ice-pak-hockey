import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const penaltiesHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            await setDoc(doc(collection(db, "penalties")), {
               ...req.body,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "GET":
         const result = await getDocs(collection(db, "penalties"));

         let penalties = [];

         result.forEach((doc) => {
            penalties.push({ id: doc.id, ...doc.data() });
         });

         return res.status(200).json(penalties);
   }
};

export default penaltiesHandler;
