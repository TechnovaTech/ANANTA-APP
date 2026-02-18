import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');

export default function MessagesScreen() {
  const { isDark } = useTheme();
  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'Hey! How are you doing?',
      time: '2:30 PM',
      unread: 2,
      avatar: require('@/assets/images/h1.png.png'),
      isOnline: true
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      lastMessage: 'Thanks for the help yesterday!',
      time: '1:45 PM',
      unread: 0,
      avatar: require('@/assets/images/h2.png.png'),
      isOnline: true
    },
    {
      id: 3,
      name: 'Mike Johnson',
      lastMessage: 'See you tomorrow at the meeting',
      time: '12:20 PM',
      unread: 1,
      avatar: require('@/assets/images/h3.png.png'),
      isOnline: false
    },
    {
      id: 4,
      name: 'Emma Davis',
      lastMessage: 'Can you send me the documents?',
      time: '11:30 AM',
      unread: 0,
      avatar: require('@/assets/images/h4.png.png'),
      isOnline: true
    },
    {
      id: 5,
      name: 'Alex Brown',
      lastMessage: 'Great job on the presentation!',
      time: 'Yesterday',
      unread: 0,
      avatar: require('@/assets/images/h1.png.png'),
      isOnline: false
    },
  ];

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
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Messages</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.conversationsContainer} showsVerticalScrollIndicator={false}>
        {conversations.map((conversation) => (
          <TouchableOpacity key={conversation.id} style={[styles.conversationItem, { 
            backgroundColor: isDark ? '#2a2a2a' : 'white'
          }]}>
            <View style={styles.avatarContainer}>
              <Image source={conversation.avatar} style={[styles.avatar, { borderColor: isDark ? '#f7c14d' : '#127d96' }]} />
              {conversation.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <ThemedText style={[styles.userName, { color: isDark ? 'white' : '#333' }]}>{conversation.name}</ThemedText>
                <ThemedText style={[styles.messageTime, { color: isDark ? '#ccc' : '#666' }]}>{conversation.time}</ThemedText>
              </View>
              <View style={styles.messageRow}>
                <ThemedText style={[styles.lastMessage, { color: isDark ? '#aaa' : '#666' }]} numberOfLines={1}>
                  {conversation.lastMessage}
                </ThemedText>
                {conversation.unread > 0 && (
                  <LinearGradient
                    colors={isDark ? ['#f7c14d', '#ffb300'] : ['#127d96', '#15a3c7']}
                    style={styles.unreadBadge}
                  >
                    <ThemedText style={[styles.unreadCount, { color: isDark ? 'black' : 'white' }]}>{conversation.unread}</ThemedText>
                  </LinearGradient>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  conversationsContainer: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: '#127d96',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#28a745',
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
  },
  messageTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 15,
    flex: 1,
    marginRight: 10,
    lineHeight: 20,
  },
  unreadBadge: {
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});