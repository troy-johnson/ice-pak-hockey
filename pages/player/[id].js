import { useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
   Avatar,
   Box,
   Paper,
   Tabs,
   Tab,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { Loading } from "../../components"
import { useGetAssists, useGetGoals, useGetPlayers } from "../../utils";

const StyledTabPanel = (props) => {
   const { children, className, desktop, value, index, ...other } = props;

   return (
      <div
         className={className}
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
         {...other}
      >
         {value === index && <SectionContainer desktop={desktop}>{children}</SectionContainer>}
      </div>
   );
};

const TabPanel = styled(StyledTabPanel)`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 100%;
`;

const PlayerContainer = styled.section`
   display: flex;
   flex-direction: column;
   align-items: center;
   margin: 15px;
`;

const SectionContainer = styled(Paper)`
   display: flex;
   flex-direction: column;
   align-items: center;
   width: ${(props) => (props.desktop ? "75%" : "100%")};
   border-top: 5px solid ${(props) => props.theme.palette.secondary.main};
   padding-top: 15px;
   margin-bottom: 15px;
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

const Player = () => {
   const router = useRouter();
   const { id } = router.query;
   const [value, setValue] = useState(0);
   const { players, playersLoading, playersError } = useGetPlayers();
   const { assists, assistsLoading, assistsError } = useGetAssists();
   const { goals, goalsLoading, goalsError } = useGetGoals();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const loading = playersLoading || assistsLoading || goalsLoading;
   const error = playersError || assistsError || goalsError;

   const handleChange = (event, newValue) => setValue(newValue);

   // console.log("id", id);

   const player = players?.filter((player) => player.id === id)[0];

   console.log("player", player);

   if (loading) {
      return <Loading />;
   } else if (error) {
      return <div>An error occurred. Please try again.</div>;
   }

   return (
      <PlayerContainer>
         <SectionContainer desktop={desktop}>
            <Avatar
               alt={`${player?.firstName} ${player?.nickname ? player?.nickname : ""} ${
                  player?.lastName
               }`}
               src={`data:image/png;base64,${player?.image}`}
               sx={{ width: desktop ? 160 : 100, height: desktop ? 160 : 100 }}
            />
            <Typography variant={desktop ? "h4" : "h5"}>{`${player?.firstName} ${
               player?.nickname ? `"${player?.nickname}"` : ""
            } ${player?.lastName} | #${player?.jerseyNumber}`}</Typography>
            <Typography variant={desktop ? "h5" : "h6"}>{`${
               player?.shoots === "L" ? "Left" : "Right"
            } | ${player?.homeTown}`}</Typography>
         </SectionContainer>
         <TabContainer>
            <TabBox sx={{ borderBottom: 1, borderColor: "divider" }}>
               <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Bio" />
                  <Tab label="Career Stats" />
                  <Tab label="Game Log" />
               </Tabs>
            </TabBox>
            <TabPanel desktop={desktop} value={value} index={0}>
               Bio (coming soon)
            </TabPanel>
            <TabPanel desktop={desktop} value={value} index={1}>
               Career Stats (coming soon)
            </TabPanel>
            <TabPanel desktop={desktop} value={value} index={2}>
               Game Log (coming soon)
            </TabPanel>
         </TabContainer>
      </PlayerContainer>
   );
};

export default Player;
