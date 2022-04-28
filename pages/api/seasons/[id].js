import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../config";

const seasonsHandler = async (req, res) => {
   // console.log("req", { method: req.method, body: req.body });
   switch (req.method) {
      case "GET":
         const { id } = req.query;

         try {
            const result = await getDoc(db, "seasons", id);

            if (result.exists()) {
               return res.status(200).json(result.data());
            }

            return res.status(200).send("Player not found!");
         } catch (error) {
            return res.status(400).send(error);
         }
      case "POST":
         try {
            await setDoc(doc(db, "seasons", req.body.id), {
               endDate: req.body.endDate,
               games: req.body.games,
               leagueId: req.body.leagueId,
               leagueName: req.body.leagueName,
               name: req.body.name,
               roster: req.body.roster,
               roles: req.body.roles,
               standings: req.body.standings,
               standingsLink: req.body.standingsLink,
               startDate: req.body.startDate,
               type: req.body.type
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            return res.status(400).send(error);
         }
      case "PUT":
         try {
            // console.log("req.body", req.body);
            await setDoc(doc(db, "seasons", req.body.id), {
               ...req.body,
            });

            return res.status(200).json({ ...req.body });
         } catch (error) {
            console.log("error", error);
            return res.status(400).send(error);
         }
      case "DELETE":
         try {
            await deleteDoc(doc(db, "seasons", req.body.id));

            return res.status(200).json();
         } catch (error) {
            return res.status(400).send(error);
         }
      default:
         break;
   }
};

export default seasonsHandler;
