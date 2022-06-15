import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSession } from "next-auth/client";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import {
   Box,
   Button,
   FormControl,
   InputLabel,
   Select,
   NativeSelect,
   MenuItem,
   Paper,
   Stack,
   Tab,
   Tabs,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { Loading, ControlledInput, ControlledSelect, PageContainer } from "../components";
import { roleCheck, useGetLeagues, useGetSeasons } from "../utils";

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
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const { leagues, leaguesLoading, leaguesError } = useGetLeagues();
   const { players, playersLoading, playersError } = useGetPlayers();

   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const [seasonId, setSeasonId] = useState(
      !seasonsLoading && !seasonsError
         ? seasons.sort(
              (a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds)
           )?.[0].id
         : "6venNqR7kd9VB0qFf9UM"
   );
   const [leagueId, setLeagueId] = useState(
      !leaguesLoading && !leaguesError ? leagues[0].id : "VgasoqbCwK96Q4eQeOMi"
   );
   const [tabValue, setTabValue] = useState(0);
   const [session, loading] = useSession();

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
      // console.log("updateValues", currentSeason(id));

      setValue(
         "startDate",
         dayjs.unix(currentSeason(id)?.startDate.seconds).format("MMM DD, YYYY")
      );
      setValue("endDate", dayjs.unix(currentSeason(id)?.endDate.seconds).format("MMM DD, YYYY"));
      setValue("games", currentSeason(id)?.games);
      setValue("leagueId", currentSeason(id)?.leagueId);
      setValue("leagueName", currentSeason(id)?.leagueName ?? "");
      setValue("name", currentSeason(id)?.name);
      setValue("result", currentSeason(id)?.result);
      setValue("standings", currentSeason(id)?.standings);
      setValue("standingsLink", currentSeason(id)?.standingsLink ?? "");
      setValue("type", currentSeason(id)?.type ?? "");
   };

   const handleSeasonChange = (e) => {
      setSeasonId(e.target.value);
      updateValues(e.target.value);
      // setLeagueId(currentSeason(e.target.value)?.leagueId);
      // setValue("type", currentSeason(e.target.value)?.type)
   };

   const onSubmit = (data) => {
      console.log("data", data);

      // TODO: Figure out correct league ID and update value

      try {
      } catch (error) {}
   };

   useEffect(() => {
      if (seasons) {
         updateValues(
            seasons?.sort(
               (a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds)
            )[0].id
         );
      }
   }, [seasons]);

   useEffect(() => {
      updateValues(seasonId);
   }, [seasonId]);

   // const watchLeagueName = watch("leagueName");

   // // if (watchLeagueName !== currentSeason(seasonId)?.leagueName) {
   // //    setValue("leagueId", leagues?.filter(league => league.name === watchLeagueName)[0]?.id)
   // // }
   // const leagueNameState = getFieldState("leagueName");

   // console.log("curSeason", currentSeason(seasonId));
   // console.log("leagues", leagues);
   // console.log("getValues", getValues());
   // console.log("leagueNameInfo", { watchLeagueName });
   // console.log("form values", getValues())
   // console.log("seasonOptions", seasonOptions);
   // console.log("players", players);

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
                  />
                  <ControlledInput control={control} size="small" name="endDate" label="End Date" />
                  <ControlledSelect
                     control={control}
                     label="League Name"
                     name="leagueName"
                     options={leagueOptions}
                  />
                  <ControlledInput control={control} size="small" name="name" label="Name" />
                  <ControlledSelect
                     control={control}
                     label="Type"
                     name="type"
                     options={typeOptions}
                  />
                  <ControlledInput control={control} size="small" name="result" label="Result" />
                  <ControlledInput
                     control={control}
                     size="small"
                     name="standingsLink"
                     label="Standings Link"
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
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
               Tab 2
            </TabPanel>
         </TabContainer>
      </PageContainer>
   );
};

export default Manager;
