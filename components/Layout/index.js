import styled from "@emotion/styled";
import { Banner, GameTicker } from "..";

const LayoutMain = styled.main`
   left: 1.5rem;

   @media (max-width: ${({ theme }) => theme.mobile}) {
      margin: 1rem 0.25rem;
   }
`;

const Layout = ({ children }) => {
   return (
      <>
         <Banner />
         <GameTicker />
         <LayoutMain>{children}</LayoutMain>
      </>
   );
};

export default Layout;
