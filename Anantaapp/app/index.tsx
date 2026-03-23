import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const userId = window.localStorage.getItem('userId');
        setTarget(userId ? '/(tabs)' : '/auth/login');
        return;
      }
      try {
        const userId = await SecureStore.getItemAsync('userId');
        setTarget(userId ? '/(tabs)' : '/auth/login');
      } catch {
        setTarget('/auth/login');
      }
    };
    init();
  }, []);

  if (!target) {
    return (
      <View style={{ flex: 1, backgroundColor: '#127d96', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return <Redirect href={target} />;
}
