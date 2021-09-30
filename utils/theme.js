import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const theme = createTheme({
   primary: {
      main: "#0583F2",
   },
   secondary: {
      main: "#f2a705",
   },
   tertiary: "#A0D3F2",
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
});
