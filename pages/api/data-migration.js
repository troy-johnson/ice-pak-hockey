import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../config";
import dayjs from "dayjs";

const dataMigrationHandler = async (req, res) => {
   // const data = [
   //    {
   //       goalsAgainst: 29,
   //       goalsFor: 30,
   //       losses: 4,
   //       otl: 0,
   //       penaltyMinutes: 32,
   //       wins: 3,
   //       teamId: "LG3ks7DMXwHXtzupNCsJ",
   //       teamName: "Flyers",
   //    },
   //    {         
   //       goalsAgainst: 20,
   //       goalsFor: 36,
   //       losses: 1,
   //       otl: 0,
   //       penaltyMinutes: 24,
   //       wins: 6,
   //       teamId: "LRk405AKU9JV8bHz2Vfm",
   //       teamName: "Dragon Juice",
   //    },
   //    {         
   //       goalsAgainst: 38,
   //       goalsFor: 26,
   //       losses: 6,
   //       otl: 0,
   //       penaltyMinutes: 30,
   //       wins: 2,
   //       teamId: "zun2S3wUdCVyxYuKDlLJ",
   //       teamName: "Dew Crew",
   //    },
   //    {         
   //       goalsAgainst: 16,
   //       goalsFor: 34,
   //       losses: 2,
   //       otl: 0,
   //       penaltyMinutes: 26,
   //       wins: 5,
   //       teamId: "QgGjs0EoxaIkizRG6xhH",
   //       teamName: "Skate & Score",
   //    },
   //    {         
   //       goalsAgainst: 48,
   //       goalsFor: 10,
   //       losses: 6,
   //       otl: 1,
   //       penaltyMinutes: 18,
   //       wins: 0,
   //       teamId: "9NJrVlNcnaA7JKNaC3eN",
   //       teamName: "Wild",
   //    },
   //    {         
   //       goalsAgainst: 22,
   //       goalsFor: 31,
   //       losses: 2,
   //       otl: 0,
   //       penaltyMinutes: 34,
   //       wins: 5,
   //       teamId: "UgiUFCBkaPleWL7ZzmgQ",
   //       teamName: "Rat Pack",
   //    },
   //    {         
   //       goalsAgainst: 25,
   //       goalsFor: 32,
   //       losses: 3,
   //       otl: 0,
   //       penaltyMinutes: 28,
   //       wins: 4,
   //       teamId: "",
   //       teamName: "Ice Pak",
   //    },
   // ];

   // data.forEach(async (el) => {
      // await updateDoc(doc(db, "seasons", "oCjzhpsvGzzFtUrRihkO"), {
      //    standings: data,
      // });
      // console.log("result", result);
   // });

   // const result = await addDoc(docollectionc(db, "games"), {
   //    statBypass: data,
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