import { useEffect, useRef, useState } from "react";
import { Banner, Burger, Footer, Menu, Navbar, UpcomingGames } from "..";

const Layout = ({ children }) => {
   const [open, setOpen] = useState(false);
   const node = useRef();

   const useOnClickOutside = (ref, handler) => {
      useEffect(() => {
         const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
               return;
            }
            handler(event);
         };
         document.addEventListener("mousedown", listener);

         return () => {
            document.removeEventListener("mousedown", listener);
         };
      }, [ref, handler]);
   };

   useOnClickOutside(node, () => setOpen(false));

   return (
      <>
         <div ref={node}>
            <Burger open={open} setOpen={setOpen} />
            <Menu open={open} setOpen={setOpen} />
         </div>
         <Banner />
         <UpcomingGames />
         <Navbar />
         <main>{children}</main>
         <Footer />
      </>
   );
};

export default Layout;
