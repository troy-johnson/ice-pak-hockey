import dayjs from "dayjs";
import twilio from "twilio";
import { prisma } from "../../../config";

const gameDayNotificationHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            const gameDays = await prisma.games.findMany({
               where: {
                  date: {
                     lte: dayjs().endOf("day").format(),
                     gte: dayjs().startOf("day").format(),
                  },
               },
               select: {
                  id: true,
                  date: true,
                  roster: true,
                  teams: {
                     select: {
                        teamName: true,
                     },
                  },
                  locations: {
                     select: {
                        name: true,
                        googleMapsLink: true,
                     },
                  },
               },
            });

            const players = await prisma.players.findMany({
               where: {
                  AND: [
                     { id: { in: gameDays.reduce((prev, cur) => [...prev, ...cur.roster], []) } },
                     { gameDayNotifications: true },
                  ],
               },
               select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phoneNumber: true,
                  preferredPhone: true,
               },
            });

            console.log("game test", players);

            if (gameDays) {
               const utc = require("dayjs/plugin/utc");
               dayjs.extend(utc);

               let listToNotify = gameDays.map((game) => {
                  return {
                     ...game,
                     phoneNumbers: players.filter((player) => game.roster.includes(player.id)),
                  };
               });

               console.log("listToNotify", listToNotify);

               const result = [];

               const textClient = twilio(
                  process.env.TWILIO_ACCOUNT_SID,
                  process.env.TWILIO_AUTH_TOKEN
               );

               // NOTE: Time format has to include utc offset as api route is hosted in Washington D.C.

               const sendTexts = async () => {
                  for (const game of listToNotify) {
                     console.log("game", game)
                     for (const player of game.phoneNumbers) {
                        try {
                           console.log("phoneNumbers", player)
                           await textClient.messages.create({
                              from: "(714) 519-2916",
                              to: player?.preferredPhone !== '' ? player?.preferredPhone : player?.phoneNumber,
                              body: `Ice Pak Hockey \n\nIt's game day! \n\nOpponent: ${
                                 game.teams.teamName
                              } \nTime: ${dayjs(game.date)
                                 .local()
                                 .format("h:mm a")} \nLocation: ${game.locations.name} (${
                                 game.locations.googleMapsLink
                              }) \n \nView game at www.icepakhockey.com/games/${game.id}`,
                           });

                           console.log(
                              `Successfully sent sms notification to ${player.firstName} ${
                                 player.lastName
                              } @ ${player?.preferredPhone !== '' ? player?.preferredPhone : player?.phoneNumber}`
                           );

                           result.push({
                              name: `${player.firstName} ${player.lastName}`,
                              phoneNumber: player?.preferredPhone !== '' ? player?.preferredPhone : player?.phoneNumber,
                              status: "success",
                           });
                        } catch (error) {
                           console.log(
                              `Error sending sms notification to ${player.firstName} ${
                                 player.lastName
                              } @ ${player?.preferredPhone !== '' ? player?.preferredPhone : player?.phoneNumber}: `,
                              error
                           );

                           result.push({
                              name: `${player.firstName} ${player.lastName}`,
                              phoneNumber: player?.preferredPhone !== '' ? player?.preferredPhone : player?.phoneNumber,
                              status: "error",
                           });
                        }
                     }
                  }
               };

               await sendTexts();

               return res.status(200).json({ result });
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
