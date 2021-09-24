import styled from "styled-components";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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
)

const StyledPostTime = ({ className, children }) => (
   <Typography className={className}>{children}</Typography>
)

export const PostBox = styled(Box)``;

export const PostCard = styled(StyledPostCard)``;

export const PostCardContent = styled(CardContent)``;

export const PostDate = styled(StyledPostDate)``;

export const PostTime = styled(StyledPostTime)``;

export const PostTitle = styled(StyledPostTitle)``;

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
