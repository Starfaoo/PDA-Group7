import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Data from the scan
  const { imageUri, disease, confidence, description, treatment } = params;

  // 🧪 MOCK DATA for the visual elements (Severity & Factors)
  // In a real app, the AI would return these specific details.
  const severityLevel = 3; // 1 to 5
  const factors = [
    { icon: 'water-outline', label: 'High', sub: 'Humidity', color: '#E3F2FD', iconColor: '#2196F3' },
    { icon: 'sunny-outline', label: 'Low', sub: 'Sunlight', color: '#FFF3E0', iconColor: '#FF9800' },
    { icon: 'weather-windy', label: 'Poor', sub: 'Airflow', color: '#E0F2F1', iconColor: '#009688' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. Header Image Section */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: imageUri as string }} style={styles.headerImage} />
          
          {/* Top Buttons (Back & Share) */}
          <View style={styles.topButtons}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={() => Alert.alert("Share", "Sharing results...")}>
              <Ionicons name="share-social-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Floating 'Disease Detected' Card */}
          <View style={styles.floatingCard}>
            <View style={styles.floatingRow}>
              <View style={styles.warningIcon}>
                <Ionicons name="warning-outline" size={20} color="#FBC02D" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.detectedTitle}>Disease Detected</Text>
                  <View style={styles.moderateBadge}>
                    <Text style={styles.moderateText}>Moderate</Text>
                  </View>
                </View>
                <Text style={styles.confidenceText}>Confidence {confidence}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Main Content Body */}
        <View style={styles.body}>
          
          {/* Title Header */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.diseaseTitle}>{disease}</Text>
              <Text style={styles.subTitle}>Affecting your plant</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Info", description as string)}>
              <Ionicons name="information-circle-outline" size={28} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {/* Severity Level Bar */}
          <View style={styles.sectionContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Feather name="activity" size={18} color="#FF9800" style={{ marginRight: 8 }} />
              <Text style={styles.sectionHeader}>Severity Level</Text>
            </View>
            
            <View style={styles.severityBar}>
              {[1, 2, 3, 4, 5].map((level) => (
                <View 
                  key={level} 
                  style={[
                    styles.severitySegment, 
                    { backgroundColor: level <= severityLevel ? '#FFC107' : '#E0E0E0' }
                  ]} 
                />
              ))}
            </View>
            <View style={styles.severityLabels}>
              <Text style={styles.labelSmall}>Mild</Text>
              <Text style={styles.labelSmall}>Severe</Text>
            </View>
          </View>

          {/* Contributing Factors */}
          <Text style={styles.sectionHeaderMb}>Contributing Factors</Text>
          <View style={styles.factorsGrid}>
            {factors.map((item, index) => (
              <View key={index} style={[styles.factorCard, { backgroundColor: item.color }]}>
                {index === 2 ? (
                   <MaterialCommunityIcons name="weather-windy" size={24} color={item.iconColor} />
                ) : (
                   <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
                )}
                <Text style={styles.factorLabel}>{item.label}</Text>
                <Text style={styles.factorSub}>{item.sub}</Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>

      {/* 3. Bottom Fixed Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryBtn} 
          onPress={() => Alert.alert("Treatment Guide", treatment as string)}
        >
          <Text style={styles.primaryBtnText}>View Treatment Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryBtn} 
          onPress={() => router.replace('/upload')}
        >
          <Text style={styles.secondaryBtnText}>Scan Another Leaf</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topButtons: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingCard: {
    position: 'absolute',
    bottom: -30, // Floats halfway out
    left: 20,
    right: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  floatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  moderateBadge: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  moderateText: {
    fontSize: 10,
    color: '#F57C00',
    fontWeight: 'bold',
  },
  confidenceText: {
    color: '#757575',
    fontSize: 12,
    marginTop: 2,
  },
  body: {
    marginTop: 50, // Space for the floating card
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  diseaseTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212121',
  },
  subTitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  sectionContainer: {
    backgroundColor: '#FFF8E1', // Light yellow bg for severity
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D4037',
  },
  severityBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  severitySegment: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 3,
  },
  severityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelSmall: {
    fontSize: 10,
    color: '#8D6E63',
  },
  sectionHeaderMb: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  factorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  factorCard: {
    width: (width - 60) / 3, // 3 columns
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  factorSub: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  primaryBtn: {
    backgroundColor: '#00C853',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: "#00C853",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00C853',
  },
  secondaryBtnText: {
    color: '#00C853',
    fontSize: 16,
    fontWeight: 'bold',
  },
});