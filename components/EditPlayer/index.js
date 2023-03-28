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
import { ControlledInput, ControlledRadio, ControlledSelect } from "../";
import { addGoal, editGoal } from "../../utils";

const InputWithMargin = styled(props => <ControlledInput {...props} />)`
   margin-bottom: 10px;
`;

const EditPlayer = ({ close, player, open }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         auth0AccountId: player?.auth0AccountId,
         born: player?.born,
         email: player?.email,
         favoriteNhlTeam: player?.favoriteNhlTeam,
         favoritePlayer: player?.favoritePlayer,
         firstName: player?.firstName,
         gameDayNotifications: player?.gameDayNotifications ?? player?.notifications?.gameDay,
         handedness: player?.handedness ?? player?.shoots,
         height: player?.height,
         hometown: player?.homeTown ?? player?.hometown,
         id: player?.id,
         image: player?.image,
         jerseyNumber: player?.jerseyNumber ?? player?.number,
         jerseySize: player?.jerseySize,
         lastName: player?.lastName,
         nickname: player?.nickname,
         gameDayNotifications: player?.notifications?.gameDay,
         number: player?.number ?? player?.jerseyNumber,
         phoneNumber: player?.phoneNumber,
         position: player?.position,
         oreferredEmail: player?.preferredEmail ?? player?.email,
         preferredPhone: player?.preferredPhone ?? player?.phoneNumber,
         tShirtSize: player?.tShirtSize,
      },
   });

   const handleClose = () => {
      reset({
         ...player,
      });
      close();
   };

   const onSubmit = (data) => {
      try {
         editPlayer({
            ...data,
         });
         close();
         mutate(`/api/players/${player?.id}`);
         setSnackbar({
            open: true,
            type: "success",
            message: `Player successfully updated!`,
         });
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>Edit Player</DialogTitle>
         <DialogContent>
            <Stack direction={desktop ? "row" : "column"}>
               <Stack
                  spacing={2}
                  sx={{
                     marginRight: "15px",
                     marginTop: "10px",
                  }}
               >
                  {/* Left Column */}
               </Stack>
               <Stack spacing={2} sx={{ marginTop: "10px" }}>
                  {/* Right Column */}
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

export default EditPlayer;
