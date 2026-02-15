import { initializeApp } from "firebase/app";
// 1. Fixed Import: Removed '/react-native' from the end
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getAuth,
    getReactNativePersistence,
    initializeAuth
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Use initializeAuth for better control over AsyncStorage
// We use a try/catch because sometimes Fast Refresh tries to init it twice
let auth = null;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If auth is already initialized, use the existing instance
  auth = getAuth(app);
}

export { app, auth };

