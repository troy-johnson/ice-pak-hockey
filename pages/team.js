import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import { useForm } from "react-hook-form";
import {
   Avatar,
   Button,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
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
import { IoPersonAddSharp } from "react-icons/io5";
import { Loading, ControlledInput, ControlledSelect, PageContainer } from "../components";
import { addPlayer, roleCheck, useGetPlayers } from "../utils";

const PlayerTableCell = styled(TableCell)`
   width: ${(props) => (props.desktop ? "100%" : "25px")};
`;

const PlayerTableHeader = styled(TableRow)`
   background-color: ${(props) => props.theme.palette.black};

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

const TeamInfo = styled.section`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
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

const AddPlayerContent = styled(DialogContent)`
   div {
      margin: 5px 0px;
   }
`;

const Team = () => {
   const [open, setOpen] = useState(false);
   const [formErrors, setFormErrors] = useState(false);
   const {
      control,
      formState: { errors, isValid },
      handleSubmit,
      reset,
   } = useForm();
   const { players, playersLoading, playersError } = useGetPlayers();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const { mutate } = useSWRConfig();
   const { data: session, status } = useSession()
   const loading = status === "loading"

   const shootsOptions = [
      { label: "L", value: "L" },
      { label: "R", value: "R" },
   ];

   const posOptions = [
      { label: "F", value: "F" },
      { label: "D", value: "D" },
      { label: "G", value: "G" },
      { label: "LW", value: "LW" },
      { label: "C", value: "C" },
      { label: "RW", value: "RW" },
      { label: "LD", value: "LD" },
      { label: "RD", value: "RD" },
   ];

   const onSubmit = (data) => {
      // console.log(data);

      try {
         if (isValid) {
            addPlayer({ ...data, jerseyNumber: data?.number, number: Number(data?.number) });
            mutate(`/api/players`, [...players, data], true);
            handleClose();
         } else {
            setFormErrors(true);
         }
      } catch (error) {
         // console.log("error", error);
      }
   };

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      reset({
         email: "",
         firstName: "",
         hometown: "",
         image: "",
         jerseyNumber: "",
         lastName: "",
         nickname: "",
         phoneNumber: "",
         position: "F",
         shoots: "R",
      });
      setOpen(false);
   };

   // console.log("players", players);

   if (playersLoading) {
      return <Loading />;
   } else if (playersError) {
      return <div>An error occurred. Please try again.</div>;
   }

   return (
      <PageContainer pageTitle="Team">
         {!!roleCheck(session, ["Admins"]) ? (
            <Button
               variant="outlined"
               onClick={handleClickOpen}
               sx={{ marginLeft: "15px", marginBottom: "15px" }}
               endIcon={<IoPersonAddSharp />}
            >
               Add Player
            </Button>
         ) : null}
         <TableContainer>
            <Table aria-label="Team">
               <TableHead>
                  <PlayerTableHeader>
                     <PlayerTableCell>Player</PlayerTableCell>
                     <PlayerTableCell align="center">{desktop ? "Number" : "#"}</PlayerTableCell>
                     <PlayerTableCell align="center">
                        {desktop ? "Position" : "Pos"}
                     </PlayerTableCell>
                     <PlayerTableCell align="center">{desktop ? "Shoots" : "Sh"}</PlayerTableCell>
                     {desktop ? <PlayerTableCell align="center">Home Town</PlayerTableCell> : null}
                  </PlayerTableHeader>
               </TableHead>
               <PlayerTableBody>
                  {players
                     ?.sort((a, b) => a?.jerseyNumber - b?.jerseyNumber)
                     ?.filter((player) => !player?.doNotDisplay)
                     ?.map((player) => (
                        <Link
                           href={`/player/${player.id}`}
                           key={player?.id || `${player?.firstName}${player?.lastName}`}
                           passHref
                        >
                           <TableRow>
                              <PlayerTableCell component="th" scope="row">
                                 <PlayerName>
                                    {desktop ? (
                                       <PlayerAvatar
                                          alt={`${player?.firstName} ${
                                             player?.nickname ? player?.nickname : ""
                                          } ${player?.lastName}`}
                                          src={player?.image || player?.authProviderImage}
                                       />
                                    ) : null}{" "}
                                    {desktop
                                       ? `${player?.firstName} ${
                                            player?.nickname ? `"${player?.nickname}"` : ""
                                         } ${player?.lastName}`
                                       : `${player?.firstName.split("")[0]}. ${player?.lastName}`}
                                 </PlayerName>
                              </PlayerTableCell>
                              <PlayerTableCell align="center">
                                 {player?.number ?? player?.jerseyNumber}
                              </PlayerTableCell>
                              <PlayerTableCell align="center">
                                 {player?.position?.slice(0, 1)?.toUpperCase()}
                              </PlayerTableCell>
                              <PlayerTableCell align="center">
                                 {player?.shoots || player?.handedness.slice(0, 1)}
                              </PlayerTableCell>
                              {desktop ? (
                                 <PlayerTableCell align="center">
                                    {player?.hometown}
                                 </PlayerTableCell>
                              ) : null}
                           </TableRow>
                        </Link>
                     ))}
               </PlayerTableBody>
            </Table>
         </TableContainer>
         <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Add New Player</DialogTitle>
            {formErrors ? "Missing some required fields." : null}
            <AddPlayerContent>
               <ControlledInput
                  control={control}
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  errorMessage="This is required."
                  rules={{ required: true, minLength: 3 }}
                  required
               />
               <ControlledInput
                  control={control}
                  label="Nickname"
                  name="nickname"
                  variant="outlined"
               />
               <ControlledInput
                  control={control}
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  rules={{ required: true, minLength: 3 }}
                  required
               />
               <ControlledInput
                  control={control}
                  label="Email Address"
                  name="email"
                  variant="outlined"
                  rules={{ required: true, minLength: 3, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ }}
                  required
               />
               <ControlledInput
                  control={control}
                  label="Phone Number"
                  name="phoneNumber"
                  variant="outlined"
                  rules={{ required: true, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im }}
                  required
               />
               <ControlledInput
                  control={control}
                  label="Home Town"
                  name="hometown"
                  variant="outlined"
               />
               <ControlledSelect
                  control={control}
                  name="position"
                  label="Position"
                  options={posOptions}
                  variant="outlined"
                  rules={{ required: true }}
                  required
               />
               <ControlledInput
                  control={control}
                  name="shoots"
                  label="Shoots"
                  options={shootsOptions}
                  variant="outlined"
                  rules={{ required: true }}
                  required
               />
               <ControlledInput
                  control={control}
                  label="Jersey Number"
                  name="number"
                  variant="outlined"
                  rules={{ required: true, min: 0, max: 99 }}
                  required
               />
            </AddPlayerContent>
            <DialogActions>
               <Button type="submit" onClick={handleSubmit(onSubmit)}>
                  Submit
               </Button>
               <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
         </Dialog>
      </PageContainer>
   );
};

export default Team;
