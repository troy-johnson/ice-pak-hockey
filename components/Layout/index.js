import styled from "@emotion/styled";
import { useSession } from "next-auth/client";
import { Banner, GameTicker } from "..";

const LayoutMain = styled.main`
   left: 1.5rem;

   @media (max-width: ${({ theme }) => theme.mobile}) {
      margin: 1rem 0.25rem;
   }
`;

const Layout = ({ children }) => {
   const [session, loading] = useSession();
   console.log("session", session)
   return (
      <>
         <Banner />
         <GameTicker />
         <LayoutMain>{children}</LayoutMain>
      </>
   );
};

export default Layout;
