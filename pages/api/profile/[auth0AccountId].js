import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config";

const profileHandler = async (req, res) => {
   const { auth0AccountId } = req.query;

   const result = await getDocs(
      query(collection(db, "players"), where("auth0AccountId", "==", auth0AccountId))
   );

   let profile = [];
   
   result.forEach(el => {
      profile.push({
         id: el.data,
         ...el.data()
      })     
   })

   return res.status(200).json(profile[0]);
};

export default profileHandler;
