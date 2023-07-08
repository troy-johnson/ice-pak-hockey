import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import {
   Avatar,
   Container,
   Divider,
   FormControl,
   Select,
   NativeSelect,
   MenuItem,
   Paper,
   InputLabel,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Typography,
   useMediaQuery,
   useTheme,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Loading, PageContainer } from "../components";
import { useGetAllTimeStats } from "../utils";

const SortArrow = styled(ArrowDropUpIcon)`
   transform: ${(props) => (props.order === "asc" ? "rotate(0deg)" : "rotate(180deg)")};
`;

const StyledStatHeaderCell = ({ className, children, onClick, orderBy, order, type }) => {
   return (
      <TableCell
         className={className}
         onClick={onClick}
         align="center"
         sx={{ backgroundColor: orderBy === type ? "secondary.main" : "black" }}
      >
         <Stack direction="row">
            {type === orderBy ? <SortArrow order={order} /> : null}
            {children}
         </Stack>
      </TableCell>
   );
};

const TableComponent = ({ children }) => <Paper variant="outlined">{children}</Paper>;

const StatHeaderCell = styled(StyledStatHeaderCell)`
   width: ${(props) => (props.desktop ? "50px" : "25px")};
   cursor: pointer;
   th:first-of-type {
      padding-left: 5px;
      width: 250px;
   }
`;

const StatBodyCell = styled(TableCell)`
   width: ${(props) => (props.desktop ? "100%" : "25px")};
   padding-left: 10px;
   padding-right: 0px;

   th:first-of-type {
      width: 250px;
   }
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

const PlayerAvatar = styled(Avatar)`
   margin-right: 10px;
`;

const LeaderStatStack = styled(Stack)`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: 5px;
   min-width: 60px;
