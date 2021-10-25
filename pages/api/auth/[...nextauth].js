import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
   debug: true,
   session: {
      jwt: true,
   },
   callbacks: {
      async session(session, user) {
         // console.log("session", { session, user });
         session.user.metadata = {};

         if (user?.firstName) {
            session.user.firstName = user.firstName;
         }

         if (user?.lastName) {
            session.user.lastName = user.lastName;
         }

         if (user?.groups) {
            session.user.groups = user.groups;
         }

         if (user?.user_metadata) {
            session.user.metadata.user = user.user_metadata;
         }

         if (user?.app_metadata) {
            session.user.metadata.app = user.app_metadata;
         }

         return session;
      },
      async jwt(token, user, account, profile, isNewUser) {
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
         return token;
      },
   },
   providers: [
      Providers.Auth0({
         clientId: process.env.AUTH0_CLIENT_ID,
         clientSecret: process.env.AUTH0_CLIENT_SECRET,
         domain: process.env.AUTH0_DOMAIN,
         profile(profile, tokens) {
            console.log("profile", { profile, tokens });
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
});
