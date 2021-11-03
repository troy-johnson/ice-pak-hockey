import { Paper, Stack, Typography, useMediaQuery } from "@mui/material";

const PageContainer = ({ children, padding, pageTitle, small }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   let width = "100%";

   if (desktop && small) {
      width = "60%";
   } else if (desktop && !small) {
      width = "75%";
   }

   return (
      <Stack
         justifyContent="center"
         alignItems="center"
         sx={{
            marginBottom: "15px",
            marginLeft: desktop ? 0 : "5px",
            marginRight: desktop ? 0 : "5px",
            marginTop: "15px",
         }}
      >
         <Paper
            elevation={3}
            sx={{
               width,
               borderTop: "5px solid #5BA5D1",
               padding: padding ? "10px" : 0,
            }}
         >
            <Typography
               variant={desktop ? "h3" : "h4"}
               ml={3}
               mt={3}
               mb={3}
               sx={{ textAlign: "left" }}
            >
               {pageTitle}
            </Typography>
            {children}
         </Paper>
      </Stack>
   );
};

export default PageContainer;
