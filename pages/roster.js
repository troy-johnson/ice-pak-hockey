import { useGetRoster } from "../utils";

const Roster = () => {
   const { roster, isLoading, isError } = useGetRoster();

   return (
      <>
         <h1>Roster</h1>
         {roster
            ? roster.map((player) => {
                 return <div key={player.id}>{JSON.stringify(player)}</div>;
              })
            : null}
      </>
   );
};

export default Roster;
