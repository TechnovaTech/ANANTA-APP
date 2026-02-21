import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const userId = window.localStorage.getItem('userId');
      setTarget(userId ? '/(tabs)' : '/auth/login');
      return;
    }
    setTarget('/auth/login');
  }, []);

  if (!target) {
    return null;
  }

  return <Redirect href={target} />;
}
