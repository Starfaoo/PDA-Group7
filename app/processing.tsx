import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from './context'; // Import Context to save data

const { width } = Dimensions.get('window');

// 🧪 MOCK DATA (Same as before)
const MOCK_RESULTS = [
  { 
    disease: "Tomato Early Blight", 
    confidence: "94%", 
    description: "A fungal infection causing dark spots on leaves.",
    treatment: "Use fungicides containing copper. Improve air circulation.",
    color: "#FF5252"
  },
  { 
    disease: "Healthy Plant", 
    confidence: "98%", 
    description: "Your plant looks vibrant and free of diseases!",
    treatment: "Keep up the good work! Maintain regular watering.",
    color: "#4CAF50"
  },
];

const STEPS = [
  "Analyzing image quality...",
  "Identifying plant species...",
  "Detecting disease patterns...",
  "Generating diagnosis..."
];

export default function ProcessingScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const { addScan } = useApp();
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
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
          finishProcessing();
          return 100;
        }
        return newProgress;
      });
    }, 40); // Runs every 40ms (Total ~4 seconds)

    return () => clearInterval(interval);
  }, []);

  const finishProcessing = () => {
    // 1. Pick Random Result
    const randomIndex = Math.floor(Math.random() * MOCK_RESULTS.length);
    const result = MOCK_RESULTS[randomIndex];

    // 2. Create Scan Object
    const newScan = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      imageUri: imageUri as string,
      ...result
    };

    // 3. Save & Navigate
    addScan(newScan);
    setTimeout(() => {
      router.replace({
        pathname: '/result',
        params: { ...newScan }
      });
    }, 500); // Small delay to show 100%
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Percentage Circle */}
      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          <Text style={styles.percentageText}>{progress}%</Text>
        </View>
        {/* Simple visual trick for the "Ring" border */}
        <View style={[styles.ring, { borderTopColor: 'rgba(255,255,255,0.3)', transform: [{ rotate: `${progress * 3.6}deg`}] }]} />
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
              <Text style={[styles.stepText, { opacity: isCurrent || isCompleted ? 1 : 0.5 }]}>
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
    backgroundColor: '#00A859', // The exact green from design
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  circleContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'transparent', // We only color top/right to simulate spinner
    borderTopColor: 'white',
    borderRightColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
  },
  barBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 40,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  stepsContainer: {
    width: '100%',
    paddingLeft: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    height: 30,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  emptyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  stepText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});