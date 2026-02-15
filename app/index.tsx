import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "./context";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Welcome to AgriLens",
    description:
      "Capture photos of your plant leaves and instantly identify diseases.",
    image: require("../assets/images/Group9.png"),
  },
  {
    id: "2",
    title: "Identify Plant Diseases",
    description:
      "Take a photo or upload an image of your plant leaf for quick analysis.",
    image: require("../assets/images/Group 10.png"),
  },
  {
    id: "3",
    title: "Track Your Plants",
    description:
      "Keep a history of all your scans and monitor plant health over time.",
    image: require("../assets/images/Group 11.png"),
  },
  {
    id: "4",
    title: "Get Treatment Tips",
    description:
      "Receive personalized recommendations to treat and prevent diseases.",
    image: require("../assets/images/amico.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSplash, setIsSplash] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFinish = async () => {
    try {
      await completeOnboarding();
      router.replace("/login");
    } catch (e) {
      console.error("Failed to finish onboarding", e);
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  if (isSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("../assets/images/Eco_Friendly_Logo_Badge_Label_Sign__Ecology__Eco__Friendly_PNG_and_Vector-removebg-preview 2.png")}
          style={styles.splashLogo}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>AgriLens</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Skip Button */}
      <View style={styles.header}>
        <View style={{ width: 50 }} />
        <TouchableOpacity onPress={handleFinish}>
          <Text style={styles.skipText}>Skip →</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image
                source={item.image} // Simplified: No more {uri}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Footer with Pagination and Button */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  skipText: { fontSize: 16, color: "#333", fontWeight: "600" },
  slide: { width: width, alignItems: "center", paddingHorizontal: 30 },
  imageContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  image: { width: "90%", height: "90%" },
  textContainer: { flex: 0.4, alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  footer: { paddingHorizontal: 20, paddingBottom: 50 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  activeDot: { width: 25, backgroundColor: "#00C853" },
  inactiveDot: { width: 6, backgroundColor: "#ccc" },
  button: {
    backgroundColor: "#00C853",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  splashContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
});
