import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import {
   Avatar,
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
   useTheme
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Loading, PageContainer } from "../components";
import { useGetSeasons, useGetSeasonStats } from "../utils";

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
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const [seasonId, setSeasonId] = useState(
      !seasonsLoading && !seasonsError
         ? seasons.sort(
              (a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds)
           )?.[0].id
         : "LSdvGKI4dFWUBwgeEC5z"
   );
   const [order, setOrder] = useState("desc");
   const [orderBy, setOrderBy] = useState("points");
   const { seasonStats, seasonStatsLoading, seasonStatsError } = useGetSeasonStats(
      seasonId ?? seasons?.[0]?.id
   );
   const theme = useTheme();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));

   const selectSize = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   // console.log("uMQ", theme)

   // console.log("seasons", seasons);
   // console.log("seasonStats", seasonStats?.stats?.sort((a, b) => b.goals - a.goals)[0]);

   const leaderStats = (stat) => {
      
      return seasonStats?.stats?.sort((a, b) => {
         if (b[stat] === a[stat]) {
            return b.points - a.points;
         }
         return b[stat] - a[stat];
      })[0];
   }

   const seasonLeaders = {
      goals: leaderStats("goals"),
      assists: leaderStats("assists"),
      points: leaderStats("points"),
      penaltyMinutes: leaderStats("penaltyMinutes"),
   };

   if (seasonStatsLoading) {
      return <Loading />;
   } else if (seasonStatsError) {
      return <div>An error occurred. Please try again.</div>;
   }

   const seasonOptions = seasons
      .sort((a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds))
      .map((season) => {
         return { label: `${season.leagueName} ${season.name} ${season.type}`, value: season.id };
      });

   console.log("seasons", seasons);

   const handleSeasonChange = (e) => {
      setSeasonId(e.target.value);
   };

   const handleClick = (type) => {
      setOrderBy(type);
      setOrder(order === "asc" ? "desc" : "asc");
   };

   return (
      <PageContainer pageTitle="Season Stats" small>
         <FormControl sx={{ marginLeft: "15px", marginBottom: "15px", maxWidth: "350px" }}>
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
                  {seasonOptions.map((option) => (
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
                  {seasonOptions.map((option) => (
                     <option key={option.value} value={option.value}>
                        {option.label}
                     </option>
                  ))}
               </NativeSelect>
            )}
         </FormControl>
         <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
            Leaders
         </Typography>
         <Stack
            direction="row"
            display="flex"
            justifyContent="center"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={selectSize ? 2.5 : 1}
            sx={{ mb: "15px", mt: 2, mr: 1, ml: 1 }}
         >
            <LeaderStatStack>
               <Typography variant="overline">Goals</Typography>
               {seasonLeaders?.goals ? (
                  <>
                     <Avatar
                        sx={{ mb: 1 }}
                        src={
                           seasonLeaders?.goals?.image
                              ? seasonLeaders?.goals?.image
                              : seasonLeaders?.goals?.googleAvatarLink
                        }
                     />
                     {desktop ? (
                        <Typography>{seasonLeaders?.goals?.fullName}</Typography>
                     ) : (
                        <>
                           <Typography variant="body2">
                              {seasonLeaders?.goals?.firstName}
                           </Typography>
                           <Typography variant="body2">{seasonLeaders?.goals?.lastName}</Typography>
                        </>
                     )}
                     <Typography variant="h6">{seasonLeaders?.goals?.goals}</Typography>
                  </>
               ) : (
                  "No stats"
               )}
            </LeaderStatStack>
            <LeaderStatStack>
               <Typography variant="overline">Assists</Typography>
               {seasonLeaders?.assists ? (
                  <>
                     <Avatar
                        sx={{ mb: 1 }}
                        src={seasonLeaders?.assists?.image}
                     />
                     {desktop ? (
                        <Typography>{seasonLeaders?.assists?.fullName}</Typography>
                     ) : (
                        <>
                           <Typography variant="body2">
                              {seasonLeaders?.assists?.firstName}
                           </Typography>
                           <Typography variant="body2">
                              {seasonLeaders?.assists?.lastName}
                           </Typography>
                        </>
                     )}
                     <Typography variant="h6">{seasonLeaders?.assists?.assists}</Typography>
                  </>
               ) : (
                  "No stats"
               )}
            </LeaderStatStack>
            <LeaderStatStack>
               <Typography variant="overline">{desktop ? "Points" : "Pts"}</Typography>
               {seasonLeaders?.points ? (
                  <>
                     <Avatar
                        sx={{ mb: 1 }}
                        src={seasonLeaders?.points?.image}
                     />
                     {desktop ? (
                        <Typography>{seasonLeaders?.points?.fullName}</Typography>
                     ) : (
                        <>
                           <Typography variant="body2">
                              {seasonLeaders?.points?.firstName}
                           </Typography>
                           <Typography variant="body2">
                              {seasonLeaders?.points?.lastName}
                           </Typography>
                        </>
                     )}
                     <Typography variant="h6">
                        {seasonLeaders?.points?.goals + seasonLeaders?.points?.assists}
                     </Typography>
                  </>
               ) : (
                  "No stats"
               )}
            </LeaderStatStack>
            <LeaderStatStack>
               <Typography variant="overline">{desktop ? "Penalty Minutes" : "PIM"}</Typography>
               {seasonLeaders?.penaltyMinutes ? (
                  <>
                     <Avatar
                        sx={{ mb: 1 }}
                        src={seasonLeaders?.penaltyMinutes?.image}
                     />
                     {desktop ? (
                        <Typography>{seasonLeaders?.penaltyMinutes?.fullName}</Typography>
                     ) : (
                        <>
                           <Typography variant="body2">
                              {seasonLeaders?.penaltyMinutes?.firstName}
                           </Typography>
                           <Typography variant="body2">
                              {seasonLeaders?.penaltyMinutes?.lastName}
                           </Typography>
                        </>
                     )}
                     <Typography variant="h6">
                        {seasonLeaders?.penaltyMinutes?.penaltyMinutes}
                     </Typography>
                  </>
               ) : (
                  "No stats"
               )}
            </LeaderStatStack>
         </Stack>
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
                  {seasonStats?.stats
                     ?.sort((a, b) =>
                        order === "asc" ? a?.[orderBy] - b?.[orderBy] : b?.[orderBy] - a?.[orderBy]
                     )
                     ?.map((player) => (
                        <Link
                           href={`/player/${player.playerId}`}
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
                                          : `${player?.firstName.split("")[0]}. ${player?.lastName}`
                                    }`}</Typography>
                                    <Typography
                                       variant="caption"
                                       sx={{ marginLeft: "5px", color: "grey.main" }}
                                    >
                                       {player?.position}
                                    </Typography>
                                 </PlayerName>
                              </StatBodyCell>
                              <StatBodyCell align="center">{player?.gamesPlayed}</StatBodyCell>
                              <StatBodyCell align="center">{player?.goals}</StatBodyCell>
                              <StatBodyCell align="center">{player?.assists}</StatBodyCell>
                              <StatBodyCell align="center">{player?.points}</StatBodyCell>
                              <StatBodyCell align="center">{player?.penaltyMinutes}</StatBodyCell>
                           </TableRow>
                        </Link>
                     ))}
               </PlayerTableBody>
            </Table>
         </TableContainer>
      </PageContainer>
   );
};

export default Stats;
