import Link from "next/link";
import { useGetRoster } from "../utils";

const Roster = () => {
   const { roster, isLoading, isError } = useGetRoster();

   return (
      <>
         <h1>Roster</h1>
         {roster
            ? roster.map((player) => {
                 return (
                    <Link key={player.id} href={`/player/${player.id}`}>
                       <div>
                          {player.firstName + " " + player.lastName}
                       </div>
                    </Link>
                 );
              })
            : null}
      </>
   );
};

export default Roster;
