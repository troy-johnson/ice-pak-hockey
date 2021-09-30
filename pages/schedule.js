import { useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import * as dayjs from "dayjs";
import {
   Button,
   Card,
   CardActions,
   CardContent,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { getAllGames } from "../utils";

const StyledScheduleGameCard = ({ className, children, game }) => {
   return (
      <GameCard className={className}>
         <CardContent>{children}</CardContent>
         <CardActions>
            <Link key={game.id} href={`/games/${game.id}`} passHref>
               <Button size="small">View Game</Button>
            </Link>
         </CardActions>
      </GameCard>
   );
};

const GameCard = styled(Card)`
   margin: 10px 5px;
`;

const ScheduleGameCard = styled(StyledScheduleGameCard)`
   max-width: 100%;
`;

const ScheduleGameDate = styled(Typography)`
   letter-spacing: 0.2rem;
   font-size: 1.1rem;
   width: 100%;
`;

const Opponent = styled(Typography)`
   font-size: 1.5rem;
   width: 100%;
`;

const Location = styled(Typography)`
   font-size: 1.25rem;
   width: 100%;
`;

const Score = styled(Typography)`
   letter-spacing: 0.2rem;
   font-size: 1.1rem;
   width: 100%;
`;

const Schedule = () => {
   const [date, setDate] = useState(dayjs());
   const { games, gamesLoading, gamesError } = getAllGames();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const isGameEnded = (gameTime) => dayjs().isAfter(dayjs(gameTime));
   const isWin = (icePakGoals, opponentGoals) => {
      if (icePakGoals > opponentGoals) {
         return "Win";
      } else if (icePakGoals === opponentGoals) {
         return "Tie";
      }
      return "Loss";
   };

   return (
      <>
         <Typography variant="h3">Schedule</Typography>
         <Typography variant="h4">{date.format("MMMM YYYY")}</Typography>
         {games
            ? games
                 ?.filter((game) => dayjs(game.date.seconds) < date)
                 ?.sort((a, b) => dayjs(a.date.seconds) - dayjs(b.date.seconds))
                 .map((game) => {
                    console.log("game", game);
                    let icePakGoals = game.goals.filter(
                       (goal) => goal.icePakGoal
                    ).length;
                    let opponentGoals = game.goals.filter(
                       (goal) => !goal.icePakGoal
                    ).length;
                    return (
                       <ScheduleGameCard game={game} key={game.id}>
                          <ScheduleGameDate variant="overline">
                             {isGameEnded(game.date.seconds) ? (
                                dayjs
                                   .unix(game.date.seconds)
                                   .format("ddd M/D h:mm A")
                             ) : (
                                <>
                                   {dayjs
                                      .unix(game.date.seconds)
                                      .format("ddd M/D")}{" "}
                                   - FINAL
                                   <Score variant="overline">
                                      {`${isWin(
                                         icePakGoals,
                                         opponentGoals
                                      )} ${icePakGoals} - ${opponentGoals}`}
                                   </Score>
                                </>
                             )}
                          </ScheduleGameDate>
                          <Opponent variant="body1">
                             {game?.opponentName}
                          </Opponent>
                          <Location variant="body2">{game.rink}</Location>
                       </ScheduleGameCard>
                    );
                 })
            : null}
      </>
   );
};

export default Schedule;
