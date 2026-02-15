import { useState, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Welcome to AgriLens",
    description:
      "Capture photos of your plant leaves and instantly identify diseases with AI-powered detection technology.",
    image: require("../assets/images/Group9.png"),
  },
  {
    id: "2",
    title: "Identify Plant Diseases",
    description:
      "Take a photo or upload an image of your plant leaf for quick analysis.",
    image:
      "https://img.freepik.com/free-vector/image-upload-concept-illustration_114360-996.jpg?w=740",
  },
  {
    id: "3",
    title: "Track Your Plants",
    description:
      "Keep a history of all your scans and monitor plant health over time.",
    image:
      "https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-8012.jpg?w=740",
  },
  {
    id: "4",
    title: "Get Treatment Tips",
    description:
      "Receive personalized recommendations to treat and prevent diseases.",
    image:
      "https://img.freepik.com/free-vector/scientists-working-lab_23-2148498871.jpg?w=740",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleFinish = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/login");
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      // Scroll to the next slide
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      // Force update state immediately for snappy feel
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Calculate which slide we are on based on x offset
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  return (
    <View style={styles.container}>
      {/* 1. Header with Skip */}
      <View style={styles.header}>
        <View style={{ width: 50 }} />
        <TouchableOpacity onPress={handleFinish}>
          <Text style={styles.skipText}>Skip →</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16} // ⚡ CRITICAL FIX: Updates state fast enough for smooth interactions
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
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

      {/* 3. Footer */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
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

        {/* Next Button */}
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
  activeDot: { width: 25, backgroundColor: "#000" },
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
});
