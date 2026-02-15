import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppContextType {
  user: any | null;
  isLoading: boolean;
  isOnboarded: boolean;
  isDarkMode: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetApp: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  scans: any[];
  addScan: (scan: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // const savedUser = await AsyncStorage.getItem("user");
        // const savedOnboarding = await AsyncStorage.getItem("hasOnboarded");
        const savedDarkMode = await AsyncStorage.getItem("isDarkMode");
        // if (savedUser) setUser(JSON.parse(savedUser));
        // if (savedOnboarding === "true") setIsOnboarded(true);
        if (savedDarkMode === "true") setIsDarkMode(true);
      } catch (e) {
        console.error("Load error", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const login = async (email: string) => {
    const fakeUser = { email, displayName: email.split("@")[0] };
    setUser(fakeUser);
    await AsyncStorage.setItem("user", JSON.stringify(fakeUser));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  const completeOnboarding = async () => {
    setIsOnboarded(true);
    await AsyncStorage.setItem("hasOnboarded", "true");
  };

  const resetApp = async () => {
    setUser(null);
    setIsOnboarded(false);
    setIsDarkMode(false);
    await AsyncStorage.clear();
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("isDarkMode", newMode.toString());
  };

  const addScan = (scan: any) => setScans([scan, ...scans]);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        isOnboarded,
        isDarkMode,
        login,
        logout,
        completeOnboarding,
        resetApp,
        toggleTheme,
        scans,
        addScan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
