import { createTheme } from "@mui/material/styles";
import { green, red } from "@mui/material/colors";

export const theme = createTheme({
   palette: {
      primary: {
         main: "#1D315F",
      },
      secondary: {
         main: "#5BA5D1",
      },
      tertiary: {
         main: "#E6ECF6",
      },
      black: "#0D0D0D",
      white: "#F2F2F2",
      grey: {
         dark: "#737373",
         main: "#AFAFAF",
         light: "#e6e6e6",
      },
      success: {
         main: green[600],
      },
      error: {
         main: red[900],
      },
   },
});
