# Firebase Setup Instructions

The current Firebase credentials in `.env` are not valid. The Firebase project `group7pda` either doesn't exist or is not properly configured.

## Option 1: Create a Real Firebase Project (RECOMMENDED)

1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "PDA-AgriLens")
4. Accept terms and create
5. Wait for project creation (takes ~1-2 minutes)
6. In Project Settings, find your Web app config
7. Copy the values to `.env`:
   - apiKey → EXPO_PUBLIC_FIREBASE_API_KEY
   - authDomain → EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
   - projectId → EXPO_PUBLIC_FIREBASE_PROJECT_ID
   - storageBucket → EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
   - messagingSenderId → EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - appId → EXPO_PUBLIC_FIREBASE_APP_ID

8. Go to Authentication tab in Firebase Console
9. Enable "Email/Password" provider
10. Enable "Google" provider
11. Copy the Google OAuth Client ID to EXPO_PUBLIC_GOOGLE_CLIENT_ID in .env

## Option 2: Use Firebase Emulator (LOCAL TESTING)

Firebase Emulator allows you to test authentication locally without a real Firebase project.

### Steps:

1. Install Firebase Tools: `npm install -g firebase-tools`
2. Initialize: `firebase init`
3. Run: `firebase emulators:start`
4. Update auth configuration to use local emulator

## Current Status

❌ The existing credentials are invalid
❌ Firebase API calls return: CONFIGURATION_NOT_FOUND

## Next Steps

You need EITHER:

- [ ] Real Firebase project credentials (Option 1)
- [ ] OR Setup Firebase Emulator (Option 2)

Once you have valid credentials, update `.env` and the app will work.

### Additional: Google OAuth for Expo

1. In Firebase Console → Authentication → Sign-in method → Google, enable the provider.
2. Go to the Google Cloud Console → APIs & Services → Credentials and create an OAuth 2.0 Client ID for a Web application.
3. Add the following authorized redirect URIs for Expo Auth Session:
   - `https://auth.expo.io/@your-username/your-app-slug` (replace with your Expo username and app slug)
   - For local testing with Expo Go, also add `exp://`/`http://` URIs as needed per Expo docs.
4. Copy the Client ID and set it in `.env` as `EXPO_PUBLIC_GOOGLE_CLIENT_ID`.
5. Restart the Expo packager and verify the Google button appears on the Login screen.

If you're unsure of your Expo app slug or username, run `npx expo whoami` and check `app.json` or `app.config` for the slug.
