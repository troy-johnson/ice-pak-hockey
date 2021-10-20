import Image from "next/image";
import {
   Box,
   Button,
   Divider,
   IconButton,
   Stack,
   Table,
   TableBody,
   TableContainer,
   TableRow,
   TableCell,
   Typography,
   useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { MdAccessTimeFilled } from "react-icons/md";
import styled from "@emotion/styled";
import dayjs from "dayjs";

const Section = styled.section`
   display: flex;
   flex-direction: column;
   align-content: center;
   margin-bottom: 25px;
   box-shadow: none;
`;

const PenaltyRowBackground = styled(Image)`
   right: 0;
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

const GamePenalties = ({ handleClickOpen, penaltiesByPeriod }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   return (
      <Section>
         <Stack direction="row" sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5">Penalties</Typography>
            <Button
               variant="outlined"
               onClick={() => handleClickOpen("add")}
               endIcon={<MdAccessTimeFilled />}
            >
               Add Penalty
            </Button>
         </Stack>
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
                                          <Typography
                                             variant={desktop ? "subtitle1" : "caption"}
                                          >{`${penalty?.penaltyType}`}</Typography>
                                          <Typography
                                             variant={desktop ? "subtitle1" : "caption"}
                                          >{`(${penalty?.minutes})`}</Typography>
                                       </div>
                                    </TableCell>
                                    {/* <TableCell align="left">{`${penalty?.minutes}:00 for ${penalty?.penaltyType}`}</TableCell> */}
                                    <TableCell align="right">
                                       <EditButton
                                          size="small"
                                          aria-label="Edit Penalty"
                                          onClick={() => handleClickOpen("edit", penalty)}
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

export default GamePenalties;
