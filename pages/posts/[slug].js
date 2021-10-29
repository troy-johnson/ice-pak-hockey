import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import {
   Alert,
   Chip,
   Container,
   Divider,
   IconButton,
   Snackbar,
   Stack,
   Typography,
   useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockContent from "@sanity/block-content-to-react";
import markdownStyles from "../../styles/markdown-styles.module.css";
import { AddComment, Loading, PageContainer } from "../../components";
import { useGetPost } from "../../utils";
import { imageBuilder } from "../../utils/sanity";

const StyledComment = ({ className, children }) => {
   return <Typography className={className}>{children}</Typography>;
};

const Comment = styled(StyledComment)`
   overflow-wrap: anywhere;
`;

const Post = () => {
   const router = useRouter();
   const [session, loading] = useSession();
   const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });
   const { slug } = router.query;
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const { post, postLoading, postError } = useGetPost(slug);

   if (postLoading) {
      return <Loading />;
   } else if (postError) {
      return <>Error retrieving post. Please try again later.</>;
   }

   // console.log("post", post);

   const {
      _id,
      comments,
      title,
      body,
      categories,
      coverImage,
      excerpt,
      date,
      author,
      slug: postSlug,
   } = post?.post;

   return (
      <PageContainer padding small>
         {desktop ? (
            <>
               <Stack display="flex">
                  <Typography variant="h4" style={{ textAlign: "left" }}>
                     {title}
                  </Typography>
                  <Typography variant="body1">{excerpt.toUpperCase()}</Typography>
                  <Container
                     sx={{
                        marginTop: "15px",
                        marginBottom: "15px",
                        display: "flex",
                        justifyContent: "center",
                     }}
                  >
                     <Image
                        src={imageBuilder(coverImage).url()}
                        alt={title}
                        width={384}
                        height={222}
                        quality={100}
                     />
                  </Container>
                  <Divider>
                     <Typography variant="overline" color="grey.dark">
                        {`POSTED BY ${author.name.toUpperCase()} ON ${dayjs(date)
                           .format("MMMM DD, YYYY")
                           .toUpperCase()}`}
                     </Typography>
                  </Divider>
                  <BlockContent
                     blocks={body}
                     projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                     dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                     className={markdownStyles.markdown}
                  />
                  <Stack direction="row" mb={2}>
                     {categories?.map((category) => {
                        return (
                           <Chip
                              key={category._id}
                              label={category.title}
                              color="primary"
                              variant="outlined"
                              sx={{ marginRight: "5px" }}
                           />
                        );
                     })}
                  </Stack>
                  <Divider>
                     <Typography variant="overline" color="grey.dark">
                        Comments
                     </Typography>
                  </Divider>
                  {comments
                     ?.sort((a, b) => dayjs(a._createdAt) - dayjs(b._createdAt))
                     ?.map((comment) => (
                        <Stack key={comment._id} spacing={1} sx={{ mb: 1 }}>
                           <Stack direction="row" display="flex" justifyContent="space-between">
                              <Typography variant="overline">
                                 {`${comment.name} (${dayjs(comment._createdAt).format(
                                    "h:m A on MMM D, YYYY"
                                 )})`}
                              </Typography>
                              {/* {comment?.email === session?.user?.email ? (
                                 <IconButton aria-label="delete" disabled size="small">
                                    <DeleteIcon />
                                 </IconButton>
                              ) : null} */}
                           </Stack>
                           <Comment variant="body2">{comment.comment}</Comment>
                           <Divider sx={{ mb: 1 }} />
                        </Stack>
                     ))}
                  <AddComment postId={post?.post?._id} setSnackbar={setSnackbar} />
               </Stack>
            </>
         ) : (
            <Stack direction="column" display="flex" alignItems="left" justifyContent="center">
               <Typography variant="h5">{title}</Typography>
               <Typography variant="caption">{excerpt.toUpperCase()}</Typography>
               <Container
                  sx={{
                     marginTop: "15px",
                     marginBottom: "15px",
                     display: "flex",
                     justifyContent: "center",
                  }}
               >
                  <Image
                     src={imageBuilder(coverImage).width(320).height(185).url()}
                     alt={title}
                     width={320}
                     height={185}
                     quality={100}
                  />
               </Container>
               <Divider>
                  <Typography variant="caption" color="grey.dark">
                     {`POSTED BY ${author.name.toUpperCase()} ON ${dayjs(date)
                        .format("MMMM DD, YYYY")
                        .toUpperCase()}`}
                  </Typography>
               </Divider>
               <BlockContent
                  blocks={body}
                  projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                  className={markdownStyles.markdown}
               />
               <Stack direction="row" display="flex" justifyContent="center" mt={1} mb={1}>
                  {categories?.map((category) => {
                     return (
                        <Chip
                           key={category._id}
                           label={category.title}
                           color="primary"
                           variant="outlined"
                           size="small"
                           sx={{ marginRight: "5px" }}
                        />
                     );
                  })}
               </Stack>
               <Divider>
                  <Typography variant="overline" color="grey.dark">
                     Comments
                  </Typography>
               </Divider>
               {comments
                  ?.sort((a, b) => dayjs(a._createdAt) - dayjs(b._createdAt))
                  ?.map((comment) => (
                     <Stack key={comment._id} spacing={1} sx={{ mb: 1 }}>
                        <Stack direction="row" display="flex" justifyContent="space-between">
                           <Typography variant="overline">
                              {`${comment.name} (${dayjs(comment._createdAt).format(
                                 "h:m A on MMM D, YYYY"
                              )})`}
                           </Typography>
                           {/* {comment?.email === session?.user?.email ? (
                              <IconButton aria-label="delete" disabled size="small">
                                 <DeleteIcon />
                              </IconButton>
                           ) : null} */}
                        </Stack>
                        <Comment variant="body2">{comment.comment}</Comment>
                        <Divider />
                     </Stack>
                  ))}
               <AddComment postId={post?.post?._id} setSnackbar={setSnackbar} />
            </Stack>
         )}
         <Snackbar
            open={snackbar.open}
            autoHideDuration={2000}
            onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
         >
            <Alert
               onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
               severity={snackbar.type}
               sx={{ width: "100%" }}
            >
               {snackbar.message}
            </Alert>
         </Snackbar>
      </PageContainer>
   );
};

export default Post;
