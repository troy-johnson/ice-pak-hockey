import { doc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../config";
import dayjs from "dayjs";

const dataMigrationHandler = async (req, res) => {
   // const data = [
   //    {
   //       goalsAgainst: 17,
   //       goalsFor: 33,
   //       losses: 1,
   //       otl: 0,
   //       penaltyMinutes: 34,
   //       wins: 5,
   //       teamId: "QgGjs0EoxaIkizRG6xhH",
   //       teamName: "Skate & Score",
   //    },
   //    {
   //       goalsAgainst: 10,
   //       goalsFor: 36,
   //       losses: 1,
   //       otl: 1,
   //       penaltyMinutes: 34,
   //       wins: 4,
   //       teamId: "m196KhSGTj8Vpf0jocK5",
   //       teamName: "Thirsty Dogs",
   //    },
   //    {
   //       goalsAgainst: 11,
   //       goalsFor: 28,
   //       losses: 2,
   //       otl: 0,
   //       penaltyMinutes: 42,
   //       wins: 4,
   //       teamId: "",
   //       teamName: "Ice Pak",
   //    },
   //    {
   //       goalsAgainst: 20,
   //       goalsFor: 30,
   //       losses: 2,
   //       otl: 0,
   //       penaltyMinutes: 26,
   //       wins: 4,
   //       teamId: "LG3ks7DMXwHXtzupNCsJ",
   //       teamName: "Flyers",
   //    },
   //    {
   //       goalsAgainst: 24,
   //       goalsFor: 21,
   //       losses: 3,
   //       otl: 0,
   //       penaltyMinutes: 93,
   //       wins: 3,
   //       teamId: "9NJrVlNcnaA7JKNaC3eN",
   //       teamName: "Wild",
   //    },
   //    {
   //       goalsAgainst: 26,
   //       goalsFor: 15,
   //       losses: 3,
   //       otl: 0,
   //       penaltyMinutes: 46,
   //       wins: 3,
   //       teamId: "UgiUFCBkaPleWL7ZzmgQ",
   //       teamName: "Rat Pack",
   //    },
   //    {
   //       goalsAgainst: 39,
   //       goalsFor: 13,
   //       losses: 5,
   //       otl: 0,
   //       penaltyMinutes: 30,
   //       wins: 1,
   //       teamId: "zun2S3wUdCVyxYuKDlLJ",
   //       teamName: "Dew Crew",
   //    },
   //    {
   //       goalsAgainst: 42,
   //       goalsFor: 14,
   //       losses: 5,
   //       otl: 1,
   //       penaltyMinutes: 18,
   //       wins: 0,
   //       teamId: "2eixQWewhDLL3kJKn1yS",
   //       teamName: "Murder Hornets",
   //    },
   // ];

   // const result = await getDocs(collection(db, "players"));

   // // if (result.length) {
   // let players = [];

   // result.forEach((doc) => {
   //    players.push({ id: doc.id, ...doc.data() });
   // });

   // players.forEach(async (el) => {
   //    await updateDoc(doc(db, "players", el.id), {
   //       notifications: {
   //          gameDay: true,
   //       },
   //    });
   // });

   // data.forEach(async (el) => {
   // await updateDoc(doc(db, "seasons", "LSdvGKI4dFWUBwgeEC5z"), {
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
