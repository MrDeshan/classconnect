import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB2eaegVKX4Zzbi0fbPpme_Wl8b3yGbLuw",
  authDomain: "connectclass-37b3e.firebaseapp.com",
  projectId: "connectclass-37b3e",
  storageBucket: "connectclass-37b3e.firebasestorage.app",
  messagingSenderId: "749249672417",
  appId: "1:749249672417:web:c57c6c09d4106be98733a0",
  measurementId: "G-6MNR9M25PM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);