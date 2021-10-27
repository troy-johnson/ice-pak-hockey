import { useState } from "react";
import { Avatar, Button, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import BlockContent from "@sanity/block-content-to-react";
import { PageContainer } from "..";
import { imageBuilder } from "../../utils/sanity";
import markdownStyles from "../../styles/markdown-styles.module.css";

const HeroPost = ({ title, body, coverImage, date, excerpt, author, slug }) => {
   const [expanded, setExpanded] = useState(false);
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const slice = body.slice(1, 3);

   console.log("HERO POST", { title, coverImage, date, excerpt, author, slug });
   return (
      <PageContainer padding>
         <Container sx={{ marginBottom: "20px"}}>
            {desktop ? (
               <Stack direction="row" display="flex" alignItems="center" justifyContent="center">
                  <Stack sx={{ marginRight: "15px" }}>
                     <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
                        {title}
                     </Typography>
                     {/* <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
               <Avatar alt={author?.name} src={author?.picture} />
               <Typography variant="subtitle1" sx={{ marginLeft: "5px" }}>
                  {author?.name}
               </Typography>
            </Stack> */}
                     <Typography>{dayjs(date).format("MMMM DD, YYYY")}</Typography>
                     <Typography variant="body2" sx={{ maxWidth: "350px" }}>
                        <BlockContent
                           blocks={expanded ? body : slice}
                           projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                           dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                           className={markdownStyles.markdown}
                        />
                     </Typography>
                     {/* <Link href={`/posts/${slug}`} passHref> */}
                     <Button
                        variant="contained"
                        sx={{ alignSelf: "center", maxWidth: "250px" }}
                        onClick={() => setExpanded(!expanded)}
                     >
                        View {expanded ? "Less" : "More"}
                     </Button>
                     {/* </Link> */}
                  </Stack>
                  <Stack>
                     <Image
                        src={imageBuilder(coverImage).width(640).height(370).url()}
                        alt={title}
                        width={640}
                        height={370}
                     />
                  </Stack>
               </Stack>
            ) : (
               <Stack direction="column" display="flex" alignItems="left" justifyContent="center">
                  <Image
                     src={imageBuilder(coverImage).width(320).height(185).url()}
                     alt={title}
                     width={320}
                     height={185}
                  />
                  <Typography variant="h5" sx={{ marginTop: "15px", textTransform: "uppercase" }}>
                     {title}
                  </Typography>
                  <Typography>{dayjs(date).format("MMMM DD, YYYY")}</Typography>
                  <Typography variant="body2" sx={{ maxWidth: "350px" }}>
                     <BlockContent
                        blocks={expanded ? body : slice}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                        className={markdownStyles.markdown}
                     />
                  </Typography>
                  {/* <Link href={`/posts/${slug}`} passHref> */}
                  <Button
                     variant="contained"
                     sx={{ alignSelf: "center", maxWidth: "250px" }}
                     onClick={() => setExpanded(!expanded)}
                  >
                     View {expanded ? "Less" : "More"}
                  </Button>
                  {/* </Link> */}
               </Stack>
            )}
         </Container>
         {/* <Link href={`/posts/${slug}`} passHref>
               <Image
                  src={imageBuilder(coverImage).width(384).height(288).url()}
                  alt={title}
                  width={384}
                  height={288}
               />
            </Link> */}
         {/* </Stack> */}
      </PageContainer>
   );
};

export default HeroPost;
