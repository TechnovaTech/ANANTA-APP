import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Dimensions, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');

export default function BandScreen() {
  const { isDark } = useTheme();
  const [bannedUsers, setBannedUsers] = useState([
    {
      id: 1,
      name: 'Alex Wilson',
      username: '@alexw',
      image: require('@/assets/images/h1.png.png'),
      bannedDate: '2024-01-20',
      reason: 'Inappropriate behavior',
      duration: 'Permanent'
    },
    {
      id: 2,
      name: 'Sarah Connor',
      username: '@sarahc',
      image: require('@/assets/images/h2.png.png'),
      bannedDate: '2024-01-18',
      reason: 'Spam messages',
      duration: '7 days'
    },
    {
      id: 3,
      name: 'Tom Brown',
      username: '@tombrown',
      image: require('@/assets/images/h1.png.png'),
      bannedDate: '2024-01-15',
      reason: 'Harassment',
      duration: '30 days'
    }
  ]);

  const handleUnban = (userId: number, userName: string) => {
    Alert.alert(
      'Unban User',
      `Are you sure you want to unban ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unban',
          style: 'destructive',
          onPress: () => {
            setBannedUsers(prev => prev.filter(user => user.id !== userId));
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? 'black' : 'white'} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Banned Users</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {bannedUsers.length > 0 ? (
          <View style={styles.usersList}>
            {bannedUsers.map((user) => (
              <View key={user.id} style={[styles.userItem, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                <View style={styles.userLeft}>
                  <View style={styles.imageContainer}>
                    <Image source={user.image} style={styles.profileImage} />
                    <View style={styles.bannedBadge}>
                      <Ionicons name="ban" size={12} color="white" />
                    </View>
                  </View>
                  <View style={styles.userInfo}>
                    <View style={styles.userHeader}>
                      <ThemedText style={[styles.userName, { color: isDark ? 'white' : '#333' }]}>{user.name}</ThemedText>
                      <View style={styles.banBadge}>
                        <ThemedText style={styles.banText}>BANNED</ThemedText>
                      </View>
                    </View>
                    <ThemedText style={[styles.userHandle, { color: isDark ? '#ccc' : '#666' }]}>{user.username}</ThemedText>
                    <View style={styles.reasonContainer}>
                      <Ionicons name="warning" size={12} color="#DC3545" />
                      <ThemedText style={styles.reason}>
                        {user.reason}
                      </ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                      <View style={styles.durationInfo}>
                        <Ionicons name="time" size={12} color={isDark ? '#999' : '#888'} />
                        <ThemedText style={[styles.duration, { color: isDark ? '#999' : '#888' }]}>
                          {user.duration}
                        </ThemedText>
                      </View>
                      <ThemedText style={[styles.bannedDate, { color: isDark ? '#999' : '#888' }]}>
                        {new Date(user.bannedDate).toLocaleDateString()}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.unbanButton}
                  onPress={() => handleUnban(user.id, user.name)}
                >
                  <LinearGradient
                    colors={['#28A745', '#20C997']}
                    style={styles.unbanButtonGradient}
                  >
                    <Ionicons name="checkmark-circle" size={16} color="white" />
                    <ThemedText style={styles.unbanText}>Unban</ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="ban" size={64} color={isDark ? '#555' : '#ccc'} />
            </View>
            <ThemedText style={[styles.emptyText, { color: isDark ? '#ccc' : '#666' }]}>
              No banned users
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: isDark ? '#999' : '#888' }]}>
              Users who are banned will appear here
            </ThemedText>
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  usersList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bannedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#DC3545',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  banBadge: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  banText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userHandle: {
    fontSize: 14,
    marginBottom: 6,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  reason: {
    fontSize: 13,
    fontWeight: '500',
    color: '#DC3545',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
  },
  bannedDate: {
    fontSize: 12,
  },
  unbanButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  unbanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 6,
  },
  unbanText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});