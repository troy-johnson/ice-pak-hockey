import { useMediaQuery } from "@mui/material";
import styled from "@emotion/styled";
import { Banner, UpcomingGames } from "..";

const LayoutMain = styled.main`
   left: 1.5rem;

   @media (max-width: ${({ theme }) => theme.mobile}) {
      margin: 1rem 0.25rem;
   }
`;

const Layout = ({ children }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   return (
      <>
         <Banner />
         {desktop ? <UpcomingGames /> : null}
         <LayoutMain>{children}</LayoutMain>
      </>
   );
};

export default Layout;
