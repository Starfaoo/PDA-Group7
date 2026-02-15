import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppContextType {
  user: any | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetApp: () => Promise<void>;
  scans: any[];
  addScan: (scan: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // const savedUser = await AsyncStorage.getItem("user");
        // const savedOnboarding = await AsyncStorage.getItem("hasOnboarded");
        // if (savedUser) setUser(JSON.parse(savedUser));
        // if (savedOnboarding === "true") setIsOnboarded(true);
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
    await AsyncStorage.clear();
  };

  const addScan = (scan: any) => setScans([scan, ...scans]);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        isOnboarded,
        login,
        logout,
        completeOnboarding,
        resetApp,
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
