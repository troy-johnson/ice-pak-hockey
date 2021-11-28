import { SWRConfig } from "swr";
import { Provider } from "next-auth/client";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Layout } from "../components";
import { store, theme } from "../utils";

function IcePakHockey({ Component, pageProps }) {
   return (
      <ReduxProvider store={store}>
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
      </ReduxProvider>
   );
}

export default IcePakHockey;
