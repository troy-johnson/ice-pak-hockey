import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
import { FaCalendarDay } from "react-icons/fa";
import { Loading, PageContainer, UpsertGame } from "../components";
import {
   editPlayerGameStatus,
   roleCheck,
   useGetAllGames,
   useGetProfile,
   useGetSeasons,
} from "../utils";

const ArrowButton = styled(IconButton)`
   color: ${(props) => props.theme.palette.black};
`;

const Schedule = () => {
   const [date, setDate] = useState(dayjs());
   const [game, setGame] = useState(null);
   const [gameAction, setGameAction] = useState("add");
   const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });
   const [upsertGameDialog, setUpsertGameDialog] = useState(false);

   const { data: session, status } = useSession();
   const loading = status === "loading";

   const { allGames, allGamesLoading, allGamesError } = useGetAllGames();
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const { profile, profileLoading, profileError } = useGetProfile();

   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const isWin = (icePakGoals, opponentGoals) => {
      if (icePakGoals > opponentGoals) {
         return "W";
      } else if (icePakGoals === opponentGoals) {
         return "T";
      }
      return "L";
   };

   if (allGamesLoading) {
      return <Loading />;
   } else if (allGamesError) {
      return <Alert severity="error">Error retrieving schedule. Please try again later.</Alert>;
   }

   const updateGameRoster = async (e, gameId) => {
      const seasonId = allGames?.filter((game) => game.id === gameId)?.[0]?.seasonId;
      const seasonPlayerData = seasons
         ?.find((season) => season.id === seasonId)
         ?.roster?.find((player) => player.playerId === profile.playerId);

      try {
         await editPlayerGameStatus({
            gameId,
            playerId: profile.playerId,
            fullName: seasonPlayerData?.fullName,
            jerseyNumber: seasonPlayerData?.jerseyNumber,
            position: seasonPlayerData?.position,
            seasonStatus: seasonPlayerData?.seasonStatus,
            gameStatus: e.target.checked ? "in" : "out",
         });
         setSnackbar({
            open: true,
            type: "success",
            message: `You've checked ${e.target.checked ? "out" : "in"}!`,
         });
         mutate(`/api/games`);
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   console.log("profile", profile)

   const isPlayerRostered = (game) => {
      return game.roster.includes(profile?.playerId);
   };

   const openUpsertGame = (action, game) => {
      setGameAction(action);
      setGame(game);
      setUpsertGameDialog(true);
   };

   const handleDelete = (data) => {
      try {
         deleteGame(data);
         setSnackbar({
            open: true,
            type: "success",
            message: "Game successfully deleted!",
         });
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   return (
      <PageContainer pageTitle="Schedule" small>
         <Stack direction="row" display="flex" alignItems="center" justifyContent="space-between">
            <Stack direction="row" display="flex" alignItems="center">
               <ArrowButton onClick={() => setDate(dayjs(date).subtract(1, "M").date(1))}>
                  <ArrowLeftIcon fontSize="large" />
               </ArrowButton>
               <Typography variant="h5">
                  {date.format(desktop ? "MMMM YYYY" : "MMM YYYY")}
               </Typography>
               <ArrowButton onClick={() => setDate(dayjs(date).add(1, "M").date(1))}>
                  <ArrowRightIcon fontSize="large" />
               </ArrowButton>
            </Stack>
            {!!roleCheck(session, ["Admins"]) ? (
               <Button
                  variant="outlined"
                  onClick={() => openUpsertGame("add")}
                  endIcon={<FaCalendarDay />}
                  sx={{ marginRight: "5px" }}
               >
                  Add Game
               </Button>
            ) : null}
         </Stack>
         <Stack
            direction="column"
            spacing={2}
            sx={{ ml: 2, mr: 2, mb: 2 }}
            divider={<Divider orientation="horizontal" flexItem />}
         >
            {allGames?.gamesData
               ?.filter(
                  (game) =>
                     dayjs(game?.date).isAfter(date.date(1)) &&
                     dayjs(game?.date).isBefore(date.add(1, "M").date(1))
               )
               ?.sort((a, b) => dayjs(a.date) - dayjs(b.date))
               .map((game) => {
                  return (
                     <Stack direction="column" key={game?.id}>
                        <Stack direction="row" display="flex" justifyContent="space-between">
                           <Typography variant="overline" sx={{ fontSize: 14 }}>
                              {dayjs(game?.date).format("ddd M/D h:mm A")}
                           </Typography>
                           <Typography variant="overline" sx={{ fontSize: 14 }}>
                              {dayjs().isAfter(dayjs(game?.date))
                                 ? `FINAL ${
                                      game?.goals?.filter((goal) => goal.team === "Ice Pak").length
                                   } - ${
                                      game?.goals?.filter((goal) => goal.team !== "Ice Pak").length
                                   } (${isWin(
                                      game?.goals?.filter((goal) => goal.team === "Ice Pak").length,
                                      game?.goals?.filter((goal) => goal.team !== "Ice Pak").length
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
                              vs. {game?.teams?.teamName}
                           </Typography>
                           {profile ? (
                              <FormControlLabel
                                 labelPlacement="end"
                                 label="In/Out"
                                 control={
                                    <Checkbox
                                       icon={<IndeterminateCheckBoxIcon />}
                                       checked={isPlayerRostered(game)}
                                       sx={{
                                          color: dayjs().isAfter(dayjs(game?.date))
                                             ? grey[500]
                                             : red[700],
                                          "&.Mui-checked": {
                                             color: dayjs().isAfter(dayjs(game?.date))
                                                ? grey[400]
                                                : green[700],
                                          },
                                       }}
                                       disabled={dayjs().isAfter(dayjs(game?.date))}
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
            {upsertGameDialog ? (
               <UpsertGame
                  gameAction={gameAction}
                  close={() => {
                     setGame(null);
                     setUpsertGameDialog(false);
                  }}
                  open={upsertGameDialog}
                  game={game}
                  setSnackbar={setSnackbar}
                  opponentId={game?.opponentId}
                  opponentName={game?.opponentName}
               />
            ) : null}
         </Stack>
         <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
         >
            <Alert
               onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
               severity={snackbar.type}
               variant="filled"
               sx={{ width: "100%" }}
            >
               {snackbar.message}
            </Alert>
         </Snackbar>
      </PageContainer>
   );
};

export default Schedule;
