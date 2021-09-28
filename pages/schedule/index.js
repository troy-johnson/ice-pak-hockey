import { useState } from "react";
import { ScheduleGameCard, ScheduleGameDate } from "./schedule.styled";
import { getAllGames } from "../../utils";

const Schedule = () => {
   const [date, setDate] = useState(new Date());
   const { games, gamesLoading, gamesError } = getAllGames();

   return (
      <>
         <h1>Schedule</h1>
         <h2>
            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(date)}{" "}
            {date.getFullYear()}
         </h2>
         {games
            ? games
                 ?.filter((game) => new Date(game.date.seconds) < date)
                 ?.sort(
                    (a, b) =>
                       new Date(a.date.seconds) - new Date(b.date.seconds)
                 )
                 .map((game) => {
                    console.log("game", game);
                    return (
                       <ScheduleGameCard game={game} key={game.id}>
                          <ScheduleGameDate
                             day={`${new Intl.DateTimeFormat("en-US", {
                                weekday: "long",
                             })
                                .format(game.date.seconds * 1000)
                                .split("")
                                .slice(0, 3)
                                .join("")} ${
                                new Date(game.date.seconds * 1000).getMonth() +
                                1
                             }/${new Date(game.date.seconds * 1000).getDate()}`}
                          />
                          <div>
                             {" @ " +
                                new Date(
                                   game.date.seconds * 1000
                                ).toLocaleTimeString([], {
                                   hour: "2-digit",
                                   minute: "2-digit",
                                }) +
                                " vs. " +
                                game?.opponentName}
                          </div>
                       </ScheduleGameCard>
                    );
                 })
            : null}
      </>
   );
};

export default Schedule;
