import { mutate } from "swr";
import {
   Button,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
   Skeleton,
   Stack,
   useMediaQuery,
} from "@mui/material";
import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { ControlledSwitch } from "..";
import { editGameRoster, useGetPlayers, useGetSeason } from "../../utils";

const EditRoster = ({ close, gameId, gameRoster, open, setSnackbar, seasonId }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("md"));
   const { players, playersLoading, playersError } = useGetPlayers();
   const { season, seasonLoading, seasonError } = useGetSeason(seasonId);

   const defaultRoster = {};

   gameRoster.forEach((player) => (defaultRoster[player.id] = true));

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         gameId: gameId,
         roster: gameRoster?.length >= 1 ? defaultRoster : [],
      },
   });

   const roster = watch("roster");

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

   const onSubmit = (data) => {
      const activeRoster = Object.keys(data.roster).filter((key) => {
         if (data.roster[key] === true) {
            return key;
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

   const rosterOptions = season?.roster
      ?.map((player) => {
         return {
            id: player,
            firstName: `${players?.filter((el) => el.id === player)[0].firstName}`,
            lastName: `${players?.filter((el) => el.id === player)[0].lastName}`,
            number: players?.filter((el) => el.id === player)[0].number,
         };
      })
      .sort((a, b) => (a.number < b.number ? -1 : 1));

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
                     rosterOptions?.map((player, index) => {
                        return (
                           <ControlledSwitch
                              checked={roster[player.id] === true}
                              onChange={handleChange}
                              name={`roster.${player.id}`}
                              key={player.id}
                              label={`#${player.number} ${player.firstName} ${player.lastName}`}
                              {...{ control, index, player }}
                           />
                        );
                     })
                  )}
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
