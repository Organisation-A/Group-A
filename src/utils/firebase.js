// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
<<<<<<< HEAD
import { getFirestore } from "firebase/firestore";
=======
>>>>>>> origin/Gael

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApnj5n3wSDJpKkeH819vCZjraTRqKnhlI",
  authDomain: "campus-transportation-82bea.firebaseapp.com",
  projectId: "campus-transportation-82bea",
  storageBucket: "campus-transportation-82bea.appspot.com",
  messagingSenderId: "801739408414",
  appId: "1:801739408414:web:0e9d0d5a8b2d141034da0f",
<<<<<<< HEAD
  measurementId: "G-5LEL634CB9",
=======
  measurementId: "G-5LEL634CB9"
>>>>>>> origin/Gael
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
<<<<<<< HEAD
const firestore = getFirestore(app);

export default auth;
export { auth, firestore };
=======

export default auth;
>>>>>>> origin/Gael
