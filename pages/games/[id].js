import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import {
   Avatar,
   Box,
   Divider,
   IconButton,
   Paper,
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
import EditIcon from "@mui/icons-material/Edit";
import { EditPenalty, Loading } from "../../components";
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

// const DesktopContainer = styled(Box)`
//    display: flex;
//    flex-direction: column;
// `;

const GoalText = styled(Typography)`
   color: ${(props) => props.theme.palette.black};
   font-size: 18px;
`;

const PenaltyPlayer = styled(Typography)`
   color: ${(props) => props.theme.palette.black};
`;

const PenaltyType = styled(Typography)`
   color: ${(props) => props.theme.palette.grey.dark};
   font-size: 14px;
   width: max-content;
   margin-left: 5px;
   margin-right: 5px;
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

const PenaltyTime = styled(Typography)`
   margin-right: 10px;
   width: ${(props) => (props.desktop ? "75px" : "0px")};
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

const PenaltyContainer = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   padding: 10px;
   margin-bottom: 5px;
   width: 100%;

   div {
      margin-right: 10px;
   }
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

const EditPenaltyContainer = styled.div`
   display: flex;
   flex-grow: 2;
   height: 100%;
   flex-direction: column;
   align-items: flex-end;
   justify-content: center;
   margin-right: 0px !important;
`;

const PenaltyRowBackground = styled(Image)`
right: 0;
`;

const PenaltyRow = styled(TableRow)``;

const Game = () => {
   const router = useRouter();
   const [value, setValue] = useState(0);
   const [editPenaltyDialog, setEditPenaltyDialog] = useState(false);
   const [penalty, setPenalty] = useState(null);
   const { id } = router.query;
   const { game, gameLoading, gameError } = useGetGameInfo(id);
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const handleChange = (event, newValue) => setValue(newValue);

   const handleClickOpen = (penalty) => {
      console.log("penalty", penalty);
      setPenalty(penalty);
      setEditPenaltyDialog(true);
   };

   console.log("penalty dialog", { penalty, editPenaltyDialog });

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
            <Typography variant="h6">Scoring Summary</Typography>
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
                              <Avatar
                                 alt={goal?.playerName}
                                 src={`data:image/png;base64,${goal?.playerImage}`}
                                 sx={{
                                    width: desktop ? 65 : 50,
                                    height: desktop ? 65 : 50,
                                 }}
                              />
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
                           </GoalContainer>
                        );
                     })}
                  </div>
               );
            })}
         </Section>
      );
   };

   const Penalties = () => {
      return (
         <Section>
            <Typography variant="h6">Penalties</Typography>
            {penaltiesByPeriod?.map((period) => {
               return (
                  <div key={`${period.period}-penalties`}>
                     <Divider>
                        <Typography variant="overline" gutterBottom>
                           {period?.period === "OT" ? "Overtime" : `${period.period} Period`}
                        </Typography>
                     </Divider>
                     {period?.penalties?.length === 0 ? (
                        <Typography variant="body2" gutterBottom>
                           No Penalties
                        </Typography>
                     ) : null}
                     <TableContainer>
                        <Table aria-label="simple table">
                           <TableBody>
                              {period?.penalties?.map((penalty) => {
                                 return (
                                    <TableRow
                                       key={"box-score-row-" + penalty.penaltyId}
                                       sx={{ border: 0, maxHeight: "100px" }}
                                    >
                                       <TableCell component="th" scope="row" align="left">
                                          {penalty?.time}
                                       </TableCell>
                                       <TableCell sx={{ width: "75px", padding: 0 }} align="center">
                                          {penalty?.playerName ? (
                                             <PenaltyRowBackground
                                                alt="Ice Pak Penalty"
                                                src="/jerseyLogo.png"
                                                width={50}
                                                height={50}
                                             />
                                          ) : null}
                                       </TableCell>
                                       <TableCell align="left">
                                          <div style={{ display: "flex", flexDirection: "column" }}>
                                             <Typography variant={desktop ? "h6" : "subtitle2"}>
                                                {penalty?.playerName
                                                   ? desktop
                                                      ? penalty?.playerName
                                                      : `${penalty.playerName.charAt(0)}. ${
                                                           penalty.playerName.split(" ")[2] ||
                                                           penalty.playerName.split(" ")[1]
                                                        }`
                                                   : penalty?.opponentName}
                                             </Typography>
                                             <Typography variant={desktop ? "subtitle1" : "caption"}>{`${penalty?.penaltyType}`}</Typography>
                                             <Typography variant={desktop ? "subtitle1" : "caption"}>{`(${penalty?.minutes})`}</Typography>
                                          </div>
                                       </TableCell>
                                       {/* <TableCell align="left">{`${penalty?.minutes}:00 for ${penalty?.penaltyType}`}</TableCell> */}
                                       <TableCell align="right">
                                          <EditButton
                                             size="small"
                                             aria-label="Edit Penalty"
                                             onClick={() => handleClickOpen(penalty)}
                                             sx={{ flexGrow: "2" }}
                                          >
                                             <EditIcon />
                                          </EditButton>
                                       </TableCell>
                                    </TableRow>
                                 );
                              })}
                           </TableBody>
                        </Table>
                     </TableContainer>
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
                     <Penalties />
                  </SectionContainer>
                  <SectionContainer>
                     <Typography variant="h5">Team Stats</Typography>
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
                     <Penalties />
                  </TabPanel>
                  <TabPanel desktop={desktop ? 1 : 0} value={value} index={1}>
                     <TeamStats desktop={desktop} teamStats={teamStats} />
                  </TabPanel>
               </TabContainer>
            )}

            {/* <EditGame game={game} onClose={() => setOpen(false)} open={open} /> */}
            {editPenaltyDialog ? (
               <EditPenalty
                  gameRoster={game?.roster}
                  penalty={penalty}
                  onClose={() => {
                     setPenalty(null);
                     setEditPenaltyDialog(false);
                  }}
                  close={() => {
                     setPenalty(null);
                     setEditPenaltyDialog(false);
                  }}
                  open={editPenaltyDialog}
               />
            ) : null}
         </GameContainer>
      </>
   );
};

export default Game;
