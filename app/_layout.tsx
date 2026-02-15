import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AppProvider, useApp } from './context'; 
import * as SplashScreen from 'expo-splash-screen'; 

function RootLayoutNav() {
  const { user, isOnboarded, isLoading } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // FIX: This safely gets the current route name even if segments are empty
  const currentRoute = segments && segments.length > 0 ? segments[segments.length - 1] : 'index';

  useEffect(() => {
    // Wait until context is finished loading storage
    if (isLoading) return;

    const inAuthGroup = currentRoute === 'login' || currentRoute === 'index';

    // 1. If not onboarded, force them to Onboarding (index)
    if (!isOnboarded && currentRoute !== 'index') {
      router.replace('/');
    } 
    // 2. If onboarded but no user, force them to Login
    else if (isOnboarded && !user && currentRoute !== 'login') {
      router.replace('/login');
    }
    // 3. If logged in and trying to see auth screens, go Home
    else if (user && inAuthGroup) {
      router.replace('/home');
    }
  }, [user, isOnboarded, isLoading, currentRoute]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="history" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="result" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}