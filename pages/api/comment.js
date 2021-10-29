import { getClient } from "../../utils/sanity";

const commentHandler = async (req, res) => {
   const { _id, approved, name, email, comment } = req.body;

   // console.log("comment data", { _id, name, email, comment })

   try {
      // console.log("submitting...")

      await getClient(true).create({
         _type: "comment",
         approved, 
         post: {
            _type: "reference",
            _ref: _id,
         },
         name,
         email,
         comment,
      });
   } catch (err) {
      console.error("Error: ", err);
      return res.status(500).json({ message: `Couldn't submit comment`, err });
   }
   return res.status(200).json({ message: "Comment submitted" });
};

export default commentHandler;
