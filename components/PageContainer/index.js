import { Paper, Stack, Typography, useMediaQuery } from "@mui/material";

const PageContainer = ({ children, pageTitle }) => {
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
            sx={{ width: desktop ? "75%" : "100%", borderTop: "5px solid #5BA5D1" }}
         >
            <Typography variant={desktop ? "h3" : "h4"} mt={3} mb={3} sx={{ textAlign: "center" }}>
               {pageTitle}
            </Typography>
            {children}
         </Paper>
      </Stack>
   );
};

export default PageContainer;
