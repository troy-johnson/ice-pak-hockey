import { getPosts } from "../../utils";
import { FeaturedPost } from "..";
import { StyledPosts } from "./Posts.styled";

const Posts = () => {
   const { posts, postsLoading, postsError } = getPosts();

   const mostRecentPost = posts?.[0];
   const olderPosts = posts?.slice(1, posts.length - 1);

   return (
      <StyledPosts>
         <FeaturedPost post={mostRecentPost} />
         {olderPosts?.map((post) => {
            return <div>{JSON.stringify(post)}</div>;
         })}
      </StyledPosts>
   );
};

export default Posts;
