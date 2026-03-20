import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SW = Dimensions.get('window').width;

const GOLD_COLORS: [string, string, ...string[]] = [
  'transparent', '#7A5828', '#C9A96E', '#F2CA6B', '#EEE0C0', '#F2CA6B', '#C9A96E', '#7A5828', 'transparent',
];
const GOLD_LOCATIONS: [number, number, ...number[]] = [0, 0.12, 0.38, 0.52, 0.62, 0.70, 0.80, 0.90, 1];

export default function AnantaLogo({ size = 'large' }: { size?: 'small' | 'medium' | 'large' }) {
  const [barWidth, setBarWidth] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;
  const running = useRef(false);

  useEffect(() => {
    if (barWidth === 0) return;
    running.current = true;

    const loop = () => {
      if (!running.current) return;
      animValue.setValue(0);
      Animated.timing(animValue, {
        toValue: -barWidth,
        duration: 2200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && running.current) loop();
      });
    };

    loop();
    return () => { running.current = false; };
  }, [barWidth]);

  const sizes = {
    small:  { word: SW * 0.10, bar: 2,   tag: 8,  gap: 8,  trackW: SW * 0.45 },
    medium: { word: SW * 0.13, bar: 3,   tag: 9,  gap: 10, trackW: SW * 0.60 },
    large:  { word: SW * 0.16, bar: 3.5, tag: 10, gap: 12, trackW: SW * 0.75 },
  };
  const c = sizes[size];

  return (
    <View style={styles.container}>
      <Text style={[styles.word, { fontSize: c.word }]}>ANANTA</Text>

      <View
        style={[styles.barTrack, { height: c.bar, marginTop: c.gap, width: c.trackW }]}
        onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
      >
        {barWidth > 0 && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0, bottom: 0,
              width: barWidth * 2,
              flexDirection: 'row',
              transform: [{ translateX: animValue }],
            }}
          >
            <LinearGradient
              colors={GOLD_COLORS}
              locations={GOLD_LOCATIONS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: barWidth, height: '100%' }}
            />
            <LinearGradient
              colors={GOLD_COLORS}
              locations={GOLD_LOCATIONS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: barWidth, height: '100%' }}
            />
          </Animated.View>
        )}
      </View>

      <Text style={[styles.tagline, { fontSize: c.tag, marginTop: c.gap + 2 }]}>
        STREAM WITHOUT LIMITS
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  word: {
    fontWeight: '900',
    letterSpacing: 6,
    color: '#F0EAE0',
    textShadowColor: 'rgba(242,202,107,0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  barTrack: {
    backgroundColor: '#1c1c1c',
    borderRadius: 100,
    overflow: 'hidden',
  },
  tagline: {
    fontWeight: '300',
    letterSpacing: 4,
    color: '#BBBBBB',
    textTransform: 'uppercase',
  },
});
