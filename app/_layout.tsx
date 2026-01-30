import { Stack } from "expo-router";
import { AppProvider } from "./context"; // Import the new provider

export default function RootLayout() {
  return (
    <AppProvider> 
      <Stack 
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="upload" />
        <Stack.Screen name="processing" options={{ animation: 'fade' }} />
        <Stack.Screen name="result" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
      </Stack>
    </AppProvider>
  );
}