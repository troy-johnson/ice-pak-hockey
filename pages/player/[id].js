import { useState } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";
import {
   Avatar,
   Box,
   Button,
   Container,
   Paper,
   Divider,
   Tabs,
   Tab,
   TableBody,
   TableContainer,
   Table,
   TableCell,
   Stack,
   TableHead,
   TableRow,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { EditPlayer, Loading, PageContainer } from "../../components";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
   roleCheck,
   useGetAssists,
   useGetGoals,
   useGetPlayers,
   useGetPlayerStats,
} from "../../utils";

const SortArrow = styled(ArrowDropUpIcon)`
   transform: ${(props) => (props.order === "asc" ? "rotate(0deg)" : "rotate(180deg)")};
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
         {value === index && <div desktop={desktop || window?.innerWidth > 650}>{children}</div>}
      </div>
   );
};

const TabPanel = styled(StyledTabPanel)`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
`;

const TableComponent = ({ children }) => <Paper variant="outlined">{children}</Paper>;

const StatBodyCell = styled(TableCell)`
   width: ${(props) => (props.desktop ? "100%" : "25px")};
   padding-left: 10px;
   padding-right: 0px;

   th:first-of-type {
      width: 250px;
   }
`;

const PlayerTableBody = styled(TableBody)`
   tr {
      cursor: pointer;
   }

   tr:nth-of-type(odd) {
      background-color: rgba(0, 0, 0, 0.04);
   }
`;

const PlayerName = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
`;

const TabContainer = styled(Box)`
   display: flex;
   flex-direction: column;
   align-items: center;
`;

const TabBox = styled(Box)`
   margin-bottom: 10px;
`;

const PlayerTableHeader = styled(TableRow)`
   background-color: ${(props) => props.theme.palette.black};

   th:first-of-type {
      width: 250px;
   }

   th {
      color: ${(props) => props.theme.palette.white};
   }
`;

const GameLogHeader = styled(TableRow)`
   background-color: ${(props) => props.theme.palette.black};

   th {
      color: ${(props) => props.theme.palette.white};
   }
`;

const StyledStatHeaderCell = ({ className, children, onClick, orderBy, order, type }) => {
   return (
      <TableCell
         className={className}
         onClick={onClick}
         align="center"
         sx={{ bgcolor: orderBy === type ? "secondary.main" : "black" }}
      >
         <Stack direction="row">
            {type === orderBy ? <SortArrow order={order} /> : null}
            {children}
         </Stack>
      </TableCell>
   );
};

const StatHeaderCell = styled(StyledStatHeaderCell)`
   width: ${(props) => (props.desktop ? "50px" : "25px")};
   cursor: pointer;
   th:first-of-type {
      padding-left: 5px;
      width: 250px;
   }
`;

const CareerStatStack = styled(Stack)`
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 5px;
   min-width: 60px;
`;

