import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import {
   Alert,
   Box,
   Button,
   FormControl,
   InputLabel,
   Select,
   NativeSelect,
   MenuItem,
   Paper,
   Snackbar,
   Stack,
   Tab,
   Tabs,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { FaCalendarDay, FaTrash } from "react-icons/fa";
import {
   Loading,
   ControlledInput,
   ControlledSelect,
   PageContainer,
   UpsertSeason,
} from "../components";
import { roleCheck, deleteSeason, useGetLeagues, useGetPlayers, useGetSeasons } from "../utils";

const StyledTabPanel = (props) => {
   const { children, className, desktop, value, index, ...other } = props;

   return (
      <div
         className={className}
         role="tabpanel"
         hidden={value !== index}
         id={`game-tabpanel-${index}`}
         aria-labelledby={`game-tab-${index}`}
         {...other}
      >
         {value === index && <SectionContainer desktop={desktop}>{children}</SectionContainer>}
      </div>
   );
};

const SectionContainer = styled(Paper)`
   display: flex;
   flex-direction: column;
   padding: 5px;
   width: ${(props) => (props.desktop ? "75%" : "100%")};
   border-top: 5px solid ${(props) => props.theme.palette.secondary.main};
   padding-top: 15px;
   border: none;
   margin-bottom: 15px;
   box-shadow: none;
`;

const TabPanel = styled(StyledTabPanel)`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
   border: none;
`;

const TabContainer = styled(Box)`
   width: ${(props) => (props.desktop ? "75%" : "100%")};
   display: flex;
   flex-direction: column;
   align-items: center;
`;

const TabBox = styled(Box)`
   margin-bottom: 10px;
`;

const Manager = () => {
   const [upsertSeasonDialog, setUpsertSeasonDialog] = useState(false);
   const [seasonAction, setSeasonAction] = useState("add");
   const [season, setSeason] = useState(null);
   const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });

   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const { leagues, leaguesLoading, leaguesError } = useGetLeagues();
   const { players, playersLoading, playersError } = useGetPlayers();

   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const [seasonId, setSeasonId] = useState(
      !seasonsLoading && !seasonsError
         ? seasons.sort(
              (a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds)
           )?.[0].id
         : ""
   );
   const [leagueId, setLeagueId] = useState(!leaguesLoading && !leaguesError ? leagues[0].id : "");
   const [tabValue, setTabValue] = useState(0);
   const { data: session, status } = useSession();
   const loading = status === "loading";

   const currentSeason = (id) => seasons?.filter((season) => season.id === id)?.[0];

   const {
      control,
      getValues,
      handleSubmit,
      reset,
      register,
      watch,
      setValue,
      formState: { errors },
   } = useForm();

   const handleChange = (event, newValue) => setTabValue(newValue);

   const seasonOptions = seasons
      ?.sort((a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds))
      .map((season) => {
         return { label: `${season.leagueName} ${season.name} ${season.type}`, value: season.id };
      });

   const leagueOptions = leagues?.map((league) => {
      return { label: `${league.name}`, value: league.name };
   });

   const typeOptions = [
      { label: "Preseason", value: "Preseason" },
      { label: "Regular Season", value: "Regular Season" },
      { label: "Playoffs", value: "Playoffs" },
   ];
   const updateValues = (id) => {
      setValue("startDate", dayjs(currentSeason(id)?.startDate).format("YYYY-MM-DDTHH:mm"));
      setValue("endDate", dayjs(currentSeason(id)?.endDate).format("YYYY-MM-DDTHH:mm"));
      setValue("games", currentSeason(id)?.games);
      setValue("leagueId", currentSeason(id)?.leagueId);
      setValue("leagueName", currentSeason(id)?.leagueName ?? "");
      setValue("name", currentSeason(id)?.name);
      setValue("result", currentSeason(id)?.result);
      setValue("standings", currentSeason(id)?.standings);
      setValue("standingsLink", currentSeason(id)?.standingsLink ?? "");
      setValue("type", currentSeason(id)?.type ?? "");
      setSeasonId(id);
   };

   const handleSeasonChange = (e) => {
      setSeasonId(e.target.value);
      updateValues(e.target.value);
      // setLeagueId(currentSeason(e.target.value)?.leagueId);
      // setValue("type", currentSeason(e.target.value)?.type)
   };

   const onSubmit = (data) => {
      // TODO: Figure out correct league ID and update value

      console.log("data", data);

      try {
      } catch (error) {}
   };

   useEffect(() => {
      if (seasons) {
         updateValues(seasons?.sort((a, b) => dayjs(b.startDate) - dayjs(a.startDate))[0].id);
      }
   }, [seasons]);

   const openUpsertSeason = (action, season) => {
      setSeasonAction(action);
      setSeason(season);
      setUpsertSeasonDialog(true);
   };

   const handleDelete = () => {
      try {
         const deletedSeason = seasonId;
         deleteSeason(seasonId);
         mutate(`/api/seasons`);
         setSnackbar({
            open: true,
            type: "success",
            message: "Season successfully deleted!",
         });
         setSeasonId(seasons?.filter((season) => season.id !== deletedSeason)?.[0]?.id);
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "There was an error deleting the season.",
         });
      }
   };

   // const watchLeagueName = watch("leagueName");

   // // if (watchLeagueName !== currentSeason(seasonId)?.leagueName) {
   // //    setValue("leagueId", leagues?.filter(league => league.name === watchLeagueName)[0]?.id)
   // // }
   // const leagueNameState = getFieldState("leagueName");

   console.log("seasons", seasons);

   return (
      <PageContainer small pageTitle="Manager">
         <TabContainer>
            <TabBox sx={{ borderBottom: 1, borderColor: "divider" }}>
               <Tabs value={tabValue} onChange={handleChange} aria-label="manager-tabs">
                  <Tab label="Seasons" />
                  <Tab label="Tab 2" />
               </Tabs>
            </TabBox>
            <TabPanel value={tabValue} index={0}>
               <Stack display="flex" alignItems="center" justifyContent="center" spacing={2}>
                  <Stack direction="row" spacing={2}>
                     <Button
                        variant="outlined"
                        onClick={() => openUpsertSeason("add")}
                        endIcon={<FaCalendarDay />}
                        sx={{ marginRight: "5px" }}
                     >
                        Add
                     </Button>
                     <Button
                        variant="outlined"
                        onClick={handleDelete}
                        endIcon={<FaTrash />}
                        sx={{ marginRight: "5px" }}
                     >
                        Delete
                     </Button>
                  </Stack>
                  <FormControl>
                     <InputLabel id="season-label">Season</InputLabel>
                     <Select
                        labelId="season-label"
                        id="season-select"
                        sx={{ minWidth: "250px" }}
                        label="Select season"
                        variant="outlined"
                        onChange={handleSeasonChange}
                        value={seasonId}
                     >
                        {seasonOptions?.map((option) => (
                           <MenuItem key={option.value} value={option.value}>
                              {option.label}
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
                  <ControlledInput
                     control={control}
                     size="small"
                     name="startDate"
                     label="Start Date"
                     type="datetime-local"
                  />
                  <ControlledInput
                     control={control}
                     size="small"
                     name="endDate"
                     type="datetime-local"
                     label="End Date"
                     rules={{ required: true }}
                  />
                  <ControlledSelect
                     control={control}
                     label="League Name"
                     name="leagueName"
                     options={leagueOptions}
                     rules={{ minLength: 3, required: true }}
                     sx={{ maxWidth: "350px" }}
                  />
                  <ControlledInput
                     control={control}
                     size="small"
                     name="name"
                     label="Name"
                     rules={{ required: true }}
                  />
                  <ControlledSelect
                     control={control}
                     label="Type"
                     name="type"
                     options={typeOptions}
                     rules={{ minLength: 3, required: true }}
                  />
                  <ControlledInput
                     control={control}
                     size="small"
                     name="standingsLink"
                     label="Standings Link"
                     rules={{ minLength: 3, required: true }}
                  />
                  <Button
                     type="submit"
                     variant="contained"
                     sx={{ maxWidth: "350px" }}
                     onClick={handleSubmit(onSubmit)}
                  >
                     Save
                  </Button>
               </Stack>
               {upsertSeasonDialog ? (
                  <UpsertSeason
                     seasonAction={seasonAction}
                     close={() => {
                        setSeason(null);
                        setUpsertSeasonDialog(false);
                     }}
                     open={upsertSeasonDialog}
                     season={season}
                     setSnackbar={setSnackbar}
                  />
               ) : null}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
               Tab 2
            </TabPanel>
         </TabContainer>
         <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
         >
            <Alert
               onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
               variant="filled"
               severity={snackbar.type}
               sx={{ width: "100%" }}
            >
               {snackbar.message}
            </Alert>
         </Snackbar>
      </PageContainer>
   );
};

export default Manager;
