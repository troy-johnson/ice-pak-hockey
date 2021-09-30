import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import {
   Alert,
   Button,
   Card,
   CardActions,
   CardContent,
   IconButton,
   Link as MuiLink,
   Skeleton,
   Typography,
   useMediaQuery,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useGetAllGames } from "../utils";

const StyledScheduleGameCard = ({ className, children, desktop, game }) => {
   return (
      <Card className={className}>
         <CardContent>{children}</CardContent>
         <CardActions>
            <Link key={game?.id} href={`/games/${game?.id}`} passHref>
               <Button
                  size={desktop ? "medium" : "small"}
                  color="secondary"
                  variant="outlined"
               >
                  View Game
               </Button>
            </Link>
         </CardActions>
      </Card>
   );
};

const StyledLoader = ({ className }) => {
   return (
      <Card className={className}>
         <DateTime variant="overline">
            <Skeleton variant="text" />
         </DateTime>
         <Opponent variant="body1">
            <Skeleton variant="rectangle" height={115} />
         </Opponent>
      </Card>
   );
};

const ScheduleGameCard = styled(StyledScheduleGameCard)`
   max-width: 100%;
   margin: 15px 0px;
`;

const DateTime = styled(Typography)`
   letter-spacing: 0.2rem;
   font-size: 1.1rem;
   width: 100%;
   margin-bottom: 5px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
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

const DateContainer = styled.div`
   display: flex;
   align-items: center;
   margin-left: -15px;
`;

const ArrowButton = styled(IconButton)`
   color: ${(props) => props.theme.palette.black};
`;

const Loader = styled(StyledLoader)`
   span > span,
   p > span {
      margin: 5px 10px;
   }

   p > span {
      margin-bottom: 15px;
   }
`;


// TODO: Figure out card background image using data:image/png;base64,game.locationImage

const ScheduleContainer = styled.section`
   margin: 15px;
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
   console.log(
      "date comparison",
      games.filter((game) => dayjs.unix(game?.date.seconds) > date)
   );

   console.log("date", date.format("MM DD YY"));

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
      <ScheduleContainer>
         <Typography variant="h3">Schedule</Typography>
         <DateContainer>
            <ArrowButton
               onClick={() => setDate(dayjs(date).subtract(1, "M").date(1))}
            >
               <ArrowLeftIcon fontSize="large" />
            </ArrowButton>
            <Typography variant="h5">{date.format("MMMM YYYY")}</Typography>
            <ArrowButton
               onClick={() => setDate(dayjs(date).add(1, "M").date(1))}
            >
               <ArrowRightIcon fontSize="large" />
            </ArrowButton>
         </DateContainer>
         {games
            ? games
                 ?.filter((game) => dayjs.unix(game?.date.seconds) > date)
                 ?.sort((a, b) => dayjs(a.date.seconds) - dayjs(b.date.seconds))
                 .map((game) => {
                    let icePakGoals = game?.goals.filter(
                       (goal) => goal.icePakGoal
                    ).length;
                    let opponentGoals = game?.goals.filter(
                       (goal) => !goal.icePakGoal
                    ).length;
                    return (
                       <ScheduleGameCard
                          game={game}
                          desktop={desktop}
                          key={game?.id}
                       >
                          <DateTime variant="overline">
                             <span>
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
                             </span>
                             {desktop ? <span>{game?.seasonName}</span> : null}
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
      </ScheduleContainer>
   );
};

export default Schedule;
