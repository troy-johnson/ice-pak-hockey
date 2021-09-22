import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config";

const goalsHandler = async(req, res) => {
   const result = await getDocs(collection(db, "goals"));

   let goals = [];

   result.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(goals);
}


export default goalsHandler;
