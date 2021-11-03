import Head from "next/head";
import { HeroPost } from "../components";
import { getAllPostsForHome } from "../utils/sanityApi";

const Home = ({ allPosts, preview }) => {
   // console.log("INDEX", { allPosts, preview });

   return (
      <>
         <Head>
            <title>Ice Pak Hockey</title>
            <meta name="description" content="Ice Pak Hockey" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <>
            {allPosts.slice(0,2).map((post) => (
               <HeroPost
                  key={post._id}
                  categories={post.categories}
                  title={post.title}
                  coverImage={post.coverImage}
                  date={post.date}
                  author={post.author}
                  slug={post.slug}
                  body={post.body}
                  postId={post._id}
                  excerpt={post.excerpt}
               />
            ))}
         </>
      </>
   );
};

export default Home;

export async function getStaticProps({ preview = true }) {
   const allPosts = await getAllPostsForHome(preview);
   return {
      props: { allPosts, preview },
      revalidate: 1,
   };
}
