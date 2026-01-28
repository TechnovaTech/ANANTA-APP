import { StyleSheet, TouchableOpacity, View, StatusBar, Text, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LiveScreen() {
  const { isDark } = useTheme();
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | null>(null);

  const handleStartLive = () => {
    if (selectedType === 'video') {
      router.push('/live/video');
    } else if (selectedType === 'audio') {
      router.push('/live/audio');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f9fa' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Modern Header */}
      <LinearGradient
        colors={isDark ? ['#f7c14d', '#ffb300'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            <Text style={[styles.appTitle, { color: isDark ? 'black' : 'white' }]}>ANANTA</Text>
          </View>
        </View>
      </LinearGradient>
      


      <View style={styles.content}>
        <View style={styles.liveOptions}>
          <TouchableOpacity 
            style={[styles.liveOption, selectedType === 'video' && styles.selectedOption]}
            onPress={() => setSelectedType('video')}
          >
            <View style={[styles.optionIcon, { borderColor: isDark ? '#f7c14d' : Colors.light.primary }, selectedType === 'video' && { backgroundColor: isDark ? '#f7c14d' : Colors.light.primary }]}>
              <ThemedText style={styles.optionIconText}>📹</ThemedText>
            </View>
            <ThemedText style={[styles.optionText, { color: isDark ? 'white' : 'black' }]}>Video live</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.liveOption, selectedType === 'audio' && styles.selectedOption]}
            onPress={() => setSelectedType('audio')}
          >
            <View style={[styles.optionIcon, { borderColor: isDark ? '#f7c14d' : Colors.light.primary }, selectedType === 'audio' && { backgroundColor: isDark ? '#f7c14d' : Colors.light.primary }]}>
              <ThemedText style={styles.optionIconText}>🎤</ThemedText>
            </View>
            <ThemedText style={[styles.optionText, { color: isDark ? 'white' : 'black' }]}>Audio live</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.startLiveButtonContainer}
          onPress={handleStartLive}
          disabled={!selectedType}
        >
          <LinearGradient
            colors={selectedType ? (isDark ? ['#f7c14d', '#ffb300'] : ['#127d96', '#15a3c7']) : ['#ccc', '#999']}
            style={styles.startLiveButton}
          >
            <ThemedText style={[styles.startLiveText, { color: selectedType && isDark ? 'black' : 'white' }]}>Start Live</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: height * 0.06,
    paddingBottom: height * 0.025,
    paddingHorizontal: width * 0.05,
  },
  headerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: width * 0.04,
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tabScrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(18,125,150,0.1)',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#127d96',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#127d96',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  liveOptions: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 80,
    justifyContent: 'center',
  },
  liveOption: {
    alignItems: 'center',
  },
  selectedOption: {
    opacity: 1,
  },
  optionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionIconText: {
    fontSize: 30,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
  startLiveButtonContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  startLiveButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startLiveText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});