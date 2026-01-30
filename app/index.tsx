import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0)); // Opacity for smooth fade-in
  const [scaleAnim] = useState(new Animated.Value(0.8)); // Scale for slight zoom effect

  useEffect(() => {
    // 1. Run Entry Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();

    // 2. Check User Status & Navigate
    const prepareApp = async () => {
      // Wait for 2.5 seconds (Simulate loading)
      await new Promise(resolve => setTimeout(resolve, 2500));

      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
        // Navigate based on history
        if (hasSeenOnboarding === 'true') {
          router.replace('/login');
        } else {
          router.replace('/onboarding');
        }
      } catch (e) {
        // Fallback if storage fails
        router.replace('/onboarding');
      }
    };

    prepareApp();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.logoContainer, 
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        
        {/* Leaf Logo (Mimicking the 'ECO' design) */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="leaf" size={120} color="#458c49" />
          {/* Decorative smaller leaf to mimic the abstract shape */}
          <MaterialCommunityIcons name="leaf" size={60} color="#2e6b32" style={styles.smallLeaf} />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>AgriLens</Text>
      </Animated.View>
      
      {/* Optional: Loading text at bottom */}
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background as per design
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  smallLeaf: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    transform: [{ rotate: '-45deg' }],
    opacity: 0.9,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#458c49', // The specific green from your screenshot
    letterSpacing: 2,
    fontFamily: 'monospace', // Matches the stylized font in the image
  },
  footerText: {
    position: 'absolute',
    bottom: 50,
    color: '#aaa',
    fontSize: 12,
    letterSpacing: 1,
  }
});