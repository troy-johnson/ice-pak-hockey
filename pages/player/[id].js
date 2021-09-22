import { useRouter } from "next/router";
import { getRoster } from "../../utils";

const Player = () => {
   const router = useRouter();
   const { id } = router.query;
   const { roster, isLoading, isError } = getRoster();

   const player = roster?.filter(player => player.id === id)[0];

   console.log("player", player)

   return (
      <>
         <h1>{player?.firstName} {player?.lastName}</h1>
         <h2>{player?.position} {`#${player?.jerseyNumber}`}</h2>
      </>
   );
};

export default Player;
