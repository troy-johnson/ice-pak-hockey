import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { Button, Container, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import BlockContent from "@sanity/block-content-to-react";
import markdownStyles from "../../styles/markdown-styles.module.css";
import { PageContainer } from "..";
import { imageBuilder } from "../../utils/sanity";

const HeroPost = ({ title, body, coverImage, date, author, excerpt, slug }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   return (
      <PageContainer small padding>
         {desktop ? (
            <>
               <Stack display="flex">
                  <Typography variant="h4" fontWeight={500} style={{ textAlign: "left" }}>
                     {title}
                  </Typography>
                  <Typography variant="h5" fontWeight={300} color="grey.dark">
                     {excerpt}
                  </Typography>
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
                        height={288}
                        quality={100}
                     />
                  </Container>
                  <Divider>
                     <Typography variant="overline" color="grey.dark">
                        {`POSTED BY ${author.name.toUpperCase()} ON ${dayjs(date)
                           .format("MMMM D, YYYY")
                           .toUpperCase()}`}
                     </Typography>
                  </Divider>
                  <BlockContent
                     blocks={body.slice(1, 3)}
                     projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                     dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                     className={markdownStyles.markdown}
                  />
                  <Link href={`/posts/${slug}`} passHref>
                     <Button variant="contained" sx={{ alignSelf: "center", maxWidth: "200px" }}>
                        Read More
                     </Button>
                  </Link>
               </Stack>
            </>
         ) : (
            <Stack
               direction="column"
               display="flex"
               alignItems="left"
               justifyContent="center"
               spacing={1}
            >
               <Image
                  src={imageBuilder(coverImage).width(320).height(185).url()}
                  alt={title}
                  width={320}
                  height={185}
                  quality={100}
               />
               <Typography variant="overline" color="grey.dark">
                  {`POSTED BY ${author.name.toUpperCase()} ON ${dayjs(date)
                     .format("MMMM DD, YYYY")
                     .toUpperCase()}`}
               </Typography>
               <Typography fontWeight={700} variant="h5">
                  {title}
               </Typography>
               <Typography fontWeight={400} variant="subtitle1" color="grey.dark">
                  {excerpt}
               </Typography>
               <Link href={`/posts/${slug}`} passHref>
                  <Button variant="contained" sx={{ alignSelf: "center", maxWidth: "250px" }}>
                     View More
                  </Button>
               </Link>
            </Stack>
         )}
      </PageContainer>
   );
};

export default HeroPost;
