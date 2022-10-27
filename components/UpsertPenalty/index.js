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

const InputWithMargin = styled(props => <ControlledInput {...props} />)`
   margin-bottom: 10px;
`;

const UpsertPenalty = ({
   penaltyAction = "add",
   close,
   gameId,
   penaltyId,
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
         penaltyId: penaltyAction === "add" ? null : penalty?.id,
         penaltyType: penaltyAction === "add" ? "Tripping" : penalty?.penaltyType,
         period: penaltyAction === "add" ? 1 : penalty?.period,
         playerId: penaltyAction === "add" ? null : penalty?.playerId,
         time: penaltyAction === "add" ? "10:00" : penalty?.time,
         team: penaltyAction === "add" ? "Ice Pak" : penalty?.team,
         teamId: penaltyAction === "add" ? "3683b632-c5c3-4e97-a7d4-6002a72839e1" : penalty?.teamId,
         ytLink: penaltyAction === "add" ? "" : penalty?.ytLink,
      },
   });

   const team = watch("team");

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
               minutes: parseFloat(data.minutes),
               penaltyType: data.penaltyType,
               period: Number(data.period),
               playerId: data.team === "Ice Pak" ? data.playerId : null,
               team: data.team,
               teamId:
                  data.team === opponentName
                     ? opponentId
                     : "3683b632-c5c3-4e97-a7d4-6002a72839e1",
               time: data.time,
               ytLink: data.ytLink,
            });
         } else if (penaltyAction === "edit") {
            editPenalty({
               ...data,
               minutes: data.minutes,
               period: Number(data.period),
               playerId: data.team === opponentName ? null : data.playerId,
               teamId: data.team === opponentName ? opponentId : "3683b632-c5c3-4e97-a7d4-6002a72839e1",
            });
         }
         close();
         setSnackbar({ open: true, type: "success", message: "Penalty successfully updated!" });
         mutate(`/api/games/${penalty?.id}`);
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   const playerOptions = gameRoster?.map((player) => {
      return {
         label: `${player?.firstName} ${player?.lastName}`,
         value: player?.id,
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
                  <InputWithMargin
                     control={control}
                     label="YouTube Link"
                     name="ytLink"
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

export default UpsertPenalty;
