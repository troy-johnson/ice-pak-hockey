import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import * as dayjs from "dayjs";
import {
   Alert,
   Button,
   Card,
   CardActions,
   CardContent,
   Link as MuiLink,
   Skeleton,
   Typography,
   useMediaQuery,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useGetAllGames } from "../utils";

const StyledScheduleGameCard = ({ className, children, game }) => {
   return (
      <GameCard className={className}>
         <CardContent>{children}</CardContent>
         <CardActions>
            <Link key={game?.id} href={`/games/${game?.id}`} passHref>
               <Button size="small">View Game</Button>
            </Link>
         </CardActions>
      </GameCard>
   );
};

const StyledLoader = ({ className }) => {
   return (
      <GameCard className={className}>
         <DateTime variant="overline">
            <Skeleton variant="text" />
         </DateTime>
         <Opponent variant="body1">
            <Skeleton variant="rectangle" height={115} />
         </Opponent>
      </GameCard>
   );
};

const GameCard = styled(Card)`
   margin: 10px 5px;
`;

const ScheduleGameCard = styled(StyledScheduleGameCard)`
   max-width: 100%;
   margin: 15px;
`;

const DateTime = styled(Typography)`
   letter-spacing: 0.2rem;
   font-size: 1.1rem;
   width: 100%;
   margin-bottom: 5px;
`;

const Opponent = styled(Typography)`
   font-size: 1.5rem;
   width: 100%;
   margin-bottom: 5px;
   margin-top: 5px;
`;

const Location = styled(Typography)`
   font-size: 1.25rem;
   width: 100%;
   display: flex;
   margin-top: 10px;
   align-items: center;
`;

const Score = styled(Typography)`
   letter-spacing: 0.2rem;
   font-size: 1.1rem;
   width: 100%;
`;

const Season = styled(Typography)`
   letter-spacing: 0.2rem;
   font-size: 1.1rem;
   width: 100%;
   margin-bottom: 5px;
`;

const Loader = styled(StyledLoader)`
   margin: 15px;

   span > span,
   p > span {
      margin: 5px 10px;
   }

   p > span {
      margin-bottom: 15px;
   }
`;

const Schedule = () => {
   const [date, setDate] = useState(dayjs());
   const { games, gamesLoading, gamesError } = useGetAllGames();
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

   console.log("games", games);
   // console.log('desktop', desktop)

   if (gamesLoading) {
      return (
         <>
            <Loader />
            <Loader />
            <Loader />
         </>
      );
   } else if (gamesError) {
      return (
         <Alert severity="error">
            Error retrieving schedule. Please try again later.
         </Alert>
      );
   }

   return (
      <>
         <Typography variant="h3">Schedule</Typography>
         <Typography variant="h4">{date.format("MMMM YYYY")}</Typography>
         {games
            ? games
                 ?.filter((game) => dayjs(game?.date.seconds) < date)
                 ?.sort((a, b) => dayjs(a.date.seconds) - dayjs(b.date.seconds))
                 .map((game) => {
                    let icePakGoals = game?.goals.filter(
                       (goal) => goal.icePakGoal
                    ).length;
                    let opponentGoals = game?.goals.filter(
                       (goal) => !goal.icePakGoal
                    ).length;
                    return (
                       <ScheduleGameCard game={game} key={game?.id}>
                          <DateTime variant="overline">
                             {isGameEnded(game?.date.seconds) ? (
                                dayjs
                                   .unix(game?.date.seconds)
                                   .format("ddd M/D h:mm A")
                             ) : (
                                <>
                                   {dayjs
                                      .unix(game?.date.seconds)
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
                          </DateTime>
                          {/* <Season variant="caption">{game?.seasonName}</Season> */}
                          <Opponent variant="body1">
                             {game?.opponentName}
                          </Opponent>
                          <Location variant="body2">
                             <LocationOnIcon />
                             <MuiLink
                                href={game?.locationMapLink}
                                alt={`View ${game?.locationName} on Google Maps`}
                                color="primary"
                                underline="hover"
                                target="_blank"
                                rel="noopener"
                             >
                                {game?.locationName}
                             </MuiLink>
                          </Location>
                       </ScheduleGameCard>
                    );
                 })
            : null}
      </>
   );
};

export default Schedule;
