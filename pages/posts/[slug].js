import Image from "next/image";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { Chip, Container, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import BlockContent from "@sanity/block-content-to-react";
import markdownStyles from "../../styles/markdown-styles.module.css";
import { Loading, PageContainer } from "../../components";
import { useGetPost } from "../../utils";
import { imageBuilder } from "../../utils/sanity";

const Post = () => {
   const router = useRouter();
   const { slug } = router.query;
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const { post, postLoading, postError } = useGetPost(slug);

   if (postLoading) {
      return <Loading />;
   } else if (postError) {
      return <>Error retrieving post. Please try again later.</>;
   }

   console.log("post", post);

   const {
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
      <PageContainer small padding>
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
                  {categories.map((category) => {
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
            </Stack>
         )}
      </PageContainer>
   );
};

export default Post;
