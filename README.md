# AgriLens - Plant Disease Analyzer

A React Native Expo app for analyzing plant diseases using AI. Features authentication, image capture, and Google Gemini AI-powered plant health analysis.

## Features

- 🔐 User Authentication (Email/Password & Google Sign-in)
- 📸 Plant Image Capture and Upload
- 🤖 AI-Powered Disease Detection using Google Gemini
- 📊 Health Analysis with Treatment Recommendations
- 📱 Cross-platform (iOS, Android, Web)
- 🌙 Dark/Light Theme Support
- 📈 Scan History Tracking

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with your API keys:

```env
# Firebase Configuration (get from Firebase Console)
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini API Key (get from Google AI Studio)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password and Google providers
4. Get your Firebase config from Project Settings

### 4. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini 1.5 Flash model

### 5. Run the App

```bash
npm start
```

## App Flow

1. **Splash Screen** - Checks authentication status
2. **Onboarding** - First-time user introduction
3. **Login/Signup** - User authentication
4. **Home** - Dashboard with recent scans
5. **Upload** - Capture or select plant image
6. **Processing** - AI analysis with progress indicator
7. **Results** - Detailed analysis with treatment recommendations

## Tech Stack

- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **Authentication**: Firebase Auth
- **AI**: Google Gemini 1.5 Flash
- **State Management**: React Context
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet

## Project Structure

```
app/
├── _layout.tsx          # Root layout with context provider
├── index.tsx            # Splash screen
├── onboarding.tsx       # Onboarding flow
├── login.tsx            # Authentication screen
├── home.tsx             # Main dashboard
├── upload.tsx           # Image capture/upload
├── processing.tsx       # Analysis progress
├── result.tsx           # Analysis results
├── history.tsx          # Scan history
├── settings.tsx         # App settings
└── context.tsx          # Global state management

services/
└── geminiService.ts     # AI analysis service

firebase.js              # Firebase configuration
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Building for Production

```bash
npx expo build:android
npx expo build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
