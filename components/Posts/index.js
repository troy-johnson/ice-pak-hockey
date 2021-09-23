import { getPosts } from "../../utils";
import { FeaturedPost } from "..";

const Posts = () => {
   const { posts, postsLoading, postsError } = getPosts();

   const mostRecentPost = posts?.[0];
   const olderPosts = posts?.slice(1, posts.length - 1);

   return (
      <div>
         <FeaturedPost post={mostRecentPost} />
         {olderPosts?.map((post) => {
            return <div>{JSON.stringify(post)}</div>;
         })}
      </div>
   );
};

export default Posts;
