import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useApp, Colors } from './context'; // Import Context

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { history, isDarkMode } = useApp(); // Get data and theme
  
  // Dynamic Styles
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const containerStyle = { backgroundColor: theme.background };
  const textStyle = { color: theme.text };
  const cardStyle = { backgroundColor: theme.card, borderColor: isDarkMode ? '#333' : '#eee' };

  // Get last 2 scans
  const recentScans = history.slice(0, 4);
  const weeklyCount = history.length; // Simplified logic for demo

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, Gardener!</Text>
              <Text style={styles.subGreeting}>Let's check your plants today</Text>
            </View>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Feather name="layers" size={16} color="#A5D6A7" />
                <Text style={styles.statLabel}> Total Scans</Text>
              </View>
              <Text style={styles.statValue}>{history.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Feather name="trending-up" size={16} color="#A5D6A7" />
                <Text style={styles.statLabel}> This Week</Text>
              </View>
              <Text style={styles.statValue}>{weeklyCount}</Text>
            </View>
          </View>
        </View>

        {/* Scan Button */}
        <TouchableOpacity style={styles.scanBtn} onPress={() => router.push('/upload')}>
          <Ionicons name="camera-outline" size={24} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.scanBtnText}>Scan New Plant</Text>
        </TouchableOpacity>

        {/* Recent Scans */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, textStyle]}>Recent Scans</Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentScans.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic' }}>No scans yet. Start scanning!</Text>
          ) : (
            recentScans.map((scan) => (
              <View key={scan.id} style={[styles.recentItem, cardStyle]}>
                <Image source={{ uri: scan.imageUri }} style={styles.plantImage} />
                <View style={styles.plantInfo}>
                  <Text style={[styles.plantName, textStyle]}>{scan.disease}</Text>
                  <Text style={styles.timeAgo}>{scan.date}</Text>
                </View>
                <View style={[styles.checkCircle, { backgroundColor: scan.color + '20' }]}>
                  <Ionicons name="checkmark" size={16} color={scan.color} />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav (Simplified for view) */}
      <View style={[styles.bottomNav, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff', borderTopColor: isDarkMode ? '#333' : '#f0f0f0' }]}>
         {/* ... (Same Nav Items, just applied theme) ... */}
         <TouchableOpacity style={styles.navItem}><Ionicons name="leaf" size={24} color="#4CAF50" /><Text style={[styles.navText, { color: '#4CAF50' }]}>Home</Text></TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => router.push('/history')}><MaterialCommunityIcons name="history" size={24} color="#ccc" /><Text style={styles.navText}>History</Text></TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => router.push('/upload')}><View style={styles.centerNavBtn}><Ionicons name="camera" size={28} color="white" /></View><Text style={[styles.navText, { marginTop: 25 }]}>Capture</Text></TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}><Ionicons name="settings-outline" size={24} color="#ccc" /><Text style={styles.navText}>Settings</Text></TouchableOpacity>
      </View>
    </View>
  );
}

// ... Keep your existing styles, but remove the backgroundColor from 'container' ...
const styles = StyleSheet.create({
  container: { flex: 1 }, // Bg color handled by style prop
  scrollContent: { paddingBottom: 100 },
  header: { backgroundColor: '#006d38', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subGreeting: { fontSize: 14, color: '#A5D6A7' },
  settingsBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 50 },
  statsContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 15, padding: 15, justifyContent: 'space-around', alignItems: 'center' },
  statCard: { alignItems: 'flex-start' },
  statHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  statLabel: { color: '#A5D6A7', fontSize: 12 },
  statValue: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  statDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.2)' },
  scanBtn: { backgroundColor: '#00C853', marginHorizontal: 20, marginTop: 20, paddingVertical: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  scanBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  recentSection: { paddingHorizontal: 20, marginTop: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  seeAll: { color: '#00C853', fontWeight: 'bold' },
  recentItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 15, marginBottom: 10, borderWidth: 1 },
  plantImage: { width: 50, height: 50, borderRadius: 25 },
  plantInfo: { flex: 1, marginLeft: 15 },
  plantName: { fontSize: 16, fontWeight: 'bold' },
  timeAgo: { fontSize: 12, color: '#888' },
  checkCircle: { width: 25, height: 25, borderRadius: 12.5, justifyContent: 'center', alignItems: 'center' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingBottom: 20, borderTopWidth: 1, elevation: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 10, color: '#ccc', marginTop: 4 },
  centerNavBtn: { position: 'absolute', top: -25, backgroundColor: '#00C853', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});