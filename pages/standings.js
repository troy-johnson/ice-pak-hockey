import { useState } from "react";
import dayjs from "dayjs";
import {
   FormControl,
   InputLabel,
   Link,
   Select,
   MenuItem,
   NativeSelect,
   Stack,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { Loading, PageContainer, StandingsTable } from "../components";
import { useGetSeasons } from "../utils";

const Standings = () => {
   const { seasons, seasonsLoading, seasonsError } = useGetSeasons();
   const [seasonId, setSeasonId] = useState(
      !seasonsLoading && !seasonsError
         ? seasons.sort(
              (a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds)
           )?.[0].id
         : "LSdvGKI4dFWUBwgeEC5z"
   );

   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const seasonOptions = seasons
      ?.sort((a, b) => dayjs.unix(b.startDate.seconds) - dayjs.unix(a.startDate.seconds))
      ?.map((season) => {
         return { label: `${season.leagueName} ${season.name} ${season.type}`, value: season.id };
      });

   const handleSeasonChange = (e) => {
      setSeasonId(e.target.value);
   };

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
         <StandingsTable currentStandings={standings} seasonType={seasonType} />
      </PageContainer>
   );
};

export default Standings;
