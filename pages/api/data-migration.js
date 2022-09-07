import { doc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../config";
import dayjs from "dayjs";

const dataMigrationHandler = async (req, res) => {
   // STANDINGS UPDATE
   // const data = [
   //    {
   //       wins: 6,
   //       losses: 0,
   //       otl: 1,
   //       goalsFor: 59,
   //       goalsAgainst: 28,
   //       penaltyMinutes: 24,
   //       teamId: "I0LCKxMnOcWh1UTkcD3e",
   //       teamName: "The Puckheads",
   //    },
   //    {
   //       wins: 6,
   //       losses: 1,
   //       otl: 0,
   //       goalsFor: 61,
   //       goalsAgainst: 15,
   //       penaltyMinutes: 32,
   //       teamId: "m196KhSGTj8Vpf0jocK5",
   //       teamName: "Thirsty Dogs",
   //    },
   //    {
   //       wins: 6,
   //       losses: 1,
   //       otl: 0,
   //       goalsFor: 36,
   //       goalsAgainst: 17,
   //       penaltyMinutes: 58,
   //       teamId: "LG3ks7DMXwHXtzupNCsJ",
   //       teamName: "Flyers",
   //    },
   //    {
   //       wins: 6,
   //       losses: 1,
   //       otl: 0,
   //       goalsFor: 38,
   //       goalsAgainst: 15,
   //       penaltyMinutes: 38,
   //       teamId: "QgGjs0EoxaIkizRG6xhH",
   //       teamName: "Skate & Score",
   //    },
   //    {
   //       wins: 4,
   //       losses: 3,
   //       otl: 0,
   //       goalsFor: 42,
   //       goalsAgainst: 28,
   //       penaltyMinutes: 35,
   //       teamId: "0SBVU2RK2pKDKagEBCWv",
   //       teamName: "Ice Pak",
   //    },
   //    {
   //       wins: 3,
   //       losses: 4,
   //       otl: 0,
   //       goalsFor: 17,
   //       goalsAgainst: 27,
   //       penaltyMinutes: 56,
   //       teamId: "zun2S3wUdCVyxYuKDlLJ",
   //       teamName: "Dew Crew",
   //    },
   //    {
   //       wins: 2,
   //       losses: 5,
   //       otl: 0,
   //       goalsFor: 19,
   //       goalsAgainst: 39,
   //       penaltyMinutes: 22,
   //       teamId: "UgiUFCBkaPleWL7ZzmgQ",
   //       teamName: "Rat Pack",
   //    },
   //    {
   //       wins: 1,
   //       losses: 5,
   //       otl: 1,
   //       goalsFor: 25,
   //       goalsAgainst: 44,
   //       penaltyMinutes: 36,
   //       teamId: "2eixQWewhDLL3kJKn1yS",
   //       teamName: "Murder Hornets",
   //    },
   //    {
   //       wins: 1,
   //       losses: 6,
   //       otl: 0,
   //       goalsFor: 10,
   //       goalsAgainst: 37,
   //       penaltyMinutes: 20,
   //       teamId: "9NJrVlNcnaA7JKNaC3eN",
   //       teamName: "Wild",
   //    },
   //    {
   //       wins: 0,
   //       losses: 7,
   //       otl: 0,
   //       goalsFor: 11,
   //       goalsAgainst: 68,
   //       penaltyMinutes: 45,
   //       teamId: "UgiUFCBkaPleWL7ZzmgQ",
   //       teamName: "Bengals 2",
   //    },
   // ];

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

   const seasonsQuery = await getDocs(collection(db, "seasons"));
   const leaguesQuery = await getDocs(collection(db, "leagues"));
   const locationsQuery = await getDocs(collection(db, "locations"));
   const gamesQuery = await getDocs(collection(db, "games"));
   const opponentsQuery = await getDocs(collection(db, "opponents"));
   const playersQuery = await getDocs(collection(db, "players"));
   const penaltiesQuery = await getDocs(collection(db, "penalties"));
   const goalsQuery = await getDocs(collection(db, "goals"));

   let seasons = [];
   let leagues = [];
   let locations = [];
   let games = [];
   let opponents = [];
   let players = [];
   let penalties = [];
   let goals = [];

   seasonsQuery.forEach((doc) => {
      seasons.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   leaguesQuery.forEach((doc) => {
      leagues.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   locationsQuery.forEach((doc) => {
      locations.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   gamesQuery.forEach((doc) => {
      games.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   opponentsQuery.forEach((doc) => {
      opponents.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   playersQuery.forEach((doc) => {
      players.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   penaltiesQuery.forEach((doc) => {
      penalties.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   goalsQuery.forEach((doc) => {
      goals.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   // // Seasons Update
   // for (const el of seasons) {
   //    let ref = doc(db, "seasons", el.firebaseId);

   //    let standings = [];
   //    let statBypass = [];
   //    // let pgGames = [];
   //    let roster = [];

   //    // console.log("el", el)

   //    const firebaseGames = games.filter(game => game.pgSeasonId === el.id).map(game => {
   //       return game.firebaseId
   //    });

   //    const pgGames = games.filter(game => game.pgSeasonId === el.id).map(game => {
   //       return game.id
   //    });

   //    console.log(`season ${el.id} firebase games`, firebaseGames);
   //    console.log(`season ${el.id} postgres games`, pgGames);

   //    await updateDoc(ref, {
   //       games: firebaseGames,
   //       pgGames
   //    });
   // }

   // console.log("games", { gamesFiltered, length: games.length });

   try {
      // await updateDoc(doc(db, "seasons", "cdLeQs6Y8Q5fjY0Fx7jI"), {
      //    standings: data,
      // });

      return res.status(200).json({
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
