import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import {
   Avatar,
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
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Loading, PageContainer } from "../components";
import { useGetSeasons, useGetSeasonStats } from "../utils";

const SortArrow = styled(ArrowDropUpIcon)`
   transform: ${(props) => (props.order === "asc" ? "rotate(0deg)" : "rotate(180deg)")};
`;

const StyledStatHeaderCell = ({ className, children, onClick, orderBy, order, type }) => {
   return (
      <TableCell className={className} onClick={onClick} align="center">
         <Stack direction="row">
            {type === orderBy ? <SortArrow order={order} /> : null}
            {children}
         </Stack>
      </TableCell>
   );
};

const TableComponent = ({children}) => (<Paper variant="outlined">{children}</Paper>)

const StatHeaderCell = styled(StyledStatHeaderCell)`
   width: ${(props) => (props.desktop ? "100%" : "25px")};
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

const Stats = () => {
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const [seasonId, setSeasonId] = useState(
      !seasonsLoading && !seasonsError ? seasons[0].id : "LSdvGKI4dFWUBwgeEC5z"
   );
   const [order, setOrder] = useState("desc");
   const [orderBy, setOrderBy] = useState("points");
   const { seasonStats, seasonStatsLoading, seasonStatsError } = useGetSeasonStats(
      seasonId ?? seasons?.[0]?.id
   );
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   // console.log("seasons", seasons);
   // console.log("seasonStats", seasonStats);

   if (seasonStatsLoading) {
      return <Loading />;
   } else if (seasonStatsError) {
      return <div>An error occurred. Please try again.</div>;
   }

   const seasonOptions = seasons.map((season) => {
      return { label: `${season.leagueName} ${season.name}`, value: season.id };
   });

   const handleSeasonChange = () => {
      setSeasonId(e.target.value);
   };

   const handleClick = (type) => {
      setOrderBy(type);
      setOrder(order === "asc" ? "desc" : "asc");
   };

   return (
      <PageContainer pageTitle="Season Stats">
         <FormControl sx={{ marginLeft: "15px", marginBottom: "15px" }}>
            <InputLabel id="demo-simple-select-label">Season</InputLabel>
            {desktop ? (
               <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={seasonId}
                  label="Season"
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
                  id="demo-simple-select"
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
