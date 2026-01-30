import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp, Colors } from './context'; // Import Context

export default function HistoryScreen() {
  const router = useRouter();
  const { history, isDarkMode, clearHistory } = useApp(); // You might want to add a deleteOne function to context later
  
  // State for Search and Filters
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Healthy', 'Diseased'

  // Dynamic Theme
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const textColor = theme.text;
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';

  // 🔍 Filter Logic
  const filteredData = history.filter(item => {
    // 1. Text Search
    const matchesSearch = item.disease.toLowerCase().includes(searchText.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()));
    
    // 2. Category Filter
    let matchesFilter = true;
    if (activeFilter === 'Healthy') matchesFilter = item.disease === 'Healthy Plant';
    if (activeFilter === 'Diseased') matchesFilter = item.disease !== 'Healthy Plant';

    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    // In a real app, you'd call a delete function from context.
    // For now, we'll just show an alert since we only implemented clearHistory globally.
    Alert.alert("Delete", "Delete feature would remove this item.");
  };

  const renderItem = ({ item }: { item: any }) => {
    const isHealthy = item.disease === 'Healthy Plant';
    
    return (
      <View style={styles.itemWrapper}>
        {/* Date Header above card */}
        <View style={styles.dateHeader}>
          <Feather name="calendar" size={14} color="#888" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {/* Main Card */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          {/* Left: Image */}
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />

          {/* Middle: Info */}
          <View style={styles.cardInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.plantName, { color: textColor }]}>
                {isHealthy ? "Plant" : "Infected"}
              </Text>
              {/* Status Icon */}
              <View style={[styles.statusIcon, { backgroundColor: isHealthy ? '#E8F5E9' : '#FFEBEE' }]}>
                {isHealthy ? (
                   <Ionicons name="leaf" size={12} color="#4CAF50" />
                ) : (
                   <Ionicons name="alert-circle" size={12} color="#FF5252" />
                )}
              </View>
            </View>
            
            <Text style={styles.diseaseName} numberOfLines={1}>{item.disease}</Text>
            <Text style={styles.confidence}>Confidence: {item.confidence}</Text>
          </View>

          {/* Right: Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.viewBtn} 
              onPress={() => router.push({ pathname: '/result', params: { ...item } })}
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
              <Feather name="trash-2" size={18} color="#7E57C2" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F9F9F9' }]}>
      
      {/* 1. Green Header Area */}
      <View style={styles.header}>
        {/* Top Nav */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan History</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="rgba(255,255,255,0.7)" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by plant or disease..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {['All', 'Healthy', 'Diseased'].map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles.filterChip, 
                activeFilter === filter ? styles.activeChip : styles.inactiveChip
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText, 
                activeFilter === filter ? styles.activeFilterText : styles.inactiveFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. List Content */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#006d38', // Dark Green
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: 'white',
  },
  inactiveChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#006d38',
  },
  inactiveFilterText: {
    color: 'rgba(255,255,255,0.9)',
  },
  listContent: {
    padding: 20,
    paddingTop: 25,
  },
  itemWrapper: {
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 6,
    fontWeight: '500',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diseaseName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  confidence: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 70, 
    paddingVertical: 2,
  },
  viewBtn: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#F3E5F5', // Light purple
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },
});