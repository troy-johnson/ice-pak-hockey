import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import {
   Divider,
   FormControl,
   InputLabel,
   Link,
   MenuItem,
   NativeSelect,
   Paper,
   Select,
   Stack,
   Typography,
   useMediaQuery,
} from "@mui/material";
import Tree from "react-d3-tree";
import { Loading, PageContainer, StandingsTable } from "../components";
import { useGetSeasons } from "../utils";

const TeamStack = styled(Stack)`
   &:before {
      content: "";
      background-image: url(${(props) => props.logo});
      background-size: cover;
      background-position: center;
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      opacity: 0.35;
   }

   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
   opacity: 1;
`;

const Standings = () => {
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const [seasonId, setSeasonId] = useState("91385e9d-638b-4b32-92b4-382921e7d8fd");

   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const seasonOptions = seasons
      ?.sort((a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds))
      ?.map((season) => {
         return { label: `${season.leagueName} ${season.name} ${season.type}`, value: season.id };
      });

   const handleSeasonChange = (e) => {
      setSeasonId(e.target.value);
   };

   useEffect(() => {
      if (!seasonsLoading && !seasonsError && seasons.length > 0) {
         setSeasonId(seasons.sort((a, b) => dayjs(b.startDate) - dayjs(a.startDate))?.[0].id);
      }
   }, [seasons]);

   if (seasonsLoading) {
      return <Loading />;
   } else if (seasonsError) {
      return <div>An error occurred. Please try again.</div>;
   }

   const seasonType = seasons.filter((season) => season.id === seasonId)?.[0]?.type;

   const standings =
      seasonType === "Playoffs"
         ? seasons
              .filter((season) => season.id === seasonId)?.[0]
              ?.standings?.sort((a, b) => a.result - b.result)
         : seasons
              .filter((season) => season.id === seasonId)?.[0]
              ?.standings?.sort((a, b) => {
                 if (b?.wins * 2 + b?.otl * 1 === a?.wins * 2 + a?.otl * 1) {
                    return a.goalsAgainst - a.goalsFor - (b.goalsAgainst - b.goalsFor);
                 }
                 return b?.wins * 2 + b?.otl * 1 - (a?.wins * 2 + a?.otl * 1);
              });

   const standingsSource = seasons.filter((season) => season.id === seasonId)?.[0]?.standingsLink;
   const playoffSource = seasons.filter((season) => season.id === seasonId)?.[0]
      ?.playoffBracketLink;

   const testStandings = [
      {
         name: "Round 1",
         games: [
            {
               id: 1,
               teamOne: "Ice Pak",
               teamOneGoals: 4,
               teamOneLogo:
                  "https://ilwuklresurtumqszppp.supabase.co/storage/v1/object/public/logos/icepak.png",
               teamTwo: "Murder Hornets",
               teamTwoGoals: 2,
               teamTwoLogo:
                  "https://ilwuklresurtumqszppp.supabase.co/storage/v1/object/public/logos/ratpack.png",
            },
            {
               id: 2,
               teamOne: "Rat Pack",
               teamOneGoals: 2,
               teamTwo: "Dynamic Smoke",
               teamTwoGoals: 1,
            },
         ],
      },
      {
         name: "Round 2",
         games: [
            {
               id: 3,
               teamOne: "Green Bees",
               teamOneGoals: 42,
               teamTwo: "Columbus Heat",
               teamTwoGoals: 2,
            },
            { id: 4, teamOne: "Everton", teamOneGoals: 2, teamTwo: "Liverpool", teamTwoGoals: 1 },
         ],
      },
   ];

   return (
      <PageContainer pageTitle="Standings" small>
         <Stack direction="column">
            <FormControl sx={{ marginLeft: "15px", marginBottom: "15px", maxWidth: "350px" }}>
               <InputLabel id="demo-simple-select-label">Season</InputLabel>
               {desktop ? (
                  <Select
                     labelId="season-select-label"
                     id="season-select"
                     value={seasonId}
                     label="Season"
                     onChange={handleSeasonChange}
                  >
                     {seasonOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                           {option.label}
                        </MenuItem>
                     ))}
                  </Select>
               ) : (
                  <NativeSelect
                     id="season-select"
                     value={seasonId}
                     label="Season"
                     onChange={handleSeasonChange}
                  >
                     {seasonOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </NativeSelect>
               )}
            </FormControl>
            {standingsSource || playoffSource ? (
               <Link
                  href={standingsSource || playoffSource}
                  ml={2}
                  width={150}
                  underline="hover"
                  target="_blank"
                  rel="noopener"
               >
                  <Typography variant="caption">
                     {standingsSource ? "Standings" : "Playoff Bracket"} Source
                  </Typography>
               </Link>
            ) : null}
         </Stack>
         {seasonType === "Playoffs" ? (
            <Stack
               spacing={2}
               divider={<Divider orientation="horizontal" flexItem />}
               sx={{ ml: 2, mr: 2, mb: 2 }}
            >
               Standings not found for selected season. Please select another season.
               {/* {testStandings?.map((round) => (
                  <>
                     <Typography variant="h5" key={round.name}>
                        {round?.name}
                     </Typography>
                     {round?.games?.map((game) => (
                        <Paper
                           elevation={1}
                           key={game.id}
                           sx={{
                              minHeight: 50,
                              width: "100%",
                              maxWidth: 500,
                              marginBottom: "15px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              alignSelf: "center",
                           }}
                        >
                           <TeamStack
                              direction="row"
                              sx={{
                                 justifyContent: "flex-end",
                                 width: "100%",
                              }}
                              logo={game.teamOneLogo}
                           >
                              <Typography
                                 variant={desktop ? "h6" : "subtitle1"}
                                 sx={{
                                    mt: 1,
                                    ml: 1,
                                    mr: 1,
                                    textTransform: "uppercase",
                                    letterSpacing: ".075rem",
                                 }}
                              >
                                 {game.teamOne}
                              </Typography>
                              <Typography
                                 variant="h5"
                                 sx={{
                                    mt: 1,
                                    ml: 1,
                                    mr: 1,
                                    textTransform: "uppercase",
                                    letterSpacing: ".075rem",
                                 }}
                              >
                                 {game.teamOneGoals}
                              </Typography>
                           </TeamStack>
                           <Stack
                              sx={{ justifyContent: "center", alignItems: "center", width: "50%" }}
                           >
                              <Typography
                                 variant="subtitle1"
                                 sx={{
                                    mt: 1,
                                    ml: 1,
                                    mr: 1,
                                    textTransform: "uppercase",
                                    letterSpacing: ".075rem",
                                    textAlign: "center"
                                 }}
                              >
                                 vs.
                              </Typography>
                           </Stack>
                           <TeamStack
                              direction="row"
                              sx={{ justifyContent: "flex-start", width: "100%" }}
                              logo={game.teamTwoLogo}
                           >
                              <Typography
                                 variant="h5"
                                 sx={{
                                    mt: 1,
                                    ml: 1,
                                    mr: 1,
                                    textTransform: "uppercase",
                                    letterSpacing: ".075rem",
                                 }}
                              >
                                 {game.teamTwoGoals}
                              </Typography>
                              <Typography
                                 variant={desktop ? "h6" : "subtitle1"}
                                 sx={{
                                    mt: 1,
                                    ml: 1,
                                    mr: 1,
                                    textTransform: "uppercase",
                                    letterSpacing: ".075rem",
                                 }}
                              >
                                 {game.teamTwo}
                              </Typography>
                           </TeamStack>
                        </Paper>
                     ))}
                  </>
               ))} */}
            </Stack>
         ) : (
            <StandingsTable currentStandings={standings} seasonType={seasonType} />
         )}
      </PageContainer>
   );
};

export default Standings;
