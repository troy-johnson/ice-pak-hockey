import { useRouter } from "next/router";
import { getPlayers } from "../../utils";

const Player = () => {
   const router = useRouter();
   const { id } = router.query;
   const { players, playersLoading, playersError } = getPlayers();

   const player = players?.filter(player => player.id === id)[0];

   return (
      <>
         <h1>{player?.firstName} {player?.lastName}</h1>
         <h2>{player?.position} {`#${player?.jerseyNumber}`}</h2>
      </>
   );
};

export default Player;
