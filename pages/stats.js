import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import {
   Avatar,
   FormControl,
   Select,
   NativeSelect,
   MenuItem,
   InputLabel,
   IconButton,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Typography,
   useMediaQuery,
   Paper,
} from "@mui/material";
import { Loading } from "../components";
import { useGetSeasons, useGetSeasonStats } from "../utils";

const PlayerTableCell = styled(TableCell)`
   width: ${(props) => (props.desktop ? "100%" : "25px")};
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

const AddButton = styled(IconButton)`
   background-color: ${(props) => props.theme.palette.black};
   color: ${(props) => props.theme.palette.white};
   height: 48px;
   width: 48px;

   :hover {
      background-color: ${(props) => props.theme.palette.white};
      color: ${(props) => props.theme.palette.black};
   }
`;

const Stats = () => {
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const [seasonId, setSeasonId] = useState(
      !seasonsLoading && !seasonsError ? seasons[0].id : null
   );
   const { seasonStats, seasonStatsLoading, seasonStatsError } = useGetSeasonStats(
      seasonId ?? seasons?.[0]?.id
   );
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   console.log("seasons", seasons);
   console.log("seasonStats", seasonStats);

   if (seasonStatsLoading) {
      return <Loading />;
   } else if (seasonStatsError) {
      return <div>An error occurred. Please try again.</div>;
   }

   const seasonOptions = seasons.map((season) => {
      return { label: `${season.leagueName} ${season.name}`, value: season.id };
   });

   const handleSeasonChange = () => {};

   return (
      <Stack
         justifyContent="center"
         alignItems="center"
         sx={{
            marginBottom: desktop ? 0 : "5px",
            marginTop: "15px",
         }}
      >
         <Paper elevation={3} sx={{ width: desktop ? "75%" : "100%" }}>
            <Typography variant={desktop ? "h3" : "h4"} mt={3} mb={3} sx={{ textAlign: "center" }}>
               SEASON STATS
            </Typography>
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
                        <PlayerTableCell>Player</PlayerTableCell>
                        <PlayerTableCell align="center">
                           {desktop ? "Games Played" : "GP"}
                        </PlayerTableCell>
                        <PlayerTableCell align="center">{desktop ? "Goals" : "G"}</PlayerTableCell>
                        <PlayerTableCell align="center">
                           {desktop ? "Assists" : "A"}
                        </PlayerTableCell>
                        <PlayerTableCell align="center">{desktop ? "Points" : "P"}</PlayerTableCell>
                        <PlayerTableCell align="center">
                           {desktop ? "Penalty Minutes" : "PIM"}
                        </PlayerTableCell>
                     </PlayerTableHeader>
                  </TableHead>
                  <PlayerTableBody>
                     {seasonStats?.stats
                        ?.sort((a, b) => b?.points - a?.points)
                        ?.map((player) => (
                           <Link
                              href={`/player/${player.playerId}`}
                              key={player?.id || `${player?.firstName}${player?.lastName}`}
                              passHref
                           >
                              <TableRow>
                                 <PlayerTableCell component="th" scope="row">
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
                                          {player?.position}
                                       </Typography>
                                    </PlayerName>
                                 </PlayerTableCell>
                                 <PlayerTableCell align="center">
                                    {player?.gamesPlayed}
                                 </PlayerTableCell>
                                 <PlayerTableCell align="center">{player?.goals}</PlayerTableCell>
                                 <PlayerTableCell align="center">{player?.assists}</PlayerTableCell>
                                 <PlayerTableCell align="center">{player?.points}</PlayerTableCell>
                                 <PlayerTableCell align="center">
                                    {player?.penaltyMinutes}
                                 </PlayerTableCell>
                              </TableRow>
                           </Link>
                        ))}
                  </PlayerTableBody>
               </Table>
            </TableContainer>
         </Paper>
      </Stack>
   );
};

export default Stats;
