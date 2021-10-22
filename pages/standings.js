import { Link, Typography } from "@mui/material";
import { PageContainer } from "../components";

const Standings = () => {
   return (
      <PageContainer pageTitle="Standings">
         <Typography ml={3} mb={2} variant="h6">Coming Soon</Typography>
         <Link href="https://slco.org/hockey/adult/standings-statistics/" ml={3}>
            Click here for SLCO standings.
         </Link>
      </PageContainer>
   );
};

export default Standings;
