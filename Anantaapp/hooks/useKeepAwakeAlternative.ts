import { useEffect, useRef } from 'react';
import { Platform, DeviceEventEmitter, NativeModules } from 'react-native';

// Alternative keep awake implementation without expo-keep-awake
export const useKeepAwakeAlternative = (isActive: boolean = true) => {
  const keepAwakeRef = useRef<boolean>(false);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive) return;

    const activateKeepAwake = async () => {
      try {
        if (Platform.OS === 'web') {
          // Web implementation using Screen Wake Lock API
          if ('wakeLock' in navigator && 'request' in (navigator as any).wakeLock) {
            wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
            keepAwakeRef.current = true;
            console.log('Screen wake lock activated');
            
            // Handle wake lock release on visibility change
            const handleVisibilityChange = () => {
              if (document.visibilityState === 'visible' && !wakeLockRef.current) {
                (navigator as any).wakeLock.request('screen').then((wakeLock: any) => {
                  wakeLockRef.current = wakeLock;
                }).catch(() => {});
              }
            };
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            return () => {
              document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
          }
        } else {
          // React Native implementation using native modules
          if (Platform.OS === 'android') {
            // Use native Android wake lock
            try {
              const { ReactNativeKeepAwake } = NativeModules;
              if (ReactNativeKeepAwake) {
                ReactNativeKeepAwake.activate();
              }
            } catch (error) {
              console.warn('Native keep awake not available, using fallback');
            }
          }
          keepAwakeRef.current = true;
          console.log('Keep awake activated (native)');
        }
      } catch (error) {
        console.warn('Failed to activate keep awake:', error);
      }
    };

    activateKeepAwake();

    // Cleanup function
    return () => {
      if (keepAwakeRef.current) {
        try {
          if (Platform.OS === 'web' && wakeLockRef.current) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
          } else if (Platform.OS === 'android') {
            try {
              const { ReactNativeKeepAwake } = NativeModules;
              if (ReactNativeKeepAwake) {
                ReactNativeKeepAwake.deactivate();
              }
            } catch (error) {
              console.warn('Native keep awake deactivation failed');
            }
          }
          keepAwakeRef.current = false;
          console.log('Keep awake deactivated');
        } catch (error) {
          console.warn('Failed to deactivate keep awake:', error);
        }
      }
    };
  }, [isActive]);

  // Manual control functions
  const activate = async () => {
    if (keepAwakeRef.current) return;
    
    try {
      if (Platform.OS === 'web') {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          keepAwakeRef.current = true;
        }
      } else if (Platform.OS === 'android') {
        try {
          const { ReactNativeKeepAwake } = NativeModules;
          if (ReactNativeKeepAwake) {
            ReactNativeKeepAwake.activate();
          }
        } catch (error) {
          console.warn('Native keep awake activation failed');
        }
        keepAwakeRef.current = true;
      }
      console.log('Keep awake manually activated');
    } catch (error) {
      console.warn('Failed to manually activate keep awake:', error);
    }
  };

  const deactivate = async () => {
    if (!keepAwakeRef.current) return;
    
    try {
      if (Platform.OS === 'web' && wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } else if (Platform.OS === 'android') {
        try {
          const { ReactNativeKeepAwake } = NativeModules;
          if (ReactNativeKeepAwake) {
            ReactNativeKeepAwake.deactivate();
          }
        } catch (error) {
          console.warn('Native keep awake deactivation failed');
        }
      }
      keepAwakeRef.current = false;
      console.log('Keep awake manually deactivated');
    } catch (error) {
      console.warn('Failed to manually deactivate keep awake:', error);
    }
  };

  return { activate, deactivate, isActive: keepAwakeRef.current };
};