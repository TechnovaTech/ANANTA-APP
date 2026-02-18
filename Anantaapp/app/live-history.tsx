import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useMemo } from 'react';

const { width } = Dimensions.get('window');



export default function LiveHistoryScreen() {
  const { isDark } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [showSidebar, setShowSidebar] = useState(false);

  const months = [
    'All Months',
    'Jan 2024',
    'Feb 2024', 
    'Mar 2024',
    'Apr 2024',
    'May 2024',
    'Jun 2024',
    'Jul 2024',
    'Aug 2024',
    'Sep 2024',
    'Oct 2024',
    'Nov 2024',
    'Dec 2024'
  ];

  const allHistoryItems = [
    {
      id: 1,
      title: 'Music Chat',
      date: 'Sep 11, 45 min.',
      month: 'Sep 2024',
      image: require('@/assets/images/h1.png.png')
    },
    {
      id: 2,
      title: 'Game Stream',
      date: 'Sep 11, 45 min.',
      month: 'Sep 2024',
      image: require('@/assets/images/h2.png.png')
    },
    {
      id: 3,
      title: 'Talk Show',
      date: 'Aug 25, 30 min.',
      month: 'Aug 2024',
      image: require('@/assets/images/h1.png.png')
    },
    {
      id: 4,
      title: 'Comedy Night',
      date: 'Aug 20, 60 min.',
      month: 'Aug 2024',
      image: require('@/assets/images/h2.png.png')
    },
    {
      id: 5,
      title: 'Dance Party',
      date: 'Jul 15, 90 min.',
      month: 'Jul 2024',
      image: require('@/assets/images/h1.png.png')
    }
  ];

  const filteredHistoryItems = useMemo(() => {
    if (selectedMonth === 'All Months') {
      return allHistoryItems;
    }
    return allHistoryItems.filter(item => item.month === selectedMonth);
  }, [selectedMonth]);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setShowSidebar(false);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      <LinearGradient
        colors={isDark ? ['#f7c14d', '#ffb300'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? 'black' : 'white'} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Live Data & History</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={[styles.filterContainer, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}>
        <TouchableOpacity 
          style={[styles.monthPicker, { 
            backgroundColor: isDark ? '#333' : '#f0f0f0',
            borderColor: isDark ? '#f7c14d' : '#127d96'
          }]}
          onPress={() => setShowSidebar(!showSidebar)}
        >
          <ThemedText style={[styles.monthPickerText, { color: isDark ? 'white' : '#333' }]}>
            {selectedMonth}
          </ThemedText>
          <Ionicons name="chevron-down" size={16} color={isDark ? 'white' : '#333'} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={[styles.contentWrapper, showSidebar && styles.dimmed]}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {filteredHistoryItems.length > 0 ? (
              filteredHistoryItems.map((item) => (
                <TouchableOpacity key={item.id} style={[styles.historyItem, { 
                  backgroundColor: isDark ? '#333' : '#F5F5F5',
                  borderColor: isDark ? '#f7c14d' : '#126996'
                }]}>
                  <Image source={item.image} style={styles.profileImage} />
                  <View style={styles.textContainer}>
                    <ThemedText style={[styles.historyTitle, { color: isDark ? 'white' : 'black' }]}>{item.title}</ThemedText>
                    <ThemedText style={[styles.historyDate, { color: isDark ? '#ccc' : '#666' }]}>{item.date}</ThemedText>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <ThemedText style={[styles.noDataText, { color: isDark ? '#ccc' : '#666' }]}>
                  No live history found for {selectedMonth}
                </ThemedText>
              </View>
            )}
          </ScrollView>
        </View>

        {showSidebar && (
          <>
            <TouchableOpacity 
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setShowSidebar(false)}
            />
            <View style={[styles.sidebar, { 
              backgroundColor: isDark ? '#333' : '#f8f9fa',
              borderLeftColor: isDark ? '#f7c14d' : '#127d96'
            }]}>
              <ThemedText style={[styles.sidebarTitle, { color: isDark ? 'white' : '#333' }]}>Filter</ThemedText>
              <ScrollView showsVerticalScrollIndicator={false}>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[styles.monthOption, {
                      backgroundColor: selectedMonth === month ? (isDark ? '#f7c14d' : '#127d96') : 'transparent'
                    }]}
                    onPress={() => handleMonthSelect(month)}
                  >
                    <ThemedText style={[styles.monthOptionText, { 
                      color: selectedMonth === month ? (isDark ? 'black' : 'white') : (isDark ? '#ccc' : '#333'),
                      fontWeight: selectedMonth === month ? 'bold' : 'normal'
                    }]}>
                      {month}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    height: 120,
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  monthPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  monthPickerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  contentWrapper: {
    flex: 1,
  },
  dimmed: {
    opacity: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    borderLeftWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  monthOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  monthOptionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 12,
    borderWidth: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
  },
});