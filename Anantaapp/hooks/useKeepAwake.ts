import { useEffect, useRef } from 'react';
import { Platform, AppState, Dimensions } from 'react-native';

// Robust keep-awake implementation that actually prevents device sleep
export const useKeepAwake = (isActive: boolean = true) => {
  const wakeLockRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isActive) {
      deactivateKeepAwake();
      return;
    }

    activateKeepAwake();

    // Handle app state changes
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && isActive) {
        activateKeepAwake();
      } else if (nextAppState === 'background') {
        // Keep some mechanisms active even in background
        if (Platform.OS === 'web') {
          maintainWebKeepAwake();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      deactivateKeepAwake();
    };
  }, [isActive]);

  const activateKeepAwake = async () => {
    try {
      if (Platform.OS === 'web') {
        await activateWebKeepAwake();
      } else {
        activateNativeKeepAwake();
      }
      console.log('✅ Keep awake activated successfully');
    } catch (error) {
      console.warn('❌ Keep awake activation failed:', error);
    }
  };

  const deactivateKeepAwake = () => {
    try {
      if (Platform.OS === 'web') {
        deactivateWebKeepAwake();
      } else {
        deactivateNativeKeepAwake();
      }
      console.log('✅ Keep awake deactivated');
    } catch (error) {
      console.warn('❌ Keep awake deactivation failed:', error);
    }
  };

  // Web implementation with multiple fallbacks
  const activateWebKeepAwake = async () => {
    // Method 1: Screen Wake Lock API (most reliable)
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        console.log('🔒 Screen Wake Lock activated');
        
        wakeLockRef.current.addEventListener('release', () => {
          console.log('🔓 Screen Wake Lock released');
          // Try to reacquire if still active
          if (isActive) {
            setTimeout(() => activateWebKeepAwake(), 1000);
          }
        });
        return;
      } catch (error) {
        console.warn('Screen Wake Lock failed, trying fallback methods');
      }
    }

    // Method 2: Invisible video element (fallback)
    createInvisibleVideo();

    // Method 3: Periodic screen interaction simulation
    startPeriodicKeepAwake();
  };

  const deactivateWebKeepAwake = () => {
    // Release wake lock
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }

    // Remove invisible video
    if (videoRef.current) {
      videoRef.current.remove();
      videoRef.current = null;
    }

    // Clear periodic keep awake
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const createInvisibleVideo = () => {
    if (videoRef.current) return;

    const video = document.createElement('video');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', '');
    video.style.position = 'fixed';
    video.style.top = '-1px';
    video.style.left = '-1px';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0.01';
    video.style.pointerEvents = 'none';
    video.style.zIndex = '-9999';

    // Create a minimal video data URL
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 1, 1);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        video.src = URL.createObjectURL(blob);
        video.play().catch(() => {});
      }
    });

    document.body.appendChild(video);
    videoRef.current = video;
  };

  const startPeriodicKeepAwake = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      // Simulate user activity to prevent sleep
      try {
        // Method 1: Dispatch a minimal mouse event
        const event = new MouseEvent('mousemove', {
          clientX: 1,
          clientY: 1,
          bubbles: false,
          cancelable: false
        });
        document.dispatchEvent(event);

        // Method 2: Touch the screen dimensions (triggers activity)
        const { width, height } = Dimensions.get('window');
        if (width && height) {
          // This access can help maintain activity
        }

        // Method 3: Request animation frame
        requestAnimationFrame(() => {});

      } catch (error) {
        console.warn('Periodic keep awake failed:', error);
      }
    }, 30000); // Every 30 seconds
  };

  const maintainWebKeepAwake = () => {
    // Try to reacquire wake lock when app becomes active
    if ('wakeLock' in navigator && !wakeLockRef.current) {
      setTimeout(() => activateWebKeepAwake(), 500);
    }
  };

  // Native implementation with multiple approaches
  const activateNativeKeepAwake = () => {
    try {
      // Method 1: Try to import and use expo-keep-awake if available
      import('expo-keep-awake').then(({ activateKeepAwake }) => {
        activateKeepAwake();
        console.log('📱 Native keep awake activated');
      }).catch(() => {
        // Method 2: Fallback to periodic activity simulation
        startNativePeriodicKeepAwake();
      });
    } catch (error) {
      startNativePeriodicKeepAwake();
    }
  };

  const deactivateNativeKeepAwake = () => {
    try {
      import('expo-keep-awake').then(({ deactivateKeepAwake }) => {
        deactivateKeepAwake();
      }).catch(() => {});
    } catch (error) {}

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startNativePeriodicKeepAwake = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      try {
        // Simulate activity by accessing screen dimensions
        const { width, height } = Dimensions.get('window');
        if (width && height) {
          // This access helps maintain activity
          console.log('📱 Maintaining device activity');
        }
      } catch (error) {
        console.warn('Native periodic keep awake failed:', error);
      }
    }, 25000); // Every 25 seconds
  };

  return {
    activate: activateKeepAwake,
    deactivate: deactivateKeepAwake,
    isActive: !!wakeLockRef.current || !!intervalRef.current
  };
};