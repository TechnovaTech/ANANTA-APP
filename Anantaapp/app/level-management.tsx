import { StyleSheet, ScrollView, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ENV } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackIcon = ({ color = 'black' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StarIcon = ({ size = 16, color = 'white' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color}/>
  </Svg>
);

type Level = { id: number; level: number; coinsRequired: number };

// Calculate which level the user is at and progress to next
function getLevelProgress(totalCoins: number, levels: Level[]) {
  let currentLevel = 0;
  let cumulative = 0;
  let prevCumulative = 0;
  let nextLevelCoins = 0;

  for (let i = 0; i < levels.length; i++) {
    prevCumulative = cumulative;
    cumulative += levels[i].coinsRequired;
    if (totalCoins >= cumulative) {
      currentLevel = levels[i].level;
    } else {
      nextLevelCoins = cumulative;
      break;
    }
    if (i === levels.length - 1) {
      // Max level reached
      nextLevelCoins = cumulative;
      prevCumulative = levels.length > 1
        ? levels.slice(0, -1).reduce((s, l) => s + l.coinsRequired, 0)
        : 0;
    }
  }

  const isMaxLevel = currentLevel === (levels[levels.length - 1]?.level ?? 0) && levels.length > 0;
  const coinsInCurrentLevel = totalCoins - prevCumulative;
  const coinsNeededForNext = nextLevelCoins - prevCumulative;
  const progress = coinsNeededForNext > 0 ? Math.min(coinsInCurrentLevel / coinsNeededForNext, 1) : 1;

  return { currentLevel, isMaxLevel, coinsInCurrentLevel, coinsNeededForNext, nextLevelCoins, progress };
}

export default function LevelManagementScreen() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'host' | 'viewer'>('host');
  const [hostLevels, setHostLevels] = useState<Level[]>([]);
  const [viewerLevels, setViewerLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [totalCoinsSpent, setTotalCoinsSpent] = useState(0);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Get userId
        let userId: string | null = null;
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          userId = window.localStorage.getItem('userId');
        } else {
          userId = await AsyncStorage.getItem('userId');
        }

        const [hostRes, viewerRes] = await Promise.all([
          fetch(`${ENV.API_BASE_URL}/api/app/levels/host`),
          fetch(`${ENV.API_BASE_URL}/api/app/levels/viewer`),
        ]);
        const hostData = await hostRes.json();
        const viewerData = await viewerRes.json();
        setHostLevels(hostData.levels || []);
        setViewerLevels(viewerData.levels || []);

        if (userId) {
          const profileRes = await fetch(`${ENV.API_BASE_URL}/api/app/profile/${userId}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setTotalCoinsEarned(profileData.user?.totalCoinsEarned || 0);
            setTotalCoinsSpent(profileData.user?.totalCoinsSpent || 0);
          }
        }
      } catch {
        setHostLevels([]);
        setViewerLevels([]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const primaryColor = isDark ? '#F7C14D' : '#127d96';
  const textColor = isDark ? 'white' : '#333';
  const cardBg = isDark ? '#2a2a2a' : 'white';
  const itemBg = isDark ? '#333' : '#f8f9fa';
  const subText = isDark ? '#999' : '#666';

  const levels = activeTab === 'host' ? hostLevels : viewerLevels;
  const totalCoins = activeTab === 'host' ? totalCoinsEarned : totalCoinsSpent;
  const { currentLevel, isMaxLevel, coinsInCurrentLevel, coinsNeededForNext, nextLevelCoins, progress } =
    getLevelProgress(totalCoins, levels);

  const nextLevel = currentLevel + 1;
  const nextLevelData = levels.find(l => l.level === nextLevel);

  return (
    <ThemedView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <BackIcon color={isDark ? 'black' : 'white'} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>My Level</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, { backgroundColor: cardBg, borderBottomColor: isDark ? '#444' : '#e2e8f0' }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'host' && { borderBottomColor: primaryColor, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('host')}
        >
          <ThemedText style={[styles.tabText, { color: activeTab === 'host' ? primaryColor : subText, fontWeight: activeTab === 'host' ? '700' : '500' }]}>
            🎙️ Host Level
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'viewer' && { borderBottomColor: primaryColor, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('viewer')}
        >
          <ThemedText style={[styles.tabText, { color: activeTab === 'viewer' ? primaryColor : subText, fontWeight: activeTab === 'viewer' ? '700' : '500' }]}>
            👁️ Viewer Level
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        ) : (
          <>
            {/* Current Level Card */}
            <LinearGradient
              colors={isDark ? ['#F7C14D', '#E6B143'] : ['#127d96', '#0a5d75']}
              style={styles.currentLevelCard}
            >
              {/* Big level badge */}
              <View style={styles.bigBadgeRow}>
                <View style={styles.bigBadge}>
                  <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.bigBadgeGradient}>
                    <ThemedText style={styles.bigBadgeNumber}>{currentLevel}</ThemedText>
                  </LinearGradient>
                  <View style={[styles.bigBadgeStar, { backgroundColor: isDark ? '#127d96' : '#FFD700' }]}>
                    <StarIcon size={14} color={isDark ? 'white' : '#333'} />
                  </View>
                </View>
                <View style={styles.currentLevelInfo}>
                  <ThemedText style={styles.currentLevelLabel}>
                    {activeTab === 'host' ? 'Host Level' : 'Viewer Level'}
                  </ThemedText>
                  <ThemedText style={styles.currentLevelValue}>Level {currentLevel}</ThemedText>
                  <ThemedText style={styles.currentLevelCoins}>
                    {activeTab === 'host'
                      ? `${totalCoinsEarned.toLocaleString()} coins earned`
                      : `${totalCoinsSpent.toLocaleString()} coins spent`}
                  </ThemedText>
                </View>
              </View>

              {/* Progress bar */}
              {levels.length > 0 && (
                <View style={styles.progressSection}>
                  <View style={styles.progressLabelRow}>
                    <ThemedText style={styles.progressLabel}>
                      {isMaxLevel ? 'Max Level Reached! 🎉' : `Progress to Level ${nextLevel}`}
                    </ThemedText>
                    {!isMaxLevel && (
                      <ThemedText style={styles.progressCoins}>
                        {coinsInCurrentLevel.toLocaleString()} / {coinsNeededForNext.toLocaleString()}
                      </ThemedText>
                    )}
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${Math.round(progress * 100)}%` }]} />
                  </View>
                  {!isMaxLevel && nextLevelData && (
                    <ThemedText style={styles.progressHint}>
                      {(coinsNeededForNext - coinsInCurrentLevel).toLocaleString()} more coins to Level {nextLevel}
                    </ThemedText>
                  )}
                </View>
              )}
            </LinearGradient>

            {/* Level Ladder */}
            <View style={[styles.listContainer, { backgroundColor: cardBg }]}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                {activeTab === 'host' ? 'Host Level Ladder' : 'Viewer Level Ladder'}
              </ThemedText>

              {levels.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <ThemedText style={[styles.emptyText, { color: subText }]}>No levels configured yet.</ThemedText>
                  <ThemedText style={[styles.emptySubText, { color: subText }]}>Admin can add levels from the admin panel.</ThemedText>
                </View>
              ) : (
                <>
                  {/* Level 0 row */}
                  <View style={[styles.levelItem, {
                    backgroundColor: currentLevel === 0 ? (isDark ? '#3a3a1a' : '#fff8e1') : itemBg,
                    borderColor: currentLevel === 0 ? '#FFD700' : (isDark ? '#555' : '#e0e0e0'),
                    borderWidth: currentLevel === 0 ? 2 : 1,
                  }]}>
                    <View style={styles.badgeWrap}>
                      <LinearGradient colors={['#aaa', '#888']} style={styles.badgeGradient}>
                        <ThemedText style={styles.badgeNumber}>0</ThemedText>
                      </LinearGradient>
                      <View style={[styles.badgeStar, { backgroundColor: '#aaa' }]}>
                        <StarIcon size={10} color="white" />
                      </View>
                    </View>
                    <View style={styles.levelInfo}>
                      <ThemedText style={[styles.levelTitle, { color: textColor }]}>Level 0</ThemedText>
                      <ThemedText style={[styles.coinsText, { color: subText }]}>Starting level</ThemedText>
                    </View>
                    {currentLevel === 0 && (
                      <View style={[styles.currentBadge, { backgroundColor: '#FFD700' }]}>
                        <ThemedText style={styles.currentBadgeText}>YOU</ThemedText>
                      </View>
                    )}
                  </View>

                  {levels.map((levelData, index) => {
                    const cumulative = levels.slice(0, index + 1).reduce((sum, l) => sum + l.coinsRequired, 0);
                    const isCurrentLevel = levelData.level === currentLevel;
                    const isUnlocked = totalCoins >= cumulative;
                    return (
                      <View
                        key={levelData.id}
                        style={[styles.levelItem, {
                          backgroundColor: isCurrentLevel ? (isDark ? '#3a3a1a' : '#fff8e1') : itemBg,
                          borderColor: isCurrentLevel ? '#FFD700' : (isDark ? '#555' : '#e0e0e0'),
                          borderWidth: isCurrentLevel ? 2 : 1,
                          opacity: isUnlocked ? 1 : 0.5,
                        }]}
                      >
                        <View style={styles.badgeWrap}>
                          <LinearGradient
                            colors={isUnlocked ? ['#FFD700', '#FFA500'] : ['#ccc', '#aaa']}
                            style={styles.badgeGradient}
                          >
                            <ThemedText style={styles.badgeNumber}>{levelData.level}</ThemedText>
                          </LinearGradient>
                          <View style={[styles.badgeStar, { backgroundColor: isUnlocked ? primaryColor : '#aaa' }]}>
                            <StarIcon size={10} color="white" />
                          </View>
                        </View>
                        <View style={styles.levelInfo}>
                          <ThemedText style={[styles.levelTitle, { color: textColor }]}>
                            Level {levelData.level}
                          </ThemedText>
                          <ThemedText style={[styles.coinsText, { color: subText }]}>
                            🪙 {levelData.coinsRequired.toLocaleString()} coins {activeTab === 'host' ? 'to earn' : 'to spend'}
                          </ThemedText>
                        </View>
                        <View style={styles.rightCol}>
                          <ThemedText style={[styles.totalLabel, { color: subText }]}>Total</ThemedText>
                          <View style={[styles.totalBadge, { backgroundColor: isUnlocked ? primaryColor : '#aaa' }]}>
                            <ThemedText style={styles.totalValue}>{cumulative.toLocaleString()}</ThemedText>
                          </View>
                        </View>
                        {isCurrentLevel && (
                          <View style={[styles.currentBadge, { backgroundColor: '#FFD700' }]}>
                            <ThemedText style={styles.currentBadgeText}>YOU</ThemedText>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </>
              )}
            </View>
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    height: 120,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  placeholder: { width: 24 },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { fontSize: 15 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  loadingContainer: { alignItems: 'center', paddingVertical: 60 },

  // Current level card
  currentLevelCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bigBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  bigBadge: { width: 72, height: 72, position: 'relative', marginRight: 18 },
  bigBadgeGradient: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  bigBadgeNumber: { fontSize: 30, fontWeight: 'bold', color: 'white' },
  bigBadgeStar: { position: 'absolute', top: -4, right: -4, borderRadius: 10, padding: 3 },
  currentLevelInfo: { flex: 1 },
  currentLevelLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
  currentLevelValue: { fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  currentLevelCoins: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },

  // Progress bar
  progressSection: { gap: 8 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  progressCoins: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  progressHint: { fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'right' },

  // Level ladder
  listContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 14, textAlign: 'center' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  emptySubText: { fontSize: 13 },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
  },
  badgeWrap: { width: 40, height: 40, position: 'relative' },
  badgeGradient: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  badgeNumber: { fontSize: 15, fontWeight: 'bold', color: 'white' },
  badgeStar: { position: 'absolute', top: -3, right: -3, borderRadius: 7, padding: 2 },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  coinsText: { fontSize: 12 },
  rightCol: { alignItems: 'center' },
  totalLabel: { fontSize: 10, marginBottom: 3 },
  totalBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  totalValue: { fontSize: 11, color: 'white', fontWeight: '700' },
  currentBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgeText: { fontSize: 9, fontWeight: '800', color: '#333' },
});
