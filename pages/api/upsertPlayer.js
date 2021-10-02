import { collection, doc, addDoc, setDoc } from "firebase/firestore";
import { db } from "../../config";

const upsertPlayerHandler = async (req, res) => {
   let id = req.body.playerId;

   const {
      draftDate,
      email,
      firstName,
      homeTown,
      image,
      jerseyNumber,
      lastName,
      nickname,
      phoneNumber,
      position,
      roles,
      shoots,
   } = req.body;

   switch (req.method) {
      case "POST":
         const addResult = await addDoc(collection(db, "players"), {
            draftDate: draftDate || "",
            email,
            firstName,
            homeTown: homeTown || "",
            image: image || "",
            jerseyNumber,
            lastName,
            nickname: nickname || "",
            phoneNumber: phoneNumber || "",
            position,
            roles: roles || [],
            shoots,
         });

         return res.status(200).json(addResult);

      case "PUT":
         const updateResult = await setDoc(doc(db, "players", id), {
            draftDate,
            email,
            firstName,
            homeTown: homeTown || "",
            image: image || "",
            jerseyNumber,
            lastName,
            nickname: nickname || "",
            phoneNumber,
            position,
            roles: roles || [],
            shoots,
         });

         return res.status(200).json(updateResult);
   }
};

export default upsertPlayerHandler;
