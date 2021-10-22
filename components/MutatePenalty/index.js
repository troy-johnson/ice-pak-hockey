import { mutate } from "swr";
import {
   Button,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
   Stack,
   useMediaQuery,
} from "@mui/material";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { ControlledInput, ControlledRadio, ControlledSelect } from "..";
import { addPenalty, editPenalty } from "../../utils";

const InputWithMargin = styled(ControlledInput)`
   margin-bottom: 10px;
`;

const MutatePenalty = ({
   penaltyAction = "add",
   close,
   gameId,
   gameRoster,
   open,
   opponentId,
   opponentName,
   penalty,
   setSnackbar,
}) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         gameId: gameId,
         minutes: penaltyAction === "add" ? 2 : penalty?.minutes,
         penaltyId: penaltyAction === "add" ? null : penalty?.penaltyId,
         penaltyType: penaltyAction === "add" ? "Tripping" : penalty?.penaltyType,
         period: penaltyAction === "add" ? 1 : penalty?.period,
         playerId: penaltyAction === "add" ? null : penalty?.playerId,
         time: penaltyAction === "add" ? "10:00" : penalty?.time,
         team: penaltyAction === "add" ? opponentName : penalty?.team
      },
   });

   const team = watch("team");
   const playerId = watch("playerId");

   const handleClose = () => {
      reset({
         ...penalty,
      });
      close();
   };

   const onSubmit = (data) => {
      try {
         if (penaltyAction === "add") {
            addPenalty({
               gameId: data.gameId,
               minutes: data.minutes,
               opponentId: data.team === opponentName ? opponentId : null,
               penaltyType: data.penaltyType,
               period: Number(data.period),
               playerId: data.team === "Ice Pak" ? data.playerId : null,
               team: data.team,
               time: data.time
            });
         } else if (penaltyAction === "edit") {
            editPenalty({
               ...data,
               period: Number(data.period),
               opponentId: team === opponentName ? opponentId : null,
               playerId: team === opponentName ? null : playerId,
            });
         }
         close();
         setSnackbar({ open: true, type: "success", message: "Penalty successfully updated!" });
         mutate(`/api/games/${penalty?.gameId}`);
      } catch (error) {
         // console.log("error", error);
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   const playerOptions = gameRoster?.map((player) => {
      return {
         label: player?.playerName,
         value: player?.playerId,
      };
   });

   const teamOptions = ["Ice Pak", opponentName];

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>{penaltyAction === "add" ? "Add" : "Edit"} Penalty</DialogTitle>
         <DialogContent>
            <ControlledRadio
               control={control}
               name="team"
               label="Team"
               options={teamOptions}
               row
               required
            />
            <Stack direction={desktop ? "row" : "column"}>
               <Stack spacing={2} sx={{ marginRight: "15px", marginTop: "10px" }}>
                  {team === "Ice Pak" ? (
                     <ControlledSelect
                        control={control}
                        name="playerId"
                        label="Player"
                        options={playerOptions}
                        variant="outlined"
                     />
                  ) : null}
                  <InputWithMargin
                     control={control}
                     label="Penalty Type"
                     name="penaltyType"
                     variant="outlined"
                  />
               </Stack>
               <Stack spacing={2} sx={{ marginTop: "10px" }}>
                  <InputWithMargin
                     control={control}
                     label="Period"
                     name="period"
                     type="number"
                     variant="outlined"
                  />
                  <InputWithMargin control={control} label="Time" name="time" variant="outlined" />
                  <InputWithMargin
                     control={control}
                     label="Minutes"
                     name="minutes"
                     variant="outlined"
                  />
               </Stack>
            </Stack>
         </DialogContent>
         <DialogActions>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
               Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
         </DialogActions>
      </Dialog>
   );
};

export default MutatePenalty;
