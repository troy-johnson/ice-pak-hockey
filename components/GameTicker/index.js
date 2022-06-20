import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconButton, Paper, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllGames, useGetGoals, useGetOpponents } from "../../utils";
import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";

const GameTicker = () => {
   const [desktopSlice, setDesktopSlice] = useState([0, 4]);
   const [mobileSlice, setMobileSlice] = useState([0, 1]);
   const { games, gamesLoading, gamesError } = useGetAllGames();
   const { goals, goalsLoading, goalsError } = useGetGoals();
   const { opponents, opponentsLoading, opponentsError } = useGetOpponents();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const gamesToShow = games
      ?.sort((a, b) => dayjs(a.date.seconds) - dayjs(b.date.seconds))
      ?.slice(
         desktop ? desktopSlice[0] : mobileSlice[0],
         desktop ? desktopSlice[1] : mobileSlice[1]
      )
      .map((game) => {
         const opponentLogo = opponents?.filter((opp) => opp.id === game?.opponentId)[0]?.logo;
         return { ...game, opponentLogo };
      });

   const getIcePakGoals = (game) => {
      return goals?.filter((goal) => goal.gameId === game.id && !!goal.playerId).length;
   };

   const getOpponentGoals = (game) => {
      return goals?.filter((goal) => goal.gameId === game.id && !!goal.opponentId).length;
   };

   useEffect(() => {
      if (!gamesLoading && !gamesError) {
         const nextGame = games?.findIndex((game) =>
            dayjs.unix(game.date.seconds).isAfter(dayjs())
         );

         if (nextGame !== -1) {
            setDesktopSlice([nextGame - 2, nextGame + 3]);
            setMobileSlice([nextGame, nextGame + 1]);
         }
      }
   }, [gamesLoading, gamesError]);

   const handleGameBack = () => {
      setDesktopSlice([desktopSlice[0] - 1, desktopSlice[1] - 1]);
      setMobileSlice([mobileSlice[0] - 1, mobileSlice[1] - 1]);
   };

   const handleGameForward = () => {
      setDesktopSlice([desktopSlice[0] + 1, desktopSlice[1] + 1]);
      setMobileSlice([mobileSlice[0] + 1, mobileSlice[1] + 1]);
   };

   const Skeletons = () => (
      <Stack spacing={1} direction="row">
         <Skeleton variant="rectangular" width={210} height={85} />
         <Skeleton variant="rectangular" width={210} height={85} />
         <Skeleton variant="rectangular" width={210} height={85} />
      </Stack>
   );

   console.log("gamesToShow", gamesToShow);

   return (
      <Stack
         spacing={1}
         direction="row"
         sx={{
            marginBottom: "15px",
            marginTop: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
         }}
      >
         {gamesLoading ? null : (
            <IconButton
               aria-label="Previous game"
               sx={{ height: "40px" }}
               disabled={desktop ? desktopSlice[0] <= 0 : mobileSlice[0] <= 0}
               onClick={handleGameBack}
            >
               <IoArrowBackSharp fontSize="inherit" />
            </IconButton>
         )}
         {gamesLoading ? <Skeletons /> : null}
         {gamesToShow?.map((game) => {
            return (
               <Link key={game.id} href={`/games/${game.id}`} passHref>
                  <Paper
                     elevation={3}
                     sx={{
                        minHeight: "50px",
                        minWidth: desktop ? "175px" : "250px",
                        padding: "5px",
                        cursor: "pointer",
                     }}
                  >
                     <Stack direction="column">
                        {dayjs() > dayjs.unix(game.date.seconds) ? (
                           <Stack direction="column">
                              <Stack direction="row" justifyContent="space-between">
                                 <Typography variant="caption">
                                    {dayjs.unix(game.date.seconds).format("dddd MMM D")}
                                 </Typography>
                                 <Typography sx={{ fontWeight: 500 }} variant="caption">
                                    FINAL
                                 </Typography>
                              </Stack>
                              <Stack
                                 direction="row"
                                 sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color:
                                       getIcePakGoals(game) > getOpponentGoals(game)
                                          ? "black"
                                          : "grey.dark",
                                 }}
                              >
                                 <Image
                                    alt="Ice Pak Game"
                                    src="/jerseyLogo.png"
                                    height={25}
                                    width={25}
                                    layout="fixed"
                                 />
                                 <Typography
                                    sx={{
                                       marginLeft: "5px",
                                       fontWeight:
                                          getIcePakGoals(game) > getOpponentGoals(game) ? 700 : 400,
                                    }}
                                    variant="subtitle1"
                                 >
                                    Ice Pak
                                 </Typography>
                                 <Typography
                                    variant="subtitle1"
                                    sx={{
                                       flexGrow: 2,
                                       fontWeight:
                                          getIcePakGoals(game) > getOpponentGoals(game) ? 700 : 400,
                                       textAlign: "end",
                                       marginRight: "12px",
                                    }}
                                 >
                                    {getIcePakGoals(game)}
                                 </Typography>
                              </Stack>
                              <Stack
                                 direction="row"
                                 sx={{
                                    display: "flex",
                                    color:
                                       getIcePakGoals(game) > getOpponentGoals(game)
                                          ? "grey.dark"
                                          : "black",
                                 }}
                              >
                                 {game?.opponentLogo ? (
                                    <Image
                                       alt={game?.opponentName}
                                       src={game?.opponentLogo}
                                       height={25}
                                       width={25}
                                       layout="fixed"
                                    />
                                 ) : null}
                                 <Typography
                                    variant="subtitle1"
                                    sx={{
                                       marginLeft: "5px",
                                       fontWeight:
                                          getIcePakGoals(game) > getOpponentGoals(game) ? 400 : 700,
                                    }}
                                 >
                                    {game?.opponentName}
                                 </Typography>
                                 <Typography
                                    variant="subtitle1"
                                    sx={{
                                       fontWeight:
                                          getIcePakGoals(game) > getOpponentGoals(game) ? 400 : 700,
                                       flexGrow: 2,
                                       textAlign: "end",
                                       marginRight: "12px",
                                    }}
                                 >
                                    {getOpponentGoals(game)}
                                 </Typography>
                              </Stack>
                           </Stack>
                        ) : (
                           <>
                              <Stack direction="row" justifyContent="space-between">
                                 <Typography variant="caption">
                                    {dayjs.unix(game.date.seconds).format("dddd MMM D")}
                                 </Typography>
                                 <Typography variant="caption">
                                    {dayjs.unix(game.date.seconds).format("h:mm A")}
                                 </Typography>
                              </Stack>
                              <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                                 <Image
                                    alt="Ice Pak Game"
                                    src="/jerseyLogo.png"
                                    height={25}
                                    width={25}
                                    layout="fixed"
                                 />
                                 <Typography variant="subtitle1" sx={{ marginLeft: "5px" }}>
                                    Ice Pak
                                 </Typography>
                              </Stack>
                              {game?.opponentLogo ? (
                                    <Image
                                       alt={game?.opponentName}
                                       src={game?.opponentLogo}
                                       height={25}
                                       width={25}
                                       layout="fixed"
                                    />
                                 ) : null}
                              <Typography variant="subtitle1">{game?.opponentName}</Typography>
                           </>
                        )}
                     </Stack>
                  </Paper>
               </Link>
            );
         })}
         {gamesLoading ? null : (
            <IconButton
               ria-label="Previous game"
               sx={{ height: "40px" }}
               disabled={
                  desktop ? desktopSlice[0] >= games.length - 5 : mobileSlice[0] >= games.length - 1
               }
               onClick={handleGameForward}
            >
               <IoArrowForwardSharp />
            </IconButton>
         )}
      </Stack>
   );
};

export default GameTicker;
