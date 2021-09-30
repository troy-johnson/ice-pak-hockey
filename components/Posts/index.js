import styled from "@emotion/styled";
import { useGetPosts } from "../../utils";
import { FeaturedPost } from "..";

const StyledPosts = styled.section`
   display: flex;
   flex-direction: row;
   justify-content: center;
   width: 75%;
`;

const Posts = () => {
   const { posts, postsLoading, postsError } = useGetPosts();

   const mostRecentPost = posts?.[0];
   const olderPosts = posts?.slice(1, posts.length - 1);

   return (
      <StyledPosts>
         <FeaturedPost post={mostRecentPost} />
         {olderPosts?.map((post) => {
            return <div key={post.id}>{JSON.stringify(post)}</div>;
         })}
      </StyledPosts>
   );
};

export default Posts;
