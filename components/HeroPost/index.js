import { Button, Chip, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "..";
import { imageBuilder } from "../../utils/sanity";

const HeroPost = ({ title, categories, coverImage, postId, date, excerpt, slug }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   return (
      <PageContainer small padding>
         {desktop ? (
            <>
               <Stack display="flex" spacing={2}>
                  <Container sx={{ display: "flex", justifyContent: "center" }}>
                     <Image
                        src={imageBuilder(coverImage).url()}
                        alt={title}
                        width={384}
                        height={222}
                     />
                  </Container>
                  <Typography variant="h4" style={{ textAlign: "left" }}>
                     {title}
                  </Typography>
                  <Typography variant="overline">{dayjs(date).format("MMMM DD, YYYY")}</Typography>
                  <Typography variant="body1">{excerpt}</Typography>
                  <Stack direction="row" mb={2}>
                     {categories.map((category) => {
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
                  <Link href={`/posts/${slug}`} passHref>
                     <Button
                        variant="contained"
                        sx={{ alignSelf: "left", maxWidth: "200px" }}
                     >
                        View More
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
               spacing={2}
            >
               <Image
                  src={imageBuilder(coverImage).width(320).height(185).url()}
                  alt={title}
                  width={320}
                  height={185}
               />
               <Typography variant="h5" sx={{ marginTop: "15px", textTransform: "uppercase" }}>
                  {title}
               </Typography>
               <Typography variant="overline">{dayjs(date).format("MMMM DD, YYYY")}</Typography>
               <Typography variant="body1">{excerpt}</Typography>
               <Stack direction="row" display="flex" justifyContent="center" mb={2}>
                  {categories.map((category) => {
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
               <Link href={`/posts/${postId}`} passHref>
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
