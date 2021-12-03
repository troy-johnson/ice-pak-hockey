import styled from "@emotion/styled";
import dayjs from "dayjs";
import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { useGetAllPosts } from "../../utils";
import { FeaturedPost, Loading, PageContainer } from "..";

const Posts = () => {
   const { posts, postsLoading, postsError } = useGetAllPosts();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const mostRecentPost = posts?.[0];
   const olderPosts = posts?.slice(1, posts.length - 1);

   if (postsLoading) {
      return <Loading />;
   } else if (postsError) {
      return (
         <PageContainer>
            <Typography variant="h6">
               Error retrieving posts data. Please try again later.
            </Typography>
         </PageContainer>
      );
   }

   if (desktop) {
      return (
         <Stack direction="column">
            <FeaturedPost post={mostRecentPost} />
            {olderPosts.map((post) => (
               <div key={post.id}>{post.title}</div>
            ))}
         </Stack>
      );
   }

   return (
      <Stack direction="column">
         {posts?.map((post) => (
            <PageContainer key={post.id}>
               <Stack direction="column" ml={2} mr={2} mt={0} mb={2}>
                  <Typography variant="h5">{post.title}</Typography>
                  <Typography mb={1} mt={0} variant="body2">
                     {dayjs.unix(post.date.seconds).format("MMMM DD, YYYY")}
                  </Typography>
                  <Typography mb={2} mt={2} variant="body2">
                     {post.body.slice(0, 250)}...
                  </Typography>
                  <Button size="small" sx={{ maxWidth: "125px" }} variant="contained">
                     View More
                  </Button>
               </Stack>
            </PageContainer>
         ))}
      </Stack>
   );
};

export default Posts;
