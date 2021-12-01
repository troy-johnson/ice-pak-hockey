import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const ordersHandler = async (req, res) => {
   const { id } = req.query;

   console.log("request body", { id, body: req.body });
};

export default ordersHandler;
