import useSWR from "swr";

const useGetPost = (postId) => {
   console.log("postId", postId)
   const { data, error } = useSWR(`/api/posts/${postId}`);

   console.log("data, error", {data, error})

   return {
      post: data,
      postLoading: !error && !data,
      postError: error,
   };
};

export default useGetPost;
