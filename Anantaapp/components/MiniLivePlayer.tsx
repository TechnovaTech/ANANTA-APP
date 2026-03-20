import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { RtcSurfaceView } from '@/agoraClient';
import { useLive } from '../contexts/LiveContext';

export default function MiniLivePlayer() {
  const { liveSession, isMinimized, expandLive, clearLive } = useLive();
  const { width, height } = Dimensions.get('window');
  const cardWidth = 150;
  const cardHeight = 150;
  const minX = 12;
  const minY = 12;
  const maxX = Math.max(minX, width - cardWidth - 12);
  const maxY = Math.max(minY, height - cardHeight - 12);
  const initialX = maxX;
  const initialY = Math.max(minY, height - cardHeight - 100);
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  const w1 = useRef(new Animated.Value(0.3)).current;
  const w2 = useRef(new Animated.Value(0.3)).current;
  const w3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!isMinimized) return;
    const loop = (val: Animated.Value, dur: number) =>
      Animated.loop(Animated.sequence([
        Animated.timing(val, { toValue: 1, duration: dur, useNativeDriver: true }),
        Animated.timing(val, { toValue: 0.3, duration: dur, useNativeDriver: true }),
      ]));
    const a1 = loop(w1, 400);
    const a2 = loop(w2, 600);
    const a3 = loop(w3, 500);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [isMinimized]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gesture) =>
        Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const x = (pan.x as any)._value;
        const y = (pan.y as any)._value;
        const clampedX = Math.min(Math.max(x, minX), maxX);
        const clampedY = Math.min(Math.max(y, minY), maxY);
        pan.setValue({ x: clampedX, y: clampedY });
      },
    })
  ).current;

  if (!liveSession || !isMinimized) return null;

  const handleExpand = () => {
    expandLive();
    router.push({
      pathname: (liveSession.type === 'video' ? '/live/video' : '/live/audio') as any,
      params: liveSession.routeParams,
    });
  };

  const handleStop = async () => {
    await liveSession.endLive();
    clearLive();
  };

  return (
    <Animated.View
      style={[styles.container, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={handleExpand} activeOpacity={0.9} style={styles.card}>
        {/* Visual area */}
        <View style={styles.visual}>
          {liveSession.type === 'video' ? (
            <View style={styles.videoBg}>
              <RtcSurfaceView
                canvas={{ uid: 0 }}
                style={styles.videoSurface}
                zOrderMediaOverlay={false}
              />
            </View>
          ) : (
            <View style={styles.audioBg}>
              {[w1, w2, w3, w2, w1].map((w, i) => (
                <Animated.View
                  key={i}
                  style={[styles.bar, { transform: [{ scaleY: w }] }]}
                />
              ))}
            </View>
          )}

          {/* LIVE badge */}
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>

          {/* Stop button */}
          <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
            <Ionicons name="close-circle" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Info row */}
        <View style={styles.info}>
          <Ionicons
            name={liveSession.type === 'video' ? 'videocam' : 'mic'}
            size={12}
            color="#127d96"
          />
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.title} numberOfLines={1}>{liveSession.title}</Text>
            <Text style={styles.host} numberOfLines={1}>@{liveSession.hostUsername}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 9999,
    elevation: 20,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: '#111',
  },
  visual: {
    height: 110,
    position: 'relative',
  },
  videoBg: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoSurface: {
    width: '100%',
    height: '100%',
  },
  audioBg: {
    flex: 1,
    backgroundColor: '#0a5d75',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bar: {
    width: 5,
    height: 30,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  liveBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ff4444',
  },
  liveText: {
    color: '#ff4444',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stopBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,0,0,0.7)',
    borderRadius: 12,
    padding: 1,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.88)',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  title: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  host: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
  },
});
