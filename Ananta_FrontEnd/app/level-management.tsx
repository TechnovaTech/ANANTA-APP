import { StyleSheet, ScrollView, TouchableOpacity, View, Dimensions, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const BackIcon = ({ color = 'black' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StarIcon = ({ size = 24, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color}/>
  </Svg>
);

const TrophyIcon = ({ size = 20, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9C6 10.45 6.39 11.8 7.07 12.96C7.75 14.12 8.69 15.04 9.83 15.62C10.97 16.2 12.26 16.41 13.51 16.23C14.76 16.05 15.93 15.5 16.85 14.64C17.77 13.78 18.4 12.66 18.66 11.42C18.92 10.18 18.79 8.89 18.29 7.72C17.79 6.55 16.94 5.56 15.85 4.85C14.76 4.14 13.49 3.75 12.2 3.75H6V9Z" fill={color}/>
    <Path d="M12 15L8 19H16L12 15Z" fill={color}/>
    <Path d="M8 19H16V21H8V19Z" fill={color}/>
  </Svg>
);

const GiftIcon = ({ size = 20, color = '#FF6B6B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6H16.25C16.25 4.21 14.79 2.75 13 2.75C11.21 2.75 9.75 4.21 9.75 6H4C2.9 6 2 6.9 2 8V10C2 10.55 2.45 11 3 11H4V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V11H21C21.55 11 22 10.55 22 10V8C22 6.9 21.1 6 20 6Z" fill={color}/>
  </Svg>
);

const FrameIcon = ({ size = 20, color = '#4ECDC4' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill={color}/>
    <Path d="M5 7H19V17H5V7Z" fill="none" stroke={color} strokeWidth="2"/>
  </Svg>
);

const ChatIcon = ({ size = 20, color = '#45B7D1' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill={color}/>
    <Path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill={color}/>
  </Svg>
);

const CrownIcon = ({ size = 20, color = '#FFD700' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 16L3 8L8 11L12 5L16 11L21 8L19 16H5Z" fill={color}/>
    <Path d="M5 16H19V18H5V16Z" fill={color}/>
  </Svg>
);

const DiamondIcon = ({ size = 20, color = '#E74C3C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 3H18L22 9L12 21L2 9L6 3Z" fill={color}/>
    <Path d="M6 3L12 9L18 3" stroke="white" strokeWidth="1"/>
    <Path d="M2 9L12 9L22 9" stroke="white" strokeWidth="1"/>
  </Svg>
);

const VipIcon = ({ size = 20, color = '#9B59B6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color}/>
    <Path d="M12 6V14M9 9L15 9" stroke="white" strokeWidth="1.5"/>
  </Svg>
);

const LockIcon = ({ size = 20, color = '#666' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 11H6C4.9 11 4 11.9 4 13V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V13C20 11.9 19.1 11 18 11ZM12 17C11.4 17 11 16.6 11 16C11 15.4 11.4 15 12 15C12.6 15 13 15.4 13 16C13 16.6 12.6 17 12 17ZM15.1 11V8.5C15.1 6.6 13.4 5 11.6 5C9.8 5 8.1 6.6 8.1 8.5V11H6.1V8.5C6.1 5.5 8.7 3 11.6 3C14.5 3 17.1 5.5 17.1 8.5V11H15.1Z" fill={color}/>
  </Svg>
);

const CheckIcon = ({ size = 20, color = '#00C851' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill={color}/>
  </Svg>
);

// Level Badge Component
const LevelBadge = ({ level, size = 'small', showStar = true, isDark = false }) => {
  const badgeSize = size === 'large' ? 60 : size === 'medium' ? 40 : 24;
  const fontSize = size === 'large' ? 20 : size === 'medium' ? 14 : 10;
  
  return (
    <View style={[styles.levelBadgeContainer, { width: badgeSize, height: badgeSize }]}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={[styles.levelBadge, { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]}
      >
        <ThemedText style={[styles.levelBadgeText, { fontSize }]}>{level}</ThemedText>
      </LinearGradient>
      {showStar && (
        <View style={[styles.starBadge, { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]}>
          <StarIcon size={size === 'large' ? 16 : 12} color="white" />
        </View>
      )}
    </View>
  );
};

export default function LevelManagementScreen() {
  const { isDark } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Mock user data
  const [userLevel, setUserLevel] = useState({
    currentLevel: 7,
    currentXP: 2450,
    nextLevelXP: 3000,
    totalXP: 12450
  });

  // Mock levels data
  const levels = [
    { level: 1, requiredXP: 0, rewards: ['Welcome Badge'], icon: 'gift', color: '#4ECDC4' },
    { level: 2, requiredXP: 100, rewards: ['Basic Frame'], icon: 'frame', color: '#45B7D1' },
    { level: 3, requiredXP: 250, rewards: ['Bronze Badge'], icon: 'trophy', color: '#CD7F32' },
    { level: 4, requiredXP: 500, rewards: ['Chat Colors'], icon: 'chat', color: '#45B7D1' },
    { level: 5, requiredXP: 800, rewards: ['Silver Badge'], icon: 'trophy', color: '#C0C0C0' },
    { level: 6, requiredXP: 1200, rewards: ['Premium Frame'], icon: 'frame', color: '#9B59B6' },
    { level: 7, requiredXP: 1700, rewards: ['Gold Badge'], icon: 'trophy', color: '#FFD700' },
    { level: 8, requiredXP: 2300, rewards: ['VIP Status'], icon: 'vip', color: '#9B59B6' },
    { level: 9, requiredXP: 3000, rewards: ['Diamond Badge'], icon: 'diamond', color: '#E74C3C' },
    { level: 10, requiredXP: 4000, rewards: ['Elite Frame'], icon: 'frame', color: '#FFD700' },
    { level: 11, requiredXP: 5200, rewards: ['Master Badge'], icon: 'crown', color: '#FFD700' },
    { level: 12, requiredXP: 6600, rewards: ['Legendary Status'], icon: 'crown', color: '#FF6B6B' },
  ];

  const progressPercentage = ((userLevel.currentXP - levels[userLevel.currentLevel - 1].requiredXP) / 
    (userLevel.nextLevelXP - levels[userLevel.currentLevel - 1].requiredXP)) * 100;

  const remainingXP = userLevel.nextLevelXP - userLevel.currentXP;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

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
          <BackIcon color={isDark ? 'black' : 'white'} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Level Management</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Level Card */}
        <LinearGradient
          colors={isDark ? ['#F7C14D', '#E6B143', '#D4A03A'] : ['#127d96', '#0a5d75', '#083d4f']}
          style={styles.levelCard}
        >
          <View style={styles.levelHeader}>
            <View style={styles.levelInfo}>
              <LevelBadge level={userLevel.currentLevel} size="large" isDark={isDark} />
              <View style={styles.levelTextContainer}>
                <ThemedText style={styles.levelTitle}>Level {userLevel.currentLevel}</ThemedText>
                <ThemedText style={styles.xpText}>
                  XP: {userLevel.currentXP.toLocaleString()} / {userLevel.nextLevelXP.toLocaleString()}
                </ThemedText>
              </View>
            </View>
            <View style={styles.remainingXP}>
              <ThemedText style={styles.remainingText}>{remainingXP} XP</ThemedText>
              <ThemedText style={styles.remainingLabel}>to Level {userLevel.currentLevel + 1}</ThemedText>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}
              />
            </View>
            <ThemedText style={styles.progressText}>
              {Math.round(progressPercentage)}% Complete
            </ThemedText>
          </View>
        </LinearGradient>

        {/* Level Ladder */}
        <View style={[styles.ladderContainer, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>
            Level Ladder
          </ThemedText>
          
          {levels.map((levelData, index) => {
            const isCompleted = levelData.level < userLevel.currentLevel;
            const isCurrent = levelData.level === userLevel.currentLevel;
            const isLocked = levelData.level > userLevel.currentLevel;
            
            return (
              <View 
                key={levelData.level}
                style={[
                  styles.ladderItem,
                  {
                    backgroundColor: isCurrent 
                      ? (isDark ? '#F7C14D' : '#e6f3f7')
                      : (isDark ? '#333' : '#f8f9fa'),
                    borderColor: isCurrent ? (isDark ? '#F7C14D' : '#127d96') : (isDark ? '#555' : '#e0e0e0'),
                    opacity: isLocked ? 0.6 : 1
                  }
                ]}
              >
                <View style={styles.ladderLeft}>
                  <View style={styles.ladderIcon}>
                    {isCompleted && <CheckIcon size={20} />}
                    {isCurrent && <LevelBadge level={levelData.level} size="medium" showStar={false} isDark={isDark} />}
                    {isLocked && <LockIcon size={20} color={isDark ? '#666' : '#999'} />}
                  </View>
                  <View style={styles.ladderInfo}>
                    <ThemedText style={[
                      styles.ladderLevel,
                      { 
                        color: isCurrent ? (isDark ? 'white' : (isDark ? '#F7C14D' : '#127d96')) : (isDark ? '#ccc' : '#333'),
                        fontWeight: isCurrent ? 'bold' : 'normal'
                      }
                    ]}>
                      Level {levelData.level}
                    </ThemedText>
                    <ThemedText style={[
                      styles.ladderXP,
                      { color: isDark ? '#999' : '#666' }
                    ]}>
                      {levelData.requiredXP.toLocaleString()} XP Required
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.ladderRight}>
                  <View style={styles.rewardContainer}>
                    {levelData.icon === 'gift' && <GiftIcon size={16} color={levelData.color} />}
                    {levelData.icon === 'frame' && <FrameIcon size={16} color={levelData.color} />}
                    {levelData.icon === 'trophy' && <TrophyIcon size={16} color={levelData.color} />}
                    {levelData.icon === 'chat' && <ChatIcon size={16} color={levelData.color} />}
                    {levelData.icon === 'crown' && <CrownIcon size={16} color={levelData.color} />}
                    {levelData.icon === 'diamond' && <DiamondIcon size={16} color={levelData.color} />}
                    {levelData.icon === 'vip' && <VipIcon size={16} color={levelData.color} />}
                    <View style={[
                      styles.rewardBadge,
                      { 
                        backgroundColor: isCompleted ? '#00C851' : (isCurrent ? levelData.color : '#999')
                      }
                    ]}>
                      <ThemedText style={[
                        styles.rewardText,
                        { 
                          color: isCompleted ? 'white' : (isCurrent ? (levelData.color === '#FFD700' ? 'black' : 'white') : 'white')
                        }
                      ]}>
                        {levelData.rewards[0]}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Live Room Preview */}
        <View style={[styles.previewContainer, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>
            Live Room Preview
          </ThemedText>
          
          <View style={[styles.userCard, { backgroundColor: isDark ? '#333' : '#f8f9fa' }]}>
            <View style={[styles.avatar, { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]}>
              <ThemedText style={styles.avatarText}>👤</ThemedText>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={[styles.username, { color: isDark ? 'white' : '#333' }]}>
                Your Username
              </ThemedText>
              <View style={[styles.levelBadgeSmall, { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]}>
                <ThemedText style={styles.levelBadgeSmallText}>Level {userLevel.currentLevel}</ThemedText>
                <StarIcon size={12} color="#FFD700" />
              </View>
            </View>
          </View>
        </View>
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
    letterSpacing: 2,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  levelCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelTextContainer: {
    marginLeft: 15,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  xpText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  remainingXP: {
    alignItems: 'flex-end',
  },
  remainingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  remainingLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  ladderContainer: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
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
    textAlign: 'center',
  },
  ladderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
  },
  ladderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ladderIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ladderInfo: {
    flex: 1,
  },
  ladderLevel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ladderXP: {
    fontSize: 12,
  },
  ladderRight: {
    alignItems: 'flex-end',
  },
  rewardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '600',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewContainer: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#127d96',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  levelBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#127d96',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelBadgeSmallText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginRight: 4,
  },
  levelBadgeContainer: {
    position: 'relative',
  },
  levelBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  levelBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  starBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#127d96',
    borderRadius: 8,
    padding: 2,
  },
});