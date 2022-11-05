import { prisma } from "../../config";
import dayjs from "dayjs";
import { batch } from "react-redux";

const migrateData = async () => {
   await prisma.seasons.update({
      where: {
         id: "91385e9d-638b-4b32-92b4-382921e7d8fd",
      },
      data: {
         roster: [
            "de29cb3c-ef2a-4d57-85f3-5bed1d8de590",
            "c76eac51-7107-4f26-b12a-a7603e9bfb1a",
            "6aca8aef-47b6-413f-ad0a-648e36904100",
            "7a324a2a-6202-42ab-bf8a-031a1c16dc67",
            "6002f0aa-676b-4592-be6e-f84e06f33087",
            "226a7aba-886a-4c91-bf00-f09193174733",
            "329c924a-96f8-4a4b-bb56-40345cf59a43",
            "13112f91-c586-488e-9355-aed047c7ca5f",
            "b3c6ef3f-f6ac-4860-9294-512ccba99bdb",
            "4a4a603c-5139-4030-aed1-8c0629cda73b",
            "f9585060-105f-4ec1-b528-c9dfaa9ca8e8",
            "cf42ed3a-214e-447b-aa0e-dd5e2520069a",
            "a47502b3-1db3-4465-9682-ef042259ecce",
            "feb7db66-05d3-4fc0-be84-a5e2772ff305",
            "048a353d-1a9c-4c5e-b0e5-b034aa15b2c7",
            "b7c925f3-8f31-455e-a402-41dbd8d42bf8",
            "7f22d8f9-8d11-4119-a86e-3362c76f0089",
            "30f91440-f727-4744-b04b-1cb07c7eebe0",
            "a95088fb-7f22-4392-9a9d-93b17e849e8d",
            "420ea60d-326a-4e83-935f-6fd675211e2a",
            "057f3718-8bd1-486c-87ae-3c0666a8d6de",
            "6aca0d5e-2896-4ea7-b42c-9d683ff8adce",
         ],
      },
   });
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

   try {
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
