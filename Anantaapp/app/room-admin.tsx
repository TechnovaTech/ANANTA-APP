import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function RoomAdminScreen() {
  const { isDark } = useTheme();
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [giftEnabled, setGiftEnabled] = useState(true);

  const roomUsers = [
    {
      id: 1,
      name: 'Micale Clarke',
      role: 'Host',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      isMuted: false,
      isBlocked: false
    },
    {
      id: 2,
      name: 'John Smith',
      role: 'Moderator',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      isMuted: false,
      isBlocked: false
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      role: 'Viewer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      isMuted: true,
      isBlocked: false
    },
    {
      id: 4,
      name: 'Mike Johnson',
      role: 'Viewer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      isMuted: false,
      isBlocked: false
    }
  ];

  const renderUser = (user) => (
    <View key={user.id} style={[styles.userItem, { backgroundColor: isDark ? '#333' : 'white' }]}>
      <View style={styles.userLeft}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
          <View style={[styles.roleIndicator, { backgroundColor: user.role === 'Host' ? (isDark ? '#F7C14D' : '#127d96') : user.role === 'Moderator' ? '#FF6B35' : '#6C757D' }]}>
            <Ionicons 
              name={user.role === 'Host' ? 'crown' : user.role === 'Moderator' ? 'shield' : 'person'} 
              size={10} 
              color="white" 
            />
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: isDark ? 'white' : '#333' }]}>{user.name}</Text>
          <Text style={[styles.userRole, { color: user.role === 'Host' ? (isDark ? '#F7C14D' : '#127d96') : user.role === 'Moderator' ? '#FF6B35' : '#6C757D' }]}>{user.role}</Text>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity style={[styles.actionBtn, user.isMuted && styles.mutedBtn]}>
          <Ionicons 
            name={user.isMuted ? "mic-off" : "mic"} 
            size={16} 
            color={user.isMuted ? "#DC3545" : (isDark ? '#F7C14D' : '#127d96')} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="ban" size={16} color="#DC3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? 'black' : 'white'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Room Admin</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live Stats */}
        <LinearGradient
          colors={isDark ? ['#F7C14D', '#E6B143'] : ['#127d96', '#0a5d75']}
          style={styles.statsCard}
        >
          <Text style={styles.statsTitle}>Live Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={20} color="white" />
              <Text style={styles.statNumber}>1.2K</Text>
              <Text style={styles.statLabel}>Viewers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="heart" size={20} color="white" />
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="gift" size={20} color="white" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Gifts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time" size={20} color="white" />
              <Text style={styles.statNumber}>2:15</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Room Controls */}
        <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Room Controls</Text>
          
          <View style={styles.controlItem}>
            <View style={styles.controlLeft}>
              <View style={[styles.controlIcon, { backgroundColor: isDark ? 'rgba(247, 193, 77, 0.1)' : 'rgba(18, 125, 150, 0.1)' }]}>
                <Ionicons name="mic" size={20} color={micEnabled ? (isDark ? '#F7C14D' : '#127d96') : "#6C757D"} />
              </View>
              <Text style={[styles.controlText, { color: isDark ? 'white' : '#333' }]}>Enable Microphone</Text>
            </View>
            <Switch
              value={micEnabled}
              onValueChange={setMicEnabled}
              trackColor={{ false: '#e9ecef', true: isDark ? '#F7C14D' : '#127d96' }}
              thumbColor={micEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.controlItem}>
            <View style={styles.controlLeft}>
              <View style={[styles.controlIcon, { backgroundColor: isDark ? 'rgba(247, 193, 77, 0.1)' : 'rgba(18, 125, 150, 0.1)' }]}>
                <Ionicons name="videocam" size={20} color={cameraEnabled ? (isDark ? '#F7C14D' : '#127d96') : "#6C757D"} />
              </View>
              <Text style={[styles.controlText, { color: isDark ? 'white' : '#333' }]}>Enable Camera</Text>
            </View>
            <Switch
              value={cameraEnabled}
              onValueChange={setCameraEnabled}
              trackColor={{ false: '#e9ecef', true: isDark ? '#F7C14D' : '#127d96' }}
              thumbColor={cameraEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.controlItem}>
            <View style={styles.controlLeft}>
              <View style={[styles.controlIcon, { backgroundColor: isDark ? 'rgba(247, 193, 77, 0.1)' : 'rgba(18, 125, 150, 0.1)' }]}>
                <Ionicons name="chatbubbles" size={20} color={chatEnabled ? (isDark ? '#F7C14D' : '#127d96') : "#6C757D"} />
              </View>
              <Text style={[styles.controlText, { color: isDark ? 'white' : '#333' }]}>Enable Chat</Text>
            </View>
            <Switch
              value={chatEnabled}
              onValueChange={setChatEnabled}
              trackColor={{ false: '#e9ecef', true: isDark ? '#F7C14D' : '#127d96' }}
              thumbColor={chatEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.controlItem}>
            <View style={styles.controlLeft}>
              <View style={[styles.controlIcon, { backgroundColor: isDark ? 'rgba(247, 193, 77, 0.1)' : 'rgba(18, 125, 150, 0.1)' }]}>
                <Ionicons name="gift" size={20} color={giftEnabled ? (isDark ? '#F7C14D' : '#127d96') : "#6C757D"} />
              </View>
              <Text style={[styles.controlText, { color: isDark ? 'white' : '#333' }]}>Enable Gifts</Text>
            </View>
            <Switch
              value={giftEnabled}
              onValueChange={setGiftEnabled}
              trackColor={{ false: '#e9ecef', true: isDark ? '#F7C14D' : '#127d96' }}
              thumbColor={giftEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Users Management */}
        <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Users in Room</Text>
            <View style={styles.userCount}>
              <Text style={styles.userCountText}>{roomUsers.length}</Text>
            </View>
          </View>
          <View style={styles.usersList}>
            {roomUsers.map(renderUser)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="people" size={20} color={isDark ? 'black' : 'white'} />
              <Text style={[styles.actionButtonText, { color: isDark ? 'black' : 'white' }]}>Invite Users</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#DC3545', '#C82333']}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="stop-circle" size={20} color="white" />
              <Text style={styles.actionButtonText}>End Stream</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statsCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userCount: {
    backgroundColor: '#127d96',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  userCountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controlItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  controlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  controlIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 125, 150, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  controlText: {
    fontSize: 16,
    fontWeight: '500',
  },
  usersList: {
    gap: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#127d96',
  },
  roleIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
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
    fontWeight: '600',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    fontWeight: '500',
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  mutedBtn: {
    backgroundColor: '#ffe6e6',
    borderColor: '#DC3545',
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});