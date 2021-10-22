import Head from "next/head";
import { PageContainer, Posts } from "../components";

const Home = () => {
   return (
      <>
         <Head>
            <title>Ice Pak Hockey</title>
            <meta name="description" content="Ice Pak Hockey" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <>
            <Posts />
         </>
      </>
   );
};

export default Home;
