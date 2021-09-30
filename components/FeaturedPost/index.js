import styled from "@emotion/styled";
import {
   Box,
   Button,
   Card,
   CardActions,
   CardContent,
   Typography,
} from "@mui/material";

const StyledPostCard = ({ className, children }) => (
   <Box className={className}>
      <Card>{children}</Card>
   </Box>
);

const StyledPostTitle = ({ className, children }) => (
   <Typography className={className} variant="h2">
      {children}
   </Typography>
);

const StyledPostDate = ({ className, children }) => (
   <Typography className={className}>{children}</Typography>
);

const StyledPostTime = ({ className, children }) => (
   <Typography className={className}>{children}</Typography>
);

const PostBox = styled(Box)``;

const PostCard = styled(StyledPostCard)``;

const PostCardContent = styled(CardContent)``;

const PostDate = styled(StyledPostDate)``;

const PostTime = styled(StyledPostTime)``;

const PostTitle = styled(StyledPostTitle)``;

// export const Title = styled.h2`
//    font-size: 24px;
//    margin-bottom: 2px;
//    color: ${(props) => props.theme.black};
// `;

// export const PostDate = styled.h3`
//    margin-top: 0px;
//    font-weight: 300;
//    color: ${(props) => props.theme.mediumGrey};
// `;

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
