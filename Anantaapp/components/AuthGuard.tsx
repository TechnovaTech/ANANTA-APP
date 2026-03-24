import React from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground, Dimensions, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/themed-text';
import AnantaLogo from '@/components/AnantaLogo';

const { width, height } = Dimensions.get('window');

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ImageBackground
          source={require('@/assets/images/auth-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(18,125,150,0.8)', 'rgba(10,93,117,0.9)', 'rgba(8,61,79,0.95)']}
            style={styles.overlay}
          >
            <View style={styles.content}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <AnantaLogo size="large" />
              </View>
              
              {/* Loading Circle */}
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <ThemedText style={styles.loadingText}>Checking authentication...</ThemedText>
              </View>

              {/* Powered by section */}
              <View style={styles.poweredByContainer}>
                <ThemedText style={styles.poweredByText}>Powered by</ThemedText>
                <Image 
                  source={require('@/assets/images/sparknet logo.png')}
                  style={styles.sparknetLogo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.05,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 120,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  poweredByContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredByText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 12,
    letterSpacing: 0.5,
  },
  sparknetLogo: {
    width: 120,
    height: 40,
  },
});