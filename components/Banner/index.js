import { useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import {
   Box,
   Button,
   List,
   ListItem,
   ListItemText,
   SwipeableDrawer,
   useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const StyledOpenNav = ({ className, onClick }) => {
   return (
      <Button className={className} onClick={onClick}>
         <MenuIcon />
      </Button>
   );
};

const StyledCloseNav = ({ className, onClick }) => {
   return (
      <Button className={className} onClick={onClick}>
         <CloseIcon />
      </Button>
   );
};

const Container = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;

   h1 {
      flex-grow: 2;
      text-align: center;
   }
`;

const NavMenuBox = styled(Box)`
   background-color: ${(props) => props.theme.primary.main};
   height: 100%;
   width: ${(props) => (props.desktop ? 300 : "500px")};
`;

const MenuItem = styled(ListItemText)`
   span {
      font-size: 48px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5rem;

      transition: color 0.2s ease-in-out;

      :hover {
         color: ${(props) => props.theme.secondary.main};
      }
   }
`;

const OpenNav = styled(StyledOpenNav)`
   svg {
      color: black;
      height: 24px;
      width: 24px;
   }
`;

const CloseNav = styled(StyledCloseNav)`
   svg {
      font-size: 48px;
      color: white;

      :hover {
         color: ${(props) => props.theme.secondary.main};
      }
   }
`;

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
                     <Link href="/" passHref>
                        <MenuItem primary="Home" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/news" passHref>
                        <MenuItem primary="News" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/team" passHref>
                        <MenuItem primary="Team" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/schedule" passHref>
                        <MenuItem primary="Schedule" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/stats" passHref>
                        <MenuItem primary="Stats" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/standings" passHref>
                        <MenuItem primary="Standings" />
                     </Link>
                  </ListItem>
                  <ListItem button>
                     <Link href="/shop" passHref>
                        <MenuItem primary="Shop" />
                     </Link>
                  </ListItem>
               </List>
            </NavMenuBox>
         </SwipeableDrawer>
         <Link href={`/`} passHref>
            <h1>Ice Pak Hockey</h1>
         </Link>
      </Container>
   );
};

export default Banner;
