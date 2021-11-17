import { mutate } from "swr";
import {
   Button,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
   IconButton,
   Stack,
   Switch,
   Typography,
   useMediaQuery,
} from "@mui/material";
import styled from "@emotion/styled";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { ControlledSelect } from "..";
import { IoMdTrash } from "react-icons/io";
import { editGameRoster, useGetPlayers } from "../../utils";

const EditRoster = ({ close, gameId, gameRoster, open, setSnackbar }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("md"));
   const { players, playersLoading, playersError } = useGetPlayers();

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         gameId: gameId,
         roster: gameRoster?.length >= 1 ? gameRoster : [],
      },
   });

   const { fields, append, remove } = useFieldArray({
      name: "roster",
      control,
   });

   const roster = watch("roster");

   const controlledFields = fields.map((field, index) => {
      return {
         ...field,
         ...roster[index],
      };
   });

   const handleClose = () => {
      reset({
         ...roster,
      });
      close();
   };

   const onSubmit = (data) => {
      console.log("data", { ...data, roster: data.roster.map((el) => el.playerId) });
      try {
         editGameRoster({ gameId, roster: data.roster.map((el) => el.playerId) });
         handleClose();
         mutate(`/api/games/${gameId}`);
         mutate(`/api/games`);
         setSnackbar({
            open: true,
            type: "success",
            message: "Roster successfully updated!",
         });
      } catch (error) {
         // console.log("Roster update error: ", error);
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   const rosterOptions = players?.map((player) => {
         return {
            lastName: player.lastName,
            label: `${player.firstName} ${player.lastName}`,
            value: player.id,
         };
      })
      .sort((a, b) => {
         const nameA = a.lastName.toUpperCase();
         const nameB = b.lastName.toUpperCase();
         if (nameA < nameB) {
            return -1;
         }
         if (nameA > nameB) {
            return 1;
         }

         return 0;
      });

   console.log("roster", rosterOptions);

   return (
      <Dialog onClose={handleClose} fullWidth={true} maxWidth="lg" open={open}>
         <DialogTitle>Edit Roster</DialogTitle>
         <DialogContent>
            <Stack direction="column">
               <Stack
                  spacing={2}
                  sx={{
                     maxHeight: "325px",
                     display: "flex",
                     flexDirection: "column",
                     flexWrap: desktop ? "wrap" : "nowrap",
                  }}
               >
                  {controlledFields.map((field, index) => {
                     return (
                        <Stack direction="row" key={field.id} sx={{ mt: 2 }}>
                           <ControlledSelect
                              control={control}
                              name={`roster.${index}.playerId`}
                              variant="outlined"
                              label={`Player No. ${index + 1}`}
                              options={rosterOptions}
                              {...{ control, index, field }}
                           />
                           <IconButton onClick={() => remove(index)}>
                              <IoMdTrash />
                           </IconButton>
                        </Stack>
                     );
                  })}
               </Stack>
            </Stack>
         </DialogContent>
         <DialogActions>
            <Button
               disabled={fields.length >= 18}
               onClick={() => append({ playerId: "", playerName: "" }, { focusIndex: 1 })}
            >
               Add Player
            </Button>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
               Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
         </DialogActions>
      </Dialog>
   );
};

export default EditRoster;
