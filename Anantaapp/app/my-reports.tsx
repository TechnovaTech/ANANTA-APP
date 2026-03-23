import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, ActivityIndicator, RefreshControl, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '@/contexts/ThemeContext';
import { ENV } from '@/config/env';

const { width, height } = Dimensions.get('window');

const STATUS_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  PENDING:   { color: '#f59e0b', icon: 'time-outline',         label: 'Pending' },
  REVIEWED:  { color: '#3182ce', icon: 'checkmark-circle-outline', label: 'Reviewed' },
  DISMISSED: { color: '#9ca3af', icon: 'close-circle-outline', label: 'Dismissed' },
};

export default function MyReportsScreen() {
  const { isDark } = useTheme();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const accent = isDark ? '#F7C14D' : '#127d96';

  const load = async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId) return;
      const res = await fetch(`${ENV.API_BASE_URL}/api/app/reports/my?reporterId=${userId}`);
      if (res.ok) setReports(await res.json());
    } catch {}
  };

  useFocusEffect(useCallback(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f9fa' }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isDark ? 'black' : 'white'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>My Reports</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[accent]} tintColor={accent} />}
        >
          {reports.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="flag-outline" size={52} color={isDark ? '#444' : '#ccc'} />
              <Text style={[styles.emptyText, { color: isDark ? '#666' : '#aaa' }]}>No reports submitted yet</Text>
            </View>
          ) : (
            reports.map(r => {
              const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.PENDING;
              return (
                <View key={r.id} style={[styles.card, { backgroundColor: isDark ? '#1a1a1a' : 'white', borderLeftColor: cfg.color }]}>
                  {/* Header row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardUser}>
                      <Ionicons name="person-circle-outline" size={18} color={isDark ? '#aaa' : '#666'} />
                      <Text style={[styles.cardUsername, { color: isDark ? 'white' : '#1a202c' }]}>
                        {r.reportedUserName || r.reportedUserId}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.color + '22' }]}>
                      <Ionicons name={cfg.icon as any} size={13} color={cfg.color} />
                      <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                  </View>

                  {/* Reason */}
                  <Text style={[styles.reason, { color: isDark ? '#ccc' : '#4a5568' }]}>{r.reason}</Text>

                  {/* Admin note */}
                  {r.adminNote ? (
                    <View style={[styles.noteBox, { backgroundColor: isDark ? '#2a2a2a' : '#f0f9ff', borderColor: isDark ? '#333' : '#bee3f8' }]}>
                      <Ionicons name="information-circle-outline" size={14} color={isDark ? '#60a5fa' : '#3182ce'} />
                      <Text style={[styles.noteText, { color: isDark ? '#93c5fd' : '#2b6cb0' }]}>
                        Admin: {r.adminNote}
                      </Text>
                    </View>
                  ) : null}

                  {/* Date */}
                  <Text style={[styles.date, { color: isDark ? '#555' : '#a0aec0' }]}>
                    {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              );
            })
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: height * 0.06,
    paddingBottom: height * 0.025,
    paddingHorizontal: 20,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardUser: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardUsername: { fontSize: 15, fontWeight: '700' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  reason: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 10,
  },
  noteText: { fontSize: 13, flex: 1, lineHeight: 18 },
  date: { fontSize: 12 },
});
