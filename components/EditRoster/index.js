import { useState } from "react";
import { mutate } from "swr";
import {
   Button,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
   IconButton,
   Skeleton,
   Stack,
   Switch,
   Typography,
   useMediaQuery,
} from "@mui/material";
import styled from "@emotion/styled";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { ControlledRadio, ControlledSelect, ControlledSwitch } from "..";
import { IoMdTrash } from "react-icons/io";
import { editGameRoster, useGetPlayers, useGetSeason } from "../../utils";

const EditRoster = ({ close, gameId, gameRoster, open, setSnackbar, seasonId }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("md"));
   const { players, playersLoading, playersError } = useGetPlayers();
   const { season, seasonLoading, seasonError } = useGetSeason(seasonId);

   const [currentRoster, setRoster] = useState(season?.roster || []);

   console.log("season", season);

   const defaultRoster = {};

   gameRoster.forEach((player) => (defaultRoster[player.id] = true));

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         gameId: gameId,
         roster: gameRoster?.length >= 1 ? defaultRoster : [],
      },
   });

   const { fields, append, remove } = useFieldArray({
      name: "roster",
      control,
   });

   const roster = watch("roster");

   // const controlledFields = fields.map((field, index) => {
   //    console.log("CF", {
   //       ...field,
   //       ...roster[index],
   //    });
   //    return {
   //       ...field,
   //       ...roster[index],
   //    };
   // });

   const handleChange = (e) => {
      e.preventDefault();
      console.log("e", e.target.value);
   };

   const handleClose = () => {
      reset({
         ...roster,
      });
      close();
   };

   console.log("roster", roster);

   const onSubmit = (data) => {
      const activeRoster = Object.keys(data.roster).filter((key) => {
         if (data.roster[key] === true) {
            return key
         }
      });

      try {
         editGameRoster({ gameId, roster: activeRoster });
         handleClose();
         mutate(`/api/games/${gameId}`);
         mutate(`/api/games`);
         setSnackbar({
            open: true,
            type: "success",
            message: "Roster successfully updated!",
         });
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   // const rosterOptions = players
   //    ?.filter((el) => {
   //       return roster.some((rosterEl) => {
   //          return rosterEl.id !== el.id;
   //       });
   //    })
   //    .map((player) => {
   //       return {
   //          lastName: player.lastName,
   //          label: `${player.firstName} ${player.lastName}`,
   //          value: player.id,
   //       };
   //    })
   //    .sort((a, b) => {
   //       const nameA = a.lastName.toUpperCase();
   //       const nameB = b.lastName.toUpperCase();
   //       if (nameA < nameB) {
   //          return -1;
   //       }
   //       if (nameA > nameB) {
   //          return 1;
   //       }

   //       return 0;
   //    });

   // console.log("roster options", rosterOptions);

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
                  {playersLoading ? (
                     <Skeleton height={325} />
                  ) : (
                     season?.roster?.map((player, index) => {
                        return (
                           <ControlledSwitch
                              checked={roster[player] === true}
                              onChange={handleChange}
                              name={`roster.${player}`}
                              key={player}
                              label={`#${players?.filter((el) => el.id === player)[0].number} ${
                                 players?.filter((el) => el.id === player)[0].firstName
                              } ${players?.filter((el) => el.id === player)[0].lastName}`}
                              {...{ control, index, player }}
                           />
                        );
                     })
                  )}
                  {/* {controlledFields.map((field, index) => {
                     return (
                        <Stack direction="row" key={`${field.id}-${index}`} sx={{ mt: 2 }}>
                           <ControlledSwitch
                              control={control}
                              name={`roster.${index}.id`}
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
                  })} */}
               </Stack>
            </Stack>
         </DialogContent>
         <DialogActions>
            {/* <Button
               disabled={fields.length >= 18}
               onClick={() => append({ playerId: "", playerName: "" }, { focusIndex: 1 })}
            >
               Add Player
            </Button> */}
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
               Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
         </DialogActions>
      </Dialog>
   );
};

export default EditRoster;
