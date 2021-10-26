import Head from "next/head";
import { HeroPost, MoreStories } from "../components";
import { getAllPostsForHome } from "../utils"

const Home = ({ allPosts, preview }) => {
   const heroPost = allPosts[0]
   const morePosts = allPosts.slice(1)

   return (
      <>
         <Head>
            <title>Ice Pak Hockey</title>
            <meta name="description" content="Ice Pak Hockey" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <>
            {heroPost && (
               <HeroPost
                  title={heroPost.title}
                  coverImage={heroPost.coverImage}
                  date={heroPost.date}
                  author={heroPost.author}
                  slug={heroPost.slug}
                  excerpt={heroPost.excerpt}
               />
            )}
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
         </>
      </>
   );
};

export default Home;

export async function getStaticProps({ preview = false }) {
   const allPosts = await getAllPostsForHome(preview);
   return {
      props: { allPosts, preview },
      revalidate: 1,
   };
}
