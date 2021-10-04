import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { Typography, useMediaQuery } from "@mui/material";
import { useGetGameInfo} from "../../utils";

const GameContainer = styled.section`
   display: flex;
   flex-direction: column;
   margin: 15px;
`;

const Game = () => {
   const router = useRouter();
   const { id } = router.query;

   const { game, gameLoading, gameError } = useGetGameInfo(id);

   console.log("game", game)

   if (gameLoading) {
      return <GameContainer>Loading...</GameContainer>
   } else if (gameError) {
      return <GameContainer>Error retrieving game data. Please try again later.</GameContainer>
   }

   return (
      <GameContainer>
         <Typography variant="h3">Game</Typography>
         {game ? <div>{JSON.stringify(game)}</div> : null}
      </GameContainer>
   );
};

export default Game;
