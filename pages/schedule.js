import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { mutate } from "swr";
import {
   Alert,
   Button,
   Checkbox,
   Divider,
   FormControlLabel,
   Snackbar,
   IconButton,
   Link as MuiLink,
   Skeleton,
   Stack,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { Loading, PageContainer } from "../components";
import { editPlayerGameStatus, useGetAllGames, useGetProfile } from "../utils";

const ArrowButton = styled(IconButton)`
   color: ${(props) => props.theme.palette.black};
`;

// TODO: Figure out card background image using data:image/png;base64,game.locationImage

const Schedule = () => {
   const [date, setDate] = useState(dayjs());
   const [gameStatus, setGameStatus] = useState({});
   const { games, gamesLoading, gamesError } = useGetAllGames();
   const { profile, profileLoading, profileError } = useGetProfile();
   const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

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

   // console.log("gameStatus", profile);

   if (gamesLoading) {
      return <Loading />;
   } else if (gamesError) {
      return <Alert severity="error">Error retrieving schedule. Please try again later.</Alert>;
   }

   const updateGameRoster = (e, gameId) => {
      // console.log("updateGameRoster", { checked: e.target.checked, gameId });
      // const otherGames = gameStatus?.filter((el) => el.gameId !== gameId);
      setGameStatus({ gameId, status: e.target.checked });

      try {
         editPlayerGameStatus({
            gameId,
            playerId: profile.playerId,
            status: e.target.checked ? "in" : "out",
         });
         mutate(`/api/games`);
         setSnackbar({
            open: true,
            type: "success",
            message: `You've checked ${e.target.checked ? "in" : "out"}!`,
         });
         setGameStatus({})
      } catch (error) {
         console.log("Roster update error: ", error);
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
         setGameStatus({})
      }
   };

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
               ?.filter(
                  (game) =>
                     dayjs.unix(game?.date.seconds).isAfter(date) &&
                     dayjs.unix(game?.date.seconds).isBefore(date.add(1, "M").date(1))
               )
               ?.sort((a, b) => dayjs(a.date.seconds) - dayjs(b.date.seconds))
               .map((game) => {
                  return (
                     <Stack direction="column" key={game?.id}>
                        <Stack direction="row" display="flex" justifyContent="space-between">
                           <Typography variant="overline" sx={{ fontSize: 14 }}>
                              {dayjs.unix(game?.date.seconds).format("ddd M/D h:mm A")}
                           </Typography>
                           <Typography variant="overline" sx={{ fontSize: 14 }}>
                              {dayjs().isAfter(dayjs.unix(game?.date.seconds))
                                 ? `FINAL ${game.icePakGoals} - ${game.opponentGoals} (${isWin(
                                      game.icePakGoals,
                                      game.opponentGoals
                                   )})`
                                 : ""}
                           </Typography>
                        </Stack>
                        <Stack
                           display="flex"
                           direction="row"
                           alignItems="center"
                           justifyContent="space-between"
                        >
                           <Typography gutterBottom variant="h5">
                              {game?.opponentName}
                           </Typography>
                           {profile ? (
                              <FormControlLabel
                                 labelPlacement="end"
                                 label="In/Out"
                                 control={
                                    <Checkbox
                                       icon={<IndeterminateCheckBoxIcon />}
                                       checked={
                                          gameStatus.gameId === game.id
                                             ? gameStatus?.status
                                             : games
                                                  ?.filter((el) => game.id === el.id)?.[0]
                                                  ?.roster.includes(profile?.playerId)
                                       }
                                       sx={{
                                          color: dayjs().isAfter(dayjs.unix(game?.date.seconds))
                                             ? grey[500]
                                             : red[700],
                                          "&.Mui-checked": {
                                             color: dayjs().isAfter(dayjs.unix(game?.date.seconds))
                                                ? grey[400]
                                                : green[700],
                                          },
                                       }}
                                       disabled={dayjs().isAfter(dayjs.unix(game?.date.seconds))}
                                       onChange={(e) => updateGameRoster(e, game.id)}
                                    />
                                 }
                              />
                           ) : null}
                        </Stack>
                        <Stack
                           display="flex"
                           direction="row"
                           alignItems="center"
                           justifyContent="space-between"
                        >
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
                           <Link href={`/games/${game?.id}`} passHref>
                              <Button variant="contained">View Game</Button>
                           </Link>
                        </Stack>
                     </Stack>
                  );
               })}
         </Stack>
         <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
         >
            <Alert
               onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
               severity={snackbar.type}
               sx={{ width: "100%" }}
            >
               {snackbar.message}
            </Alert>
         </Snackbar>
      </PageContainer>
   );
};

export default Schedule;
