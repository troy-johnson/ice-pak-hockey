import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconButton, Paper, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { useGetRecentGames } from "../../utils";
import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";

const GameTicker = () => {
   const [desktopSlice, setDesktopSlice] = useState([0, 4]);
   const [mobileSlice, setMobileSlice] = useState([0, 1]);
   const { games, gamesLoading, gamesError } = useGetRecentGames();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

   useEffect(() => {
      if (!gamesLoading && !gamesError) {
         const nextGame = games?.findIndex((game) =>
            dayjs(game.date).isAfter(dayjs())
         );

         if (nextGame !== -1) {
            setDesktopSlice([nextGame - 1, nextGame + 2]);
            setMobileSlice([nextGame, nextGame + 1]);
         } else {
            setDesktopSlice([games?.length - 4, games?.length]);
            setMobileSlice([games?.length - 1, games?.length]);
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

   const gamesToShow = desktop ? games?.slice(desktopSlice[0], desktopSlice[1]) : games?.slice(mobileSlice[0], mobileSlice[1]);

   const Skeletons = () => (
      <Stack spacing={1} direction="row">
         <Skeleton variant="rectangular" width={210} height={85} />
         {desktop ? <Skeleton variant="rectangular" width={210} height={85} /> : null}
         {desktop ? <Skeleton variant="rectangular" width={210} height={85} /> : null}
      </Stack>
   );

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
         {/* {gamesLoading ? null : (
            <IconButton
               aria-label="Previous game"
               sx={{ height: "40px" }}
               disabled={desktop ? desktopSlice[0] <= 0 : mobileSlice[0] <= 0}
               onClick={handleGameBack}
            >
               <IoArrowBackSharp fontSize="inherit" />
            </IconButton>
         )} */}
         {gamesLoading ? <Skeletons /> : null}
         {gamesToShow?.map((game) => {
            return (
               <Link key={game.id} href={`/games/${game.id}`} passHref>
                  <Paper
                     elevation={3}
                     sx={{
                        minHeight: "50px",
                        minWidth: desktop ? "210px" : "250px",
                        padding: "5px",
                        cursor: "pointer",
                     }}
                  >
                     <Stack direction="column">
                        {dayjs() > dayjs(game.date) ? (
                           <Stack direction="column">
                              <Stack direction="row" justifyContent="space-between">
                                 <Typography variant="caption">
                                    {dayjs(game.date).format("dddd MMM D")}
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
                                       game.icePakGoals > game.opponentGoals
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
                                          game.icePakGoals > game.opponentGoals ? 700 : 400,
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
                                          game.icePakGoals > game.opponentGoals ? 700 : 400,
                                       textAlign: "end",
                                       marginRight: "12px",
                                    }}
                                 >
                                    {game.icePakGoals}
                                 </Typography>
                              </Stack>
                              <Stack
                                 direction="row"
                                 sx={{
                                    display: "flex",
                                    color:
                                       game.icePakGoals > game.opponentGoals
                                          ? "grey.dark"
                                          : "black",
                                 }}
                              >
                                 {game?.opponent?.logo ? (
                                    <Image
                                       alt={game?.opponent?.teamName}
                                       src={game?.opponent?.logo}
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
                                          game.icePakGoals > game.opponentGoals ? 400 : 700,
                                    }}
                                 >
                                    {game?.opponent?.teamName}
                                 </Typography>
                                 <Typography
                                    variant="subtitle1"
                                    sx={{
                                       fontWeight:
                                          game.icePakGoals > game.opponentGoals ? 400 : 700,
                                       flexGrow: 2,
                                       textAlign: "end",
                                       marginRight: "12px",
                                    }}
                                 >
                                    {game.opponentGoals}
                                 </Typography>
                              </Stack>
                           </Stack>
                        ) : (
                           <>
                              <Stack direction="row" justifyContent="space-between">
                                 <Typography variant="caption">
                                    {dayjs(game.date).format("dddd MMM D")}
                                 </Typography>
                                 <Typography variant="caption">
                                    {dayjs(game.date).format("h:mm A")}
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
                              <Stack direction="row">
                                 {game?.teams?.logo ? (
                                    <Image
                                       alt={game?.opponent?.teamName}
                                       src={game?.opponent?.logo}
                                       height={25}
                                       width={25}
                                       layout="fixed"
                                    />
                                 ) : null}
                                 <Typography variant="subtitle1" sx={{ marginLeft: "5px" }}>
                                    {game?.opponent?.teamName}
                                 </Typography>
                              </Stack>
                           </>
                        )}
                     </Stack>
                  </Paper>
               </Link>
            );
         })}
         {/* {gamesLoading ? null : (
            <IconButton
               ria-label="Previous game"
               sx={{ height: "40px" }}
               disabled={
                  desktop
                     ? desktopSlice[0] >= games?.length - 4
                     : mobileSlice[0] >= games?.length - 1
               }
               onClick={handleGameForward}
            >
               <IoArrowForwardSharp />
            </IconButton>
         )} */}
      </Stack>
   );
};

export default GameTicker;
