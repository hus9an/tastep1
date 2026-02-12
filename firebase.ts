
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhpS8rmHUrS9vLVbsPjWwQXOJ51qPTUFk",
  authDomain: "tastep1-e0770.firebaseapp.com",
  projectId: "tastep1-e0770",
  storageBucket: "tastep1-e0770.firebasestorage.app",
  messagingSenderId: "528900563877",
  appId: "1:528900563877:web:6181f9ec5cbf571acdbe4c",
  measurementId: "G-FRX8YDXDJY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
