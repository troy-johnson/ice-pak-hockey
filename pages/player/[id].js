import { useRouter } from "next/router";
import { useGetPlayer } from "../../utils";

const Player = () => {
   const router = useRouter();
   const { id } = router.query;

   const { player, isLoading, isError } = useGetPlayer(id);

   console.log("player", player)

   return (
      <>
         <h1>{player?.firstName} {player?.lastName}</h1>
         <h2>{player?.position} {`#${player?.jerseyNumber}`}</h2>
      </>
   );
};

export default Player;
