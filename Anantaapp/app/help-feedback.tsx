import { StyleSheet, ScrollView, TouchableOpacity, View, TextInput, Dimensions, StatusBar, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HelpFeedbackScreen() {
  const { isDark } = useTheme();
  const helpItems = [
    { id: 1, title: 'Frequently Asked Questions', description: 'Find answers to common questions', icon: 'help-circle' },
    { id: 2, title: 'Contact Support', description: 'Get help from our support team', icon: 'headset' },
    { id: 3, title: 'Report a Problem', description: 'Let us know about any issues', icon: 'bug' },
    { id: 4, title: 'Feature Request', description: 'Suggest new features', icon: 'bulb' },
    { id: 5, title: 'User Guide', description: 'Learn how to use the app', icon: 'book' },
    { id: 6, title: 'Privacy Policy', description: 'Read our privacy policy', icon: 'shield-checkmark' },
  ];

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
            <Text style={[styles.appTitle, { color: isDark ? 'black' : 'white' }]}>Help & Support</Text>
          </View>
          
          <View style={styles.headerActions}>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.helpSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>How can we help you?</Text>
          
          {helpItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.helpItem, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
            >
              <View style={styles.helpLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={24} color={isDark ? '#F7C14D' : '#127d96'} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.helpTitle, { color: isDark ? 'white' : '#333' }]}>{item.title}</Text>
                  <Text style={[styles.helpDescription, { color: isDark ? '#ccc' : '#666' }]}>{item.description}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#ccc' : '#666'} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.feedbackSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Send Feedback</Text>
          
          <View style={[styles.feedbackCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}>
            <Text style={[styles.feedbackLabel, { color: isDark ? '#ccc' : '#666' }]}>
              We'd love to hear from you! Share your thoughts, suggestions, or report any issues.
            </Text>
            
            <TextInput
              style={[styles.feedbackInput, { 
                backgroundColor: isDark ? '#333' : '#f8f9fa',
                borderColor: isDark ? '#555' : '#e0e0e0',
                color: isDark ? 'white' : '#333'
              }]}
              placeholder="Type your feedback here..."
              placeholderTextColor={isDark ? '#888' : '#999'}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            <TouchableOpacity style={styles.submitButtonContainer}>
              <LinearGradient
                colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
                style={styles.submitButton}
              >
                <Ionicons name="send" size={20} color={isDark ? 'black' : 'white'} />
                <Text style={[styles.submitText, { color: isDark ? 'black' : 'white' }]}>Send Feedback</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View style={[styles.contactCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}>
          <View style={styles.contactHeader}>
            <Ionicons name="mail" size={24} color={isDark ? '#F7C14D' : '#127d96'} />
            <Text style={[styles.contactTitle, { color: isDark ? 'white' : '#333' }]}>Contact Information</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={16} color={isDark ? '#ccc' : '#666'} />
            <Text style={[styles.contactText, { color: isDark ? '#ccc' : '#666' }]}>support@ananta.com</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={16} color={isDark ? '#ccc' : '#666'} />
            <Text style={[styles.contactText, { color: isDark ? '#ccc' : '#666' }]}>+91 98765 43210</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="time-outline" size={16} color={isDark ? '#ccc' : '#666'} />
            <Text style={[styles.contactText, { color: isDark ? '#ccc' : '#666' }]}>24/7 Support Available</Text>
          </View>
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
    paddingHorizontal: 20,
    paddingBottom: height * 0.1,
  },
  helpSection: {
    paddingTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(247,193,77,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
  },
  feedbackSection: {
    marginBottom: 30,
  },
  feedbackCard: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feedbackLabel: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  feedbackInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 120,
    marginBottom: 20,
  },
  submitButtonContainer: {
    alignSelf: 'stretch',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 12,
  },
});