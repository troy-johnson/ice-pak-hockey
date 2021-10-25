import { SWRConfig } from "swr";
import { Provider } from "next-auth/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Layout } from "../components";
import { theme } from "../utils";

function IcePakHockey({ Component, pageProps }) {
   return (
      <Provider session={pageProps.session}>
         <SWRConfig
            value={{
               revalidateOnMount: true,
               dedupingInterval: 6000,
               fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
            }}
         >
            <CssBaseline />
            <ThemeProvider theme={theme}>
               <Layout>
                  <Component {...pageProps} />
               </Layout>
            </ThemeProvider>
         </SWRConfig>
      </Provider>
   );
}

export default IcePakHockey;
