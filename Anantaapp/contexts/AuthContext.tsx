import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '@/config/env';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      let storedUserId: string | null = null;
      
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        storedUserId = window.localStorage.getItem('userId');
      } else {
        storedUserId = await SecureStore.getItemAsync('userId');
      }

      if (!storedUserId) {
        setIsAuthenticated(false);
        setUserId(null);
        setIsLoading(false);
        return;
      }

      // Validate with backend if available
      try {
        const response = await fetch(`${ENV.API_BASE_URL}/api/app/validate-auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: storedUserId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
            setUserId(storedUserId);
          } else {
            // Invalid user, clear storage
            await logout();
          }
        } else {
          // Server error, but user exists in storage - allow access
          console.warn('Backend validation failed, allowing cached user');
          setIsAuthenticated(true);
          setUserId(storedUserId);
        }
      } catch (error) {
        // Network error, but user exists in storage - allow access
        console.warn('Network error during auth validation, allowing cached user:', error);
        setIsAuthenticated(true);
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.removeItem('userId');
        window.localStorage.removeItem('userEmail');
      } else {
        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('userEmail');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsAuthenticated(false);
    setUserId(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      userId,
      checkAuth,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}