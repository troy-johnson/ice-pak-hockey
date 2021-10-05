import { Container, CircularProgress } from "@mui/material";

const Loading = () => {
   return (
      <Container sx={{ display: "flex", justifyContent: "center", marginTop: "10rem" }}>
         <CircularProgress />
      </Container>
   );
};

export default Loading;
