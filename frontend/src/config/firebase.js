import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDkrrYJZc2cSSuwovTaCHvksSYnRVOOFgs",
  authDomain: "smartreport-pro.firebaseapp.com",
  projectId: "smartreport-pro",
  storageBucket: "smartreport-pro.firebaseapp.com",
  messagingSenderId: "990789201953",
  appId: "1:990789201953:web:20b4c0b3a5610a4e61b360",
  measurementId: "G-B5KLV37LEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
