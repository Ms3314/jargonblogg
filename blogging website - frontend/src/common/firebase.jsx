// Import the functions you need from the SDKs you need
import { initializeApp } from 
"firebase/app";
import { getAuth } from "firebase/auth";
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz53SZpY-eLJ634huh_49iKH9M8-AtMao",
  authDomain: "jargon-blog.firebaseapp.com",
  projectId: "jargon-blog",
  storageBucket: "jargon-blog.appspot.com",
  messagingSenderId: "875329640136",
  appId: "1:875329640136:web:ab56222fd45b1cdadaf7fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null ;
    await signInWithPopup(auth, provider).then((result) => {
        user = result.user})
        .catch((error) => {
            console.log(error)
        });
    return user;
    
}   