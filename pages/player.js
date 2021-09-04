import { useGetPlayer } from "../utils";

const Player = () => {
   const { player, isLoading, isError } = useGetPlayer();

   return (
      <>
         <h1>Roster</h1>
         {player
            ? roster.map((player) => {
                 return <div key={player.id}>{JSON.stringify(player)}</div>;
              })
            : null}
      </>
   );
};

export default Player;
