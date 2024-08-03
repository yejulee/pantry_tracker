// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, getFireStore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA37pk_EfxrEdcLvX8_IT5uXTUE29S9p-A",
  authDomain: "pantry-tracker-39ea7.firebaseapp.com",
  projectId: "pantry-tracker-39ea7",
  storageBucket: "pantry-tracker-39ea7.appspot.com",
  messagingSenderId: "432712547913",
  appId: "1:432712547913:web:9e746024fbf317a10d4998",
  measurementId: "G-RFG2WJF02B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}