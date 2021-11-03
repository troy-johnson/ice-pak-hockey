import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import {
   Avatar,
   Box,
   Divider,
   IconButton,
   ListItemIcon,
   Menu,
   MenuItem,
   Tooltip,
   Typography,
   useMediaQuery,
} from "@mui/material";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";

const Account = () => {
   const [anchorEl, setAnchorEl] = useState(null);
   const [session, loading] = useSession();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const open = Boolean(anchorEl);

   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   // console.log("account info", session)

   return (
      <>
         <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
            <Tooltip title="Profile">
               <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                  <Avatar
                     src={session?.user?.image}
                     sx={{ width: desktop ? 32 : 28, height: desktop ? 32 : 28 }}
                  />
               </IconButton>
            </Tooltip>
         </Box>
         <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
               elevation: 0,
               sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                     width: 32,
                     height: 32,
                     ml: -0.5,
                     mr: 1,
                  },
                  "&:before": {
                     content: '""',
                     display: "block",
                     position: "absolute",
                     top: 0,
                     right: 14,
                     width: 10,
                     height: 10,
                     bgcolor: "background.paper",
                     transform: "translateY(-50%) rotate(45deg)",
                     zIndex: 0,
                  },
               },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
         >
            {session ? (
               <Link href="/profile" passHref>
                  <MenuItem>
                     <Avatar /> Profile
                  </MenuItem>
               </Link>
            ) : null}
            {session ? (
               <MenuItem onClick={() => signOut()}>
                  <ListItemIcon>
                     <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
               </MenuItem>
            ) : (
               <MenuItem onClick={() => signIn("auth0")}>
                  <ListItemIcon>
                     <Login fontSize="small" />
                  </ListItemIcon>
                  Login
               </MenuItem>
            )}
         </Menu>
      </>
   );
};

export default Account;
