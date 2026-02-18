import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, TextInput, TouchableOpacity, View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function VideoLiveScreen() {
  const { isDark } = useTheme();
  const params = useLocalSearchParams();
  const title = params.title as string || '#Love me like you do';
  const user = params.user as string || 'Micale clarke';
  const location = params.location as string || 'Location';
  const views = params.views as string || '20';
  
  const [likes, setLikes] = useState(15000);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<any[]>([]);
  
  const [liveComments, setLiveComments] = useState<any[]>([
    { id: 1, user: 'Johnson joy', message: 'Great stream!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
    { id: 2, user: 'Henny', message: 'Love this song', avatar: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e0e0?w=50' },
    { id: 3, user: 'Mike', message: 'Amazing performance!', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50' }
  ]);
  const [messageText, setMessageText] = useState('');
  const animatedValues = useRef<{[key: number]: Animated.Value}>({});
  
  const comments = [
    { id: 1, user: 'Johnson joy', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
    { id: 2, user: 'Johnson joy', message: 'Hi micale john', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
    { id: 3, user: 'Henny', message: 'Hi', avatar: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e0e0?w=50' },
    { id: 4, user: 'Johnson joy', message: 'How are you?', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
    { id: 5, user: 'Henny', message: 'Im good, How are you?', avatar: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e0e0?w=50' },
  ];

  const addFloatingHeart = () => {
    const newHeart = {
      id: Date.now(),
      bottom: Math.random() * 200 + 100,
      right: Math.random() * 50 + 20,
    };
    setFloatingHearts(prev => [...prev, newHeart]);
    
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
    }, 3000);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
    setIsLiked(true);
    addFloatingHeart();
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      const newComment = {
        id: Date.now(),
        user: 'You',
        message: messageText.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50'
      };
      setLiveComments(prev => [...prev, newComment].slice(-5));
      setMessageText('');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      const newComment = { ...randomComment, id: Date.now() };
      setLiveComments(prev => [...prev, newComment].slice(-5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Image 
        source={require('../../assets/images/video image.png')}
        style={styles.backgroundImage}
      />
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' }}
              style={styles.userAvatar}
            />
            <View style={styles.userDetails}>
              <ThemedText style={styles.username}>@{user}</ThemedText>
              <ThemedText style={styles.liveText}>{title}</ThemedText>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.followButton, { backgroundColor: isDark ? '#FFD700' : Colors.light.primary }, isFollowing && styles.followingButton]} onPress={handleFollow}>
              <ThemedText style={[styles.followText, { color: isDark ? 'black' : 'white' }, isFollowing && styles.followingText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.closeText}>×</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statIcon, { color: 'white' }]}>👁</ThemedText>
            <ThemedText style={styles.statText}>{views} Viewers</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statIcon}>💛</ThemedText>
            <ThemedText style={styles.statText}>{likes.toLocaleString()}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statIcon}>🎯</ThemedText>
            <ThemedText style={styles.statText}>55</ThemedText>
          </View>
        </View>

        <View style={styles.commentsSection}>
          {liveComments.map((comment) => (
            <View key={comment.id} style={styles.liveCommentItem}>
              <Image source={{ uri: comment.avatar }} style={styles.liveCommentAvatar} />
              <View style={styles.liveCommentContent}>
                <Text style={styles.liveCommentUser}>@{comment.user}</Text>
                <Text style={styles.liveCommentText}>{comment.message}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.floatingHeartsContainer}>
          {floatingHearts.map((heart) => (
            <View 
              key={heart.id} 
              style={[
                styles.floatingHeart,
                { bottom: heart.bottom, right: heart.right }
              ]}
            >
              <Text style={styles.heartEmoji}>❤️</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Say Something..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <ThemedText style={styles.sendIcon}>▶</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionIcon}>🎤</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionIcon}>🎁</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <ThemedText style={[styles.actionIcon, { color: isLiked ? '#ff4444' : 'white' }]}>❤️</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  userDetails: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  username: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
  followButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  followText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  followingButton: {
    backgroundColor: '#4CAF50',
  },
  followingText: {
    color: 'white',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  statText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  commentsSection: {
    position: 'absolute',
    bottom: 120,
    left: 5,
    right: 5,
    height: 250,
    justifyContent: 'flex-end',
  },
  liveCommentItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  liveCommentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  liveCommentContent: {
    flex: 1,
  },
  liveCommentUser: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  liveCommentText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 16,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  messageInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    paddingVertical: 10,
  },
  sendButton: {
    padding: 5,
  },
  sendIcon: {
    color: 'white',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
  },
  floatingHeartsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    pointerEvents: 'none',
  },
  floatingHeart: {
    position: 'absolute',
    opacity: 0.8,
  },
  heartEmoji: {
    fontSize: 24,
    color: '#FF6B6B',
  },
})