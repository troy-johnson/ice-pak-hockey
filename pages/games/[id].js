import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import {
   Alert,
   Box,
   Button,
   Container,
   Divider,
   Paper,
   Snackbar,
   Stack,
   Tabs,
   Tab,
   Table,
   TableBody,
   TableContainer,
   TableHead,
   TableRow,
   TableCell,
   Typography,
   useMediaQuery,
} from "@mui/material";
import {
   EditRoster,
   UpsertGoal,
   MutatePenalty,
   GameGoals,
   GamePenalties,
   Loading,
   PageContainer,
} from "../../components";
import { FaClipboardList } from "react-icons/fa";
import { roleCheck, upsertGame, useGetGameInfo, useGetOpponents, useGetProfile } from "../../utils";

const objectSupport = require("dayjs/plugin/objectSupport");
dayjs.extend(objectSupport);

const StyledTabPanel = (props) => {
   const { children, className, desktop, value, index, ...other } = props;

   return (
      <div
         className={className}
         role="tabpanel"
         hidden={value !== index}
         id={`game-tabpanel-${index}`}
         aria-labelledby={`game-tab-${index}`}
         {...other}
      >
         {value === index && <SectionContainer desktop={desktop}>{children}</SectionContainer>}
      </div>
   );
};

const TableComponent = ({ children }) => <Paper variant="outlined">{children}</Paper>;

const GameContainer = styled.section`
   display: flex;
   margin: 15px;
   flex-direction: ${(props) => (props.desktop ? "row" : "column")};
`;

const SectionContainer = styled(Paper)`
   display: flex;
   flex-direction: column;
   padding: 5px;
   width: ${(props) => (props.desktop ? "75%" : "100%")};
   border-top: 5px solid ${(props) => props.theme.palette.secondary.main};
   padding-top: 15px;
   border: none;
   margin-bottom: 15px;
   box-shadow: none;
`;

const GoalText = styled(Typography)`
   color: ${(props) => props.theme.palette.black};
   font-size: 18px;
`;

const BoxScoreBody = styled(TableBody)`
   tr:nth-of-type(even) {
      background-color: rgba(0, 0, 0, 0.04);
   }
`;

const TabPanel = styled(StyledTabPanel)`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   border: none;
`;

const PlayerName = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   margin-left: 10px;
`;

const TabContainer = styled(Box)`
   width: ${(props) => (props.desktop ? "75%" : "100%")};
   display: flex;
   flex-direction: column;
   align-items: center;
`;

const TabBox = styled(Box)`
   margin-bottom: 10px;
`;

const BoxScoreHeader = styled(TableRow)`
   background-color: ${(props) => props.theme.palette.black};

   th {
      color: ${(props) => props.theme.palette.white};
   }
`;

const BoxScoreRow = styled(TableRow)`
   text-align: center;

   th {
      position: relative;
      padding: 8px;
   }
`;

const BoxScoreCell = styled(TableCell)`
   width: ${(props) => (props.desktop ? "100%" : "25px")};
