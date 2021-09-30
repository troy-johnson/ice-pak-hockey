import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const theme = createTheme({
   palette: {
      primary: {
         main: "#26466D",
      },
      secondary: {
         main: "#63B8FF",
      },
      black: "#0D0D0D",
      white: "#F2F2F2",
      grey: {
         dark: "#737373",
         main: "#afafaf",
         light: "#e6e6e6",
      },
      error: {
         main: red.A400,
      },
   },
});
