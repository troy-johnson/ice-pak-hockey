import Link from "next/link";
import { getPlayers } from "../../utils";

const Roster = () => {
   const { players, playersLoading, playersError } = getPlayers();

   if (playersLoading) {
      return <div>Loading...</div>;
   } else if (playersError) {
      return <div>An error occurred. Please try again.</div>;
   }

   return (
      <>
         <h1>Roster</h1>
         {players
            ? players.map((player) => {
                 return (
                    <Link key={player.id} href={`/player/${player.id}`}>
                       <div>{player.firstName + " " + player.lastName}</div>
                    </Link>
                 );
              })
            : null}
      </>
   );
};

export default Roster;
