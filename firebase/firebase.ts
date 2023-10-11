import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDL9d6lTZniZlp8WGQ-rMJE8jhA7GfW38s",
    authDomain: "chatgptclone-c7ff3.firebaseapp.com",
    projectId: "chatgptclone-c7ff3",
    storageBucket: "chatgptclone-c7ff3.appspot.com",
    messagingSenderId: "708847741815",
    appId: "1:708847741815:web:e4cb08253ef247bff08f72",
};

// Initialize Firebase using Next.js
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
