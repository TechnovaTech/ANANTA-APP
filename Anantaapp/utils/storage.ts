import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const getUserId = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.localStorage.getItem('userId');
    } else {
      return await SecureStore.getItemAsync('userId');
    }
  } catch (error) {
    console.error('Error getting userId:', error);
    return null;
  }
};
