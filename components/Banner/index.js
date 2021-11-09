import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSession } from "next-auth/client";
import {
   AppBar,
   Box,
   IconButton,
   LinearProgress,
   List,
   ListItem,
   ListItemText,
   SwipeableDrawer,
   Toolbar,
   useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Account } from "..";
import { roleCheck } from "../../utils";

const StyledOpenNav = ({ className, onClick }) => {
   return (
      <IconButton className={className} onClick={onClick}>
         <MenuIcon />
      </IconButton>
   );
};

const StyledCloseNav = ({ className, onClick }) => {
   return (
      <IconButton className={className} onClick={onClick}>
         <CloseIcon />
      </IconButton>
   );
};

const StyledTextLogo = ({ className, desktop }) => {
   return (
      <div className={className}>
         <Link href="/" passHref>
            <div>
               <Image src="/icePakTextLogo.png" width={300} height={60} alt="Ice Pak Hockey" />
            </div>
         </Link>
      </div>
   );
};

const TextLogo = styled(StyledTextLogo)`
   width: 100%;
   margin: ${(props) => (props.desktop ? "15px 15px 5px 45px" : "15px 0px 5px 15px")};
   display: flex;
   height: 100%;
   width: 100%;
   justify-content: center;
   div div:hover {
      cursor: pointer;
   }
`;

const NavMenuBox = styled(Box)`
   background-color: ${(props) => props.theme.palette.primary.main};
   width: ${(props) => (props.desktop ? 300 : "500px")};
   height: 100%;
`;

const MenuItem = styled(ListItemText)`
   span {
      font-size: 48px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5rem;

      transition: color 0.2s ease-in-out;

      :hover {
         color: ${(props) => props.theme.palette.tertiary.main};
      }
   }
`;

const OpenNav = styled(StyledOpenNav)`
   svg {
      color: ${(props) => props.theme.palette.white};
      height: 24px;
      width: 24px;
   }
`;

const Banner = () => {
   const [open, setOpen] = useState(false);
   const [showProgress, setShowProgress] = useState(false);
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const [session, loading] = useSession();

   const router = useRouter();

   useEffect(() => {
      const handleStart = (url) => {
         setShowProgress(true);
      };
      const handleStop = () => {
         setShowProgress(false);
      };

      router.events.on("routeChangeStart", handleStart);
      router.events.on("routeChangeComplete", handleStop);
      router.events.on("routeChangeError", handleStop);

      return () => {
         router.events.off("routeChangeStart", handleStart);
         router.events.off("routeChangeComplete", handleStop);
         router.events.off("routeChangeError", handleStop);
      };
   }, [router]);

   return (
      <AppBar position="sticky">
         <Toolbar>
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
                     {/* <ListItem button>
                        <Link href="/news" passHref>
                           <MenuItem primary="News" />
                        </Link>
                     </ListItem> */}
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
                     {/* <ListItem button>
                        <Link href="/shop" passHref>
                           <MenuItem primary="Shop" />
                        </Link>
                     </ListItem> */}
                     {!!roleCheck(session, ["Admins", "Manager", "Assistant Manager"]) ? (
                        <ListItem button>
                           <Link href="/manager" passHref>
                              <MenuItem primary="Manager" />
                           </Link>
                        </ListItem>
                     ) : null}
                  </List>
               </NavMenuBox>
            </SwipeableDrawer>
            <TextLogo desktop={desktop} />
            <Account />
         </Toolbar>
         {showProgress ? (
            <Box sx={{ width: "100%" }}>
               <LinearProgress color="secondary" />
            </Box>
         ) : null}
      </AppBar>
   );
};

export default Banner;
