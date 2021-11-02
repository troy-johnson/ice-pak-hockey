import { useState } from "react";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import {
   Container,
   FormControl,
   InputLabel,
   Link,
   Select,
   MenuItem,
   NativeSelect,
   TableContainer,
   TableCell,
   TableBody,
   Table,
   Paper,
   Stack,
   TableHead,
   TableRow,
   Typography,
   useMediaQuery,
} from "@mui/material";
// import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Loading } from "..";
import { useGetSeasons } from "../../utils";

const TableComponent = ({ children }) => <Paper variant="outlined">{children}</Paper>;

const PlayerTableHeader = styled(TableRow)`
   background-color: ${(props) => props.theme.palette.black};

   th:first-of-type {
      min-width: 125px;
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

const StandingsTable = ({ currentStandings, seasonType }) => {
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const [seasonId, setSeasonId] = useState(
      !seasonsLoading && !seasonsError
         ? seasons.sort(
              (a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds)
           )?.[0].id
         : "LSdvGKI4dFWUBwgeEC5z"
   );

   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const standings = currentStandings;

   console.log("season type", seasonType);

   const cells =
      seasonType === "Playoffs"
         ? ["Team", "Result", "W", "L", "GF", "GA"]
         : ["Team", "GP", "W", "L", "OTL", "P", "GF", "GA", "PIM"];

   return (
      <>
         {!standings ? (
            <Typography sx={{ ml: 2, mt: 2, mb: 2 }}>
               Standings not found for selected season. Please select another season.
            </Typography>
         ) : (
            <TableContainer sx={{ mt: "15px" }}>
               <Table aria-label="Team">
                  <TableHead>
                     <PlayerTableHeader>
                        {seasonType === "Playoffs" ? (
                           <>
                              <TableCell align="left">Team</TableCell>
                              {/* <TableCell align="center">Result</TableCell> */}
                              <TableCell align="center">W</TableCell>
                              <TableCell align="center">L</TableCell>
                              {/* {desktop ? (
                                 <> */}
                                    <TableCell align="center">GF</TableCell>
                                    <TableCell align="center">GA</TableCell>
                                 {/* </>
                              ) : null} */}
                           </>
                        ) : (
                           <>
                              <TableCell align="left">Team</TableCell>
                              <TableCell align="center">GP</TableCell>
                              <TableCell align="center">W</TableCell>
                              <TableCell align="center">L</TableCell>
                              <TableCell align="center">OTL</TableCell>
                              <TableCell align="center">P</TableCell>
                              <TableCell align="center">GF</TableCell>
                              <TableCell align="center">GA</TableCell>
                              <TableCell align="center">PIM</TableCell>
                           </>
                        )}
                     </PlayerTableHeader>
                  </TableHead>
                  <PlayerTableBody>
                     {seasonType === "Playoffs"
                        ? currentStandings?.map((team, index) => (
                             <TableRow key={team.teamId}>
                                <TableCell component="th" scope="row">
                                {team?.teamName}
                                </TableCell>
                                {/* <TableCell align="center">{team?.result}</TableCell> */}
                                <TableCell align="center">{team?.wins}</TableCell>
                                <TableCell align="center">{team?.losses}</TableCell>
                                {/* {desktop ? (
                                   <> */}
                                      <TableCell align="center">{team?.goalsFor}</TableCell>
                                      <TableCell align="center">{team?.goalsAgainst}</TableCell>
                                   {/* </>
                                ) : null} */}
                             </TableRow>
                          ))
                        : currentStandings?.map((team, index) => (
                             <TableRow key={team.teamId}>
                                <TableCell component="th" scope="row">
                                   {team?.teamName}
                                </TableCell>
                                <TableCell align="center">
                                   {team?.wins + team?.losses + team?.otl}
                                </TableCell>
                                <TableCell align="center">{team?.wins}</TableCell>
                                <TableCell align="center">{team?.losses}</TableCell>
                                <TableCell align="center">{team?.otl}</TableCell>
                                <TableCell align="center">
                                   {team?.wins * 2 + team?.otl * 1}
                                </TableCell>
                                <TableCell align="center">{team?.goalsFor}</TableCell>
                                <TableCell align="center">{team?.goalsAgainst}</TableCell>
                                <TableCell align="center">{team?.penaltyMinutes}</TableCell>
                             </TableRow>
                          ))}
                  </PlayerTableBody>
               </Table>
            </TableContainer>
         )}
      </>
   );
};

export default StandingsTable;
