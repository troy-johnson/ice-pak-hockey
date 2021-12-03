import useSWR from "swr";

const useGetAllPosts = () => {
   const { data, error } = useSWR("/api/posts");

   return {
      posts: data,
      postsLoading: !error && !data,
      postsError: error,
   };
};

export default useGetAllPosts;
