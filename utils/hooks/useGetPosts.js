import useSWR from "swr";

const useGetPosts = () => {
   const { data, error } = useSWR(`/api/posts`);

   return {
      posts: data,
      postsLoading: !error && !data,
      postsError: error,
   };
};

export default useGetPosts;
