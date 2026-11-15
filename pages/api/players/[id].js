import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db, prisma } from "../../../config";
import { getApiUser, isOwnPlayer, isStaff } from "../../../utils/apiAuth";

const playerHandler = async (req, res) => {
   // console.log("req", { method: req.method, body: req.body });
   if (req.method !== "GET") {
      const user = await getApiUser(req);

      if (!user) return res.status(401).json({ message: "Sign in required." });

      // Players can edit their own row. All other writes are for staff.
      const ownEdit =
         req.method === "PUT" &&
         !!req.body?.id &&
         isOwnPlayer(
            user,
            await prisma.players.findUnique({
               where: { id: req.body.id },
               select: { email: true, auth0AccountId: true },
            })
         );

      if (!isStaff(user) && !ownEdit) return res.status(403).json({ message: "Not allowed." });
   }

   switch (req.method) {
      case "GET":
         const { id } = req.query;

         try {
            const profile = prisma.players.findUnique({ where: { id } });

            return res.status(200).json(profile);
         } catch (error) {
            return res.status(400).send(error);
         }
      case "POST":
         try {
            await setDoc(doc(db, "players", req.body.id), {
               email: req.body.email,
               firstName: req.body.firstName,
               jerseyNumber: req.body.jerseyNumber,
               lastName: req.body.lastName,
               phoneNumber: req.body.phoneNumber,
               position: req.body.position,
               roles: req.body.roles,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            return res.status(400).send(error);
         }
      case "PUT":
         try {
            // console.log("req.body", req.body);
            await setDoc(doc(db, "players", req.body.id), {
               ...req.body,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            await deleteDoc(doc(db, "players", req.body.id));

            return res.status(200).json();
         } catch (error) {
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default playerHandler;
