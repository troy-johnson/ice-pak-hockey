import styled from "@emotion/styled";
// import Link from "next/link";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const StyledScheduleGameCard = ({ className, children, game }) => {
   return (
      <GameCard className={className}>
         <CardContent>{children}</CardContent>
         <CardActions>
            {/* <Link key={game.id} href={`/games/${game.id}`}> */}
               <Button size="small">View Game</Button>
            {/* </Link> */}
         </CardActions>
      </GameCard>
   );
};

const StyledDate = ({ className, day }) => {
   return (
      <Typography className={className} variant="h5">
         {day}
      </Typography>
   );
};

export const GameCard = styled(Card)`
   margin: 10px 5px;
`;

export const ScheduleGameCard = styled(StyledScheduleGameCard)`
   max-width: 100%;
`;

export const ScheduleGameDate = styled(StyledDate)`
   width: 100%;
`;
