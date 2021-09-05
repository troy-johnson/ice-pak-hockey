import { useGetSchedule } from "../utils";

const Schedule = () => {
   const { schedule, isLoading, isError } = useGetSchedule();

   return (
      <>
         <h1>Schedule</h1>
         {schedule
            ? schedule?.map((game) => {
                 return <div key={game.id}></div>;
              })
            : null}
      </>
   );
};

export default Schedule;
