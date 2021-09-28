import { useState } from "react";
import Link from "next/link";
import {
   CloseNav,
   Container,
   MenuItem,
   NavMenuBox,
   OpenNav,
} from "./Banner.styled";
import { List, ListItem, SwipeableDrawer, useMediaQuery } from "@mui/material";

const Banner = () => {
   const [open, setOpen] = useState(false);
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   return (
      <Container>
         <OpenNav onClick={() => setOpen(true)} />
         <SwipeableDrawer
            anchor="left"
            onOpen={() => {}}
            open={open}
            onClose={() => setOpen(false)}
         >
            <NavMenuBox
               role="presentation"
               onClick={() => setOpen(false)}
               onKeyDown={() => setOpen(false)}
               desktop={desktop}
            >
               {/* <CloseNav onClick={() => setOpen(false)} /> */}
               <List>
                  <ListItem button>
                     <Link href="/">
                        <MenuItem primary="Home" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/news">
                        <MenuItem primary="News" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/team">
                        <MenuItem primary="Team" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/schedule">
                        <MenuItem primary="Schedule" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/stats">
                        <MenuItem primary="Stats" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/standings">
                        <MenuItem primary="Standings" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/shop">
                        <MenuItem primary="Shop" />
                     </Link>
                  </ListItem>
               </List>
            </NavMenuBox>
         </SwipeableDrawer>
         <Link href={`/`}>
            <h1>Ice Pak Hockey</h1>
         </Link>
      </Container>
   );
};

export default Banner;
