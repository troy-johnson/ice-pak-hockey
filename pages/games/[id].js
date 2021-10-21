import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import {
   Alert,
   Avatar,
   Box,
   Button,
   Divider,
   IconButton,
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
import { FaClipboardList, FaHockeyPuck } from "react-icons/fa";
import EditIcon from "@mui/icons-material/Edit";
import { EditRoster, UpsertGoal, MutatePenalty, GamePenalties, Loading } from "../../components";
import { upsertGame, useGetGameInfo } from "../../utils";

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

const AssistText = styled(Typography)`
   color: ${(props) => props.theme.palette.grey.dark};
   font-size: 14px;
   width: max-content;
`;

const GoalTime = styled(Typography)`
   margin-top: 5px;
   text-align: center;
   font-size: 18px;
   font-weight: 700;
   background-color: ${(props) =>
      props.playerid ? props.theme.palette.primary.main : props.theme.palette.error.main};
   color: ${(props) => props.theme.palette.white};
   border: 1px solid
      ${(props) =>
         props.playerid ? props.theme.palette.primary.main : props.theme.palette.error.main};
   width: 150px;
`;

const Section = styled.section`
   display: flex;
   flex-direction: column;
   align-content: center;
   margin-bottom: 25px;
   box-shadow: none;
`;

const GoalContainer = styled(Paper)`
   display: flex;
   flex-direction: row;
   align-items: center;
   border: 1px solid ${(props) => props.theme.palette.grey.light};
   padding: 10px;
   height: 100px;
   margin-bottom: 5px;

   div {
      margin-right: 10px;
   }
`;

const BoxScoreBody = styled(TableBody)`
   tr:nth-of-type(even) {
      background-color: rgba(0, 0, 0, 0.04);
   }
`;

const EditButton = styled(IconButton)`
   background-color: #fff;
   color: ${(props) => props.theme.palette.grey.main};
   height: 24px;
   width: 24px;
   :hover {
      background-color: ${(props) => props.theme.palette.white};
      color: ${(props) => props.theme.palette.black};
   }
`;

const TabPanel = styled(StyledTabPanel)`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   border: none;
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

   th,
   td {
      text-align: center;
   }
`;

const BoxScoreCell = styled(TableCell)`
   width: ${(props) => (props.desktop ? "100%" : "25px")};
`;

const Game = () => {
   const router = useRouter();
   const [value, setValue] = useState(0);
   const [mutatePenaltyDialog, setMutatePenaltyDialog] = useState(false);
   const [penalty, setPenalty] = useState(null);
   const [penaltyAction, setPenaltyAction] = useState("add");
   const [upsertGoalDialog, setUpsertGoalDialog] = useState(false);
   const [editRosterDialog, setEditRosterDialog] = useState(false);
   const [goal, setGoal] = useState(null);
   const [goalAction, setGoalAction] = useState("add");
   const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });
   const { id } = router.query;
   const { game, gameLoading, gameError } = useGetGameInfo(id);
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

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

   const icePakGoals = goalsSorted?.filter((goal) => goal?.playerId);
   const opponentGoals = goalsSorted?.filter((goal) => goal?.opponentId);

   const goalsByPeriod = [
      {
         period: "1st",
         goals: goalsSorted?.filter((goal) => goal.period === 1),
      },
      {
         period: "2nd",
         goals: goalsSorted?.filter((goal) => goal.period === 2),
      },
      {
         period: "3rd",
         goals: goalsSorted?.filter((goal) => goal.period === 3),
      },
   ];

   if (goalsSorted?.filter((goal) => goal.period === 4).length >= 1) {
      goalsByPeriod.push({
         period: "OT",
         goals: goalsSorted?.filter((goal) => goal.period === 4),
      });
   }

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
         name: "Ice Pak",
         periodOne: icePakGoals?.filter((goal) => goal.period === 1).length,
         periodTwo: icePakGoals?.filter((goal) => goal.period === 2).length,
         periodThree: icePakGoals?.filter((goal) => goal.period === 3).length,
         overTime: icePakGoals?.filter((goal) => goal.period === 4).length,
         total: icePakGoals?.length,
      },
      {
         name: game?.opponentName,
         periodOne: opponentGoals?.filter((goal) => goal.period === 1).length,
         periodTwo: opponentGoals?.filter((goal) => goal.period === 2).length,
         periodThree: opponentGoals?.filter((goal) => goal.period === 3).length,
         overTime: opponentGoals?.filter((goal) => goal.period === 4).length,
         total: opponentGoals?.length,
      },
   ];

   const getPlayerGoals = (playerId) => {
      let goalCount = 0;

      icePakGoals?.forEach((goal) => {
         if (goal.playerId === playerId) {
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
            return sum + currentValue?.minutes;
         }
         return sum;
      }, 0);

      return penaltyMinutes;
   };

   const teamStats = game?.roster
      ?.map((player) => {
         return {
            jerseyNumber: player?.playerJerseyNumber || 0,
            playerId: player?.playerId,
            playerName: player?.playerName,
            goals: getPlayerGoals(player.playerId),
            assists: getPlayerAssists(player.playerId),
            points: getPlayerGoals(player.playerId) + getPlayerAssists(player.playerId),
            penaltyMinutes: getPlayerPenaltyMinutes(player.playerId),
         };
      })
      .sort((a, b) => b.points - a.points);

   console.log("game", game);
   // console.log("icePakGoals", icePakGoals);
   // console.log("oppGoals", opponentGoals);
   // console.log("desktop", desktop);

   if (gameLoading) {
      return <Loading />;
   } else if (gameError) {
      return <GameContainer>Error retrieving game data. Please try again later.</GameContainer>;
   }

   const BoxScore = () => {
      return (
         <Section>
            <TableContainer component={Paper}>
               <Table aria-label="simple table">
                  <TableHead>
                     <BoxScoreHeader>
                        <BoxScoreCell align="center">FINAL</BoxScoreCell>
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
         </Section>
      );
   };

   const Goals = () => {
      return (
         <Section>
            <Stack direction="row" sx={{display: "flex", justifyContent: "space-between"}}>
               <Typography variant="h5">Scoring Summary</Typography>
               <Button
                  variant="outlined"
                  onClick={() => openUpsertGoal("add")}
                  endIcon={<FaHockeyPuck />}
               >
                  Add Goal
               </Button>
            </Stack>
            {goalsByPeriod?.map((period) => {
               return (
                  <div key={`${period.period}-goals`}>
                     <Divider>
                        <Typography variant="overline" gutterBottom>
                           {period?.period === "OT" ? "Overtime" : `${period.period} Period`}
                        </Typography>
                     </Divider>
                     {period?.goals?.length === 0 ? (
                        <Typography variant="body2" gutterBottom>
                           No Goals
                        </Typography>
                     ) : null}
                     {period?.goals?.map((goal) => {
                        console.log("goal", goal);
                        return (
                           <GoalContainer key={goal?.goalId}>
                              {goal?.playerId ? (
                                 <Avatar
                                    alt={goal?.playerName}
                                    src={
                                       goal?.playerId
                                          ? `data:image/png;base64,${goal?.playerImage}`
                                          : null
                                    }
                                    sx={{
                                       width: desktop ? 65 : 50,
                                       height: desktop ? 65 : 50,
                                    }}
                                 />
                              ) : (
                                 <Avatar
                                    sx={{
                                       width: desktop ? 65 : 50,
                                       height: desktop ? 65 : 50,
                                    }}
                                 >
                                    {game?.opponentName.slice(0, 1)[0]}
                                 </Avatar>
                              )}
                              <div>
                                 <GoalText variant="body1">
                                    {goal?.playerName ? goal?.playerName : game?.opponentName}
                                 </GoalText>
                                 {goal?.assists?.map((assist) => {
                                    return (
                                       <AssistText
                                          variant="body2"
                                          key={goal?.goalId + assist?.playerId}
                                       >
                                          {assist?.playerName}
                                          {goal?.assists?.length > 1 ? "," : ""}
                                       </AssistText>
                                    );
                                 })}
                                 <GoalTime playerid={goal?.playerId}>
                                    {goal?.time} / {period.period}
                                 </GoalTime>
                              </div>
                              <EditButton
                                 size="small"
                                 aria-label="Edit Penalty"
                                 onClick={() => openUpsertGoal("edit", goal)}
                                 sx={{ textAlign: "right" }}
                              >
                                 <EditIcon />
                              </EditButton>
                           </GoalContainer>
                        );
                     })}
                  </div>
               );
            })}
         </Section>
      );
   };

   const TeamStats = ({ desktop, teamStats }) => {
      return (
         <TableContainer component={Paper}>
            <Table aria-label="Team Stats Table">
               <TableHead>
                  <BoxScoreHeader>
                     <BoxScoreCell align="center">#</BoxScoreCell>
                     <BoxScoreCell align="center">{desktop ? "Player Name" : "Name"}</BoxScoreCell>
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
                           <BoxScoreCell align="center">{row.jerseyNumber}</BoxScoreCell>
                           <BoxScoreCell
                              align="center"
                              sx={{
                                 width: "85px !important",
                                 padding: "16px 0px !important",
                                 cursor: "pointer",
                              }}
                           >
                              {desktop
                                 ? row?.playerName
                                 : `${row.playerName.charAt(0)}. ${
                                      row.playerName.split(" ")[2] || row.playerName.split(" ")[1]
                                   }`}
                           </BoxScoreCell>
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

   return (
      <>
         {desktop ? (
            <>
               <Typography sx={{ textAlign: "center" }} variant={desktop ? "h4" : "h5"}>
                  Ice Pak vs. {game?.opponentName}
               </Typography>
               <Typography sx={{ textAlign: "center" }} variant={desktop ? "h5" : "h6"}>
                  {dayjs.unix(game?.date?.seconds).format("MMMM D, YYYY")}
               </Typography>
            </>
         ) : null}
         <GameContainer desktop={desktop}>
            {!desktop ? (
               <>
                  <Typography variant={desktop ? "h4" : "h5"}>
                     Ice Pak vs. {game?.opponentName}
                  </Typography>
                  <Typography variant={desktop ? "h5" : "h6"}>
                     {dayjs.unix(game?.date?.seconds).format("MMMM D, YYYY")}
                  </Typography>
               </>
            ) : null}

            {desktop ? (
               <>
                  <SectionContainer>
                     <Typography variant="h5">Box Score</Typography>
                     <BoxScore />
                     <Goals />
                     <GamePenalties
                        penaltiesByPeriod={penaltiesByPeriod}
                        handleClickOpen={openMutatePenalty}
                     />
                  </SectionContainer>
                  <SectionContainer>
                  <Stack direction="row" sx={{display: "flex", justifyContent: "space-between"}}>
               <Typography variant="h5">Team Stats</Typography>
               <Button
                  variant="outlined"
                  onClick={() => setEditRosterDialog(true)}
                  endIcon={<FaClipboardList />}
               >
                  Edit Roster
               </Button>
            </Stack>
                     <TeamStats desktop={desktop} teamStats={teamStats} />
                  </SectionContainer>
               </>
            ) : (
               <TabContainer>
                  <TabBox sx={{ borderBottom: 1, borderColor: "divider" }}>
                     <Tabs value={value} onChange={handleChange} aria-label="game-tabs">
                        <Tab label="Box Score" />
                        <Tab label="Team Stats" />
                     </Tabs>
                  </TabBox>
                  <TabPanel desktop={desktop ? 1 : 0} value={value} index={0}>
                     <BoxScore />
                     <Goals />
                     <GamePenalties
                        penaltiesByPeriod={penaltiesByPeriod}
                        handleClickOpen={openMutatePenalty}
                     />
                  </TabPanel>
                  <TabPanel desktop={desktop ? 1 : 0} value={value} index={1}>
                     <TeamStats desktop={desktop} teamStats={teamStats} />
                  </TabPanel>
               </TabContainer>
            )}

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
         </GameContainer>
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
      </>
   );
};

export default Game;
