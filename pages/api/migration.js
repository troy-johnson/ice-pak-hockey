import { prisma } from "../../config";

const migrationsHandler = async (req, res) => {
   const stats = [
      {
         fullName: "Ned White",
         gamesPlayed: 15,
      },
      {
         fullName: "Ben Lieberman",
         gamesPlayed: 3,
      },
      {
         fullName: "Dave Mohr",
         gamesPlayed: 5,
      },
      {
         fullName: "Troy Johnson",
         gamesPlayed: 14,
      },
      {
         fullName: "Chris Browne",
         gamesPlayed: 15,
      },
      {
         fullName: "Eric Capps",
         gamesPlayed: 14,
      },
      {
         fullName: "John Pereira",
         gamesPlayed: 9,
      },
      {
         fullName: "Blake Moss",
         gamesPlayed: 8,
      },
      {
         fullName: "Rich Greenberg",
         gamesPlayed: 10,
      },
      {
         fullName: "Christiaan O'Connor",
         gamesPlayed: 15,
      },
      {
         fullName: "Todd Rankin",
         gamesPlayed: 7,
      },
      {
         fullName: "Gracie Capps",
         gamesPlayed: 4,
      },
      {
         fullName: "Stefan Wilson",
         gamesPlayed: 13,
      },
      {
         fullName: "Benjamin Smith",
         gamesPlayed: 5,
      },
      {
         goals: 4,
         fullName: "Per Gesteland",
         gamesPlayed: 12,
         penaltyMinutes: 6,
      },
      {
         fullName: "Jake Barnes",
         gamesPlayed: 11,
         penaltyMinutes: 18.5,
      },
      {
         goals: 3,
         fullName: "Jay Bartlett",
         gamesPlayed: 10,
         penaltyMinutes: 4.5,
      },
      {
         goals: 11,
         fullName: "Henry Levy",
         gamesPlayed: 7,
      },
      {
         goals: 10,
         fullName: "Mike Thompson",
         gamesPlayed: 10,
         penaltyMinutes: 19.5,
      },
      {
         fullName: "Dave Dries",
         gamesPlayed: 8,
      },
   ];

   try {
      const seasonStartDate = new Date("June 28, 2021 5:00 PM");

      let daysToSkip = 4;

      const data = games.map((game, index) => {
         daysToSkip += Math.ceil(Math.random() * (7 - 2) + 2);

         return {
            ...game,
            date: new Date(seasonStartDate.setDate(daysToSkip)),
         };
      });

      await prisma.games.createMany({
         data,
      });

      return res.status(200);
   } catch (error) {
      return res.status(400).json(error);
   }
};

export default migrationsHandler;
