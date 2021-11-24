import { doc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../config";
import dayjs from "dayjs";

const dataMigrationHandler = async (req, res) => {
   // STANDINGS UPDATE
   // const data = [
   //    {
   //       goalsAgainst: 18,
   //       goalsFor: 40,
   //       losses: 1,
   //       otl: 0,
   //       penaltyMinutes: 38,
   //       wins: 6,
   //       teamId: "QgGjs0EoxaIkizRG6xhH",
   //       teamName: "Skate & Score",
   //    },
   //    {
   //       goalsAgainst: 14,
   //       goalsFor: 38,
   //       losses: 2,
   //       otl: 1,
   //       penaltyMinutes: 75,
   //       wins: 4,
   //       teamId: "m196KhSGTj8Vpf0jocK5",
   //       teamName: "Thirsty Dogs",
   //    },
   //    {
   //       goalsAgainst: 13,
   //       goalsFor: 32,
   //       losses: 2,
   //       otl: 0,
   //       penaltyMinutes: 52,
   //       wins: 5,
   //       teamId: "",
   //       teamName: "Ice Pak",
   //    },
   //    {
   //       goalsAgainst: 24,
   //       goalsFor: 35,
   //       losses: 2,
   //       otl: 0,
   //       penaltyMinutes: 34,
   //       wins: 5,
   //       teamId: "LG3ks7DMXwHXtzupNCsJ",
   //       teamName: "Flyers",
   //    },
   //    {
   //       goalsAgainst: 29,
   //       goalsFor: 22,
   //       losses: 4,
   //       otl: 0,
   //       penaltyMinutes: 99,
   //       wins: 3,
   //       teamId: "9NJrVlNcnaA7JKNaC3eN",
   //       teamName: "Wild",
   //    },
   //    {
   //       goalsAgainst: 27,
   //       goalsFor: 20,
   //       losses: 3,
   //       otl: 0,
   //       penaltyMinutes: 52,
   //       wins: 4,
   //       teamId: "UgiUFCBkaPleWL7ZzmgQ",
   //       teamName: "Rat Pack",
   //    },
   //    {
   //       goalsAgainst: 44,
   //       goalsFor: 17,
   //       losses: 6,
   //       otl: 0,
   //       penaltyMinutes: 42,
   //       wins: 1,
   //       teamId: "zun2S3wUdCVyxYuKDlLJ",
   //       teamName: "Dew Crew",
   //    },
   //    {
   //       goalsAgainst: 49,
   //       goalsFor: 15,
   //       losses: 6,
   //       otl: 1,
   //       penaltyMinutes: 18,
   //       wins: 0,
   //       teamId: "2eixQWewhDLL3kJKn1yS",
   //       teamName: "Murder Hornets",
   //    },
   // ];

   // await updateDoc(doc(db, "seasons", "LSdvGKI4dFWUBwgeEC5z"), {
   //    standings: data,
   // });

   return res.status(418).json({ message: "This route is not available." });
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

// 6/14/21 qLBxSVbpxCbeFMj1yR08

// bob mccracken HzFzkgO7uN3dZ7MeRWuP
