import { Avatar, Typography } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "..";
import { imageBuilder } from "../../utils";

const HeroPost = ({ title, coverImage, date, excerpt, author, slug }) => {
   console.log("HERO POST", {title, coverImage, date, excerpt, author, slug})


   console.log("test", imageBuilder(coverImage).url())
   return (
      <PageContainer>
         <div className="-mx-5 sm:mx-0">
            {slug ? (
               <Link as={`/posts/${slug}`} href="/posts/[slug]">
                  <a aria-label={title}>
                     {/* <Image
                        width={1240}
                        height={540}
                        alt={`Cover Image for ${title}`}
                        src={coverImage}
                     /> */}
                  </a>
               </Link>
            ) : (
               // <Image width={1240} height={540} alt={`Cover Image for ${title}`} src={coverImage} />
               <div>asdf</div>
            )}
         </div>
         {slug ? (
            <Link as={`/posts/${slug}`} href="/posts/[slug]">
               <a aria-label={title}>
                  <Image src={imageBuilder(coverImage).url()} alt={title} width={1920} height={1440} />
               </a>
            </Link>
         ) : (
            <Image src={imageBuilder(coverImage).url()} alt={title} width={1920} height={1440} />
         )}
         <div>
            <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
               <Link as={`/posts/${slug}`} href="/posts/[slug]">
                  <a className="hover:underline">{title}</a>
               </Link>
            </h3>
            <div className="mb-4 md:mb-0 text-lg">{dayjs(date).format("DD/MM/YYYY")}</div>
         </div>
         <div>
            <Typography variant="body1">{excerpt}</Typography>
            <Avatar name={author?.name} picture={author?.picture} />
         </div>
      </PageContainer>
   );
};

export default HeroPost;
