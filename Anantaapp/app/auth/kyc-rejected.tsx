import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function KycRejectedScreen() {
  const params = useLocalSearchParams();
  const userId = typeof params.userId === 'string' ? params.userId : '';

  const handleRetry = () => {
    if (userId) {
      router.replace({ pathname: '/auth/profile', params: { userId } });
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#e53e3e', '#f56565']}
        style={styles.card}
      >
        <Ionicons name="close-circle" size={60} color="white" style={{ marginBottom: 20 }} />
        <Text style={styles.title}>Application Rejected</Text>
        <Text style={styles.message}>
          Your KYC application was rejected. Please review your details and try submitting again.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRetry}>
          <Text style={styles.buttonText}>Fill Form Again</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d3748',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e53e3e',
  },
});

