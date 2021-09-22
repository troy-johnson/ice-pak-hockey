import { getSchedule } from "../utils";

const Schedule = () => {
   const { schedule, isLoading, isError } = getSchedule();

   return (
      <>
         <h1>Schedule</h1>
         {schedule
            ? schedule?.map((game) => {
               console.log('sec', new Date(game.date.seconds * 1000))
                 return (
                    <div key={game.id}>
                       {new Date(game.date.seconds * 1000).toLocaleDateString()}
                    </div>
                 );
              })
            : null}
      </>
   );
};

export default Schedule;
