import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

interface VideoGiftPlayerProps {
  videoUrl: string;
  giftName: string;
  senderName: string;
  onComplete: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function VideoGiftPlayer({ videoUrl, giftName, senderName, onComplete }: VideoGiftPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Auto-complete after video duration (estimate 10 seconds for unknown duration)
    const timer = setTimeout(() => {
      onComplete();
    }, 10000); // 10 seconds default

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    // Auto-complete after 3 seconds if video fails
    setTimeout(onComplete, 3000);
  };

  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>🎁</Text>
          <Text style={styles.giftName}>{giftName}</Text>
          <Text style={styles.senderName}>from @{senderName}</Text>
        </View>
      </View>
    );
  }

  const videoHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: transparent;
        }
      </style>
    </head>
    <body>
      <video autoplay muted="false" controls="false" playsInline onended="window.ReactNativeWebView.postMessage('ended')" style="pointer-events: none;">
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <script>
        // Ensure video plays with sound
        const video = document.querySelector('video');
        video.muted = false;
        video.volume = 1.0;
        
        // Try to play with sound
        video.play().catch(e => {
          console.log('Autoplay failed:', e);
          // If autoplay fails, try with muted first then unmute
          video.muted = true;
          video.play().then(() => {
            setTimeout(() => {
              video.muted = false;
            }, 100);
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading gift...</Text>
        </View>
      )}
      
      <WebView
        source={{ html: videoHtml }}
        style={styles.video}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'ended') {
            onComplete();
          }
        }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo={false}
        mixedContentMode="compatibility"
        androidLayerType="hardware"
      />
      
      <View style={styles.overlay}>
        <Text style={styles.giftName}>{giftName}</Text>
        <Text style={styles.senderName}>from @{senderName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  video: {
    width: screenWidth * 0.75, // 75% of screen width
    height: screenHeight * 0.75, // 75% of screen height
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  giftName: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  senderName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 80,
    marginBottom: 20,
  },
});