`;

const Stats = () => {
   const { stats, statsLoading, statsError } = useGetAllTimeStats();
   const [seasonId, setSeasonId] = useState(null);
   const [order, setOrder] = useState("desc");
   const [orderBy, setOrderBy] = useState("points");

   const theme = useTheme();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));
   const selectSize = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const handleClick = (type) => {
      setOrderBy(type);
      setOrder(order === "asc" ? "desc" : "asc");
   };

   if (statsLoading) {
      return <Loading />;
   } else if (statsError) {
      return <div>An error occurred. Please try again.</div>;
   }

   console.log("stats", stats);

   return (
      <PageContainer pageTitle="All-Time Stats" small>
         {/* <FormControl sx={{ marginLeft: "15px", marginBottom: "15px", maxWidth: "350px" }}>
            <InputLabel id="demo-simple-select-label">Season</InputLabel>
            {selectSize ? (
               <Select
                  labelId="season-select-label"
                  id="season-select"
                  value={seasonId}
                  label="Season"
                  variant="outlined"
                  onChange={handleSeasonChange}
               >
                  {seasonOptions?.map((option) => (
                     <MenuItem key={option.value} value={option.value}>
                        {option.label}
                     </MenuItem>
                  ))}
               </Select>
            ) : (
               <NativeSelect
                  id="season-select"
                  value={seasonId}
                  label="Season"
                  onChange={handleSeasonChange}
               >
                  {seasonOptions?.map((option) => (
                     <option key={option.value} value={option.value}>
                        {option.label}
                     </option>
                  ))}
               </NativeSelect>
            )}
         </FormControl> */}
         {!stats?.stats ? (
            <Container>No stats recorded for this season. Please select another season.</Container>
         ) : (
            <>
               <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                  Leaders
               </Typography>
               {selectSize ? (
                  <Stack
                     direction="row"
                     display="flex"
                     justifyContent="center"
                     divider={<Divider orientation="vertical" flexItem />}
                     spacing={selectSize ? 2.5 : 1}
                     sx={{ mb: "15px", mt: 2, mr: 1, ml: 1 }}
                  >
                     <LeaderStatStack>
                        <Typography variant="overline">
                           {desktop ? "Games Played" : "GP"}
                        </Typography>
                        {stats?.leaders?.gamesPlayed ? (
                           <>
                              <Avatar
                                 sx={{ mb: 1 }}
                                 src={
                                    stats?.leaders?.gamesPlayed?.image ||
                                    stats?.leaders?.gamesPlayed?.authProviderImage
                                 }
                              />
                              {desktop ? (
                                 <Typography>{stats?.leaders?.gamesPlayed?.fullName}</Typography>
                              ) : (
                                 <>
                                    <Typography variant="body2">
                                       {stats?.leaders?.gamesPlayed?.firstName}
                                    </Typography>
                                    <Typography variant="body2">
                                       {stats?.leaders?.gamesPlayed?.lastName}
                                    </Typography>
                                 </>
                              )}
                              <Typography variant="h6">
                                 {stats?.leaders?.gamesPlayed?.gamesPlayed}
                              </Typography>
                           </>
                        ) : (
                           "No stats"
                        )}
                     </LeaderStatStack>
                     <LeaderStatStack>
                        <Typography variant="overline">Goals</Typography>
                        {stats?.leaders?.goals ? (
                           <>
                              <Avatar
                                 sx={{ mb: 1 }}
                                 src={
                                    stats?.leaders?.goals?.image ||
                                    stats?.leaders?.goals?.authProviderImage
                                 }
                              />
                              {desktop ? (
                                 <Typography>{stats?.leaders?.goals?.fullName}</Typography>
                              ) : (
                                 <>
                                    <Typography variant="body2">
                                       {stats?.leaders?.goals?.firstName}
                                    </Typography>
                                    <Typography variant="body2">
                                       {stats?.leaders?.goals?.lastName}
                                    </Typography>
                                 </>
                              )}
                              <Typography variant="h6">{stats?.leaders?.goals?.goals}</Typography>
                           </>
                        ) : (
                           "No stats"
                        )}
                     </LeaderStatStack>
                     <LeaderStatStack>
                        <Typography variant="overline">Assists</Typography>
                        {stats?.leaders?.assists ? (
                           <>
                              <Avatar
                                 sx={{ mb: 1 }}
                                 src={
                                    stats?.leaders?.assists?.image ||
                                    stats?.leaders?.assists?.authProviderImage
                                 }
                              />
                              {desktop ? (
                                 <Typography>{stats?.leaders?.assists?.fullName}</Typography>
                              ) : (
                                 <>
                                    <Typography variant="body2">
                                       {stats?.leaders?.assists?.firstName}
                                    </Typography>
                                    <Typography variant="body2">
                                       {stats?.leaders?.assists?.lastName}
                                    </Typography>
                                 </>
                              )}
                              <Typography variant="h6">
                                 {stats?.leaders?.assists?.assists}
                              </Typography>
                           </>
                        ) : (
                           "No stats"
                        )}
                     </LeaderStatStack>
                     <LeaderStatStack>
                        <Typography variant="overline">{desktop ? "Points" : "Pts"}</Typography>
                        {stats?.leaders?.points ? (
                           <>
                              <Avatar
                                 sx={{ mb: 1 }}
                                 src={
                                    stats?.leaders?.points?.image ||
                                    stats?.leaders?.points?.authProviderImage
                                 }
                              />
                              {desktop ? (
                                 <Typography>{stats?.leaders?.points?.fullName}</Typography>
                              ) : (
                                 <>
                                    <Typography variant="body2">
                                       {stats?.leaders?.points?.firstName}
                                    </Typography>
                                    <Typography variant="body2">
                                       {stats?.leaders?.points?.lastName}
                                    </Typography>
                                 </>
                              )}
                              <Typography variant="h6">
                                 {stats?.leaders?.points?.goals + stats?.leaders?.points?.assists}
                              </Typography>
                           </>
                        ) : (
                           "No stats"
                        )}
                     </LeaderStatStack>
                     <LeaderStatStack>
                        <Typography variant="overline">
                           {desktop ? "Penalty Minutes" : "PIM"}
                        </Typography>
                        {stats?.leaders?.penaltyMinutes ? (
                           <>
                              <Avatar
                                 sx={{ mb: 1 }}
                                 src={
                                    stats?.leaders?.penaltyMinutes?.image ||
                                    stats?.leaders?.penaltyMinutes?.authProviderImage
                                 }
                              />
                              {desktop ? (
                                 <Typography>{stats?.leaders?.penaltyMinutes?.fullName}</Typography>
                              ) : (
                                 <>
                                    <Typography variant="body2">
                                       {stats?.leaders?.penaltyMinutes?.firstName}
                                    </Typography>
                                    <Typography variant="body2">
                                       {stats?.leaders?.penaltyMinutes?.lastName}
                                    </Typography>
                                 </>
                              )}
                              <Typography variant="h6">
                                 {stats?.leaders?.penaltyMinutes?.penaltyMinutes}
                              </Typography>
                           </>
                        ) : (
                           "No stats"
                        )}
                     </LeaderStatStack>
                  </Stack>
               ) : (
                  <TableContainer>
                     <Table aria-label="leaders table">
                        <TableBody>
                           <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <TableCell align="left">
                                 <Typography variant="caption">GP</Typography>
                              </TableCell>
                              <TableCell align="right">
                                 <Avatar
                                    sx={{ mb: 1 }}
                                    src={
                                       stats?.leaders?.gamesPlayed?.image ||
                                       stats?.leaders?.gamesPlayed?.authProviderImage
                                    }
                                 />
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="body2">
                                    {stats?.leaders?.gamesPlayed?.fullName}
                                 </Typography>
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="h6">
                                    {stats?.leaders?.gamesPlayed?.gamesPlayed}
                                 </Typography>
                              </TableCell>
                           </TableRow>
                           <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <TableCell align="left">
                                 <Typography variant="caption">G</Typography>
                              </TableCell>
                              <TableCell align="right">
                                 <Avatar
                                    sx={{ mb: 1 }}
                                    src={
                                       stats?.leaders?.goals?.image ||
                                       stats?.leaders?.goals?.authProviderImage
                                    }
                                 />
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="body2">
                                    {stats?.leaders?.goals?.fullName}
                                 </Typography>
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="h6">{stats?.leaders?.goals?.goals}</Typography>
                              </TableCell>
                           </TableRow>
                           <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <TableCell align="left">
                                 <Typography variant="caption">A</Typography>
                              </TableCell>
                              <TableCell align="right">
                                 <Avatar
                                    sx={{ mb: 1 }}
                                    src={
                                       stats?.leaders?.assists?.image ||
                                       stats?.leaders?.assists?.authProviderImage
                                    }
                                 />
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="body2">
                                    {stats?.leaders?.assists?.fullName}
                                 </Typography>
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="h6">
                                    {stats?.leaders?.assists?.assists}
                                 </Typography>
                              </TableCell>
                           </TableRow>
                           <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <TableCell align="left">
                                 <Typography variant="caption">P</Typography>
                              </TableCell>
                              <TableCell align="right">
                                 <Avatar
                                    sx={{ mb: 1 }}
                                    src={
                                       stats?.leaders?.points?.image ||
                                       stats?.leaders?.points?.authProviderImage
                                    }
                                 />
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="body2">
                                    {stats?.leaders?.points?.fullName}
                                 </Typography>
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="h6">
                                    {stats?.leaders?.points?.points}
                                 </Typography>
                              </TableCell>
                           </TableRow>
                           <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <TableCell align="left">
                                 <Typography variant="caption">PIM</Typography>
                              </TableCell>
                              <TableCell align="right">
                                 <Avatar
                                    sx={{ mb: 1 }}
                                    src={
                                       stats?.leaders?.penaltyMinutes?.image ||
                                       stats?.leaders?.penaltyMinutes?.authProviderImage
                                    }
                                 />
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="body2">
                                    {stats?.leaders?.penaltyMinutes?.fullName}
                                 </Typography>
                              </TableCell>
                              <TableCell align="left">
                                 <Typography variant="h6">
                                    {stats?.leaders?.penaltyMinutes?.penaltyMinutes}
                                 </Typography>
                              </TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                  </TableContainer>
               )}
               <TableContainer>
                  <Table aria-label="Team">
                     <TableHead>
                        <PlayerTableHeader>
                           <StatHeaderCell order={order} orderBy={orderBy} type="lastName">
                              Player
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
                        {stats?.stats
                           ?.sort((a, b) =>
                              order === "asc"
                                 ? a?.[orderBy] - b?.[orderBy]
                                 : b?.[orderBy] - a?.[orderBy]
                           )
                           ?.map((player) => (
                              <Link
                                 href={`/player/${player?.id}`}
                                 key={player?.id || `${player?.firstName}${player?.lastName}`}
                                 passHref
                              >
                                 <TableRow>
                                    <StatBodyCell component="th" scope="row">
                                       <PlayerName>
                                          <Typography variant="caption">{` ${
                                             desktop
                                                ? `${player?.firstName} ${
                                                     player?.nickname ? `"${player?.nickname}"` : ""
                                                  } ${player?.lastName}`
                                                : `${player?.firstName.split("")[0]}. ${
                                                     player?.lastName
                                                  }`
                                          }`}</Typography>
                                          <Typography
                                             variant="caption"
                                             sx={{ marginLeft: "5px", color: "grey.main" }}
                                          >
                                             {player?.jerseyNumber}
                                          </Typography>
                                       </PlayerName>
                                    </StatBodyCell>
                                    <StatBodyCell align="center">
                                       {player?.gamesPlayed}
                                    </StatBodyCell>
                                    <StatBodyCell align="center">{player?.goals}</StatBodyCell>
                                    <StatBodyCell align="center">{player?.assists}</StatBodyCell>
                                    <StatBodyCell align="center">{player?.points}</StatBodyCell>
                                    <StatBodyCell align="center">
                                       {player?.penaltyMinutes}
                                    </StatBodyCell>
                                 </TableRow>
                              </Link>
                           ))}
                     </PlayerTableBody>
                  </Table>
               </TableContainer>
            </>
         )}
      </PageContainer>
   );
};

export default Stats;
