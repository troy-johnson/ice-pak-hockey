import Image from "next/image";
import { useSession } from "next-auth/react";
import {
   Button,
   Divider,
   IconButton,
   Link,
   Stack,
   TableContainer,
   TableCell,
   Table,
   TableRow,
   TableBody,
   Typography,
   useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { FaHockeyPuck } from "react-icons/fa";
import { deleteGoal, roleCheck } from "../../utils";

const GameGoals = ({
   goals,
   goalsSorted,
   openUpsertGoal,
   setSnackbar,
   teams
}) => {
   const { data: session, status } = useSession()
   const loading = status === "loading"
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

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

   const handleDelete = (data) => {
      try {
         deleteGoal(data);
         setSnackbar({
            open: true,
            type: "success",
            message: "Goal successfully deleted!",
         });
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   return (
      <Stack direction="column">
         <Stack direction="row" sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ ml: "5px" }} variant="h5">
               Goals
            </Typography>
            {!!roleCheck(session, ["Admins"]) ? (
               <Button
                  variant="outlined"
                  onClick={() => openUpsertGoal("add")}
                  endIcon={<FaHockeyPuck />}
               >
                  Add Goal
               </Button>
            ) : null}
         </Stack>
         {goalsByPeriod?.map((period) => {
            return (
               <div key={`${period.period}-period-goals`}>
                  <Divider>
                     <Typography variant="overline" gutterBottom>
                        {period?.period === "OT" ? "Overtime" : `${period.period} Period`}
                     </Typography>
                  </Divider>
                  {period?.goals?.length === 0 ? (
                     <Typography sx={{ ml: "5px" }} variant="body2" gutterBottom>
                        No Goals
                     </Typography>
                  ) : null}

                  <TableContainer>
                     <Table aria-label="simple table">
                        <TableBody>
                           {period?.goals?.map((goal) => {
                              return (
                                 <TableRow
                                    key={"box-score-row-" + goal.goalId}
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
                                       {goal?.time}
                                    </TableCell>
                                    <TableCell
                                       sx={{ width: "30px", padding: "5px 0 0 0" }}
                                       align="center"
                                    >
                                          <Image
                                             alt={`${goal?.team} Goal`}
                                             src={teams?.filter(team => team.id === goal?.teamId)?.[0]?.logo}
                                             width={40}
                                             height={40}
                                          />
                                    </TableCell>
                                    <TableCell align="left" sx={{ padding: 0 }}>
                                       <Stack ml={2} direction="column">
                                          <Typography
                                             variant={desktop ? "h6" : "subtitle2"}
                                             fontWeight={400}
                                          >
                                             {goal?.team === "Ice Pak"
                                                ? desktop
                                                   ? `${goal?.players?.firstName} ${goal?.players?.lastName}`
                                                   : `${goal.players?.firstName.charAt(0)}. ${goal?.players.lastName}`
                                                : goal?.team}
                                          </Typography>
                                          <Stack direction="row">
                                             {goal?.assists?.map((assist, index) => {
                                                return (
                                                   <Typography
                                                      variant={desktop ? "body2" : "caption"}
                                                      fontStyle="italic"
                                                      key={goal?.goalId + assist?.playerId}
                                                      ml={index === 1 ? 1 : 0}
                                                   >
                                                      {desktop
                                                         ? `${assist?.firstName} ${assist?.lastName}`
                                                         : `${assist?.firstName.charAt(0)}. ${assist?.lastName}`}
                                                      {`${
                                                         goal?.assists?.length > 1 && index === 0
                                                            ? ","
                                                            : ""
                                                      }`}
                                                   </Typography>
                                                );
                                             })}
                                          </Stack>
                                       </Stack>
                                    </TableCell>
                                    {/* {!!roleCheck(session, [
                                       "Admins",
                                       "Manager",
                                       "Assistant Manager]",
                                    ]) ? ( */}
                                    <TableCell align="right">
                                       {/* <Stack direction="row"> */}
                                       {goal?.ytLink ? (
                                          <Link href={goal?.ytLink} rel="noopener" target="_blank">
                                             <IconButton size={desktop ? "large" : "small"}>
                                                <OndemandVideoIcon />
                                             </IconButton>
                                          </Link>
                                       ) : null}
                                       {!!roleCheck(session, [
                                          "Admins",
                                          "Manager",
                                          "Assistant Manager",
                                       ]) ? (
                                          <IconButton
                                             size={desktop ? "large" : "small"}
                                             onClick={() => openUpsertGoal("edit", goal)}
                                          >
                                             <EditIcon />
                                          </IconButton>
                                       ) : null}
                                       {!!roleCheck(session, [
                                          "Admins",
                                          "Manager",
                                          "Assistant Manager",
                                       ]) ? (
                                          <IconButton
                                             size={desktop ? "large" : "small"}
                                             onClick={() => handleDelete(goal)}
                                          >
                                             <DeleteIcon />
                                          </IconButton>
                                       ) : null}
                                       {/* </Stack> */}
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
      </Stack>
   );
};
export default GameGoals;
