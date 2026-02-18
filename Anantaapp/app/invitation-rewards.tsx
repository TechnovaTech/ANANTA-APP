import { StyleSheet, ScrollView, TouchableOpacity, View, Dimensions, Share, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function InvitationRewardsScreen() {
  const { isDark } = useTheme();
  const inviteCode = "ANANTA2024";
  const totalInvites = 12;
  const totalRewards = 480;

  const rewardTiers = [
    { invites: 1, reward: 50, claimed: true },
    { invites: 3, reward: 100, claimed: true },
    { invites: 5, reward: 200, claimed: false },
    { invites: 10, reward: 500, claimed: false },
    { invites: 20, reward: 1000, claimed: false },
  ];

  const recentInvites = [
    { name: "John Doe", date: "2 days ago", reward: 50 },
    { name: "Sarah Smith", date: "5 days ago", reward: 50 },
    { name: "Mike Johnson", date: "1 week ago", reward: 50 },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Ananta Live! Use my invite code: ${inviteCode} and get bonus coins! Download now: https://ananta.live`,
      });
    } catch (error) {
      console.log(error);
    }
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
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Invitation Rewards</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <LinearGradient
          colors={isDark ? ['#F7C14D', '#E6B143'] : ['#127d96', '#0a5d75']}
          style={styles.statsCard}
        >
          <View style={styles.statsIcon}>
            <Ionicons name="gift" size={40} color={isDark ? 'black' : 'white'} />
          </View>
          <Text style={[styles.statsTitle, { color: isDark ? 'black' : 'white' }]}>Invite Friends & Earn Rewards!</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={20} color={isDark ? 'black' : 'white'} />
              <Text style={[styles.statNumber, { color: isDark ? 'black' : 'white' }]}>{totalInvites}</Text>
              <Text style={[styles.statLabel, { color: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }]}>Friends Invited</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="diamond" size={20} color={isDark ? 'black' : 'white'} />
              <Text style={[styles.statNumber, { color: isDark ? 'black' : 'white' }]}>{totalRewards}</Text>
              <Text style={[styles.statLabel, { color: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }]}>Coins Earned</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Invite Code */}
        <View style={[styles.inviteSection, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Your Invite Code</ThemedText>
          <View style={[styles.codeContainer, { 
            backgroundColor: isDark ? 'rgba(247, 193, 77, 0.1)' : 'rgba(18, 125, 150, 0.1)',
            borderColor: isDark ? '#F7C14D' : '#127d96'
          }]}>
            <ThemedText style={[styles.inviteCode, { color: isDark ? '#F7C14D' : '#127d96' }]}>{inviteCode}</ThemedText>
            <TouchableOpacity style={[styles.copyButton, { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]}>
              <Ionicons name="copy" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <LinearGradient
              colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
              style={styles.shareButtonGradient}
            >
              <Ionicons name="share-social" size={20} color={isDark ? 'black' : 'white'} />
              <Text style={[styles.shareText, { color: isDark ? 'black' : 'white' }]}>Share Invite Link</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Reward Tiers */}
        <View style={[styles.rewardsSection, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Reward Milestones</ThemedText>
          {rewardTiers.map((tier, index) => (
            <View key={index} style={[
              styles.tierCard, 
              { backgroundColor: isDark ? '#333' : '#f8f9fa' },
              tier.claimed && styles.claimedTier
            ]}>
              <View style={styles.tierLeft}>
                <View style={[styles.tierIcon, { backgroundColor: tier.claimed ? '#00C851' : (isDark ? '#F7C14D' : '#127d96') }]}>
                  <Ionicons 
                    name={tier.claimed ? "checkmark" : "people"} 
                    size={20} 
                    color="white" 
                  />
                </View>
                <View style={styles.tierInfo}>
                  <ThemedText style={[styles.tierTitle, { color: isDark ? 'white' : '#333' }]}>Invite {tier.invites} Friend{tier.invites > 1 ? 's' : ''}</ThemedText>
                  <View style={styles.tierReward}>
                    <Ionicons name="diamond" size={14} color="#B8860B" />
                    <ThemedText style={[styles.tierRewardText, { color: isDark ? '#ccc' : '#666' }]}>{tier.reward} Coins</ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.tierStatus}>
                {tier.claimed ? (
                  <View style={styles.claimedBadge}>
                    <ThemedText style={[styles.claimedText, { color: 'white' }]}>Claimed</ThemedText>
                  </View>
                ) : totalInvites >= tier.invites ? (
                  <TouchableOpacity style={styles.claimButton}>
                    <ThemedText style={[styles.claimText, { color: 'white' }]}>Claim</ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.lockedBadge}>
                    <ThemedText style={[styles.lockedText, { color: '#666' }]}>{totalInvites}/{tier.invites}</ThemedText>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Recent Invites */}
        <View style={[styles.recentSection, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Recent Invites</ThemedText>
          {recentInvites.map((invite, index) => (
            <View key={index} style={[styles.inviteCard, { backgroundColor: isDark ? '#333' : '#f8f9fa' }]}>
              <View style={styles.inviteLeft}>
                <View style={[styles.avatarContainer, { backgroundColor: isDark ? 'rgba(247, 193, 77, 0.1)' : 'rgba(18, 125, 150, 0.1)' }]}>
                  <Ionicons name="person" size={20} color={isDark ? '#F7C14D' : '#127d96'} />
                </View>
                <View style={styles.inviteInfo}>
                  <ThemedText style={[styles.inviteName, { color: isDark ? 'white' : '#333' }]}>{invite.name}</ThemedText>
                  <ThemedText style={[styles.inviteDate, { color: isDark ? '#ccc' : '#666' }]}>{invite.date}</ThemedText>
                </View>
              </View>
              <View style={styles.inviteReward}>
                <Ionicons name="diamond" size={16} color="#B8860B" />
                <ThemedText style={styles.inviteRewardText}>+{invite.reward}</ThemedText>
              </View>
            </View>
          ))}
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
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsIcon: {
    marginBottom: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  inviteSection: {
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
    marginBottom: 15,
  },
  codeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(18, 125, 150, 0.1)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#127d96',
  },
  inviteCode: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#127d96',
  },
  copyButton: {
    backgroundColor: '#127d96',
    padding: 8,
    borderRadius: 8,
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    gap: 10,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rewardsSection: {
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
  tierCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  claimedTier: {
    borderLeftWidth: 4,
    borderLeftColor: '#00C851',
  },
  tierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tierIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tierInfo: {
    flex: 1,
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tierReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tierRewardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tierStatus: {
    alignItems: 'center',
  },
  claimedBadge: {
    backgroundColor: '#00C851',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  claimedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  claimButton: {
    backgroundColor: '#B8860B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  claimText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockedBadge: {
    backgroundColor: '#C0C0C0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  lockedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  recentSection: {
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inviteCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inviteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 125, 150, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  inviteDate: {
    fontSize: 12,
  },
  inviteReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inviteRewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00C851',
  },
});