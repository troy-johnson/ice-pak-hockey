import { Banner, UpcomingGames } from "..";

const Layout = ({ children }) => {
   return (
      <>
         <Banner />
         <UpcomingGames />
         <main>{children}</main>
         {/* <Footer /> */}
      </>
   );
};

export default Layout;
