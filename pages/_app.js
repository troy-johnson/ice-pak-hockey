import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { SimpleDialog } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Layout } from "../components";
import { store, theme } from "../utils";

function IcePakHockey({ Component, pageProps }) {
   return (
      <ReduxProvider store={store}>
         <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
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
         </SessionProvider>
      </ReduxProvider>
   );
}

export default IcePakHockey;
