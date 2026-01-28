/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#127D96';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#127D96',
    primaryDark: '#1B3F47',
    secondary: '#E5E5E5',
    inputBackground: '#E5E5E5',
    gradient: ['#127D96', '#15A3C7', '#1BB5D8'],
    cardGradient: ['#FFFFFF', '#F8F9FA'],
    accent: '#FFC107',
    accentDark: '#FF8F00',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#15A3C7',
    primaryDark: '#127D96',
    secondary: '#333333',
    inputBackground: '#333333',
    gradient: ['#1BB5D8', '#15A3C7', '#127D96'],
    cardGradient: ['#2A2D30', '#1F2225'],
    accent: '#FFD54F',
    accentDark: '#FFC107',
  },
};

export const Fonts = {
  inter: 'Inter_400Regular',
  interBold: 'Inter_700Bold',
  interSemiBold: 'Inter_600SemiBold',
  rounded: 'Inter_600SemiBold',
  mono: 'Inter_400Regular',
};

export const FontSizes = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  title: 48,
};
