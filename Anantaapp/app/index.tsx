import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // AuthGuard will show loading screen
    return <AuthGuard><></></AuthGuard>;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}
