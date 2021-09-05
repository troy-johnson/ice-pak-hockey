import "../styles/globals.css";
import { SWRConfig } from "swr";
import { Layout } from "../components";

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
         <Layout>
            <Component {...pageProps} />
         </Layout>
      </SWRConfig>
   );
}

export default IcePakHockey;
