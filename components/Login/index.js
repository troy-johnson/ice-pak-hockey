import { useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";

const firebaseAuthConfig = {
   signInFlow: "popup",
   signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
   ],
   signInSuccessUrl: "/",
   credentialHelper: "none",
   callbacks: { signInSuccessWithAuthResult: () => false },
};

const Login = () => {
   const [renderAuth, setRenderAuth] = useState(false);
   useEffect(() => {
      if (typeof window !== "undefined") {
         setRenderAuth(true);
      }
   }, []);

   return (
      <div className={styles.container}>
         <main className={styles.main}>
            <h1 className={styles.title}>Login</h1>
            {renderAuth ? (
               <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={firebase.auth()} />
            ) : null}
         </main>
      </div>
   );
};

export default withAuthUser({
   whenAuthed: AuthAction.REDIRECT_TO_APP,
   whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
   whenUnauthedAfterInit: AuthAction.RENDER,
})(Login);
