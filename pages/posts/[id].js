import { useRouter } from "next/router";
import { getPosts } from "../../utils";

const Post = () => {
   const { posts, postsLoading, postsError } = getPosts();

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
