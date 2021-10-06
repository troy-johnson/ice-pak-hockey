import { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useSWRConfig } from "swr";
import { useForm } from "react-hook-form";
import {
   Avatar,
   Box,
   Fab,
   Paper,
   SpeedDial,
   SpeedDialIcon,
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
   flex-direction: column;
   margin: 15px;
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

const EditButton = styled(Fab)`
   background-color: ${(props) => props.theme.palette.black};
   color: ${(props) => props.theme.palette.white};
   height: 48px;
   width: 48px;

   :hover {
      background-color: ${(props) => props.theme.palette.white};
      color: ${(props) => props.theme.palette.black};
   }
`;

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
      console.log('penalty', penalty)
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

   const rows = [
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

   console.log("game", game);
   // console.log("icePakGoals", icePakGoals);
   // console.log("oppGoals", opponentGoals);
   // console.log("desktop", desktop);

   if (gameLoading) {
      return <Loading />;
   } else if (gameError) {
      return <GameContainer>Error retrieving game data. Please try again later.</GameContainer>;
   }

   return (
      <GameContainer>
         <Typography variant={desktop ? "h4" : "h5"}>Ice Pak vs. {game?.opponentName}</Typography>
         <Typography variant={desktop ? "h5" : "h6"}>
            {dayjs.unix(game?.date?.seconds).format("MMMM D, YYYY")}
         </Typography>

         <TabContainer>
            <TabBox sx={{ borderBottom: 1, borderColor: "divider" }}>
               <Tabs value={value} onChange={handleChange} aria-label="game-tabs">
                  <Tab label="Box Score" />
                  <Tab label="Team Stats" />
               </Tabs>
            </TabBox>
            <TabPanel desktop={desktop ? 1 : 0} value={value} index={0}>
               <Section>
                  <TableContainer component={Paper}>
                     <Table aria-label="simple table">
                        <TableHead>
                           <BoxScoreHeader>
                              <BoxScoreCell>FINAL</BoxScoreCell>
                              <BoxScoreCell align="right">1ST</BoxScoreCell>
                              <BoxScoreCell align="right">2ND</BoxScoreCell>
                              <BoxScoreCell align="right">3RD</BoxScoreCell>
                              {rows[0].overTime >= 1 || rows[1].overTime >= 1 ? (
                                 <BoxScoreCell align="right">OT</BoxScoreCell>
                              ) : null}
                              <BoxScoreCell align="right">T</BoxScoreCell>
                           </BoxScoreHeader>
                        </TableHead>
                        <BoxScoreBody>
                           {rows.map((row) => (
                              <BoxScoreRow
                                 key={row.name}
                                 sx={{
                                    "&:last-child td, &:last-child th": {
                                       border: 0,
                                    },
                                 }}
                              >
                                 <BoxScoreCell component="th" scope="row">
                                    {row.name}
                                 </BoxScoreCell>
                                 <BoxScoreCell align="right">{row.periodOne}</BoxScoreCell>
                                 <BoxScoreCell align="right">{row.periodTwo}</BoxScoreCell>
                                 <BoxScoreCell align="right">{row.periodThree}</BoxScoreCell>
                                 {row.overTime ? (
                                    <BoxScoreCell align="right">{row.overTime}</BoxScoreCell>
                                 ) : null}
                                 <BoxScoreCell align="right">{row.total}</BoxScoreCell>
                              </BoxScoreRow>
                           ))}
                        </BoxScoreBody>
                     </Table>
                  </TableContainer>
               </Section>
               <Section>
                  <Typography variant="h6">Scoring</Typography>
                  {goalsByPeriod?.map((period) => {
                     return (
                        <div key={`${period.period}-goals`}>
                           <Typography variant="overline" gutterBottom>
                              {period?.period === "OT" ? "Overtime" : `${period?.period} Period`}
                           </Typography>
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
               <Section>
                  <Typography variant="h6">Penalties</Typography>
                  {penaltiesByPeriod?.map((period) => {
                     return (
                        <div key={`${period.period}-penalties`}>
                           <Typography variant="overline" gutterBottom>
                              {period?.period === "OT" ? "Overtime" : `${period.period} Period`}
                           </Typography>
                           {period?.penalties?.length === 0 ? (
                              <Typography variant="body2" gutterBottom>
                                 No Penalties
                              </Typography>
                           ) : null}
                           {period?.penalties?.map((penalty) => {
                              return (
                                 <GoalContainer key={penalty?.penaltyId}>
                                    <Avatar
                                       alt={penalty?.playerName}
                                       src={`data:image/png;base64,${penalty?.playerImage}`}
                                       sx={{
                                          width: desktop ? 65 : 50,
                                          height: desktop ? 65 : 50,
                                       }}
                                    />
                                    <div>
                                       <GoalText variant="body1">
                                          {penalty?.playerName
                                             ? penalty?.playerName
                                             : penalty?.opponentName}
                                       </GoalText>
                                       <AssistText variant="body2">
                                          {`${penalty?.penaltyType} (${penalty?.minutes}:00)`}
                                       </AssistText>
                                       <GoalTime playerid={penalty?.playerId}>
                                          {penalty?.time} / {period?.period}
                                       </GoalTime>
                                    </div>
                                    {/* <EditButton
                                       size="small"
                                       aria-label="Add Player"
                                       onClick={() => handleClickOpen(penalty)}
                                    >
                                       <EditIcon />
                                    </EditButton> */}
                                 </GoalContainer>
                              );
                           })}
                        </div>
                     );
                  })}
               </Section>
            </TabPanel>
            <TabPanel desktop={desktop ? 1 : 0} value={value} index={1}>
               Team Stats
            </TabPanel>
         </TabContainer>

         {/* <SpeedDial
            ariaLabel="Edit Game"
            sx={{
               position: "sticky",
               bottom: 16,
               display: "flex",
               alignItems: "flex-end",
               marginTop: "-88px",
            }}
            icon={<EditIcon />}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
         /> */}
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
   );
};

export default Game;
