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
   Divider,
   IconButton,
   Link as MuiLink,
   Skeleton,
   Stack,
   Typography,
   useMediaQuery,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Loading, PageContainer } from "../components";
import { useGetAllGames } from "../utils";

const ArrowButton = styled(IconButton)`
   color: ${(props) => props.theme.palette.black};
`;

// TODO: Figure out card background image using data:image/png;base64,game.locationImage

const Schedule = () => {
   const [date, setDate] = useState(dayjs());
   const { games, gamesLoading, gamesError } = useGetAllGames();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const isGameEnded = (gameTime) => dayjs().isAfter(dayjs(gameTime));
   const isWin = (icePakGoals, opponentGoals) => {
      if (icePakGoals > opponentGoals) {
         return "W";
      } else if (icePakGoals === opponentGoals) {
         return "T";
      }
      return "L";
   };

   const schedule = games.map((game) => {
      return {
         date: game?.date?.seconds,
         opponentName: game?.opponentName,
         locationName: game?.locationName,
      };
   });

   if (gamesLoading) {
      return <Loading />;
   } else if (gamesError) {
      return <Alert severity="error">Error retrieving schedule. Please try again later.</Alert>;
   }

   return (
      <PageContainer pageTitle="Schedule" small>
         <Stack direction="row" display="flex" alignItems="center">
            <ArrowButton onClick={() => setDate(dayjs(date).subtract(1, "M").date(1))}>
               <ArrowLeftIcon fontSize="large" />
            </ArrowButton>
            <Typography variant="h5">{date.format("MMMM YYYY")}</Typography>
            <ArrowButton onClick={() => setDate(dayjs(date).add(1, "M").date(1))}>
               <ArrowRightIcon fontSize="large" />
            </ArrowButton>
         </Stack>
         <Stack
            direction="column"
            spacing={2}
            sx={{ ml: 2, mr: 2, mb: 2 }}
            divider={<Divider orientation="horizontal" flexItem />}
         >
            {games
               ? games
                    ?.filter(
                       (game) =>
                          dayjs.unix(game?.date.seconds).isAfter(date) &&
                          dayjs.unix(game?.date.seconds).isBefore(date.add(1, "M").date(1))
                    )
                    ?.sort((a, b) => dayjs(a.date.seconds) - dayjs(b.date.seconds))
                    .map((game) => {
                       return (
                          <Link href={`/games/${game?.id}`} key={game?.id} passHref>
                             <Stack direction="column">
                                <Stack
                                   direction="row"
                                   display="flex"
                                   justifyContent="space-between"
                                >
                                   <Typography variant="overline" sx={{ fontSize: 14 }}>
                                      {dayjs.unix(game?.date.seconds).format("ddd M/D h:mm A")}
                                   </Typography>
                                   <Typography variant="overline" sx={{ fontSize: 14 }}>
                                      {dayjs().isAfter(dayjs.unix(game?.date.seconds))
                                         ? `FINAL ${game.icePakGoals} - ${
                                              game.opponentGoals
                                           } (${isWin(game.icePakGoals, game.opponentGoals)})`
                                         : ""}
                                   </Typography>
                                </Stack>
                                <Typography gutterBottom variant="h5">
                                   {game?.opponentName}
                                </Typography>
                                <Typography variant="caption">
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
                                </Typography>
                             </Stack>
                          </Link>
                       );
                    })
               : null}
         </Stack>
      </PageContainer>
   );
};

export default Schedule;
