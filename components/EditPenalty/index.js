import { Button, DialogActions, DialogContent, DialogTitle, Dialog } from "@mui/material";
import { useSWRConfig } from "swr";
import { useForm } from "react-hook-form";
import { Loading, ControlledInput, ControlledSelect } from "../";

const EditPenalty = ({ close, gameRoster, open, penalty }) => {
   console.log("gameRoster", gameRoster);

   const { control, handleSubmit, reset } = useForm({
      defaultValues: {
         gameId: penalty?.gameId,
         minutes: penalty?.minutes,
         penaltyId: penalty?.penaltyId,
         penaltyType: penalty?.penaltyType,
         period: penalty?.period,
         playerId: penalty?.playerId,
         playerName: penalty?.playerName,
         time: penalty?.time
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
      //    addPlayer(data);
      //    mutate(`/api/players`, [...players, data], true);
      //    handleClose();
      // } catch (error) {
      //    consol.log("error", error);
      // }
   };

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>Edit Penalty</DialogTitle>
         <DialogContent>
            <ControlledInput
               control={control}
               label="Penalty Type"
               name="penaltyType"
               variant="filled"
               required
            />
            <ControlledInput
               control={control}
               label="Minutes"
               name="minutes"
               variant="filled"
            />
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
