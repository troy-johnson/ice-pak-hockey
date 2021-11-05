import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config";

const dataMigrationHandler = async (req, res) => {
   // const data = {};

   // const result = await updateDoc(doc(db, "seasons", "6venNqR7kd9VB0qFf9UM"), {
   //    statBypass: data,
   // });

   return res.status(418).json({message: "This route is not available."});
};

export default dataMigrationHandler;
