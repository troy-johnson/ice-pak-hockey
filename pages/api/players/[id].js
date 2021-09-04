import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config";

const playerHandler = async (req, res) => {
   const { id } = req.query;

   console.log("api id", id);

   const querySnapshot = await getDoc(doc(db, "players", id));

   return res.status(200).json(querySnapshot.data());
};

export default playerHandler;
