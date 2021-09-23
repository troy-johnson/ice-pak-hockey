import { Container, PostDate, Title } from "./FeaturedPost.styled";

const FeaturedPost = ({ post }) => {
   console.log("post", post);

   return (
      <Container>
         <Title>{post?.title}</Title>
         <PostDate>
            {new Date(post?.date.seconds * 1000).toLocaleString("en-us", {
               month: "long",
               day: "numeric",
               year: "numeric",
            })}
         </PostDate>
      </Container>
   );
};

export default FeaturedPost;
