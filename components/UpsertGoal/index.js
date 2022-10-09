import { mutate } from "swr";
import {
   Button,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
   IconButton,
   Stack,
   useMediaQuery,
} from "@mui/material";
import styled from "@emotion/styled";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { IoMdTrash } from "react-icons/io";
import { ControlledInput, ControlledRadio, ControlledSelect } from "..";
import { addGoal, editGoal } from "../../utils";

const InputWithMargin = styled((props) => <ControlledInput {...props} />)`
   margin-bottom: 10px;
`;

const UpsertGoal = ({
   goalAction = "add",
   close,
   gameId,
   gameRoster,
   open,
   opponentId,
   opponentName,
   goal,
   setSnackbar,
}) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         gameId: gameId,
         assists: goalAction === "add" ? [] : goal?.assists,
         goalId: goalAction === "add" ? null : goal?.id,
         period: goalAction === "add" ? 1 : goal?.period,
         playerId: goalAction === "add" ? gameRoster[0]?.playerId : goal?.playerId,
         time: goalAction === "add" ? "10:00" : goal?.time,
         team: goalAction === "add" ? "Ice Pak" : goal?.team,
         teamId: goalAction === "add" ? "3683b632-c5c3-4e97-a7d4-6002a72839e1" : goal?.teamId,
         ytLink: goalAction === "add" ? "" : goal?.ytLink,
      },
   });

   console.log('data', { goal, gameId, opponentId })

   const { fields, append, remove } = useFieldArray({
      name: "assists",
      control,
   });

   const assists = watch("assists");
   const team = watch("team");
   const scoredById = watch("playerId");

   const controlledFields = fields.map((field, index) => {
      return {
         ...field,
         ...assists[index],
      };
   });

   const handleClose = () => {
      reset({
         ...goal,
      });
      close();
   };

   const onSubmit = (data) => {
      console.log("data", data);
      try {
         if (goalAction === "add") {
            addGoal({
               gameId: data.gameId,
               assists: data.assists.map((assist) => assist.playerId),
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
         } else if (goalAction === "edit") {
            editGoal({
               ...data,
               assists:
                  data.team === opponentName ? [] : data.assists.map((assist) => assist.playerId),
               period: Number(data.period),
               playerId: data.team === opponentName ? null : data.playerId,
               teamId: data.team === opponentName ? opponentId : "3683b632-c5c3-4e97-a7d4-6002a72839e1",
            });
         }
         close();
         mutate(`/api/games/${goal?.gameId}`);
         setSnackbar({
            open: true,
            type: "success",
            message: `Goal successfully ${goalAction === "add" ? "added" : "updated"}!`,
         });
      } catch (error) {
         // console.log("error", error);
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   console.log("game Roster", { gameRoster, opponentName });

   const playerOptions = gameRoster?.map((player) => {
      return {
         label: `${player?.firstName} ${player?.lastName}`,
         value: player?.id,
      };
   });

   const teamOptions = ["Ice Pak", opponentName];

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>{goalAction === "add" ? "Add" : "Edit"} Goal</DialogTitle>
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
               <Stack
                  spacing={2}
                  sx={{
                     marginRight: "15px",
                     marginTop: "10px",
                     width: team === "Ice Pak" ? "250px" : 0,
                  }}
               >
                  {team === "Ice Pak" ? (
                     <>
                        <ControlledSelect
                           control={control}
                           name="playerId"
                           label="Scored By"
                           options={playerOptions}
                           variant="outlined"
                        />
                        {controlledFields.map((field, index) => {
                           return (
                              <Stack direction="row" key={field.id}>
                                 <ControlledSelect
                                    control={control}
                                    name={`assists.${index}.playerId`}
                                    label="Assisted By"
                                    variant="outlined"
                                    options={playerOptions?.filter(
                                       (player) => player.playerId !== scoredById
                                    )}
                                    {...{ control, index, field }}
                                 />
                                 <IconButton onClick={() => remove(index)}>
                                    <IoMdTrash />
                                 </IconButton>
                              </Stack>
                           );
                        })}
                     </>
                  ) : null}
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
                     label="YouTube Link"
                     name="ytLink"
                     variant="outlined"
                  />
               </Stack>
            </Stack>
         </DialogContent>
         <DialogActions>
            {team === "Ice Pak" ? (
               <Button
                  disabled={fields.length >= 2}
                  onClick={() => append({ playerId: "", playerName: "" }, { focusIndex: 1 })}
               >
                  Add Assist
               </Button>
            ) : null}
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
               Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
         </DialogActions>
      </Dialog>
   );
};

export default UpsertGoal;
