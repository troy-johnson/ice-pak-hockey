import { getGames, getGoals, getOpponents } from ".";

const getSchedule = () => {
   const { games, gamesLoading, gamesError } = getGames();
   const { goals, goalsLoading, goalsError } = getGoals();
   const { opponents, opponentsLoading, opponentsError } = getOpponents();

   const error = gamesError | goalsError | opponentsError;

   let schedule = [];

   console.log("games", games);
   console.log("goals", goals);
   console.log("goals", opponents);

   games?.forEach((game) => {

      schedule.push({
         goals: goals.filter((goal) => goal.gameId === game.id),
         date: game.date,
         opponent: opponents.filter(
            (opponent) => opponent.id === game.opponentId
         )[0],
         roster,
      });
   });

   return {
      schedule,
      scheduleLoading: !error && !schedule,
      scheduleError: error,
   };
};

export default getSchedule;
