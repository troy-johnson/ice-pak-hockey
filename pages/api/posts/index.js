import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const postsHandler = async (req, res) => {
   const result = await getDocs(collection(db, "posts"));

   let posts = [];

   result.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
   });

   return res.status(200).json(posts);
};

export default postsHandler;
