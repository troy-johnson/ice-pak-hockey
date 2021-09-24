import { SWRConfig } from "swr";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Layout } from "../components";
import { theme } from "../utils";

function IcePakHockey({ Component, pageProps }) {
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
               <CssBaseline />
               <Component {...pageProps} />
            </Layout>
         </ThemeProvider>
      </SWRConfig>
   );
}

export default IcePakHockey;
