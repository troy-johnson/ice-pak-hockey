import { Button, DialogActions, DialogContent, DialogTitle, Dialog, Stack } from "@mui/material";
import { useSWRConfig } from "swr";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { Loading, ControlledInput, ControlledRadio, ControlledSelect } from "../";

const InputWithMargin = styled(ControlledInput)`
   margin-bottom: 10px;
`;

const EditPenalty = ({ close, gameRoster, open, penalty }) => {
   console.log("gameRoster", gameRoster);

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         gameId: penalty?.gameId,
         minutes: penalty?.minutes,
         penaltyId: penalty?.penaltyId,
         penaltyType: penalty?.penaltyType,
         period: penalty?.period,
         player: penalty?.playerId,
         time: penalty?.time,
         team: penalty?.playerId ? "Ice Pak" : penalty?.opponentName,
      },
   });

   const handleClose = () => {
      reset({
         ...penalty,
      });
      close();
   };

   const onSubmit = (data) => {
      console.log(data);

      // try {
      //    editPenalty(data);
      //    mutate(`/api/penalties`, [...players, data], true);
      //    handleClose();
      // } catch (error) {
      //    consol.log("error", error);
      // }
   };

   const playerOptions = gameRoster?.map((player) => {
      return {
         label: player?.playerName,
         value: player?.playerId,
      };
   });

   const teamOptions = ["Ice Pak", penalty?.opponentName];

   const team = watch("team", penalty?.playerId ? "Ice Pak" : penalty?.opponentName);

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>Edit Penalty</DialogTitle>
         <DialogContent sx={{ display: "flex", flexDirection: "row" }}>
            <Stack sx={{ marginRight: "5px", marginTop: "10px" }}>
               {/* <ControlledRadio control={control} name="team" label="Team" options={teamOptions} required /> */}
               {team === "Ice Pak" ? (
                  <ControlledSelect
                     control={control}
                     name="player"
                     label="Player"
                     options={playerOptions}
                     variant="outlined"
                  />
               ) : null}
               <InputWithMargin
                  control={control}
                  label="Penalty Type"
                  name="penaltyType"
                  variant="filled"
                  required
               />
            </Stack>
            <Stack sx={{ marginTop: "10px" }}>
               <InputWithMargin control={control} label="Period" name="period" variant="filled" />
               <InputWithMargin control={control} label="Time" name="time" variant="filled" />
               <InputWithMargin control={control} label="Minutes" name="minutes" variant="filled" />
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

export default EditPenalty;
