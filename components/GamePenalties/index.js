import Image from "next/image";
import { useSession } from "next-auth/client";
import {
   Button,
   Divider,
   IconButton,
   Link,
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
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { MdAccessTimeFilled } from "react-icons/md";
import styled from "@emotion/styled";
import { roleCheck } from "../../utils";

const Section = styled.section`
   display: flex;
   flex-direction: column;
   align-content: center;
   margin-bottom: 25px;
   box-shadow: none;
`;

const GamePenalties = ({ handleClickOpen, penaltiesByPeriod }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const [session, loading] = useSession();

   return (
      <Section>
         <Stack direction="row" sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ ml: "5px" }} variant="h5">
               Penalties
            </Typography>
            {!!roleCheck(session, ["Admins", "Manager", "Assistant Manager]"]) ? (
               <Button
                  variant="outlined"
                  onClick={() => handleClickOpen("add")}
                  endIcon={<MdAccessTimeFilled />}
               >
                  Add Penalty
               </Button>
            ) : null}
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
                     <Typography sx={{ ml: "5px" }} variant="body2" gutterBottom>
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
                                    sx={{
                                       padding: 0,
                                       border: "hidden",
                                       maxHeight: "75px",
                                       height: "50px",
                                    }}
                                 >
                                    <TableCell
                                       component="th"
                                       scope="row"
                                       align="left"
                                       sx={{ padding: "0 15px 0 5px", width: "50px" }}
                                    >
                                       {penalty?.time}
                                    </TableCell>
                                    <TableCell
                                       sx={{ width: "30px", padding: "5px 0 0 0" }}
                                       align="center"
                                    >
                                       {penalty?.playerName ? (
                                          <Image
                                             alt="Ice Pak Penalty"
                                             src="/jerseyLogo.png"
                                             width={35}
                                             height={30}
                                          />
                                       ) : null}
                                    </TableCell>
                                    <TableCell align="left" sx={{ padding: 0 }}>
                                       <Stack ml={2} direction="column">
                                          <Typography
                                             variant={desktop ? "h6" : "subtitle2"}
                                             fontWeight={400}
                                          >
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
                                             variant={desktop ? "body2" : "caption"}
                                             fontStyle="italic"
                                          >{`${penalty?.penaltyType} (${penalty?.minutes}:00)`}</Typography>
                                       </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                       {penalty?.ytLink ? (
                                          <Link
                                             href={penalty?.ytLink}
                                             rel="noopener"
                                             target="_blank"
                                          >
                                             <IconButton size={desktop ? "large" : "small"}>
                                                <OndemandVideoIcon />
                                             </IconButton>
                                          </Link>
                                       ) : null}
                                       {!!roleCheck(session, [
                                          "Admins",
                                          "Manager",
                                          "Assistant Manager]",
                                       ]) ? (
                                          <IconButton
                                             size={desktop ? "large" : "small"}
                                             onClick={() => handleClickOpen("edit", penalty)}
                                          >
                                             <EditIcon />
                                          </IconButton>
                                       ) : null}
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