const Player = () => {
   const router = useRouter();
   const { id } = router.query;

   const [order, setOrder] = useState("desc");
   const [orderBy, setOrderBy] = useState("points");
   const [value, setValue] = useState(0);
   // const [editPlayerDialog, setEditPlayerDialog] = useState(false);

   const { data: session, status } = useSession();
   const loading = status === "loading";
   const { playerStats, playerStatsLoading, playerStatsError } = useGetPlayerStats(id);

   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const handleChange = (event, newValue) => setValue(newValue);

   const handleClick = (type) => {
      setOrderBy(type);
      setOrder(order === "asc" ? "desc" : "asc");
   };

   console.log("player stats", { playerStats, playerStatsLoading, playerStatsError });

   if (playerStatsLoading) {
      return <Loading />;
   } else if (playerStatsError) {
      return <div>An error occurred. Please try again.</div>;
   }

   return (
      <PageContainer small>
         <Stack display="flex" alignItems="center">
            <Avatar
               alt={`${playerStats?.player?.firstName} ${playerStats?.player?.nickname ? playerStats?.player?.nickname : ""} ${
                  playerStats?.player?.lastName
               }`}
               src={playerStats?.player?.image || playerStats?.player?.authProviderImage}
               sx={{ width: desktop ? 160 : 100, height: desktop ? 160 : 100 }}
            />
            <Typography variant={desktop ? "h4" : "h5"}>{`${playerStats?.player?.firstName} ${
               playerStats?.player?.nickname ? `"${playerStats?.player?.nickname}"` : ""
            } ${playerStats?.player?.lastName} | #${playerStats?.player?.number ?? playerStats?.player?.jerseyNumber}`}</Typography>
            {playerStats?.player?.handedness ? (
               <Typography variant="subtitle1">
                  <b>Shoots: </b>
                  {playerStats?.player?.handedness ?? playerStats?.player?.shoots}
               </Typography>
            ) : null}
            {playerStats?.player?.born ? (
               <Typography variant="subtitle1">
                  <b>Born: </b>
                  {dayjs(playerStats?.player?.born).format("MMM D, YYYY")}
               </Typography>
            ) : null}
            {playerStats?.player?.height ? (
               <Typography variant="subtitle1">
                  <b>Height: </b>
                  {playerStats?.player?.height}
               </Typography>
            ) : null}
            {playerStats?.player?.hometown ? (
               <Typography variant="subtitle1">
                  <b>Hometown: </b>
                  {playerStats?.player?.hometown}
               </Typography>
            ) : null}
         </Stack>
         <TabContainer>
            <TabBox sx={{ borderBottom: 1, borderColor: "divider" }}>
               <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Career Stats" />
                  <Tab label="Game Log" />
                  {!!roleCheck(session, ["Admins"]) ? <Tab label="Edit Player" /> : null}
               </Tabs>
            </TabBox>
            <TabPanel desktop={desktop || window?.innerWidth > 650} value={value} index={0}>
               <Typography variant="subtitle2" sx={{ ml: 2 }}>
                  Career Totals
               </Typography>
               <Stack
                  direction="row"
                  display="flex"
                  justifyContent="center"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={1}
                  sx={{ mb: "15px", mt: 2 }}
               >
                  <CareerStatStack>
                     <Typography variant="overline">{desktop ? "Games Played" : "GP"}</Typography>
                     <Typography>{playerStats?.careerStats?.gamesPlayed}</Typography>
                  </CareerStatStack>
                  <CareerStatStack>
                     <Typography variant="overline">Goals</Typography>
                     <Typography>{playerStats?.careerStats?.goals}</Typography>
                  </CareerStatStack>
                  <CareerStatStack>
                     <Typography variant="overline">Assists</Typography>
                     <Typography>{playerStats?.careerStats?.assists}</Typography>
                  </CareerStatStack>
                  <CareerStatStack>
                     <Typography variant="overline">Points</Typography>
                     <Typography>
                        {playerStats?.careerStats?.goals + playerStats?.careerStats?.assists}
                     </Typography>
                  </CareerStatStack>
                  <CareerStatStack>
                     <Typography variant="overline">
                        {desktop ? "Penalty Minutes" : "PIM"}
                     </Typography>
                     <Typography>{playerStats?.careerStats?.penaltyMinutes}</Typography>
                  </CareerStatStack>
               </Stack>
               <Typography variant="subtitle2" sx={{ ml: 2, mb: 2, mt: 3 }}>
                  Season Stats
               </Typography>
               <Container sx={{ mb: 2 }}>
                  <TableContainer component={TableComponent}>
                     <Table aria-label="Team">
                        <TableHead>
                           <PlayerTableHeader>
                              <StatHeaderCell
                                 order={order}
                                 orderBy={orderBy}
                                 type="season"
                                 onClick={() => handleClick("gamesPlayed")}
                              >
                                 Season
                              </StatHeaderCell>
                              <StatHeaderCell
                                 order={order}
                                 orderBy={orderBy}
                                 type="gamesPlayed"
                                 onClick={() => handleClick("gamesPlayed")}
                              >
                                 GP
                              </StatHeaderCell>
                              <StatHeaderCell
                                 order={order}
                                 orderBy={orderBy}
                                 type="goals"
                                 onClick={() => handleClick("goals")}
                              >
                                 {desktop ? "Goals" : "G"}
                              </StatHeaderCell>
                              <StatHeaderCell
                                 order={order}
                                 orderBy={orderBy}
                                 type="assists"
                                 onClick={() => handleClick("assists")}
                              >
                                 {desktop ? "Assists" : "A"}
                              </StatHeaderCell>
                              <StatHeaderCell
                                 order={order}
                                 orderBy={orderBy}
                                 type="points"
                                 onClick={() => handleClick("points")}
                              >
                                 {desktop ? "Points" : "P"}
                              </StatHeaderCell>
                              <StatHeaderCell
                                 order={order}
                                 orderBy={orderBy}
                                 type="penaltyMinutes"
                                 onClick={() => handleClick("penaltyMinutes")}
                              >
                                 PIM
                              </StatHeaderCell>
                           </PlayerTableHeader>
                        </TableHead>
                        <PlayerTableBody>
                           {playerStats?.seasonStats
                              ?.sort((a, b) =>
                                 order === "asc"
                                    ? a?.[orderBy] - b?.[orderBy]
                                    : b?.[orderBy] - a?.[orderBy]
                              )
                              ?.filter((season) => season?.gamesPlayed >= 1)
                              ?.map((season) => (
                                 <TableRow key={season.seasonId}>
                                    <StatBodyCell component="th" scope="row">
                                       {desktop ? (
                                          <Typography variant="caption">
                                             {`${season.leagueName} ${season.shortYear} ${season.type}`}
                                          </Typography>
                                       ) : (
                                          <Stack direction="column" alignItems="left">
                                             <Typography variant="caption">
                                                {season.leagueName}
                                             </Typography>
                                             <Typography variant="caption">
                                                {season.shortYear}
                                             </Typography>
                                             <Typography variant="caption">
                                                {season.type}
                                             </Typography>
                                          </Stack>
                                       )}
                                    </StatBodyCell>
                                    <StatBodyCell align="center">
                                       {season?.gamesPlayed}
                                    </StatBodyCell>
                                    <StatBodyCell align="center">{season?.goals}</StatBodyCell>
                                    <StatBodyCell align="center">{season?.assists}</StatBodyCell>
                                    <StatBodyCell align="center">
                                       {season?.goals + season?.assists}
                                    </StatBodyCell>
                                    <StatBodyCell align="center">
                                       {season?.penaltyMinutes}
                                    </StatBodyCell>
                                 </TableRow>
                              ))}
                        </PlayerTableBody>
                     </Table>
                  </TableContainer>
               </Container>
            </TabPanel>
            <TabPanel desktop={desktop || window?.innerWidth > 650} value={value} index={1}>
               <Container sx={{ mb: 2 }}>
                  <TableContainer component={TableComponent}>
                     <Table aria-label="Game Log">
                        <TableHead>
                           <GameLogHeader>
                              <TableCell sx={{ bgcolor: "black.main" }}>Date</TableCell>
                              <TableCell
                                 sx={{ minWidth: desktop ? "150px" : "100%" }}
                                 align="center"
                              >
                                 Opponent
                              </TableCell>
                              <TableCell>{desktop ? "Goals" : "G"}</TableCell>
                              <TableCell>{desktop ? "Assists" : "A"}</TableCell>
                              <TableCell>{desktop ? "Points" : "P"}</TableCell>
                              <TableCell>PIM</TableCell>
                           </GameLogHeader>
                        </TableHead>
                        <PlayerTableBody>
                           {playerStats?.gameLog?.map((game, index) => (
                              <TableRow key={`game-log-${index}`}>
                                 <StatBodyCell component="th" scope="row">
                                    <PlayerName>
                                       <Typography variant="caption">
                                          {dayjs(game.date).format("MMM D")}
                                       </Typography>
                                    </PlayerName>
                                 </StatBodyCell>
                                 <StatBodyCell align="center">{game.opponentName}</StatBodyCell>
                                 <StatBodyCell align="center">{game.goals}</StatBodyCell>
                                 <StatBodyCell align="center">{game?.assists}</StatBodyCell>
                                 <StatBodyCell align="center">
                                    {game?.goals + game?.assists}
                                 </StatBodyCell>
                                 <StatBodyCell align="center">{game?.penaltyMinutes}</StatBodyCell>
                              </TableRow>
                           ))}
                        </PlayerTableBody>
                     </Table>
                  </TableContainer>
               </Container>
            </TabPanel>
            <TabPanel desktop={desktop || window?.innerWidth > 650} value={value} index={2}>
               <div>Edit Player</div>
            </TabPanel>
         </TabContainer>
         {/* <EditPlayer
            open={editPlayerDialog}
            close={() => setEditPlayerDialog(false)}
            player={player}
         /> */}
      </PageContainer>
   );
};

export default Player;
