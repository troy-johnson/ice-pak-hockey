import { getPosts } from "../../utils";
import { FeaturedPost } from "..";

const Posts = () => {
   const { posts, postsLoading, postsError } = getPosts();

   console.log("posts", posts)

   const featuredPost = posts?.[0];
   const olderPosts = posts?.slice(1, posts.length - 1);

   console.log('fP', featuredPost);

   return (
      <div>
         <FeaturedPost post={featuredPost} />
         {olderPosts?.map((post) => {
            return <div>{JSON.stringify(post)}</div>;
         })}
      </div>
   );
};

export default Posts;
