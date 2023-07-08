import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconButton, Paper, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { useGetAllGames, useGetGoals } from "../../utils";
import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";

const GameTicker = () => {
   const [desktopSlice, setDesktopSlice] = useState([0, 4]);
   const [mobileSlice, setMobileSlice] = useState([0, 1]);
   const { allGames, allGamesLoading, allGamesError } = useGetAllGames();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

   useEffect(() => {
      if (!allGamesLoading && !allGamesError) {
         const nextGame = allGames?.gamesData?.findIndex((game) =>
            dayjs(game.date).isAfter(dayjs())
         );

         if (nextGame !== -1) {
            setDesktopSlice([nextGame - 1, nextGame + 2]);
            setMobileSlice([nextGame, nextGame + 1]);
         } else {
            setDesktopSlice([allGames?.gamesData?.length - 4, allGames?.gamesData?.length]);
            setMobileSlice([allGames?.gamesData?.length - 1, allGames?.gamesData?.length]);
         }
      }
   }, [allGamesLoading, allGamesError]);

   const handleGameBack = () => {
      setDesktopSlice([desktopSlice[0] - 1, desktopSlice[1] - 1]);
      setMobileSlice([mobileSlice[0] - 1, mobileSlice[1] - 1]);
   };

   const handleGameForward = () => {
      setDesktopSlice([desktopSlice[0] + 1, desktopSlice[1] + 1]);
      setMobileSlice([mobileSlice[0] + 1, mobileSlice[1] + 1]);
   };

   const gamesToShow = allGames?.gamesData
      ?.sort((a, b) => dayjs(a.date) - dayjs(b.date))
      ?.slice(
         desktop ? desktopSlice[0] : mobileSlice[0],
         desktop ? desktopSlice[1] : mobileSlice[1]
      )
      .map((game) => {
         const logo = allGames?.teamsData?.filter((team) => team.id === game?.teams?.id)[0]?.logo;
         return { ...game, teams: { ...game.teams, logo } };
      });

   const Skeletons = () => (
      <Stack spacing={1} direction="row">
         <Skeleton variant="rectangular" width={210} height={85} />
         {desktop ? <Skeleton variant="rectangular" width={210} height={85} /> : null}
         {desktop ? <Skeleton variant="rectangular" width={210} height={85} /> : null}
      </Stack>
   );

   const icePakGoals = (game) => game.goals.filter((goal) => goal.team === "Ice Pak").length;
   const opponentGoals = (game) => game.goals.filter((goal) => goal.team !== "Ice Pak").length;

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
         {allGamesLoading ? null : (
            <IconButton
               aria-label="Previous game"
               sx={{ height: "40px" }}
               disabled={desktop ? desktopSlice[0] <= 0 : mobileSlice[0] <= 0}
               onClick={handleGameBack}
            >
               <IoArrowBackSharp fontSize="inherit" />
            </IconButton>
         )}
         {allGamesLoading ? <Skeletons /> : null}
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
                                       icePakGoals(game) > opponentGoals(game)
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
                                          icePakGoals(game) > opponentGoals(game) ? 700 : 400,
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
                                          icePakGoals(game) > opponentGoals(game) ? 700 : 400,
                                       textAlign: "end",
                                       marginRight: "12px",
                                    }}
                                 >
                                    {icePakGoals(game)}
                                 </Typography>
                              </Stack>
                              <Stack
                                 direction="row"
                                 sx={{
                                    display: "flex",
                                    color:
                                       icePakGoals(game) > opponentGoals(game)
                                          ? "grey.dark"
                                          : "black",
                                 }}
                              >
                                 {game?.teams?.logo ? (
                                    <Image
                                       alt={game?.teams?.teamName}
                                       src={game?.teams?.logo}
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
                                          icePakGoals(game) > opponentGoals(game) ? 400 : 700,
                                    }}
                                 >
                                    {game?.teams?.teamName}
                                 </Typography>
                                 <Typography
                                    variant="subtitle1"
                                    sx={{
                                       fontWeight:
                                          icePakGoals(game) > opponentGoals(game) ? 400 : 700,
                                       flexGrow: 2,
                                       textAlign: "end",
                                       marginRight: "12px",
                                    }}
                                 >
                                    {opponentGoals(game)}
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
                                       alt={game?.teams?.teamName}
                                       src={game?.teams?.logo}
                                       height={25}
                                       width={25}
                                       layout="fixed"
                                    />
                                 ) : null}
                                 <Typography variant="subtitle1" sx={{ marginLeft: "5px" }}>
                                    {game?.teams?.teamName}
                                 </Typography>
                              </Stack>
                           </>
                        )}
                     </Stack>
                  </Paper>
               </Link>
            );
         })}
         {allGamesLoading ? null : (
            <IconButton
               ria-label="Previous game"
               sx={{ height: "40px" }}
               disabled={
                  desktop
                     ? desktopSlice[0] >= allGames?.games?.length - 5
                     : mobileSlice[0] >= allGames?.games?.length - 1
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
