import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function NotificationScreen() {
  const { isDark } = useTheme();
  const notifications = [
    {
      id: 1,
      user: 'Mr.Jimmy',
      message: 'Started following you.',
      time: '5 hour ago',
      avatar: require('@/assets/images/h1.png.png'),
      type: 'follow',
      hasAction: false
    },
    {
      id: 2,
      user: 'Roy niger',
      message: 'stared live video',
      time: '30 min ago',
      avatar: require('@/assets/images/h2.png.png'),
      type: 'live',
      hasAction: false
    },
    {
      id: 3,
      user: 'James anderson',
      message: 'want to join your live stream.',
      time: '30 min ago',
      avatar: require('@/assets/images/h3.png.png'),
      type: 'request',
      hasAction: true
    },
    {
      id: 4,
      user: 'Sarah Wilson',
      message: 'liked your live stream.',
      time: '1 hour ago',
      avatar: require('@/assets/images/h4.png.png'),
      type: 'like',
      hasAction: false
    },
    {
      id: 5,
      user: 'Mike Johnson',
      message: 'sent you a gift.',
      time: '2 hours ago',
      avatar: require('@/assets/images/h1.png.png'),
      type: 'gift',
      hasAction: false
    }
  ];

  const renderNotification = (notification) => (
    <TouchableOpacity key={notification.id} style={[styles.notificationItem, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}>
      <View style={styles.avatarContainer}>
        <Image source={notification.avatar} style={styles.avatar} />
        {notification.type === 'follow' && (
          <View style={styles.followBadge}>
            <Ionicons name="person-add" size={12} color="white" />
          </View>
        )}
        {notification.type === 'live' && (
          <View style={styles.liveBadge}>
            <Ionicons name="videocam" size={12} color="white" />
          </View>
        )}
        {notification.type === 'like' && (
          <View style={styles.likeBadge}>
            <Ionicons name="heart" size={12} color="white" />
          </View>
        )}
        {notification.type === 'gift' && (
          <View style={styles.giftBadge}>
            <Ionicons name="gift" size={12} color="white" />
          </View>
        )}
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.messageContainer}>
          <Text style={styles.notificationText}>
            <Text style={[styles.userName, { color: isDark ? 'white' : '#333' }]}>{notification.user} </Text>
            <Text style={[styles.messageText, { color: isDark ? '#ccc' : '#666' }]}>{notification.message}</Text>
          </Text>
          <Text style={[styles.timeText, { color: isDark ? '#888' : '#999' }]}>{notification.time}</Text>
        </View>
        
        {notification.hasAction && (
          <TouchableOpacity style={styles.acceptButton}>
            <LinearGradient
              colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
              style={styles.acceptButtonGradient}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={16} color={isDark ? '#ccc' : '#666'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f9fa' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Modern Header */}
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isDark ? 'black' : 'white'} />
          </TouchableOpacity>
          
          <View style={styles.logoSection}>
            <Text style={[styles.appTitle, { color: isDark ? 'black' : 'white' }]}>Notifications</Text>
          </View>
          
          <View style={styles.headerActions}>
          </View>
        </View>
      </LinearGradient>
      
      {/* Notifications List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.notificationsList}>
          {notifications.map(renderNotification)}
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
    paddingTop: height * 0.06,
    paddingBottom: height * 0.025,
    paddingHorizontal: width * 0.05,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
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
    width: 40,
  },
  content: {
    flex: 1,
    paddingBottom: height * 0.1,
  },
  notificationsList: {
    paddingTop: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  followBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F7C14D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  liveBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  likeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  giftBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffd93d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageContainer: {
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  userName: {
    fontWeight: 'bold',
  },
  messageText: {
    fontWeight: '400',
  },
  timeText: {
    fontSize: 12,
  },
  acceptButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  acceptButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  moreButton: {
    padding: 8,
  },
});