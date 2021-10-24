import { useEffect } from "react"
import { getProviders, useSession, signIn, signOut } from "next-auth/client";
import { PageContainer } from "../components";

const Login = () => {
   const [session, loading] = useSession();
   let currentProviders;

   useEffect(() => {
      getProviders()
         .then((providers) => (providers = currentProviders))
         .catch((err) => console.log("provider list error", err));
   }, []);

   console.log("useSession", { loading, session });
   // getProviders().then(providers => console.log("providers", providers))
   console.log("providers", currentProviders);

   if (session) {
      return (
         <PageContainer pageTitle="Login">
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
         </PageContainer>
      );
   }
   return (
      <PageContainer pageTitle="Login">
         Not signed in <br />
         <button onClick={() => signIn()}>Sign in</button>
      </PageContainer>
   );
};

export default Login;
