import "../styles/globals.css";
import { SWRConfig } from "swr";
import { Layout } from "../components";

function MyApp({ Component, pageProps }) {
   return (
      <SWRConfig
         value={{
            refreshInterval: 3000,
            fetcher: (resource, init) =>
               fetch(resource, init).then((res) => res.json()),
         }}
      >
         <Layout>
            <Component {...pageProps} />
         </Layout>
      </SWRConfig>
   );
}

export default MyApp;
