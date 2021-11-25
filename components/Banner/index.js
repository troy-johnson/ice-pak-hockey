import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSession } from "next-auth/client";
import {
   AppBar,
   Badge,
   Box,
   Button,
   Divider,
   Fab,
   IconButton,
   LinearProgress,
   List,
   ListItem,
   ListItemText,
   Stack,
   SwipeableDrawer,
   Toolbar,
   Typography,
   useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Account } from "..";
import { roleCheck } from "../../utils";

const StyledOpenNav = ({ className, onClick }) => {
   return (
      <IconButton className={className} onClick={onClick}>
         <MenuIcon />
      </IconButton>
   );
};

// const StyledCloseNav = ({ className, onClick }) => {
//    return (
//       <IconButton className={className} onClick={onClick}>
//          <CloseIcon />
//       </IconButton>
//    );
// };

const StyledTextLogo = ({ className, desktop }) => {
   return (
      <Stack direction="column" className={className} spacing={1} sx={{ mb: 2 }}>
         <Link href="/" passHref>
            <div>
               <Image src="/icePakTextLogo.png" width={300} height={60} alt="Ice Pak Hockey" />
            </div>
         </Link>
      </Stack>
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
   width: ${(props) => (props.desktop ? 300 : "100vw")};
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

const StyledFixedFab = ({ className, children }) => {
   return (
      <Fab color="primary" size="small" aria-label="cart" className={className}>
         {children}
      </Fab>
   );
};

const StyledOpenCartNav = ({ className, onClick, cartItems }) => {
   return (
      <Badge className={className} onClick={onClick} badgeContent={cartItems} color="secondary">
         <ShoppingCartIcon color="white" />
      </Badge>
   );
};

const OpenCartNav = styled(StyledOpenCartNav)`
   svg {
      color: ${(props) => props.theme.palette.white};
      height: 24px;
      width: 24px;
   }
`;

const CartBox = styled(Box)`
   background-color: ${(props) => props.theme.palette.white};
   width: ${(props) => (props.desktop ? 300 : "100vw")};
   height: 100%;
`;

const FixedFab = styled(StyledFixedFab)`
   position: fixed;
   bottom: 15px;
   right: 15px;
`;

const Banner = () => {
   const [open, setOpen] = useState(false);
   const [cartOpen, setCartOpen] = useState(false);
   const [cartItems, setCartItems] = useState(0);
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

      if (router.isReady) {
         setCartItems(JSON.parse(window?.localStorage?.getItem("icePakCart"))?.length ?? 0);
      }

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
         {cartItems >= 1 ? (
            <FixedFab>
               <OpenCartNav cartItems={cartItems} onClick={() => setCartOpen(true)} />
               <SwipeableDrawer
                  anchor="right"
                  onOpen={() => {}}
                  open={cartOpen}
                  onClose={() => setCartOpen(false)}
               >
                  <CartBox
                     role="presentation"
                     onClick={() => setCartOpen(false)}
                     onKeyDown={() => setCartOpen(false)}
                     desktop={desktop}
                  >
                     <Typography variant="h4">Cart</Typography>
                     <Stack direction="column">
                        {JSON.parse(window?.localStorage?.getItem("icePakCart"))?.map((el) => {
                           return (
                              <div key={el.sku}>
                                 <Typography variant="body2">Name: {el.name}</Typography>
                                 <Typography variant="body2">Color: {el.color}</Typography>
                                 <Typography variant="body2">Size: {el.size}</Typography>
                                 <Typography variant="body2">Quantity: {el.quantity}</Typography>
                                 <Typography variant="body2">
                                    Price: {`$${parseFloat(el.price).toFixed(2)}`}
                                 </Typography>
                                 <Divider />
                              </div>
                           );
                        })}
                        <Typography>
                           Total:{" $"}
                           {JSON.parse(window?.localStorage?.getItem("icePakCart"))
                              ?.reduce((sum, curr) => {
                                 return Number(sum + curr.price);
                              }, 0)
                              .toFixed(2)}
                        </Typography>
                        <Button>Order</Button>
                     </Stack>
                  </CartBox>
               </SwipeableDrawer>
            </FixedFab>
         ) : null}
      </AppBar>
   );
};

export default Banner;
