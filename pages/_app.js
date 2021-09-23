import { ThemeProvider } from "styled-components";
import { SWRConfig } from "swr";
import { Layout } from "../components";
import "../styles/globals.css";

function IcePakHockey({ Component, pageProps }) {
   const theme = {
      fontFamily: "Inter",
      mobile: '576px',
      primary: "#0583F2",
      secondary: "#0597F2",
      tertiary: "#A0D3F2",
      black: "#0D0D0D",
      white: "#F2F2F2",
      darkGrey: "#737373",
      mediumGrey: "#afafaf",
      lightGrey: "#e6e6e6",
   };

   return (
      <SWRConfig
         value={{
            revalidateOnMount: true,
            dedupingInterval: 6000,
            fetcher: (resource, init) =>
               fetch(resource, init).then((res) => res.json()),
         }}
      >
         <ThemeProvider theme={theme}>
            <Layout>
               <Component {...pageProps} />
            </Layout>
         </ThemeProvider>
      </SWRConfig>
   );
}

export default IcePakHockey;
