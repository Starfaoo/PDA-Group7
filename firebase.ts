import { FirebaseApp, initializeApp } from "firebase/app";
import { 
  Auth, 
  initializeAuth, 
  getAuth,
  // @ts-ignore
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate config (Optional but good for debugging)
if (!firebaseConfig.apiKey) {
  console.error("❌ Firebase Config Missing! Check your .env file.");
}

// Initialize Firebase app
let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);

  // Initialize Auth with React Native Persistence (AsyncStorage)
  // This ensures the user stays logged in even after closing the app
  try {
    // @ts-ignore
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // If auth is already initialized (e.g., during hot reload), use existing instance
    auth = getAuth(app);
  }

  console.log("✅ [Firebase] Initialized successfully with AsyncStorage");
} catch (error: any) {
  console.error("❌ [Firebase] Initialization Failed:", error.message);
  throw error;
}

export { app, auth };
export default app;