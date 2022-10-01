import { doc, updateDoc, collection, addDoc, getDocs, documentId } from "firebase/firestore";
import { db, prisma } from "../../config";
import dayjs from "dayjs";
import { batch } from "react-redux";

const migrateData = async () => {
   const seasonsQuery = await getDocs(collection(db, "seasons"));
   const leaguesQuery = await getDocs(collection(db, "leagues"));
   const locationsQuery = await getDocs(collection(db, "locations"));
   const gamesQuery = await getDocs(collection(db, "games"));
   const opponentsQuery = await getDocs(collection(db, "opponents"));
   const playersQuery = await getDocs(collection(db, "players"));
   const penaltiesQuery = await getDocs(collection(db, "penalties"));
   const goalsQuery = await getDocs(collection(db, "goals"));
   const ordersQuery = await getDocs(collection(db, "orders"));

   let seasons = [];
   let leagues = [];
   let locations = [];
   let games = [];
   let opponents = [];
   let players = [];
   let penalties = [];
   let goals = [];
   let orders = [];

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

   ordersQuery.forEach((doc) => {
      orders.push({
         ...doc.data(),
         firebaseId: doc.id,
      });
   });

   // Games
   // for (const el of games) {
   //    await prisma.games.create({
   //       data: {
   //          id: el.gameGuid,
   //          date: el.pgDate,
   //          embedLink: el.embedLink,
   //          video: el.video,
   //          roster: el.rosterGuids,
   //          locationId: el.locationGuid,
   //          seasonId: el.seasonGuid,
   //          opponentId: el.opponentGuid,
   //          firebaseLocationId: el.locationId,
   //          firebaseOpponentId: el.opponentId,
   //          firebaseSeasonId: el.seasonId,
   //          firebaseRoster: el.roster,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }

   // Goals
   // for (const el of goals) {
   //    await prisma.goals.create({
   //       data: {
   //          id: el.goalGuid,
   //          gameId: el.gameGuid,
   //          assists: el.assistGuids,
   //          teamId: el.teamGuid,
   //          time: el.time,
   //          ytLink: el.ytLink,
   //          playerId: el.playerGuid,
   //          period: el.period,
   //          team: el.team,
   //          firebaseTeamId: el.opponentId,
   //          firebaseGameId: el.gameId,
   //          firebaseAssists: el.assists,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }

   // Leagues
   // for (const el of leagues) {
   //    await prisma.leagues.create({
   //       data: {
   //          id: el.leagueGuid,
   //          name: el.name,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }

   // Locations
   // for (const el of locations) {
   //    await prisma.locations.create({
   //       data: {
   //          id: el.locationGuid,
   //          code: el.code,
   //          googleMapsLink: el.googleMapsLink,
   //          name: el.name,
   //          googlePlusCode: el.googlePlusCode,
   //          googlePhotoReference: el.googlePhotoReference,
   //          googlePlaceId: el.googlePlaceId,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }

   // Orders
   // for (const el of orders) {
   //    await prisma.orders.create({
   //       data: {
   //          id: el.orderGuid,
   //          orderAmount: el.orderAmount,
   //          orderStatus: el.orderStatus,
   //          orderedItems: el.orderedItems,
   //          paymentStatus: el.paymentStatus,
   //          referenceId: el.referenceId,
   //          shippingStatus: el.shippingStatus,
   //          status: el.status,
   //          user: el.user,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }

   // Penalties
   // for (const el of penalties) {
   //    await prisma.penalties.create({
   //       data: {
   //          id: el.penaltyGuid,
   //          gameId: el.gameGuid,
   //          minutes: el.minutes.toString(),
   //          teamId: el.teamGuid,
   //          penaltyType: el.penaltyType,
   //          period: el.period,
   //          playerId: el.playerGuid,
   //          team: el.team,
   //          time: el.time,
   //          ytLink: el.ytLink,
   //          firebasePlayerId: el.playerId,
   //          firebaseGameId: el.gameId,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }

   // Players
   // for (const el of players) {
   //    await prisma.players.create({
   //       data: {
   //          id: el.playerGuid,
   //          email: el.email,
   //          firstName: el.firstName,
   //          lastName: el.lastName,
   //          hometown: el.hometown || el.homeTown,
   //          image: el.image,
   //          nickname: el.nickname,
   //          number: parseInt(el.number) || null,
   //          phoneNumber: el.phoneNumber,
   //          position: el.position,
   //          roles: el.roles,
   //          auth0AccountId: el.auth0AccountId,
   //          born: null,
   //          favoriteNhlTeam: el.favoriteNhlTeam,
   //          favoritePlayer: el.favoritePlayer,
   //          gameDayNotifications: el.gameDayNotifications,
   //          jerseySize: el.jerseySize,
   //          preferredEmail: el.preferredEmail,
   //          preferredJerseyNumber: el.preferredJerseyNumber,
   //          preferredPhone: el.preferredPhone,
   //          tShirtSize: el.tShirtSize,
   //          handedness: el.handedness,
   //          height: el.height,
   //          notifications: el.notifications,
   //          jerseyNumber: parseInt(el.jerseyNumber) || null,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }

   // Seasons
   // for (const el of seasons) {
   //    await prisma.seasons.create({
   //       data: {
   //          id: el.seasonGuid,
   //          endDate: el.pgEndDate,
   //          games: el.gamesGuids,
   //          firebaseGames: el.games,
   //          firebaseLeagueId: el.leagueId,
   //          leagueId: el.leagueGuid,
   //          leagueName: el.leagueName,
   //          name: el.name,
   //          startDate: el.pgStartDate,
   //          roster: el.rosterGuids,
   //          firebaseRoster: el.roster,
   //          standings: el.standings,
   //          statBypass: el.statBypass,
   //          type: el.type,
   //          standingsLink: el.standingsLink,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }

   // Teams
   // for (const el of opponents) {
   //    await prisma.teams.create({
   //       data: {
   //          id: el.opponentGuid,
   //          logo: el.logo,
   //          teamName: el.teamName,
   //          firebaseId: el.firebaseId,
   //       },
   //    });
   // }
};

