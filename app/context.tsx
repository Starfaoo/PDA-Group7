import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Define what a "Scan" looks like
export type ScanResult = {
  id: string;
  date: string;
  disease: string;
  confidence: string;
  imageUri: string;
  description?: string;
  treatment?: string;
  color: string; // Color code for the disease status
};

// 2. Define the Context
type AppContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  history: ScanResult[];
  addScan: (scan: ScanResult) => void;
  clearHistory: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// 3. Create the Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState<ScanResult[]>([]);

  // Load saved data on startup
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    const savedHistory = await AsyncStorage.getItem('scanHistory');
    if (savedTheme === 'dark') setIsDarkMode(true);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const addScan = async (scan: ScanResult) => {
    const newHistory = [scan, ...history]; // Add to top of list
    setHistory(newHistory);
    await AsyncStorage.setItem('scanHistory', JSON.stringify(newHistory));
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem('scanHistory');
  };

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, history, addScan, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
}

// 4. Custom Hook for easy access
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}

// 5. Theme Colors Helper
export const Colors = {
  light: { background: '#fff', text: '#333', card: '#f9f9f9', tint: '#00C853' },
  dark: { background: '#121212', text: '#fff', card: '#1E1E1E', tint: '#00E676' }
};