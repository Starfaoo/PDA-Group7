import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, useApp } from "./context"; // Import Context

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, clearHistory } = useApp();

  // Dynamic Theme Colors
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const bgColor = isDarkMode ? "#121212" : "#F5F5F5";
  const sectionBg = isDarkMode ? "#1E1E1E" : "#FFFFFF";
  const textColor = theme.text;

  // ✅ LOGOUT: Navigate back to login
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear user session
            await AsyncStorage.removeItem("hasSeenOnboarding");
            // Force navigate to login
            router.push("/login");
          } catch (error) {
            router.push("/login");
          }
        },
      },
    ]);
  };

  // ⚠️ FACTORY RESET: Wipes Storage + Resets to Splash
  const handleFactoryReset = () => {
    Alert.alert(
      "Reset App",
      "This will permanently delete ALL data (scans, settings, onboarding status) and restart the app.\n\nAre you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Clear React State (Context)
              clearHistory();

              // 2. NUKE EVERYTHING from Storage
              await AsyncStorage.clear();

              // 3. Go to splash screen (index)
              router.push("/");
            } catch (error) {
              Alert.alert("Error", "Failed to reset data. Please try again.");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* 1. Green Header */}
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
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>johndoe@gmail.com</Text>
          </View>
          <Feather name="chevron-right" size={24} color="white" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Account */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={[styles.sectionContainer, { backgroundColor: sectionBg }]}>
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Alert.alert("Profile", "Edit profile feature coming soon!")
            }
          >
            <View style={styles.rowLeft}>
              <Feather name="user" size={20} color={textColor} />
              <View style={styles.rowTextContainer}>
                <Text style={[styles.rowTitle, { color: textColor }]}>
                  Profile
                </Text>
                <Text style={styles.rowSub}>Edit details</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="bell" size={20} color={textColor} />
              <Text
                style={[styles.rowTitle, { color: textColor, marginLeft: 15 }]}
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

        {/* 3. Preferences */}
        <Text style={styles.sectionHeader}>PREFERENCE</Text>
        <View style={[styles.sectionContainer, { backgroundColor: sectionBg }]}>
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Alert.alert("Language", "Language selection coming soon!")
            }
          >
            <View style={styles.rowLeft}>
              <Feather name="globe" size={20} color={textColor} />
              <View style={styles.rowTextContainer}>
                <Text style={[styles.rowTitle, { color: textColor }]}>
                  Language
                </Text>
                <Text style={styles.rowSub}>English</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="moon" size={20} color={textColor} />
              <Text
                style={[styles.rowTitle, { color: textColor, marginLeft: 15 }]}
              >
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: "#00C853" }}
            />
          </View>
        </View>

        {/* 4. About */}
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={[styles.sectionContainer, { backgroundColor: sectionBg }]}>
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Alert.alert("Privacy", "Privacy Policy content goes here.")
            }
          >
            <View style={styles.rowLeft}>
              <Feather name="shield" size={20} color={textColor} />
              <Text
                style={[styles.rowTitle, { color: textColor, marginLeft: 15 }]}
              >
                Privacy Policy
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Alert.alert("Help", "Support contact info goes here.")
            }
          >
            <View style={styles.rowLeft}>
              <Feather name="help-circle" size={20} color={textColor} />
              <Text
                style={[styles.rowTitle, { color: textColor, marginLeft: 15 }]}
              >
                Help & Support
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="info" size={20} color={textColor} />
              <View style={styles.rowTextContainer}>
                <Text style={[styles.rowTitle, { color: textColor }]}>
                  App Version
                </Text>
                <Text style={styles.rowSub}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. DANGER ZONE (Factory Reset) */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleFactoryReset}>
          <Feather
            name="trash-2"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.resetText}>Factory Reset App</Text>
        </TouchableOpacity>

        {/* 6. Logout */}
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
  rowSub: { fontSize: 12, color: "#999", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginLeft: 35 },

  // Factory Reset Button Style
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D32F2F", // Strong Red
    padding: 15,
    borderRadius: 15,
    marginTop: 30,
    elevation: 2,
  },
  resetText: { color: "white", fontSize: 16, fontWeight: "bold" },

  // Logout Button Style
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
