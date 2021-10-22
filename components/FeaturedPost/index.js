import styled from "@emotion/styled";
import { Box, Button, Stack, Typography } from "@mui/material";
import { PageContainer } from "..";
import dayjs from "dayjs";

const FeaturedPost = ({ post }) => {
   return (
      <PageContainer>
         <Stack direction="column" ml={2} mr={2} mt={0} mb={2}>
            <Typography variant="h4">{post.title}</Typography>
            <Typography mb={1} mt={0} variant="body2">
               {dayjs.unix(post.date.seconds).format("MMMM DD, YYYY")}
            </Typography>
            <Typography mb={2} mt={2} variant="body1">
               {post.body.slice(0, 400)}...
            </Typography>
            <Button size="small" sx={{ maxWidth: "125px" }} variant="contained">
               View More
            </Button>
         </Stack>
      </PageContainer>
   );
};

export default FeaturedPost;
