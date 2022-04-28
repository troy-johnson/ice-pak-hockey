import { doc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../config";
import dayjs from "dayjs";

const dataMigrationHandler = async (req, res) => {
   // STANDINGS UPDATE
   // const data = [
   //    {
   //       goalsAgainst: 18,
   //       goalsFor: 48,
   //       losses: 1,
   //       otl: 0,
   //       penaltyMinutes: 40,
   //       wins: 8,
   //       teamId: "QgGjs0EoxaIkizRG6xhH",
   //       teamName: "Skate & Score",
   //    },
   //    {
   //       goalsAgainst: 17,
   //       goalsFor: 44,
   //       losses: 3,
   //       otl: 1,
   //       penaltyMinutes: 81,
   //       wins: 5,
   //       teamId: "m196KhSGTj8Vpf0jocK5",
   //       teamName: "Thirsty Dogs",
   //    },
   //    {
   //       goalsAgainst: 14,
   //       goalsFor: 48,
   //       losses: 2,
   //       otl: 0,
   //       penaltyMinutes: 56,
   //       wins: 7,
   //       teamId: "",
   //       teamName: "Ice Pak",
   //    },
   //    {
   //       goalsAgainst: 26,
   //       goalsFor: 43,
   //       losses: 3,
   //       otl: 0,
   //       penaltyMinutes: 42,
   //       wins: 6,
   //       teamId: "LG3ks7DMXwHXtzupNCsJ",
   //       teamName: "Flyers",
   //    },
   //    {
   //       goalsAgainst: 38,
   //       goalsFor: 24,
   //       losses: 6,
   //       otl: 0,
   //       penaltyMinutes: 107,
   //       wins: 3,
   //       teamId: "9NJrVlNcnaA7JKNaC3eN",
   //       teamName: "Wild",
   //    },
   //    {
   //       goalsAgainst: 31,
   //       goalsFor: 23,
   //       losses: 4,
   //       otl: 0,
   //       penaltyMinutes: 56,
   //       wins: 5,
   //       teamId: "UgiUFCBkaPleWL7ZzmgQ",
   //       teamName: "Rat Pack",
   //    },
   //    {
   //       goalsAgainst: 52,
   //       goalsFor: 20,
   //       losses: 8,
   //       otl: 0,
   //       penaltyMinutes: 78,
   //       wins: 1,
   //       teamId: "zun2S3wUdCVyxYuKDlLJ",
   //       teamName: "Dew Crew",
   //    },
   //    {
   //       goalsAgainst: 61,
   //       goalsFor: 18,
   //       losses: 7,
   //       otl: 1,
   //       penaltyMinutes: 28,
   //       wins: 1,
   //       teamId: "2eixQWewhDLL3kJKn1yS",
   //       teamName: "Murder Hornets",
   //    },
   // ];

   //       cdLeQs6Y8Q5fjY0Fx7jI",

   // await updateDoc(doc(db, "seasons", "LSdvGKI4dFWUBwgeEC5z"), {
   //    standings: data,
   // });

   try {
      // const data = await addDoc(collection(db, "games"), {
      //    date: new Date("7/19/22 8:45 PM"),
      //    embedLink: "",
      //    goals: [],
      //    locationId: "gxvZcjH4pjfc6WUroHSE",
      //    opponentId: "2eixQWewhDLL3kJKn1yS",
      //    opponentName: "Murder Hornets",
      //    penalties: [],
      //    roster: [],
      //    seasonId: "cdLeQs6Y8Q5fjY0Fx7jI",
      //    video: ""
      // });

      // const data = await updateDoc(doc(db, "seasons", "cdLeQs6Y8Q5fjY0Fx7jI"), {
      //    games: ["LQitqBFMMuZWFPIB9Kig",
      //       "9yiEhlKd6JB27Ef0eHsl",
      //       "Kwi7KnkMroiFEVwNE278",
      //       "bAiGSz8FCIFMRW5IlGFH",
      //       "Ia6tM0TDxCpDh1sSxU76",
      //       "cr9H1dfryDvdhJGxAql5",
      //       "XD2vVBnXEZ2DKjqsIfYo",
      //       "YYhusgHaWdGcqMAEoNgM",
      //       "ATYzmGyPoFMyzCl43vav",
      //       "QIqKof1bD6cGHg9s0rYL"]
      // })

      return res
         .status(200)
         .json({
            message: "This route is not available. Please contact troy.johnson57@gmail.com.",
         });
   } catch (error) {
      return res.status(400).json({ message: "Error." });
   }

   // return res.status(418).json({ message: "This route is not available." });
};

export default dataMigrationHandler;

// steiner doiWx2roh0nsoz0Wxq1H
// acord sTIQDSOE4asDyu6icq12
// murray gxvZcjH4pjfc6WUroHSE

// dew crew zun2S3wUdCVyxYuKDlLJ
// murder hornets 2eixQWewhDLL3kJKn1yS
// wild 9NJrVlNcnaA7JKNaC3eN
// flyers LG3ks7DMXwHXtzupNCsJ
// dragon juice LRk405AKU9JV8bHz2Vfm
// skate & score QgGjs0EoxaIkizRG6xhH
// rat pack UgiUFCBkaPleWL7ZzmgQ
// thirsty dogs m196KhSGTj8Vpf0jocK5
// the puckheads I0LCKxMnOcWh1UTkcD3e
// bengals 2 a4IIcXMrJqLKY0wxo86e

// bob mccracken HzFzkgO7uN3dZ7MeRWuP
