import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  StatusBar,
} from "react-native";
import { useApp } from "./context";

export default function SettingsScreen() {
  const router = useRouter();

  // Get everything we need from Context
  const { user, logout, isDarkMode, toggleTheme, resetApp } = useApp();

  // 1. LOGOUT
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            // Navigation will be handled by _layout.tsx based on auth state
          } catch (error) {
            // Error is handled in context, but good to have backup
          }
        },
      },
    ]);
  };

  // 2. FACTORY RESET
  const handleFactoryReset = () => {
    Alert.alert(
      "Factory Reset",
      "This will clear ALL data (including onboarding status) and log you out. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: async () => {
            try {
              await resetApp();
              // Force navigation to onboarding
              router.replace("/");
            } catch (error) {
              Alert.alert("Error", "Failed to reset device data.");
            }
          },
        },
      ],
    );
  };

  // 3. DYNAMIC THEME COLORS
  const theme = {
    bg: isDarkMode ? "#121212" : "#F5F5F5",
    cardBg: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#333333",
    subText: isDarkMode ? "#AAAAAA" : "#999999",
    icon: isDarkMode ? "#FFFFFF" : "#333333",
    divider: isDarkMode ? "#333333" : "#F0F0F0",
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Green Header */}
      <View style={styles.headerBackground}>
        <View style={styles.headerNav}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person-outline" size={24} color="white" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.displayName || user?.email?.split("@")[0] || "User"}
            </Text>
            <Text style={styles.profileEmail}>{user?.email || "No email"}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View
          style={[styles.sectionContainer, { backgroundColor: theme.cardBg }]}
        >
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert("Profile", "Edit profile coming soon!")}
          >
            <View style={styles.rowLeft}>
              <Feather name="user" size={20} color={theme.icon} />
              <View style={styles.rowTextContainer}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  Profile
                </Text>
                <Text style={[styles.rowSub, { color: theme.subText }]}>
                  Edit details
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="bell" size={20} color={theme.icon} />
              <Text
                style={[styles.rowTitle, { color: theme.text, marginLeft: 15 }]}
              >
                Notifications
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: "#767577", true: "#00C853" }}
            />
          </View>
        </View>

        {/* PREFERENCE SECTION */}
        <Text style={styles.sectionHeader}>PREFERENCE</Text>
        <View
          style={[styles.sectionContainer, { backgroundColor: theme.cardBg }]}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather
                name={isDarkMode ? "moon" : "sun"}
                size={20}
                color={theme.icon}
              />
              <Text
                style={[styles.rowTitle, { color: theme.text, marginLeft: 15 }]}
              >
                Dark Mode
              </Text>
            </View>
            {/* THEME TOGGLE SWITCH */}
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: "#00C853" }}
            />
          </View>
        </View>

        {/* ABOUT SECTION */}
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View
          style={[styles.sectionContainer, { backgroundColor: theme.cardBg }]}
        >
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert("Privacy", "Standard Privacy Policy.")}
          >
            <View style={styles.rowLeft}>
              <Feather name="shield" size={20} color={theme.icon} />
              <Text
                style={[styles.rowTitle, { color: theme.text, marginLeft: 15 }]}
              >
                Privacy Policy
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="info" size={20} color={theme.icon} />
              <View style={styles.rowTextContainer}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>
                  App Version
                </Text>
                <Text style={[styles.rowSub, { color: theme.subText }]}>
                  1.0.0
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* FACTORY RESET */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleFactoryReset}>
          <Feather
            name="trash-2"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.resetText}>Factory Reset App</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather
            name="log-out"
            size={20}
            color="#E53935"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBackground: {
    backgroundColor: "#006d38",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "bold", color: "white" },
  profileEmail: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  sectionContainer: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowTextContainer: { marginLeft: 15 },
  rowTitle: { fontSize: 16, fontWeight: "500" },
  rowSub: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginLeft: 35 },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D32F2F",
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    elevation: 2,
  },
  resetText: { color: "white", fontSize: 16, fontWeight: "bold" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  logoutText: { color: "#E53935", fontSize: 16, fontWeight: "bold" },
});
