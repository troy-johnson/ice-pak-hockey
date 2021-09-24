import { PostBox, PostCard, PostCardContent, PostTime, PostTitle } from "./FeaturedPost.styled";

const FeaturedPost = ({ post }) => {
   console.log("post", post);

   return (
      <PostBox>
         <PostCard variant="outlined">
            <PostCardContent>
               <PostTitle>{post?.title}</PostTitle>
               <PostTime>
                  {new Date(post?.date.seconds * 1000).toLocaleString("en-us", {
                     month: "long",
                     day: "numeric",
                     year: "numeric",
                  })}
               </PostTime>
            </PostCardContent>
         </PostCard>
      </PostBox>
   );
};

export default FeaturedPost;
