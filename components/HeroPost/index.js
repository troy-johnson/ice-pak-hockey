import { Avatar, Button, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import BlockContent from "@sanity/block-content-to-react";
import { PageContainer } from "..";
import { imageBuilder } from "../../utils";
import markdownStyles from "../../styles/markdown-styles.module.css";

const HeroPost = ({ title, body, coverImage, date, excerpt, author, slug }) => {
   console.log("HERO POST", { title, coverImage, date, excerpt, author, slug });
   return (
      <PageContainer padding>
         <Link href={`/posts/${slug}`} passHref>
            <Image
               src={imageBuilder(coverImage).width(384).height(288).url()}
               alt={title}
               width={384}
               height={288}
            />
         </Link>
         <div>
            <Typography variant="h4">
               <Link href={`/posts/${slug}`} passHref>
                  {title}
               </Link>
            </Typography>
            <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
               <Avatar alt={author?.name} src={author?.picture} />
               <Typography variant="subtitle1" sx={{ marginLeft: "5px" }}>
                  {author?.name}
               </Typography>
            </Stack>
            <Typography>{dayjs(date).format("MMMM DD, YYYY")}</Typography>
         </div>
         <Typography>
            <BlockContent
               blocks={body.slice(0, 3)}
               projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
               dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
               className={markdownStyles.markdown}
            />
         </Typography>
         <Link href={`/posts/${slug}`} passHref>
            <Button variant="outlined">Read More</Button>
         </Link>
      </PageContainer>
   );
};

export default HeroPost;
