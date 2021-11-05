import { getDocs, collection, documentId, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import twilio from "twilio";
import { db } from "../../../config";

const gameDayNotificationHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            let games = [];
            let players = [];
            let locations = [];
            let opponents = [];

            const gameResult = await getDocs(collection(db, "games"));
            const playerResult = await getDocs(
               query(collection(db, "players"), where("notifications.gameDay", "==", true))
            );

            gameResult.forEach((doc) => {
               games.push({ id: doc.id, ...doc.data() });
            });

            playerResult?.forEach((doc) => {
               players.push({
                  id: doc.id,
                  firstName: doc.data().firstName,
                  lastName: doc.data().lastName,
                  phoneNumber: doc.data().phoneNumber,
                  preferredPhone: doc.data()?.preferredPhone,
                  preferredEmail: doc.data()?.preferredEmail,
               });
            });

            const gameDay = games
               .map((game) => {
                  return {
                     ...game,
                     difference: dayjs.unix(game.date.seconds).diff(dayjs(), "hour"),
                  };
               })
               .filter((game) => game.difference <= 72 && game.difference >= 0)
               .sort((a, b) => a.difference - b.difference)[0];

            if (!gameDay) {
               return res.status(200).json({ message: "Not a game day." });
            }

            const opponentResult = await getDocs(
               query(collection(db, "opponents"), where(documentId(), "==", gameDay.opponentId))
            );
            const locationResult = await getDocs(
               query(collection(db, "locations"), where(documentId(), "==", gameDay.locationId))
            );

            opponentResult.forEach((opponent) =>
               opponents.push({ id: opponent.id, ...opponent.data() })
            );

            locationResult.forEach((location) =>
               locations.push({ id: location.id, ...location.data() })
            );

            const opponentInfo = opponents.filter(
               (opponent) => opponent.id === gameDay.opponentId
            )[0];
            const locationInfo = locations.filter(
               (location) => location.id === gameDay.locationId
            )[0];

            if (gameDay) {
               let listToNotify = players?.filter((player) => gameDay.roster.includes(player.id));

               const textClient = twilio(
                  process.env.TWILIO_ACCOUNT_SID,
                  process.env.TWILIO_AUTH_TOKEN
               );

               listToNotify.push({
                  firstName: "Bob",
                  lastName: "McCracken",
                  preferredPhone: "7143126570‬",
               });

               const sendTexts = async () => {
                  for (const player of listToNotify) {
                     try {
                        await textClient.messages.create({
                           from: "(714) 519-2916",
                           to: player.preferredPhone ?? player.phoneNumber,
                           body: `Ice Pak Hockey \n\nIt's game day! \n\nOpponent: ${
                              opponentInfo.teamName
                           } \nDate and Time: ${dayjs
                              .unix(gameDay.date.seconds)
                              .format("MMM D @ h:m")} \nLocation: ${locationInfo.name} (${
                              locationInfo.googleMapsLink
                           }) \n \nView game at www.icepakhockey.com/games/${gameDay.id}`,
                        });
                        console.log(
                           `Successfully sent sms notification to ${player.firstName} ${
                              player.lastName
                           } @ ${player.preferredPhone ?? player.phoneNumber}`
                        );
                     } catch (error) {
                        console.log(
                           `Error sending sms notification to ${player.firstName} ${
                              player.lastName
                           } @ ${player.preferredPhone ?? player.phoneNumber}: `,
                           error
                        );
                     }
                  }
               };

               sendTexts();

               // listToNotify.forEach((player) => {
               //    textClient.messages
               //       .create({
               //          from: "(714) 519-2916",
               //          to: player.preferredPhone ?? player.phoneNumber,
               //          body: `Ice Pak Hockey \n\nIt's game day! \n\nOpponent: ${
               //             opponentInfo.teamName
               //          } \nDate and Time: ${dayjs
               //             .unix(gameDay.date.seconds)
               //             .format("MMM D @ h:m")} \nLocation: ${locationInfo.name} (${
               //             locationInfo.googleMapsLink
               //          }) \n \nView game at www.icepakhockey.com/games/${gameDay.id}`,
               //       })
               //       .then((res) =>
               //          console.log(
               //             `successfully sent game day sms notification to ${player.firstName} ${player.lastName}`,
               //             res
               //          )
               //       )
               //       .catch((err) =>
               //          console.log(
               //             `error sending message to ${player.firstName} ${player.lastName}`,
               //             err
               //          )
               //       );
               // });

               return res.status(200).json({
                  message: "Successfully sent game day text notifications.",
                  listToNotify,
               });
            }
         } catch (error) {
            console.log("error", error);
            return res.status(400).json({ message: error });
         }
      default:
         break;
   }
};

export default gameDayNotificationHandler;
