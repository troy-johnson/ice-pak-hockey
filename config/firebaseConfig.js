import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);

// if (getApps().length === 0) {
//    initializeApp({
//       apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//       authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//    });
// }

// const db = getFirestore();

export default db;
