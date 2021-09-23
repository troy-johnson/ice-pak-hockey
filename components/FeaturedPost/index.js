import styled from "styled-components";

const Container = styled.article`
   border: 2px solid #ececec;
   border-radius: 8px;
   margin-left: 10px;
   margin-right: 10px;
   padding-left: 5px;
   padding-right: 5px;
   display: flex;
   flex-direction: column;
`;

const Title = styled.h2`
   font-size: 24px;
   margin-bottom: 2px;
   color: ${props => props.theme.black}
`;

const PostDate = styled.h3`
   margin-top: 0px;
   font-weight: 300;
   color: ${props => props.theme.mediumGrey}
`;

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
