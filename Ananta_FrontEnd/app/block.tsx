import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Dimensions, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');

export default function BlockScreen() {
  const { isDark } = useTheme();
  const [blockedUsers, setBlockedUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      username: '@johndoe',
      image: require('@/assets/images/h1.png.png'),
      blockedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: '@janesmith',
      image: require('@/assets/images/h2.png.png'),
      blockedDate: '2024-01-10'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      username: '@mikej',
      image: require('@/assets/images/h1.png.png'),
      blockedDate: '2024-01-05'
    }
  ]);

  const handleUnblock = (userId: number, userName: string) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          style: 'destructive',
          onPress: () => {
            setBlockedUsers(prev => prev.filter(user => user.id !== userId));
            Alert.alert(
              'Success',
              `${userName} has been unblocked successfully!`,
              [{ text: 'OK' }]
            );
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
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Blocked Users</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <LinearGradient
          colors={isDark ? ['#F7C14D', '#E6B143'] : ['#127d96', '#0a5d75']}
          style={styles.infoCard}
        >
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle" size={24} color={isDark ? 'black' : 'white'} />
          </View>
          <ThemedText style={[styles.infoText, { color: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }]}>
            Blocked users cannot send you messages or see your profile. You can unblock them anytime.
          </ThemedText>
        </LinearGradient>
        
        {blockedUsers.length > 0 ? (
          <View style={styles.usersList}>
            {blockedUsers.map((user) => (
              <View key={user.id} style={[styles.userItem, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                <View style={styles.userLeft}>
                  <View style={styles.imageContainer}>
                    <Image source={user.image} style={styles.profileImage} />
                    <View style={styles.blockedBadge}>
                      <Ionicons name="ban" size={12} color="white" />
                    </View>
                  </View>
                  <View style={styles.userInfo}>
                    <ThemedText style={[styles.userName, { color: isDark ? 'white' : '#333' }]}>{user.name}</ThemedText>
                    <ThemedText style={[styles.userHandle, { color: isDark ? '#ccc' : '#666' }]}>{user.username}</ThemedText>
                    <View style={styles.blockedInfo}>
                      <Ionicons name="time" size={12} color={isDark ? '#999' : '#888'} />
                      <ThemedText style={[styles.blockedDate, { color: isDark ? '#999' : '#888' }]}>
                        Blocked on {new Date(user.blockedDate).toLocaleDateString()}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.unblockButton}
                  onPress={() => handleUnblock(user.id, user.name)}
                >
                  <LinearGradient
                    colors={['#DC3545', '#C82333']}
                    style={styles.unblockButtonGradient}
                  >
                    <Ionicons name="checkmark-circle" size={16} color="white" />
                    <ThemedText style={styles.unblockText}>Unblock</ThemedText>
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
              No blocked users
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: isDark ? '#999' : '#888' }]}>
              Users you block will appear here and you can unblock them anytime
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
  infoCard: {
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
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
  blockedBadge: {
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
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 14,
    marginBottom: 6,
  },
  blockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  blockedDate: {
    fontSize: 12,
  },
  unblockButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  unblockButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 6,
  },
  unblockText: {
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