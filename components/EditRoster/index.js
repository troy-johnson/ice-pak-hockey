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
import { editRoster, useGetPlayers } from "../../utils";

const EditRoster = ({ close, gameId, gameRoster, open, setSnackbar }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const { players, playersLoading, playersError } = useGetPlayers();

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         gameId: gameId,
         roster: gameRoster.length >= 1 ? gameRoster : [],
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
      try {
         editRoster({
            gameId: data.gameId,
            roster: data.roster,
         });
         handleClose();
         mutate(`/api/games/${goal?.gameId}`);
         setSnackbar({
            open: true,
            type: "success",
            message: `Goal successfully ${goalAction === "add" ? "added" : "updated"}!`,
         });
      } catch (error) {
         console.log("error", error);
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   const rosterOptions = players.map((player) => {
      return {
         label: `${player.firstName} ${player.lastName}`,
         value: player.id,
      };
   });

   console.log("roster", roster)

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>Edit Roster</DialogTitle>
         <DialogContent>
            <Stack direction="column">
               <Stack
                  spacing={2}
                  sx={{
                     marginRight: "15px",
                     marginTop: "10px",
                     maxHeight: "300px",
                  }}
               >
                  {controlledFields.map((field, index) => {
                     return (
                        <Stack direction="row" key={field.id}>
                           <ControlledSelect
                              control={control}
                              name={`roster.${index}.playerId`}
                              variant="outlined"
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
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
               Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
         </DialogActions>
      </Dialog>
   );
};

export default EditRoster;
