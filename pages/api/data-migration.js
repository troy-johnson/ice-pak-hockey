import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../config";
import dayjs from "dayjs";

const dataMigrationHandler = async (req, res) => {
   const data = [
      {
         date: new Date(2021, 6, 23, 18, 15, 0, 0),
         locationId: "doiWx2roh0nsoz0Wxq1H",
         opponentId: "LG3ks7DMXwHXtzupNCsJ",
         opponentName: "Flyers",
         roster: [],
         seasonId: "oCjzhpsvGzzFtUrRihkO",
      },
      {         
         date: new Date(2021, 6, 28, 17, 45, 0, 0),
         locationId: "gxvZcjH4pjfc6WUroHSE",
         opponentId: "LRk405AKU9JV8bHz2Vfm",
         opponentName: "Dragon Juice",
         roster: [],
         seasonId: "oCjzhpsvGzzFtUrRihkO"
      },
      {         
         date: new Date(2021, 7, 13, 19, 45, 0, 0),
         locationId: "doiWx2roh0nsoz0Wxq1H",
         opponentId: "zun2S3wUdCVyxYuKDlLJ",
         opponentName: "Dew Crew",
         roster: [],
         seasonId: "oCjzhpsvGzzFtUrRihkO"
      },
      {         
         date: new Date(2021, 7, 20, 19, 45, 0, 0),
         locationId: "sTIQDSOE4asDyu6icq12",
         opponentId: "QgGjs0EoxaIkizRG6xhH",
         opponentName: "Skate & Score",
         roster: [],
         seasonId: "oCjzhpsvGzzFtUrRihkO"
      },
      {         
         date: new Date(2021, 7, 27, 18, 15, 0, 0),
         locationId: "doiWx2roh0nsoz0Wxq1H",
         opponentId: "9NJrVlNcnaA7JKNaC3eN",
         opponentName: "Wild",
         roster: [],
         seasonId: "oCjzhpsvGzzFtUrRihkO"
      },
      {         
         date: new Date(2021, 8, 3, 19, 45, 0, 0),
         locationId: "sTIQDSOE4asDyu6icq12",
         opponentId: "UgiUFCBkaPleWL7ZzmgQ",
         opponentName: "Rat Pack",
         roster: [],
         seasonId: "oCjzhpsvGzzFtUrRihkO"
      },
      {         
         date: new Date(2021, 8, 9, 19, 30, 0, 0),
         locationId: "doiWx2roh0nsoz0Wxq1H",
         opponentId: "LG3ks7DMXwHXtzupNCsJ",
         opponentName: "Flyers",
         roster: [],
         seasonId: "rNnyTNXfArAUzTRua2Og"
      },
      {         
         date: new Date(2021, 8, 16, 17, 45, 0, 0),
         locationId: "gxvZcjH4pjfc6WUroHSE",
         opponentId: "LRk405AKU9JV8bHz2Vfm",
         opponentName: "Dragon Juice",
         roster: [],
         seasonId: "rNnyTNXfArAUzTRua2Og"
      }
   ];

   data.forEach(async (el) => {
      await addDoc(collection(db, "games"), {
         ...el,
      });
      // console.log("result", result);
   });

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