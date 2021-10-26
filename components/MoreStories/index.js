import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { Avatar, Typography } from "@mui/material";

export default function MoreStories({ posts }) {
   return (
      <section>
         <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
            More Stories
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 md:col-gap-16 lg:col-gap-32 row-gap-20 md:row-gap-32 mb-32">
            {posts.map((post) => (
               <div key={post.slug}>
                  <div className="mb-5">
                     <div className="-mx-5 sm:mx-0">
                        {slug ? (
                           <Link as={`/posts/${slug}`} href="/posts/[slug]">
                              <a aria-label={title}>
                                 <Image
                                    width={1240}
                                    height={540}
                                    alt={`Cover Image for ${post.title}`}
                                    src={coverImage}
                                 />
                              </a>
                           </Link>
                        ) : (
                           <Image
                              width={1240}
                              height={540}
                              alt={`Cover Image for ${title}`}
                              src={coverImage}
                           />
                        )}
                     </div>
                  </div>
                  <h3 className="text-3xl mb-3 leading-snug">
                     <Link as={`/posts/${post.slug}`} href="/posts/[slug]">
                        <a className="hover:underline">{post.title}</a>
                     </Link>
                  </h3>
                  <div className="text-lg mb-4">
                     <div className="mb-4 md:mb-0 text-lg">
                        {dayjs(post.date).format("DD/MM/YYYY")}
                     </div>
                  </div>
                  <Typography variant="body1">{post.excerpt}</Typography>
                  <Avatar name={post.author?.name} picture={post.author?.picture} />
               </div>
            ))}
         </div>
      </section>
   );
}
