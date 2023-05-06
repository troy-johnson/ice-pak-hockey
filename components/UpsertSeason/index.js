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
import { ControlledInput, ControlledSwitch, ControlledSelect } from "..";
import {
   addSeason,
   editSeason,
   useGetLeagues,
   useGetLocations,
   useGetPlayers,
   useGetTeams,
} from "../../utils";

const InputWithMargin = styled((props) => <ControlledInput {...props} />)`
   margin-bottom: 10px;
`;

const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const UpsertSeason = ({ seasonAction = "add", close, open, season, setSnackbar }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const { leagues } = useGetLeagues();
   const { players } = useGetPlayers();

   const defaultRoster = {};

   if (seasonAction === "add") {
      players.forEach((player) => (defaultRoster[player.id] = false));
   }

   const { control, handleSubmit, reset, watch } = useForm({
      defaultValues: {
         leagueName: seasonAction === "add" ? "" : season?.leagueName,
         name: seasonAction === "add" ? "" : season?.name,
         seasonId: seasonAction === "add" ? null : season?.seasonId,
         startDate: seasonAction === "add" ? "" : season?.startDate,
         endDate: seasonAction === "add" ? "" : season?.endDate,
         standingsLink: seasonAction === "add" ? "" : season?.standingsLink,
         type: seasonAction === "add" ? "" : season?.type,
         roster: seasonAction === "add" ? defaultRoster : season?.roster,
      },
   });

   const roster = watch("roster");

   const handleChange = (e) => {
      e.preventDefault();
      console.log("e", e.target.value);
   };

   const handleClose = () => {
      reset({
         ...season,
      });
      close();
   };

   const onSubmit = (data) => {
      try {

         const seasonRoster = Object.keys(data.roster).filter((key) => {
            if (data.roster[key] === true) {
               return key;
            }
         });

         if (seasonAction === "add") {
            addSeason({
               games: [],
               statBypass: [],
               leagueName: data?.leagueName,
               leagueId: leagues?.filter((el) => el.name === data?.leagueName)[0].id,
               name: data?.name,
               type: data?.type,
               startDate: new Date(data?.startDate),
               endDate: new Date(data?.endDate),
               standingsLink: data?.standingsLink,
               roster: seasonRoster,
            });
         } else if (seasonAction === "edit") {
            editSeason({
               ...data,
               roster: seasonRoster,
            });
         }

         close();

         mutate(`/api/seasons`);

         setSnackbar({
            open: true,
            type: "success",
            message: `Season successfully ${seasonAction === "add" ? "added" : "updated"}!`,
         });
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   const typeOptions = ["Preseason", "Regular Season", "Playoffs"].map((type) => ({
      label: type,
      value: type,
   }));

   const leagueOptions = leagues?.map((league) => ({ label: league.name, value: league.name }));

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>{seasonAction === "add" ? "Add" : "Edit"} Season</DialogTitle>
         <DialogContent>
            <Stack direction={desktop ? "row" : "column"}>
               <Stack spacing={2} sx={{ marginTop: "10px", marginRight: desktop ? "15px" : "" }}>
                  <ControlledSelect
                     control={control}
                     name="leagueName"
                     label="League Name"
                     options={leagueOptions}
                     variant="outlined"
                  />
                  <InputWithMargin control={control} label="Name" name="name" variant="outlined" />
                  <ControlledSelect
                     control={control}
                     name="type"
                     label="Type"
                     options={typeOptions}
                     variant="outlined"
                  />
               </Stack>
               <Stack spacing={2} sx={{ marginTop: "10px" }}>
                  <InputWithMargin
                     control={control}
                     label="Start Date and Time"
                     name="startDate"
                     type="text"
                     variant="outlined"
                  />
                  <InputWithMargin
                     control={control}
                     label="End Date and Time"
                     name="endDate"
                     type="text"
                     variant="outlined"
                  />
                  <InputWithMargin
                     control={control}
                     label="Standings Link"
                     name="standingsLink"
                     variant="outlined"
                  />
               </Stack>
            </Stack>
            <Stack>
               {Object.keys(roster).map((player, index) => {
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
               })}
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

export default UpsertSeason;
