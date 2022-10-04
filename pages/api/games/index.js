import { collection, addDoc, getDoc, getDocs, setDoc, Timestamp, doc } from "firebase/firestore";
import { db, prisma } from "../../../config";

const gamesHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            const result = await addDoc(collection(db, "games"), {
               ...req.body,
               date: Timestamp.fromDate(new Date(req.body.date)),
            });

            const seasonData = await getDoc(doc(db, "seasons", req.body.seasonId));

            await setDoc(
               doc(db, "seasons", req.body.seasonId),
               { games: [...seasonData.data().games, result.id] },
               { merge: true }
            );

            return res.status(200).json({ ...req.body });
         } catch (error) {
            // console.log("error", error);
            return res.status(400).send(error);
         }
      case "GET":
         try {
            const gamesData = await prisma.games.findMany({
               select: {
                  id: true,
                  date: true,
                  locationId: true,
                  seasonId: true,
                  opponentId: true,
                  goals: {
                     select: {
                        id: true,
                        team: true,
                        teamId: true,
                        gameId: true,
                        teams: {
                           select: {
                              teamName: true,
                           },
                        },
                     },
                  },
                  teams: {
                     select: {
                        id: true,
                        teamName: true,
                     },
                  },
                  seasons: {
                     select: {
                        leagueName: true,
                        type: true,
                        name: true,
                     },
                  },
                  locations: {
                     select: {
                        name: true,
                        code: true,
                        googleMapsLink: true,
                     },
                  },
               },
            });

            const teamsData = await prisma.teams.findMany({
               select: {
                  id: true,
                  logo: true,
                  teamName: true,
               },
            });

            const gameInfo = {
               gamesData,
               teamsData,
            };

            if (gameInfo) {
               return res.status(200).json(gameInfo);
            }
         } catch (error) {
            console.log("all games error", error);
            return res.status(400).send(error);
         }
   }
};

export default gamesHandler;
