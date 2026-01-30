import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We will build our own custom headers
        animation: "slide_from_right", // Smooth transitions
      }}
    >
      <Stack.Screen name="index" /> {/* Splash Screen */}
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="processing" options={{ animation: "fade" }} />
      <Stack.Screen name="result" />
    </Stack>
  );
}
