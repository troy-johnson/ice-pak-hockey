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
import { editPenalty } from "../../utils";

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
         playerId: penaltyAction === "add" ? gameRoster[0].playerId : penalty?.playerId,
         time: penaltyAction === "add" ? "10:00" : penalty?.time,
         team: penalty?.playerId ? "Ice Pak" : opponentName,
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
         editPenalty({
            ...data,
            opponentId: team === opponentName ? opponentId : null,
            playerId: team === opponentName ? null : playerId,
         });
         mutate(`/api/games/${penalty?.gameId}`);
         handleClose();
         setSnackbar({ open: true, type: "success", message: "Penalty successfully updated!" });
      } catch (error) {
         console.log("error", error);
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
