import { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useSWRConfig } from "swr";
import { useForm } from "react-hook-form";
import {
   Avatar,
   Box,
   Paper,
   Tabs,
   Tab,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { upsertGame, useGetGameInfo } from "../../utils";

const objectSupport = require("dayjs/plugin/objectSupport");
dayjs.extend(objectSupport);

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
      props.playerid
         ? props.theme.palette.primary.main
         : props.theme.palette.error.main};
   color: ${(props) => props.theme.palette.white};
   border: 1px solid
      ${(props) =>
         props.playerid
            ? props.theme.palette.primary.main
            : props.theme.palette.error.main};
   width: 150px;
`;

const Section = styled.section`
   display: flex;
   flex-direction: column;
   align-content: center;
`;

const GoalContainer = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   border: 1px solid ${(props) => props.theme.palette.grey.light};
   padding: 10px;
   height: 100px;

   div {
      margin-right: 10px;
   }
`;

const StyledTabPanel = (props) => {
   const { children, className, desktop, value, index, ...other } = props;

   return (
      <div
         className={className}
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
         {...other}
      >
         {value === index && (
            <SectionContainer desktop={desktop}>{children}</SectionContainer>
         )}
      </div>
   );
};

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

const Game = () => {
   const router = useRouter();
   const [value, setValue] = useState(0);
   const { id } = router.query;
   const { game, gameLoading, gameError } = useGetGameInfo(id);
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const goalsSorted = game?.goals?.sort(
      (a, b) =>
         dayjs({
            minute: b.time.split(":")[0],
            second: b.time.split(":")[1],
         }) -
         dayjs({
            minute: a.time.split(":")[0],
            second: a.time.split(":")[1],
         })
   );

   const handleChange = (event, newValue) => setValue(newValue);

   const icePakGoals = goalsSorted?.filter((goal) => goal?.playerId);
   const opponentGoals = goalsSorted?.filter((goal) => goal?.opponentId);

   console.log("game", game);
   console.log("icePakGoals", icePakGoals);
   console.log("oppGoals", opponentGoals);
   console.log("desktop", desktop);

   if (gameLoading) {
      return <GameContainer>Loading...</GameContainer>;
   } else if (gameError) {
      return (
         <GameContainer>
            Error retrieving game data. Please try again later.
         </GameContainer>
      );
   }

   return (
      <GameContainer>
         <Typography variant={desktop ? "h4" : "h5"}>
            Ice Pak vs. {game?.opponentName}
         </Typography>
         <Typography variant={desktop ? "h5" : "h6"}>
            {dayjs.unix(game?.date?.seconds).format("MMMM D, YYYY")}
         </Typography>

         <TabContainer>
            <TabBox sx={{ borderBottom: 1, borderColor: "divider" }}>
               <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
               >
                  <Tab label="Box Score" />
                  <Tab label="Team Stats" />
               </Tabs>
            </TabBox>
            <TabPanel desktop={desktop ? 1 : 0} value={value} index={0}>
               <Section>Box Table</Section>
               <Section>
                  <Typography variant="h6">Scoring</Typography>
                  <Typography variant="overline" gutterBottom>
                     1st Period
                  </Typography>
                  {game?.goals
                     ?.filter((goal) => goal.period === 1)
                     .map((goal, index) => {
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
                                    {goal?.playerName
                                       ? goal?.playerName
                                       : game?.opponentName}
                                 </GoalText>
                                 {goal?.assists?.map((assist) => {
                                    return (
                                       <AssistText
                                          variant="body2"
                                          key={goal?.goalId + assist}
                                       >
                                          {assist?.playerName}
                                          {goal?.assists?.length > 1 ? "," : ""}
                                       </AssistText>
                                    );
                                 })}
                                 <GoalTime playerid={goal?.playerId}>
                                    {goal?.time} / 1st
                                 </GoalTime>
                              </div>
                           </GoalContainer>
                        );
                     })}
                  <Typography variant="overline" gutterBottom>
                     2nd Period
                  </Typography>
                  {game?.goals
                     ?.filter((goal) => goal.period === 2)
                     .map((goal, index) => {
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
                                    {goal?.playerName
                                       ? goal?.playerName
                                       : game?.opponentName}
                                 </GoalText>
                                 {goal?.assists?.map((assist) => {
                                    return (
                                       <AssistText
                                          variant="body2"
                                          key={goal?.goalId + assist}
                                       >
                                          {assist?.playerName}
                                          {goal?.assists?.length > 1 ? "," : ""}
                                       </AssistText>
                                    );
                                 })}
                                 <GoalTime playerid={goal?.playerId}>
                                    {goal?.time} / 2nd
                                 </GoalTime>
                              </div>
                           </GoalContainer>
                        );
                     })}
                  <Typography variant="overline" gutterBottom>
                     3rd Period
                  </Typography>
                  {game?.goals
                     ?.filter((goal) => goal.period === 3)
                     .map((goal, index) => {
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
                                    {goal?.playerName
                                       ? goal?.playerName
                                       : game?.opponentName}
                                 </GoalText>
                                 {goal?.assists?.map((assist) => {
                                    return (
                                       <AssistText
                                          variant="body2"
                                          key={goal?.goalId + assist}
                                       >
                                          {assist?.playerName}
                                          {goal?.assists?.length > 1 ? "," : ""}
                                       </AssistText>
                                    );
                                 })}
                                 <GoalTime playerid={goal?.playerId}>
                                    {goal?.time} / 3rd
                                 </GoalTime>
                              </div>
                           </GoalContainer>
                        );
                     })}
               </Section>
               <Section>
                  <Typography variant="h6">Penalties</Typography>
               </Section>
            </TabPanel>
            <TabPanel desktop={desktop ? 1 : 0} value={value} index={1}>
               Team Stats
            </TabPanel>
         </TabContainer>
      </GameContainer>
   );
};

export default Game;