const dataMigrationHandler = async (req, res) => {
   // STANDINGS UPDATE
   const data = [
      {
         wins: 6,
         losses: 0,
         otl: 1,
         goalsFor: 59,
         goalsAgainst: 28,
         penaltyMinutes: 24,
         teamId: "I0LCKxMnOcWh1UTkcD3e",
         teamName: "The Puckheads",
      },
      {
         wins: 6,
         losses: 1,
         otl: 0,
         goalsFor: 61,
         goalsAgainst: 15,
         penaltyMinutes: 32,
         teamId: "m196KhSGTj8Vpf0jocK5",
         teamName: "Thirsty Dogs",
      },
      {
         wins: 6,
         losses: 1,
         otl: 0,
         goalsFor: 36,
         goalsAgainst: 17,
         penaltyMinutes: 58,
         teamId: "LG3ks7DMXwHXtzupNCsJ",
         teamName: "Flyers",
      },
      {
         wins: 6,
         losses: 1,
         otl: 0,
         goalsFor: 38,
         goalsAgainst: 15,
         penaltyMinutes: 38,
         teamId: "QgGjs0EoxaIkizRG6xhH",
         teamName: "Skate & Score",
      },
      {
         wins: 4,
         losses: 3,
         otl: 0,
         goalsFor: 42,
         goalsAgainst: 28,
         penaltyMinutes: 35,
         teamId: "0SBVU2RK2pKDKagEBCWv",
         teamName: "Ice Pak",
      },
      {
         wins: 3,
         losses: 4,
         otl: 0,
         goalsFor: 17,
         goalsAgainst: 27,
         penaltyMinutes: 56,
         teamId: "zun2S3wUdCVyxYuKDlLJ",
         teamName: "Dew Crew",
      },
      {
         wins: 2,
         losses: 5,
         otl: 0,
         goalsFor: 19,
         goalsAgainst: 39,
         penaltyMinutes: 22,
         teamId: "UgiUFCBkaPleWL7ZzmgQ",
         teamName: "Rat Pack",
      },
      {
         wins: 1,
         losses: 5,
         otl: 1,
         goalsFor: 25,
         goalsAgainst: 44,
         penaltyMinutes: 36,
         teamId: "2eixQWewhDLL3kJKn1yS",
         teamName: "Murder Hornets",
      },
      {
         wins: 1,
         losses: 6,
         otl: 0,
         goalsFor: 10,
         goalsAgainst: 37,
         penaltyMinutes: 20,
         teamId: "9NJrVlNcnaA7JKNaC3eN",
         teamName: "Wild",
      },
      {
         wins: 0,
         losses: 7,
         otl: 0,
         goalsFor: 11,
         goalsAgainst: 68,
         penaltyMinutes: 45,
         teamId: "UgiUFCBkaPleWL7ZzmgQ",
         teamName: "Bengals 2",
      },
   ];

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

   try {
      // const ref = doc(db, "seasons", "");

      // await updateDoc(ref, { pgDate, pgLocationId, pgOpponentId, pgSeasonId, pgRoster })

      await migrateData();

      return res.status(200).json({ message: "success" });
   } catch (error) {
      console.log("error", error);
      return res.status(400).json({ message: error });
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
