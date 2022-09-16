import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

// console.log("envs", {
//    clientId: process.env.AUTH0_CLIENT_ID,
//    clientSecret: process.env.AUTH0_CLIENT_SECRET,
//    issuer: process.env.AUTH0_DOMAIN,
// });

export default NextAuth({
   debug: true,
   session: {
      strategy: "jwt",
   },
   callbacks: {
      async session({ session, token, user }) {
         // console.log("session", { session, token, user });
         session.user.metadata = {};

         if (token?.firstName) {
            session.user.firstName = token.firstName;
         }

         if (token?.lastName) {
            session.user.lastName = token.lastName;
         }

         if (token?.groups) {
            session.user.groups = token.groups;
         }

         if (token?.user_metadata) {
            session.user.metadata.user = token.user_metadata;
         }

         if (token?.app_metadata) {
            session.user.metadata.app = token.app_metadata;
         }

         if (token?.sub) {
            session.user.sub = token.sub;
         }

         return session;
      },
      async jwt({ token, user, account, profile, isNewUser }) {
         // console.log("jwt", { token, user, account, profile, isNewUser });
         if (user?.firstName) {
            token.firstName = user.firstName;
         }

         if (user?.lastName) {
            token.lastName = user.lastName;
         }

         if (user?.groups) {
            token.groups = user.groups;
         }

         if (user?.user_metadata) {
            token.user_metadata = user.user_metadata;
         }

         if (user?.app_metadata) {
            token.app_metadata = user.app_metadata;
         }

         if (user?.sub) {
            token.sub = user.sub;
         }
         return token;
      },
   },
   providers: [
      Auth0Provider({
         clientId: process.env.AUTH0_CLIENT_ID,
         clientSecret: process.env.AUTH0_CLIENT_SECRET,
         issuer: process.env.AUTH0_DOMAIN,
         profile(profile, tokens) {
            // console.log("profile", { profile, tokens });
            return {
               id: profile.sub,
               name: profile.nickname,
               email: profile.email,
               image: profile.picture,
               firstName: profile.given_name,
               lastName: profile.family_name,
               groups: profile["http://icepakhockey.com/claims/groups"],
               user_metadata: profile["http://icepakhockey.com/claims/user_metadata"],
               app_metadata: profile["http://icepakhockey.com/claims/app_metadata"],
            };
         },
      }),
   ],
   secret: "jREkJF4YNWIJK7P7IMroSgpMG6iwUweOp2RwgdAlF3k=",
});
