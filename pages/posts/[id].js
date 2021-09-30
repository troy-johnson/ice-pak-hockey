import { useRouter } from "next/router";
import { useGetPosts } from "../../utils";

const Post = () => {
   const { posts, postsLoading, postsError } = useGetPosts();

   const router = useRouter();
   const { id } = router.query;

   const post = posts?.filter((post) => post.id === id);

   return (
      <>
         <h2>{post?.title}</h2>
         {post ? <div>{JSON.stringify(post)}</div> : null}
      </>
   );
};

export default Post;
