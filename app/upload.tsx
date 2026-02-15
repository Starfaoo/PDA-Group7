import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "./context"; // Import context to check auth

const { width } = Dimensions.get("window");

export default function UploadScreen() {
  const router = useRouter();
  const { user } = useApp(); // Verify user is logged in
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Verify user is authenticated
  if (!user) {
    Alert.alert("Not Authenticated", "Please log in first", [
      { text: "OK", onPress: () => router.replace("/login") },
    ]);
    return null;
  }

  const pickImage = async (useCamera: boolean) => {
    let result;

    try {
      // Request permissions first
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need camera access to scan plants.",
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets?.[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    router.push({
      pathname: "/processing",
      params: { imageUri: selectedImage },
    });
  };

  return (
    <View style={styles.container}>
      {/* 1. Custom Curved Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan plant</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center title */}
      </View>

      {/* 2. Main Content Area */}
      <View style={styles.content}>
        {selectedImage ? (
          // STATE: Image Selected
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
          </View>
        ) : (
          // STATE: Empty Placeholder
          <View style={styles.placeholderContainer}>
            <View style={styles.circle}>
              <Ionicons name="image-outline" size={60} color="#00C853" />
            </View>
            <Text style={styles.title}>Select Leaf Image</Text>
            <Text style={styles.subtitle}>
              Take a clear photo or upload an image of the plant leaf you want
              to analyze
            </Text>
          </View>
        )}
      </View>

      {/* 3. Bottom Action Buttons */}
      <View style={styles.footer}>
        {selectedImage ? (
          // Buttons for "Analyze" State
          <>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleAnalyze}>
              <Text style={styles.primaryText}>Analyze Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setSelectedImage(null)}
            >
              <Feather
                name="upload"
                size={20}
                color="#333"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.secondaryText}>Choose Different Image</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Buttons for "Select" State
          <>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => pickImage(true)}
            >
              <Ionicons
                name="camera-outline"
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.primaryText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => pickImage(false)}
            >
              <Feather
                name="upload"
                size={20}
                color="#00C853"
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.secondaryText, { color: "#00C853" }]}>
                Upload from Gallery
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#006d38", // Deep Green
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  placeholderContainer: {
    alignItems: "center",
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E8F5E9", // Light Green
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
  imageWrapper: {
    width: width * 0.85,
    height: width * 0.85, // Square aspect ratio
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
  },
  primaryBtn: {
    backgroundColor: "#00C853", // Bright Green
    flexDirection: "row",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryBtn: {
    flexDirection: "row",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
  },
  secondaryText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
