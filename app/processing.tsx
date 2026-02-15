import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { analyzePlantImage } from "../services/geminiService";
import { useApp } from "./context"; // Import Context to save data

const { width } = Dimensions.get("window");

const STEPS = [
  "Analyzing image quality...",
  "Identifying plant species...",
  "Detecting disease patterns...",
  "Generating diagnosis...",
];

export default function ProcessingScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const { addScan } = useApp();

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate image URI
    if (!imageUri) {
      setError("No image provided. Please go back and select an image.");
      return;
    }

    // ⏱️ Animation Loop
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;

        // Update steps based on percentage
        if (newProgress > 20 && newProgress < 50) setCurrentStep(1);
        if (newProgress > 50 && newProgress < 80) setCurrentStep(2);
        if (newProgress > 80) setCurrentStep(3);

        if (newProgress >= 100) {
          clearInterval(interval);
          if (!analyzing) {
            performAnalysis();
          }
          return 100;
        }
        return newProgress;
      });
    }, 40); // Runs every 40ms (Total ~4 seconds)

    return () => clearInterval(interval);
  }, [analyzing]);

  const performAnalysis = async () => {
    if (!imageUri) {
      setError("Image URI is missing");
      return;
    }

    setAnalyzing(true);
    try {
      console.log("Starting plant image analysis for:", imageUri);
      const result = await analyzePlantImage(imageUri as string);

      if (!result) {
        throw new Error("No analysis result returned");
      }

      // 2. Create Scan Object with all necessary data
      const newScan = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        imageUri: imageUri as string,
        disease: result.disease || "Unknown",
        confidence: result.confidence || "0%",
        description: result.description || "No description available",
        treatment: result.treatment || "Please try again",
        color: result.color || "#FF9800",
        severity: result.severity || 1,
        factors: result.factors || {
          humidity: "Unknown",
          sunlight: "Unknown",
          airflow: "Unknown",
        },
      };

      // 3. Save & Navigate
      addScan(newScan);
      setTimeout(() => {
        router.replace({
          pathname: "/result",
          params: {
            ...newScan,
            factors: JSON.stringify(newScan.factors), // Convert to string for URL params
          },
        });
      }, 500); // Small delay to show 100%
    } catch (error: any) {
      console.error("Analysis failed:", error);
      const errorMessage = error?.message || "Failed to analyze the image";
      setError(errorMessage);

      // Show error alert
      Alert.alert(
        "Analysis Failed",
        errorMessage +
          "\n\nPlease try again or check your internet connection.",
        [
          {
            text: "Go Back",
            onPress: () => router.back(),
          },
        ],
      );

      // Still create a fallback result so user can see what happened
      const fallbackScan = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        imageUri: imageUri as string,
        disease: "Analysis Error",
        confidence: "0%",
        description:
          errorMessage || "Failed to analyze the image. Please try again.",
        treatment:
          "Ensure you have a stable internet connection and try again.",
        color: "#FF9800",
        severity: 1,
        factors: {
          humidity: "Unknown",
          sunlight: "Unknown",
          airflow: "Unknown",
        },
      };

      addScan(fallbackScan);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Percentage Circle */}
      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          <Text style={styles.percentageText}>{progress}%</Text>
        </View>
        {/* Simple visual trick for the "Ring" border */}
        <View
          style={[
            styles.ring,
            {
              borderTopColor: "rgba(255,255,255,0.3)",
              transform: [{ rotate: `${progress * 3.6}deg` }],
            },
          ]}
        />
      </View>

      <Text style={styles.title}>Analyzing...</Text>
      <Text style={styles.subtitle}>Examining your plant leaf</Text>

      {/* 2. Linear Progress Bar */}
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>

      {/* 3. Checklist Steps */}
      <View style={styles.stepsContainer}>
        {STEPS.map((step, index) => {
          // Logic for icon state
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <View key={index} style={styles.stepRow}>
              <View style={styles.iconContainer}>
                {isCompleted ? (
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                ) : isCurrent ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <View style={styles.emptyDot} />
                )}
              </View>
              <Text
                style={[
                  styles.stepText,
                  { opacity: isCurrent || isCompleted ? 1 : 0.5 },
                ]}
              >
                {step}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00A859", // The exact green from design
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  circleContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  ring: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "transparent", // We only color top/right to simulate spinner
    borderTopColor: "white",
    borderRightColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 40,
  },
  barBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginBottom: 40,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
  stepsContainer: {
    width: "100%",
    paddingLeft: 20,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    height: 30,
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
    marginRight: 15,
  },
  emptyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  stepText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