`;

// th:before {
//    content: " ";
//    display: block;
//    position: absolute;
//    left: 0;
//    top: 0;
//    width: 400%;
//    height: 100%;
//    opacity: 0.25;
//    background-image: url(${(props) => props.logo});
//    background-repeat: no-repeat;
//    background-position: center;
//    background-size: cover;
// }

const Game = () => {
   const router = useRouter();
   const { id } = router.query;

   const [value, setValue] = useState(0);
   const [mutatePenaltyDialog, setMutatePenaltyDialog] = useState(false);
   const [penalty, setPenalty] = useState(null);
   const [penaltyAction, setPenaltyAction] = useState("add");
   const [upsertGoalDialog, setUpsertGoalDialog] = useState(false);
   const [editRosterDialog, setEditRosterDialog] = useState(false);
   const [goal, setGoal] = useState(null);
   const [goalAction, setGoalAction] = useState("add");
   const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });

   const { data: session, status } = useSession();
   const loading = status === "loading";
   const { game, gameLoading, gameError } = useGetGameInfo(id);
   const { opponents, opponentsLoading, opponentsError } = useGetOpponents();
   const { profile, profileLoading, profileError } = useGetProfile();

   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   // const isPlayerRostered = game?.roster?.includes(profile?.playerId)

   const handleChange = (event, newValue) => setValue(newValue);

   const openMutatePenalty = (action, penalty) => {
      setPenaltyAction(action);
      setPenalty(penalty);
      setMutatePenaltyDialog(true);
   };

   const openUpsertGoal = (action, goal) => {
      setGoalAction(action);
      setGoal(goal);
      setUpsertGoalDialog(true);
   };

   const goalsSorted = game?.goals?.sort(
      (a, b) =>
         dayjs({
            minute: b.time?.split(":")[0],
            second: b.time?.split(":")[1],
         }) -
         dayjs({
            minute: a.time?.split(":")[0],
            second: a.time?.split(":")[1],
         })
   );

   const penaltiesSorted = game?.penalties?.sort(
      (a, b) =>
         dayjs({
            minute: b.time?.split(":")[0],
            second: b.time?.split(":")[1],
         }) -
         dayjs({
            minute: a.time?.split(":")[0],
            second: a.time?.split(":")[1],
         })
   );

   const icePakGoals = goalsSorted?.filter(
      (goal) => goal?.teamId === "3683b632-c5c3-4e97-a7d4-6002a72839e1"
   );
   const opponentGoals = goalsSorted?.filter(
      (goal) => goal?.teamId !== "3683b632-c5c3-4e97-a7d4-6002a72839e1"
   );

   const penaltiesByPeriod = [
      {
         period: "1st",
         penalties: penaltiesSorted?.filter((penalty) => penalty.period === 1),
      },
      {
         period: "2nd",
         penalties: penaltiesSorted?.filter((penalty) => penalty.period === 2),
      },
      {
         period: "3rd",
         penalties: penaltiesSorted?.filter((penalty) => penalty.period === 3),
      },
   ];

   if (penaltiesSorted?.filter((penalty) => penalty.period === 4).length >= 1) {
      penaltiesByPeriod.push({
         period: "OT",
         penalties: penaltiesSorted?.filter((penalty) => penalty.period === 4),
      });
   }

   const goalRows = [
      {
         name: game?.teams[1]?.teamName,
         logo: opponents?.filter((opp) => opp.id === game?.teams[1]?.teamName)?.[0]?.logo,
         periodOne: icePakGoals?.filter((goal) => goal.period === 1).length,
         periodTwo: icePakGoals?.filter((goal) => goal.period === 2).length,
         periodThree: icePakGoals?.filter((goal) => goal.period === 3).length,
         overTime: icePakGoals?.filter((goal) => goal.period === 4).length,
         total: icePakGoals?.length,
      },
      {
         name: game?.teams[0]?.teamName,
         logo: opponents?.filter((opp) => opp.id === game?.teams[0]?.teamName)?.[0]?.logo,
         periodOne: opponentGoals?.filter((goal) => goal.period === 1).length,
         periodTwo: opponentGoals?.filter((goal) => goal.period === 2).length,
         periodThree: opponentGoals?.filter((goal) => goal.period === 3).length,
         overTime: opponentGoals?.filter((goal) => goal.period === 4).length,
         total: opponentGoals?.length,
      },
   ];

   const getPlayerGoals = (id) => {
      let goalCount = 0;

      icePakGoals?.forEach((goal) => {
         if (goal.playerId === id) {
            goalCount++;
         }
      });

      return goalCount;
   };

   const getPlayerAssists = (playerId) => {
      let assistCount = 0;

      icePakGoals?.forEach((goal) => {
         goal.assists.forEach((assist) => {
            if (assist.playerId === playerId) {
               assistCount++;
            }
         });
      });

      return assistCount;
   };

   const getPlayerPenaltyMinutes = (playerId) => {
      const penaltyMinutes = game?.penalties.reduce((sum, currentValue) => {
         if (currentValue?.playerId === playerId) {
            return sum + parseFloat(currentValue?.minutes);
         }
         return sum;
      }, 0);

      return penaltyMinutes;
   };

   const teamStats = game?.roster
      ?.filter((player) => player.id !== "6aca0d5e-2896-4ea7-b42c-9d683ff8adce")
      ?.map((player) => {
         return {
            jerseyNumber: player?.playerJerseyNumber || 0,
            playerId: player?.id,
            playerName: player?.playerName,
            goals: getPlayerGoals(player.id),
            assists: getPlayerAssists(player.id),
            points: getPlayerGoals(player.id) + getPlayerAssists(player.id),
            penaltyMinutes: getPlayerPenaltyMinutes(player.id),
         };
      })
      .sort((a, b) => b.points - a.points);

   const opponent = opponents?.filter((opp) => opp.id === game?.opponentId)[0];

   // console.log("opponents", { opponents, opponent });

   console.log("game", game);

   if (gameLoading) {
      return <Loading />;
   } else if (gameError) {
      return <GameContainer>Error retrieving game data. Please try again later.</GameContainer>;
   }

   const BoxScore = () => {
      return (
         <Container sx={{ width: desktop ? 3 / 4 : 1 }}>
            <TableContainer component={TableComponent}>
               <Table aria-label="simple table">
                  <TableHead>
                     <BoxScoreHeader>
                        <BoxScoreCell align="center" sx={{ minWidth: "75px" }}>
                           {dayjs().isAfter(dayjs(game?.date)) ? "FINAL" : ""}
                        </BoxScoreCell>
                        <BoxScoreCell align="center">1ST</BoxScoreCell>
                        <BoxScoreCell align="center">2ND</BoxScoreCell>
                        <BoxScoreCell align="center">3RD</BoxScoreCell>
                        {goalRows[0].overTime >= 1 || goalRows[1].overTime >= 1 ? (
                           <BoxScoreCell align="center">OT</BoxScoreCell>
                        ) : null}
                        <BoxScoreCell align="center">T</BoxScoreCell>
                     </BoxScoreHeader>
                  </TableHead>
                  <BoxScoreBody>
                     {goalRows.map((row) => (
                        <BoxScoreRow
                           key={"box-score-row-" + row.name}
                           sx={{
                              "&:last-child td, &:last-child th": {
                                 border: 0,
                              },
                           }}
                           logo={row.logo}
                        >
                           <BoxScoreCell component="th" scope="row">
                              {row.name}
                           </BoxScoreCell>
                           <BoxScoreCell align="center">{row.periodOne}</BoxScoreCell>
                           <BoxScoreCell align="center">{row.periodTwo}</BoxScoreCell>
                           <BoxScoreCell align="center">{row.periodThree}</BoxScoreCell>
                           {row.overTime ? <BoxScoreCell>{row.overTime}</BoxScoreCell> : null}
                           <BoxScoreCell align="center">{row.total}</BoxScoreCell>
                        </BoxScoreRow>
                     ))}
                  </BoxScoreBody>
               </Table>
            </TableContainer>
         </Container>
      );
   };

   const TeamStats = ({ desktop, teamStats }) => {
      return (
         <TableContainer component={TableComponent}>
            <Table aria-label="Team Stats Table">
               <TableHead>
                  <BoxScoreHeader>
                     <BoxScoreCell>Name</BoxScoreCell>
                     <BoxScoreCell align="center">G</BoxScoreCell>
                     <BoxScoreCell align="center">A</BoxScoreCell>
                     <BoxScoreCell align="center">P</BoxScoreCell>
                     <BoxScoreCell align="center">PIM</BoxScoreCell>
                  </BoxScoreHeader>
               </TableHead>
               <BoxScoreBody>
                  {teamStats?.map((row) => (
                     <Link
                        key={"team-stats-row" + row.playerId}
                        href={`/player/${row.playerId}`}
                        passHref
                     >
                        <BoxScoreRow
                           sx={{
                              "&:last-child td, &:last-child th": {
                                 border: 0,
                              },
                           }}
                        >
                           <TableCell
                              sx={{
                                 cursor: "pointer",
                                 textAlign: "left",
                              }}
                              align="left"
                           >
                              <Typography
                                 variant="caption"
                                 sx={{ marginRight: "5px", color: "grey.main" }}
                              >
                                 {row.jerseyNumber}
                              </Typography>
                              <Typography variant="caption" sx={{ flexGrow: 2 }}>
                                 {desktop
                                    ? row?.playerName
                                    : `${row.playerName.charAt(0)}. ${
                                         row.playerName.split(" ")[2] ||
                                         row.playerName.split(" ")[1]
                                      }`}
                              </Typography>
                           </TableCell>
                           <BoxScoreCell align="center">{row.goals}</BoxScoreCell>
                           <BoxScoreCell align="center">{row.assists}</BoxScoreCell>
                           <BoxScoreCell align="center">{row.points}</BoxScoreCell>
                           <BoxScoreCell align="center">{row.penaltyMinutes}</BoxScoreCell>
                        </BoxScoreRow>
                     </Link>
                  ))}
               </BoxScoreBody>
            </Table>
         </TableContainer>
      );
   };

   // console.log("game", game)

   return (
      <PageContainer
         pageTitle={`${game?.teams?.[1]?.teamName} vs. ${game?.teams?.[0]?.teamName}`}
         small
      >
         <Stack
            direction="column"
            ml={3}
            mt={0}
            mb={2}
            spacing={1}
            display="flex"
            alignItems="flex-start"
         >
            <Typography sx={{ textAlign: "left" }} variant="subtitle1">
               {dayjs(game?.date).format("MMMM D, YYYY @ h:mm a")}
            </Typography>
            <Typography sx={{ textAlign: "left" }} variant="subtitle1">
               {game?.seasonName}
            </Typography>
            <Typography sx={{ textAlign: "left" }} variant="subtitle1">
               {game?.locationName}
            </Typography>
         </Stack>
         <>
            <Stack direction="column">
               <>
                  <BoxScore />
                  <TabContainer>
                     <TabBox sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={value} onChange={handleChange} aria-label="game-tabs">
                           <Tab label="Summary" />
                           <Tab label="Team Stats" />
                           <Tab label="Highlights" />
                        </Tabs>
                     </TabBox>
                     <TabPanel desktop={desktop ? 1 : 0} value={value} index={0}>
                        <Stack spacing={2}>
                           <GameGoals
                              goals={game?.goals}
                              openUpsertGoal={openUpsertGoal}
                              goalsSorted={goalsSorted}
                              teams={game?.teams}
                              setSnackbar={setSnackbar}
                           />
                           <GamePenalties
                              penaltiesByPeriod={penaltiesByPeriod}
                              opponentLogo={game?.teams?.logo}
                              handleClickOpen={openMutatePenalty}
                              setSnackbar={setSnackbar}
                           />
                        </Stack>
                     </TabPanel>
                     <TabPanel desktop={desktop ? 1 : 0} value={value} index={1} sx={{ width: 95 }}>
                        <Stack
                           direction="row"
                           sx={{ display: "flex", justifyContent: "space-between" }}
                        >
                           <Typography sx={{ ml: "5px" }} variant="h5">
                              Game Roster
                           </Typography>
                           {!!roleCheck(session, ["Admins"]) ? (
                              <Button
                                 variant="outlined"
                                 onClick={() => setEditRosterDialog(true)}
                                 endIcon={<FaClipboardList />}
                                 sx={{ maxWidth: "200px", mb: 1, textAlign: "right" }}
                              >
                                 Edit Roster
                              </Button>
                           ) : null}
                        </Stack>

                        <TeamStats desktop={desktop} teamStats={teamStats} />
                     </TabPanel>
                     <TabPanel desktop={desktop ? 2 : 0} value={value} index={2}>
                        <Container>
                           {game?.highlightLink ? (
                              <iframe
                                 width="100%"
                                 height={desktop ? "359" : "200"}
                                 src={game?.highlightLink}
                                 title={`Ice Pak vs. ${game?.opponentName}`}
                                 frameBorder="0"
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                 allowFullScreen
                              ></iframe>
                           ) : (
                              <Typography>No highlights found for this game.</Typography>
                           )}
                        </Container>
                     </TabPanel>
                  </TabContainer>
               </>

               {/* <EditGame game={game} onClose={() => setOpen(false)} open={open} /> */}
               {mutatePenaltyDialog ? (
                  <MutatePenalty
                     penaltyAction={penaltyAction}
                     gameId={game?.gameId}
                     gameRoster={game?.roster}
                     penalty={penalty}
                     onClose={() => {
                        setPenalty(null);
                        setMutatePenaltyDialog(false);
                     }}
                     close={() => {
                        setPenalty(null);
                        setMutatePenaltyDialog(false);
                     }}
                     setSnackbar={setSnackbar}
                     opponentId={game?.opponentId}
                     opponentName={game?.opponentName}
                     open={mutatePenaltyDialog}
                  />
               ) : null}
               {upsertGoalDialog ? (
                  <UpsertGoal
                     goalAction={goalAction}
                     gameId={game?.gameId}
                     gameRoster={game?.roster}
                     goal={goal}
                     onClose={() => {
                        setGoal(null);
                        setUpsertGoalDialog(false);
                     }}
                     close={() => {
                        setGoal(null);
                        setUpsertGoalDialog(false);
                     }}
                     setSnackbar={setSnackbar}
                     opponentId={game?.opponentId}
                     opponentName={game?.opponentName}
                     open={upsertGoalDialog}
                  />
               ) : null}
               {editRosterDialog ? (
                  <EditRoster
                     gameId={game?.gameId}
                     gameRoster={game?.roster}
                     onClose={() => setEditRosterDialog(false)}
                     close={() => setEditRosterDialog(false)}
                     open={editRosterDialog}
                     setSnackbar={setSnackbar}
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
                  variant="filled"
                  severity={snackbar.type}
                  sx={{ width: "100%" }}
               >
                  {snackbar.message}
               </Alert>
            </Snackbar>
         </>
      </PageContainer>
   );
};

export default Game;
