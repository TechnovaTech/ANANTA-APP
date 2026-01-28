import { StyleSheet, ScrollView, TouchableOpacity, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function DailyTasksScreen() {
  const { isDark } = useTheme();
  const dailyTasks = [
    {
      id: 1,
      title: 'Start a Live Stream',
      description: 'Go live for at least 10 minutes',
      reward: 50,
      completed: true,
      progress: '1/1',
      icon: 'videocam'
    },
    {
      id: 2,
      title: 'Watch 3 Live Streams',
      description: 'Watch other streamers for 5 minutes each',
      reward: 30,
      completed: false,
      progress: '2/3',
      icon: 'play-circle'
    },
    {
      id: 3,
      title: 'Send 10 Messages',
      description: 'Chat with other users in live streams',
      reward: 20,
      completed: true,
      progress: '10/10',
      icon: 'chatbubbles'
    },
    {
      id: 4,
      title: 'Follow 2 New Streamers',
      description: 'Discover and follow new content creators',
      reward: 25,
      completed: false,
      progress: '1/2',
      icon: 'person-add'
    },
    {
      id: 5,
      title: 'Receive 5 Hearts',
      description: 'Get hearts from viewers during your stream',
      reward: 40,
      completed: false,
      progress: '3/5',
      icon: 'heart'
    },
    {
      id: 6,
      title: 'Share a Stream',
      description: 'Share your favorite stream with friends',
      reward: 15,
      completed: false,
      progress: '0/1',
      icon: 'share-social'
    },
    {
      id: 7,
      title: 'Login Daily',
      description: 'Open the app and check in',
      reward: 10,
      completed: true,
      progress: '1/1',
      icon: 'calendar'
    }
  ];

  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const totalRewards = dailyTasks.filter(task => task.completed).reduce((sum, task) => sum + task.reward, 0);

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
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Daily Tasks</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Summary */}
        <LinearGradient
          colors={isDark ? ['#F7C14D', '#E6B143'] : ['#127d96', '#0a5d75']}
          style={styles.summaryCard}
        >
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryNumber}>{completedTasks}/{dailyTasks.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Tasks Completed</ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <View style={styles.coinsContainer}>
              <Ionicons name="diamond" size={20} color="#B8860B" />
              <ThemedText style={styles.summaryNumber}>{totalRewards}</ThemedText>
            </View>
            <ThemedText style={styles.summaryLabel}>Coins Earned</ThemedText>
          </View>
        </LinearGradient>

        {/* Task List */}
        {dailyTasks.map((task) => (
          <View key={task.id} style={[
            styles.taskCard,
            { backgroundColor: isDark ? '#2a2a2a' : 'white' },
            task.completed && styles.completedTask
          ]}>
            <View style={styles.taskHeader}>
              <View style={styles.taskIconContainer}>
                <View style={[
                  styles.taskIcon,
                  { backgroundColor: task.completed ? '#00C851' : (isDark ? '#F7C14D' : '#127d96') }
                ]}>
                  <Ionicons 
                    name={task.completed ? 'checkmark' : task.icon} 
                    size={20} 
                    color="white" 
                  />
                </View>
              </View>
              <View style={styles.taskInfo}>
                <ThemedText style={[styles.taskTitle, { color: isDark ? 'white' : '#333' }]}>
                  {task.title}
                </ThemedText>
                <ThemedText style={[styles.taskDescription, { color: isDark ? '#ccc' : '#666' }]}>
                  {task.description}
                </ThemedText>
                <View style={styles.taskMeta}>
                  <ThemedText style={[styles.taskProgress, { color: isDark ? '#F7C14D' : '#127d96' }]}>Progress: {task.progress}</ThemedText>
                  <View style={styles.rewardContainer}>
                    <Ionicons name="diamond" size={14} color="#FFD700" />
                    <ThemedText style={styles.rewardText}>{task.reward}</ThemedText>
                  </View>
                </View>
              </View>
            </View>
            
            {!task.completed && (
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: isDark ? '#F7C14D' : '#127d96',
                        width: `${(parseInt(task.progress.split('/')[0]) / parseInt(task.progress.split('/')[1])) * 100}%` 
                      }
                    ]} 
                  />
                </View>
                <ThemedText style={[styles.progressPercent, { color: isDark ? '#ccc' : '#666' }]}>
                  {Math.round((parseInt(task.progress.split('/')[0]) / parseInt(task.progress.split('/')[1])) * 100)}%
                </ThemedText>
              </View>
            )}
          </View>
        ))}

        <View style={styles.footer}>
          <Ionicons name="time" size={16} color={isDark ? '#aaa' : '#999'} />
          <ThemedText style={[styles.footerText, { color: isDark ? '#aaa' : '#999' }]}>
            Tasks reset daily at midnight
          </ThemedText>
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
    letterSpacing: 1,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedTask: {
    borderLeftWidth: 4,
    borderLeftColor: '#00C851',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskIconContainer: {
    marginRight: 15,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskProgress: {
    fontSize: 12,
    color: '#127d96',
    fontWeight: '600',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(184, 134, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B8860B',
  },
  progressBarContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#127d96',
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});