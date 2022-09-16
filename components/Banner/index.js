import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
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
   Drawer,
   Toolbar,
   Typography,
   useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { RiAddFill, RiSubtractFill, RiDeleteBin5Line } from "react-icons/ri";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Account } from "..";
import {
   createCheckoutSession,
   incrementQuantity,
   decrementQuantity,
   removeFromCart,
   roleCheck,
} from "../../utils";

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
   text-align: center;
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

const StyledOpenCartNav = ({ className, onClick, cartLength }) => {
   return (
      <Badge className={className} onClick={onClick} badgeContent={cartLength} color="secondary">
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
   width: ${(props) => (props.desktop ? "50vw" : "100vw")};
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
   const [showProgress, setShowProgress] = useState(false);
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));
   const { data: session, status } = useSession()
   const loading = status === "loading"

   const router = useRouter();

   const cart = useSelector((state) => state.cart);
   const dispatch = useDispatch();

   const getTotalPrice = () => {
      return cart.reduce((accumulator, item) => accumulator + item.quantity * item.price, 0);
   };

   const getTotalItems = () => {
      return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
   };

   const handleCheckout = async () => {
      const checkoutSession = await createCheckoutSession({
         cart,
         user: {
            email: session?.user?.email ?? "",
            firstName: session?.user?.firstName ?? "",
            lastName: session?.user?.lastName ?? "",
            fullName: session?.user ? `${session?.user?.firstName} ${session?.user?.lastName}` : "",
         },
      });
      
      window.location.href = checkoutSession.url;
   };

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

   // console.log("session", session);

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
                     <ListItem button>
                        <Link href="/shop" passHref>
                           <MenuItem primary="Shop" />
                        </Link>
                     </ListItem>
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
         {cart.length >= 1 ? (
            <FixedFab>
               <OpenCartNav cartLength={getTotalItems()} onClick={() => setCartOpen(true)} />
               <SwipeableDrawer
                  anchor="right"
                  onOpen={() => {}}
                  open={cartOpen}
                  onClose={() => setCartOpen(false)}
               >
                  <CartBox role="presentation" desktop={desktop}>
                     <Typography variant="h4" sx={{ ml: 2, mt: 2, mb: 2 }}>
                        Cart
                     </Typography>
                     <Stack direction="column" sx={{ ml: 2, mr: 2 }} spacing={2}>
                        {cart.map((el) => {
                           return (
                              <>
                                 <Stack direction="row" key={el.sku} sx={{ mb: 2 }}>
                                    <Image src={el.image} width={100} height={100} alt={el.name} />
                                    <Stack direction="column" sx={{ ml: 2 }}>
                                       <Typography variant="body1">
                                          {el.name.split("-")[0].trim()}
                                       </Typography>
                                       <Typography variant="body1">
                                          {el.color} / {el.size}
                                       </Typography>
                                       <Typography variant="body1">
                                          {`$${(parseFloat(el.price) * el.quantity).toFixed(2)}`}
                                       </Typography>
                                       <Stack direction="row" alignItems="center">
                                          <Button
                                             onClick={() => dispatch(decrementQuantity(el.id))}
                                          >
                                             <RiSubtractFill />
                                          </Button>
                                          {el.quantity}
                                          <Button
                                             onClick={() => dispatch(incrementQuantity(el.id))}
                                          >
                                             <RiAddFill />
                                          </Button>
                                          <Button onClick={() => dispatch(removeFromCart(el.id))}>
                                             <RiDeleteBin5Line />
                                          </Button>
                                       </Stack>
                                    </Stack>
                                 </Stack>
                                 <Divider />
                              </>
                           );
                        })}
                        <Typography variant="h5" sx={{ mt: 3 }}>
                           Total*: {`$${getTotalPrice().toFixed(2)}`}
                        </Typography>
                        <Typography variant="caption">*Includes tax & shipping</Typography>
                        <Button
                           disabled={cart.length === 0}
                           variant="contained"
                           sx={{ maxWidth: "200px" }}
                           onClick={handleCheckout}
                        >
                           Check Out
                        </Button>
                     </Stack>
                  </CartBox>
               </SwipeableDrawer>
            </FixedFab>
         ) : null}
      </AppBar>
   );
};

export default Banner;
