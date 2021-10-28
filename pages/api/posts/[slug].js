import { getClient } from "../../../utils/sanity";

const postsHandler = async (req, res) => {
   const { slug } = req.query;

   const curClient = getClient(true);

   const postFields = `
   _id,
   name,
   title,
   'date': publishedAt,
   excerpt,
   categories[]->{
      _id,
      title
   },
   'slug': slug.current,
   'coverImage': mainImage,
   'author': author->{name, 'picture': image.asset->url},
`;

   const [post, morePosts] = await Promise.all([
      curClient
         .fetch(
            `*[_type == "post" && slug.current == $slug] | order(_updatedAt desc) {
         ${postFields}
         body,
        'comments': *[
                     _type == "comment" && 
                     post._ref == ^._id && 
                     approved == true] {
         _id, 
         name, 
         email, 
         comment, 
         _createdAt
         }
      }`,
            { slug }
         )
         .then((res) => res?.[0]),
      curClient.fetch(
         `*[_type == "post" && slug.current != $slug] | order(publishedAt desc, _updatedAt desc){
         ${postFields}
         body,
      }[0...2]`,
         { slug }
      ),
   ]);

   return res.status(200).json({ post });
};

export default postsHandler;
