import { doc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../config";
import dayjs from "dayjs";

const dataMigrationHandler = async (req, res) => {
   // STANDINGS UPDATE
   const regularSeasonData = [
      {
         wins: 8,
         losses: 1,
         otl: 1,
         goalsFor: 76,
         goalsAgainst: 35,
         penaltyMinutes: 34,
         teamId: "I0LCKxMnOcWh1UTkcD3e",
         pgTeamId: 4,
         teamName: "The Puckheads",
      },
      {
         wins: 8,
         losses: 2,
         otl: 0,
         goalsFor: 79,
         goalsAgainst: 22,
         penaltyMinutes: 38,
         teamId: "m196KhSGTj8Vpf0jocK5",
         pgTeamId: 10,
         teamName: "Thirsty Dogs",
      },
      {
         wins: 8,
         losses: 2,
         otl: 0,
         goalsFor: 50,
         goalsAgainst: 25,
         penaltyMinutes: 64,
         teamId: "LG3ks7DMXwHXtzupNCsJ",
         pgTeamId: 5,
         teamName: "Flyers",
      },
      {
         wins: 8,
         losses: 2,
         otl: 0,
         goalsFor: 55,
         goalsAgainst: 23,
         penaltyMinutes: 52,
         teamId: "QgGjs0EoxaIkizRG6xhH",
         pgTeamId: 7,
         teamName: "Skate & Score",
      },
      {
         wins: 7,
         losses: 3,
         otl: 0,
         goalsFor: 65,
         goalsAgainst: 32,
         penaltyMinutes: 41,
         teamId: "0SBVU2RK2pKDKagEBCWv",
         pgTeamId: 1,
         teamName: "Ice Pak",
      },
      {
         wins: 4,
         losses: 6,
         otl: 0,
         goalsFor: 24,
         goalsAgainst: 43,
         penaltyMinutes: 38,
         teamId: "zun2S3wUdCVyxYuKDlLJ",
         pgTeamId: 11,
         teamName: "Dew Crew",
      },
      {
         wins: 2,
         losses: 7,
         otl: 1,
         goalsFor: 31,
         goalsAgainst: 65,
         penaltyMinutes: 63,
         teamId: "2eixQWewhDLL3kJKn1yS",
         pgTeamId: 2,
         teamName: "Murder Hornets",
      },
      {
         wins: 2,
         losses: 7,
         otl: 1,
         goalsFor: 25,
         goalsAgainst: 62,
         penaltyMinutes: 60,
         teamId: "UgiUFCBkaPleWL7ZzmgQ",
         pgTeamId: 8,
         teamName: "Rat Pack",
      },
      {
         wins: 2,
         losses: 7,
         otl: 1,
         goalsFor: 18,
         goalsAgainst: 50,
         penaltyMinutes: 26,
         teamId: "9NJrVlNcnaA7JKNaC3eN",
         pgTeamId: 3,
         teamName: "Wild",
      },
      {
         wins: 1,
         losses: 9,
         otl: 0,
         goalsFor: 20,
         goalsAgainst: 86,
         penaltyMinutes: 53,
         teamId: "a4IIcXMrJqLKY0wxo86e",
         pgTeamId: 9,
         teamName: "Bengals 2",
      },
   ];

   const playoffData = [
      {
         id: 1,
         name: "Round 1 - Game 1",
         nextMatchId: 9,
         tournamentRoundText: "1", // Text for Round Header
         startTime: "",
         state: "WALK_OVER", // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
         participants: [
            {
               id: 4, // Unique identifier of any kind
               resultText: "BYE", // Any string works
               isWinner: true,
               status: "WALK_OVER", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
               name: "The Puckheads",
            },
            { id: null, resultText: null, isWinner: false, status: "NO_PARTY" },
         ],
      },
      {
         id: 2,
         name: "Round 1 - Game 2",
         nextMatchId: 9,
         tournamentRoundText: "1",
         startTime: "2022-08-01 8:15 PM",
         state: "DONE",
         participants: [
            {
               id: 8,
               resultText: "2",
               isWinner: true,
               status: "PLAYED",
               name: "Rat Pack",
            },
            {
               id: 3,
               resultText: "1",
               isWinner: false,
               status: "PLAYED",
               name: "Wild",
            },
         ],
      },
      {
         id: 3,
         name: "Round 1 - Game 3",
         nextMatchId: 10,
         tournamentRoundText: "1",
         startTime: "",
         state: "WALK_OVER",
         participants: [
            {
               id: 7,
               resultText: "BYE",
               isWinner: true,
               status: "WALK_OVER",
               name: "Skate & Score",
            },
            { id: null, resultText: null, isWinner: false, status: "NO_PARTY" },
         ],
      },
      {
         id: 4,
         name: "Round 1 - Game 4",
         nextMatchId: 10,
         tournamentRoundText: "1",
         startTime: "",
         state: "WALK_OVER",
         participants: [
            {
               id: 1,
               resultText: "BYE",
               isWinner: true,
               status: "WALK_OVER",
               name: "Ice Pak",
            },
            { id: null, resultText: null, isWinner: false, status: "NO_PARTY" },
         ],
      },
      {
         id: 5,
         name: "Round 1 - Game 5",
         nextMatchId: 11,
         tournamentRoundText: "1",
         startTime: "",
         state: "WALK_OVER",
         participants: [
            {
               id: 10,
               resultText: "BYE",
               isWinner: true,
               status: "WALK_OVER",
               name: "Thirsty Dogs",
            },
            { id: null, resultText: null, isWinner: false, status: "NO_PARTY" },
         ],
      },
      {
         id: 6,
         name: "Round 1 - Game 6",
         nextMatchId: 11,
         tournamentRoundText: "1",
         startTime: "2022-08-01 9:45 PM",
         state: "DONE",
         participants: [
            {
               id: 2,
               resultText: "9",
               isWinner: true,
               status: "PLAYED",
               name: "Murder Hornets",
            },
            {
               id: 9,
               resultText: "0",
               isWinner: false,
               status: "PLAYED",
               name: "Bengals 2",
            },
         ],
      },
      {
         id: 7,
         name: "Round 1 - Game 7",
         nextMatchId: 12,
         tournamentRoundText: "1",
         startTime: "",
         state: "WALK_OVER",
         participants: [
            {
               id: 1,
               resultText: "BYE",
               isWinner: true,
               status: "WALK_OVER",
               name: "Flyers",
            },
            { id: null, resultText: null, isWinner: false, status: "NO_PARTY" },
         ],
      },
      {
         id: 8,
         name: "Round 1 - Game 8",
         nextMatchId: 12,
         tournamentRoundText: "1",
         startTime: "",
         state: "WALK_OVER",
         participants: [
            {
               id: 11,
               resultText: "BYE",
               isWinner: true,
               status: "WALK_OVER",
               name: "Dew Crew",
            },
            { id: null, resultText: null, isWinner: false, status: "NO_PARTY" },
         ],
      },
      {
         id: 9,
         name: "Round 2 - Game 1",
         nextMatchId: 13,
         tournamentRoundText: "2",
         startTime: "2022-08-08 8:15 PM",
         state: "DONE",
         participants: [
            {
               id: 4,
               resultText: "7",
               isWinner: true,
               status: "PLAYED",
               name: "The Puckheads",
            },
            {
               id: 8,
               resultText: "0",
               isWinner: false,
               status: "PLAYED",
               name: "Rat Pack",
            },
         ],
      },
      {
         id: 10,
         name: "Round 2 - Game 2",
         nextMatchId: 13,
         tournamentRoundText: "2",
         startTime: "2022-08-02 7:15 PM",
         state: "DONE",
         participants: [
            {
               id: 7,
               resultText: "2",
               isWinner: false,
               status: "PLAYED",
               name: "Skate & Score",
            },
            {
               id: 1,
               resultText: "3",
               isWinner: true,
               status: "PLAYED",
               name: "Ice Pak",
            },
         ],
      },
      {
         id: 11,
         name: "Round 2 - Game 3",
         nextMatchId: 14,
         tournamentRoundText: "2",
         startTime: "2022-08-08 9:45 PM",
         state: "DONE",
         participants: [
            {
               id: 10,
               resultText: "5",
               isWinner: true,
               status: "PLAYED",
               name: "Thirsty Dogs",
            },
            {
               id: 2,
               resultText: "4",
               isWinner: false,
               status: "PLAYED",
               name: "Murder Hornets",
            },
         ],
      },
      {
         id: 12,
         name: "Round 2 - Game 4",
         nextMatchId: 14,
         tournamentRoundText: "2",
         startTime: "2022-08-02 8:45 PM",
         state: "DONE",
         participants: [
            {
               id: 5,
               resultText: "3",
               isWinner: false,
               status: "PLAYED",
               name: "Flyers",
            },
            {
               id: 11,
               resultText: "4",
               isWinner: true,
               status: "PLAYED",
               name: "Dew Crew",
            },
         ],
      },
      {
         id: 13,
         name: "Round 3 - Game 1",
         nextMatchId: 15,
         tournamentRoundText: "3",
         startTime: "2022-08-10 8:15 PM",
         state: "DONE",
         participants: [
            {
               id: 4,
               resultText: "4",
               isWinner: true,
               status: "PLAYED",
               name: "The Puckheads",
            },
            {
               id: 1,
               resultText: "3",
               isWinner: false,
               status: "PLAYED",
               name: "Ice Pak",
            },
         ],
      },
      {
         id: 15,
         name: "Round 3 - Game 2",
         nextMatchId: 15,
         tournamentRoundText: "3",
         startTime: "2022-08-01 9:45 PM",
         state: "DONE",
         participants: [
            {
               id: 10,
               resultText: "8",
               isWinner: true,
               status: "PLAYED",
               name: "Thirsty Dogs",
            },
            {
               id: 8,
               resultText: "3",
               isWinner: false,
               status: "PLAYED",
               name: "Dew Crew",
            },
         ],
      },
      {
         id: 15,
         name: "Finals",
         nextMatchId: null,
         tournamentRoundText: "4",
         startTime: "2022-08-17 6:45 PM",
         state: "DONE",
         participants: [
            {
               id: 4,
               resultText: "2",
               isWinner: false,
               status: "PLAYED",
               name: "The Puckheads",
            },
            {
               id: 8,
               resultText: "5",
               isWinner: true,
               status: "PLAYED",
               name: "Thirsty Dogs",
            },
         ],
      },
   ];

   try {
      await updateDoc(doc(db, "seasons", "ADYC3Djh4pgZ1dN8SFZ1"), {
         standings: playoffData,
      });

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

// 1 ice pak 0SBVU2RK2pKDKagEBCWv
// 2 murder hornets 2eixQWewhDLL3kJKn1yS
// 3 wild 9NJrVlNcnaA7JKNaC3eN
// 4 the puckheads I0LCKxMnOcWh1UTkcD3e
// 5 flyers LG3ks7DMXwHXtzupNCsJ
// 6 dragon juice LRk405AKU9JV8bHz2Vfm
// 7 skate & score QgGjs0EoxaIkizRG6xhH
// 8 rat pack UgiUFCBkaPleWL7ZzmgQ
// 9 bengals 2 a4IIcXMrJqLKY0wxo86e
// 10 thirsty dogs m196KhSGTj8Vpf0jocK5
// 11 dew crew zun2S3wUdCVyxYuKDlLJ
// 12 whiskey dekes 7SqedrslMXDCtKPkws8z
// 13 bengals dmih1xo7MhkGLbbNggFW
// 14 sharks Ird4brrgp9QLL5s7Tu7R
// 15 whore island ocelots hjEUoSbRiFDcsDlr0vS2
// 16 a bar named sue xnhRw8Q2QYdWqXuQWDBW
// 17 predators 6o5cbJWGcwOsnTkUZMu5
// 18 airshow ucR3pDQKfz6qgVwMgaTl
// 19 cutthroat PwZ9f2Oj0zOxUgWx5iJP
// 20 junior's tavern 3OXJu72yB5JYCjhpERnQ
// 21 goodfellas lEn0ImOeYVNJmieW5usp

// bob mccracken HzFzkgO7uN3dZ7MeRWuP

// const seasonsQuery = await getDocs(collection(db, "seasons"));
// const leaguesQuery = await getDocs(collection(db, "leagues"));
// const locationsQuery = await getDocs(collection(db, "locations"));
// const gamesQuery = await getDocs(collection(db, "games"));
// const opponentsQuery = await getDocs(collection(db, "opponents"));
// const playersQuery = await getDocs(collection(db, "players"));
// const penaltiesQuery = await getDocs(collection(db, "penalties"));
// const goalsQuery = await getDocs(collection(db, "goals"));

// let seasons = [];
// let leagues = [];
// let locations = [];
// let games = [];
// let opponents = [];
// let players = [];
// let penalties = [];
// let goals = [];

// seasonsQuery.forEach((doc) => {
//    seasons.push({
//       ...doc.data(),
//       firebaseId: doc.id,
//    });
// });

// leaguesQuery.forEach((doc) => {
//    leagues.push({
//       ...doc.data(),
//       firebaseId: doc.id,
//    });
// });

// locationsQuery.forEach((doc) => {
//    locations.push({
//       ...doc.data(),
//       firebaseId: doc.id,
//    });
// });

// gamesQuery.forEach((doc) => {
//    games.push({
//       ...doc.data(),
//       firebaseId: doc.id,
//    });
// });

// opponentsQuery.forEach((doc) => {
//    opponents.push({
//       ...doc.data(),
//       firebaseId: doc.id,
//    });
// });

// playersQuery.forEach((doc) => {
//    players.push({
//       ...doc.data(),
//       firebaseId: doc.id,
//    });
// });

// penaltiesQuery.forEach((doc) => {
//    penalties.push({
//       ...doc.data(),
//       firebaseId: doc.id,
//    });
// });

// goalsQuery.forEach((doc) => {
//    goals.push({
//       ...doc.data(),
//       firebaseId: doc.id,
//    });
// });

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
