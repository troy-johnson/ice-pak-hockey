import { getDocs, collection } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../../../config";

const gameDayNotificationHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         const gameResult = await getDocs(collection(db, "games"));
         const playerResult = await getDocs(collection(db, "players"));

         let games = [];
         let players = [];

         gameResult.forEach((doc) => {
            games.push({ id: doc.id, ...doc.data() });
         });

         playerResult.forEach((doc) => {
            players.push({ id: doc.id, ...doc.data() });
         });

         const gameDay = games.map(
            (game) => dayjs.unix(game.date.seconds).diff(dayjs(), "hour")
         );

         console.log("gameDay", gameDay)

         return res.status(200).json(gameDay);

      // try {
      //    const result = await getDoc(doc(db, "penalties", id));

      //    const penalty = { ...result.data() };

      //    if (penalty) {
      //       return res.status(200).json(penalty);
      //    }

      //    return res.status(200).send("Penalty not found!");
      // } catch (error) {
      //    console.log("error", error);
      //    return res.status(400).send(error);
      // }
      default:
         break;
   }
};

export default gameDayNotificationHandler;
