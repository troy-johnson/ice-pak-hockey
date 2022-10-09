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
import dayjs from "dayjs";
import { mutate } from "swr";
import { useForm, Controller, useWatch } from "react-hook-form";
import { IoMdTrash } from "react-icons/io";
import { ControlledInput, ControlledRadio, ControlledSelect } from "..";
import {
   addGame,
   editGame,
   editSeason,
   useGetLocations,
   useGetTeams,
   useGetSeasons,
} from "../../utils";

const InputWithMargin = styled((props) => <ControlledInput {...props} />)`
   margin-bottom: 10px;
`;

const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const UpsertGame = ({ gameAction = "add", close, open, game, setSnackbar }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const { seasons } = useGetSeasons();
   const { locations } = useGetLocations();
   const { teams } = useGetTeams();

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         date: gameAction === "add" ? "" : game?.date,
         embedLink: gameAction === "add" ? "" : game?.embedLink,
         gameId: gameAction === "add" ? null : game?.gameId,
         locationId: gameAction === "add" ? "" : game?.locationId,
         opponentId: gameAction === "add" ? "" : game?.opponentId,
         roster: gameAction === "add" ? [] : game?.roster,
         seasonId: gameAction === "add" ? "" : game?.seasonId,
         video: gameAction === "add" ? "" : game?.video,
      },
   });

   const roster = watch("locationId");

   const handleClose = () => {
      reset({
         ...game,
      });
      close();
   };

   const onSubmit = (data) => {
      // console.log("data", { ...data, date: dayjs(data?.date).format() });
      try {
         if (gameAction === "add") {
            addGame({
               date: new Date(data?.date),
               embedLink: data?.embedLink,
               locationId: data?.locationId,
               opponentId: data?.opponentId,
               roster: data?.roster,
               seasonId: data?.seasonId,
               video: data?.video,
            });
         } else if (gameAction === "edit") {
            editGame({
               ...data,
            });
         }

         close();

         mutate(`/api/games`);

         setSnackbar({
            open: true,
            type: "success",
            message: `Game successfully ${gameAction === "add" ? "added" : "updated"}!`,
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

   const alphabeticalSort = (a, b) => {
      let key = "teamName";

      if (a?.name) {
         key = "name";
      }

      const nameA = a[key]?.toUpperCase();
      const nameB = b[key]?.toUpperCase();
      if (nameA < nameB) {
         return -1;
      }
      if (nameA > nameB) {
         return 1;
      }

      return 0;
   };

   console.log("seasons", {
      seasons,
      sorted: seasons?.sort((a, b) => dayjs(b.endDate).unix() - dayjs(a.endDate).unix()),
   });

   const seasonOptions = seasons
      ?.sort((a, b) => dayjs(a.endDate).isAfter(dayjs(b.endDate)))
      ?.map((season) => {
         return {
            label: `${season?.leagueName} ${season?.name} ${season?.type}`,
            value: season?.id,
         };
      });

   const locationOptions = locations?.sort(alphabeticalSort)?.map((location) => {
      return {
         label: location?.name,
         value: location?.id,
      };
   });

   const teamOptions = teams
      ?.sort(alphabeticalSort)
      ?.filter((team) => team.teamName !== "Ice Pak")
      ?.map((team) => {
         return {
            label: team?.teamName,
            value: team?.id,
         };
      });

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>{gameAction === "add" ? "Add" : "Edit"} Game</DialogTitle>
         <DialogContent>
            <Stack direction={desktop ? "row" : "column"}>
               <Stack spacing={2} sx={{ marginTop: "10px", marginRight: desktop ? "15px" : "" }}>
                  <ControlledSelect
                     control={control}
                     name="seasonId"
                     label="Season"
                     options={seasonOptions}
                     variant="outlined"
                  />
                  <ControlledSelect
                     control={control}
                     name="locationId"
                     label="Location"
                     options={locationOptions}
                     variant="outlined"
                  />
                  <ControlledSelect
                     control={control}
                     name="opponentId"
                     label="Team"
                     options={teamOptions}
                     variant="outlined"
                  />
                  <InputWithMargin
                     control={control}
                     label="Date and Time"
                     name="date"
                     type="text"
                     variant="outlined"
                  />
               </Stack>
               <Stack spacing={2} sx={{ marginTop: "10px" }}>
                  <InputWithMargin
                     control={control}
                     label="Embed Link"
                     name="embedLink"
                     variant="outlined"
                  />
                  <InputWithMargin
                     control={control}
                     label="Video Link"
                     name="video"
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

export default UpsertGame;
