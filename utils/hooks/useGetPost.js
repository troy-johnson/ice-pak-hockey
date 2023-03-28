import useSWR from "swr";

const useGetPost = (postId) => {
   const { data, error } = useSWR(`/api/posts/${postId}`);

   return {
      post: data,
      postLoading: !error && !data,
      postError: error,
   };
};

export default useGetPost;
