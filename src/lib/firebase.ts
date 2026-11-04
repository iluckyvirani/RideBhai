import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDzESF8yHqjhwayJ9qG36cJkSZufik8vsg",
  authDomain: "ridebhai-7b724.firebaseapp.com",
  projectId: "ridebhai-7b724",
  storageBucket: "ridebhai-7b724.firebasestorage.app",
  messagingSenderId: "788141359962",
  appId: "1:788141359962:web:ee8539a3b1ab0963d5a963",
  measurementId: "G-EXCX4M5JYF"
};

// Initialize Firebase App singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(firebaseApp);
firebaseAuth.languageCode = 'en';

export { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult };

