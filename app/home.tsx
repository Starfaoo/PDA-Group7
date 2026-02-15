import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "./context"; 

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  // 1. Get user and scans from our Context
  const { user, scans, isLoading } = useApp();

  // 2. Navigation guard - redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="dark-content" />
        <Text>Loading your farm...</Text>
      </View>
    );
  }

  // Prevent flicker if redirecting
  if (!user) return null;

  // Get name from Firebase user (or fallback to email)
  const displayName = user.displayName || user.email?.split("@")[0] || "Farmer";

  // Calculate health rate from scans
  const healthyScans = scans.filter((s) =>
    s.disease.toLowerCase().includes("healthy")
  ).length;
  
  const healthRate = scans.length > 0 
    ? Math.round((healthyScans / scans.length) * 100) 
    : 100; // Default to 100% if no scans yet

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, {displayName}!</Text>
              <Text style={styles.subGreeting}>Let's check your plants</Text>
            </View>

            {/* Header Button (Settings Only - Logout Removed) */}
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => router.push("/settings")}
              >
                <Ionicons name="settings-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Container */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Feather name="layers" size={16} color="#A5D6A7" />
                <Text style={styles.statLabel}> Total Scans</Text>
              </View>
              <Text style={styles.statValue}>{scans.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Feather name="activity" size={16} color="#A5D6A7" />
                <Text style={styles.statLabel}> Health Rate</Text>
              </View>
              <Text style={styles.statValue}>{healthRate}%</Text>
            </View>
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => router.push("/upload")}
        >
          <Ionicons
            name="camera-outline"
            size={28}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.scanBtnText}>Scan New Plant</Text>
        </TouchableOpacity>

        {/* Recent Scans Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity onPress={() => router.push("/history")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {scans.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="camera" size={40} color="#ddd" />
              <Text style={styles.emptyText}>No scans yet. Start scanning!</Text>
            </View>
          ) : (
            scans.slice(0, 5).map((scan) => (
              <View key={scan.id} style={styles.recentItem}>
                <Image
                  source={{ uri: scan.imageUri }}
                  style={styles.plantImage}
                />
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{scan.disease}</Text>
                  <Text style={styles.timeAgo}>{scan.date}</Text>
                </View>
                <View
                  style={[
                    styles.checkCircle,
                    { backgroundColor: (scan.color || "#FF9800") + "20" },
                  ]}
                >
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={scan.color || "#FF9800"}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="leaf" size={24} color="#00C853" />
          <Text style={[styles.navText, { color: "#00C853" }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/history")}
        >
          <MaterialCommunityIcons name="history" size={24} color="#ccc" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centerNavItem}
          onPress={() => router.push("/upload")}
        >
          <View style={styles.centerNavBtn}>
            <Ionicons name="camera" size={28} color="white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            Alert.alert("Coming Soon", "Community features coming soon!")
          }
        >
          <Ionicons name="people-outline" size={24} color="#ccc" />
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/settings")}
        >
          <Ionicons name="settings-outline" size={24} color="#ccc" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: "#006d38",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subGreeting: {
    color: "#A5D6A7",
    fontSize: 14,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 50,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statCard: {
    alignItems: "flex-start",
    flex: 1,
    paddingHorizontal: 10,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    color: "#A5D6A7",
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  scanBtn: {
    backgroundColor: "#00C853",
    marginHorizontal: 20,
    marginTop: 25,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00C853",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  scanBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  recentSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    color: "#00C853",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 20,
    opacity: 0.6,
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  plantImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  plantInfo: {
    flex: 1,
    marginLeft: 15,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end", 
    paddingBottom: 25, 
    paddingTop: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navText: {
    fontSize: 10,
    color: "#ccc",
    marginTop: 6,
    fontWeight: "500",
  },
  centerNavItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 20, 
  },
  centerNavBtn: {
    backgroundColor: "#00C853",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00C853",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    top: -5,
  },
});