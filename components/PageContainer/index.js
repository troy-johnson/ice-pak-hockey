import { Paper, Stack, Typography, useMediaQuery } from "@mui/material";

const PageContainer = ({ children, padding, pageTitle }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

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
               width: desktop ? "75%" : "100%",
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
