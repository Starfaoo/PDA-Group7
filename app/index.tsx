import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    // 1. Simulate a 2-second delay for the splash logo
    setTimeout(async () => {
      // 2. Check if user has seen onboarding before
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      if (hasSeenOnboarding === "true") {
        router.replace("/login"); // Go to Login if they've used the app before
      } else {
        router.replace("/onboarding"); // Go to Onboarding if it's their first time
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Replace this Text with your Logo Image later */}
      <Text style={styles.logoText}>🌿 PlantScan</Text>
      <Text style={styles.subText}>Group 7 Project</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4CAF50", // Nice Plant Green
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#E8F5E9",
  },
});
