import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Inter_400Regular, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/contexts/ThemeContext';

const HomeIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TrophyIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9H4.5C3.67157 9 3 9.67157 3 10.5V12C3 12.8284 3.67157 13.5 4.5 13.5H6M18 9H19.5C20.3284 9 21 9.67157 21 10.5V12C21 12.8284 20.3284 13.5 19.5 13.5H18M6 9V7C6 5.89543 6.89543 5 8 5H16C17.1046 5 18 5.89543 18 7V9M6 9V15C6 16.1046 6.89543 17 8 17H16C17.1046 17 18 16.1046 18 15V9M8 21H16M12 17V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LiveIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12V4C10 2.89543 10.8954 2 12 2Z" stroke={color} strokeWidth="2"/>
    <Path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 19V23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8 23H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ProfileIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#f7c14d' : '#127D96',
        tabBarInactiveTintColor: isDark ? '#999' : '#666666',
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : 'white',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#f7c14d' : '#E0E0E0',
          paddingBottom: Math.max(insets.bottom, 20),
          paddingTop: 10,
          height: 70 + Math.max(insets.bottom, 20),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 2,
          fontFamily: 'Inter_600SemiBold',
          color: isDark ? '#ccc' : undefined,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <TrophyIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live',
          tabBarIcon: ({ color }) => <LiveIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
