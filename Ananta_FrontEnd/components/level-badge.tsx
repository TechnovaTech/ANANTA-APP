import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const StarIcon = ({ size = 12, color = 'white' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color}/>
  </Svg>
);

interface LevelBadgeProps {
  level: number;
  size?: 'small' | 'medium' | 'large';
  showStar?: boolean;
  style?: any;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  size = 'small', 
  showStar = true,
  style 
}) => {
  const badgeSize = size === 'large' ? 60 : size === 'medium' ? 40 : 24;
  const fontSize = size === 'large' ? 20 : size === 'medium' ? 14 : 10;
  const starSize = size === 'large' ? 16 : size === 'medium' ? 12 : 8;
  
  return (
    <View style={[styles.container, { width: badgeSize, height: badgeSize }, style]}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={[styles.badge, { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]}
      >
        <ThemedText style={[styles.text, { fontSize }]}>{level}</ThemedText>
      </LinearGradient>
      {showStar && (
        <View style={[styles.starContainer, { 
          top: size === 'large' ? -4 : -2, 
          right: size === 'large' ? -4 : -2 
        }]}>
          <View style={[styles.starBadge, { 
            padding: size === 'large' ? 3 : 2,
            borderRadius: size === 'large' ? 10 : 8
          }]}>
            <StarIcon size={starSize} color="white" />
          </View>
        </View>
      )}
    </View>
  );
};

// Compact version for live rooms and user cards
export const CompactLevelBadge: React.FC<{ level: number; style?: any }> = ({ level, style }) => {
  return (
    <View style={[styles.compactBadge, style]}>
      <ThemedText style={styles.compactText}>Level {level}</ThemedText>
      <StarIcon size={10} color="#FFD700" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  starContainer: {
    position: 'absolute',
  },
  starBadge: {
    backgroundColor: '#127d96',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#127d96',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compactText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginRight: 4,
  },
});