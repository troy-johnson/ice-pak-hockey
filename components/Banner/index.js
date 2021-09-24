import { useState } from "react";
import Link from "next/link";
import { StyledContainer } from "./Banner.styled";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const Banner = () => {
   const [open, setOpen] = useState(false);

   const list = (anchor) => (
      <Box
         sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
         role="presentation"
         onClick={() => setOpen(false)}
         onKeyDown={() => setOpen(false)}
      >
         <List>
            <ListItem button>
               <ListItemIcon>
               </ListItemIcon>
               <ListItemText primary="Home" />
            </ListItem>
         </List>
      </Box>
   );

   return (
      <StyledContainer>
         <Button onClick={() => setOpen(true)}>Menu</Button>
         <SwipeableDrawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
         >
            {list("left")}
         </SwipeableDrawer>
         <h1>
            <Link href={`/`}>Ice Pak Hockey </Link>
         </h1>
      </StyledContainer>
   );
};

export default Banner;
