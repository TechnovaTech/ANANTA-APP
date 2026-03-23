import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '@/config/env';

type Tx = {
  id: number;
  amount: number;
  credit: boolean;
  type: string;
  note: string | null;
  otherUserName: string | null;
  createdAt: string | null;
};

type EarningsData = {
  totalGiftReceived: number;
  totalTaskReward: number;
  totalRecharge: number;
  totalSpent: number;
  totalEarned: number;
  currentBalance: number;
  history: Tx[];
};

const TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  GIFT_RECEIVED: { icon: 'gift',           label: 'Gift Received',  color: '#e91e8c' },
  GIFT_SENT:     { icon: 'gift-outline',   label: 'Gift Sent',      color: '#f97316' },
  TASK_REWARD:   { icon: 'trophy',         label: 'Task Reward',    color: '#22c55e' },
  RECHARGE:      { icon: 'wallet',         label: 'Recharge',       color: '#3b82f6' },
  SIGNUP_BONUS:  { icon: 'star',           label: 'Signup Bonus',   color: '#a855f7' },
};

function formatDate(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    '  ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function EarningsScreen() {
  const { isDark } = useTheme();
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const accent = isDark ? '#F7C14D' : '#127d96';

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId) return;
      const res = await fetch(`${ENV.API_BASE_URL}/api/app/earnings/${userId}`);
      if (res.ok) setData(await res.json());
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) => (
    <View style={[styles.statCard, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <ThemedText style={[styles.statValue, { color: isDark ? '#fff' : '#111' }]}>{Math.round(value)}</ThemedText>
      <ThemedText style={[styles.statLabel, { color: isDark ? '#aaa' : '#666' }]}>{label}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#ffb300'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? 'black' : 'white'} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Earnings</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={accent} />}
        >
          {/* Balance banner */}
          <LinearGradient
            colors={isDark ? ['#2a2a2a', '#1a1a1a'] : ['#127d96', '#0a5d75']}
            style={styles.balanceBanner}
          >
            <ThemedText style={styles.balanceLabel}>Current Balance</ThemedText>
            <View style={styles.balanceRow}>
              <Ionicons name="diamond" size={28} color="#FFD700" />
              <Text style={styles.balanceValue}>{Math.round(data?.currentBalance ?? 0)}</Text>
            </View>
            <ThemedText style={styles.balanceSub}>coins</ThemedText>
          </LinearGradient>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <StatCard icon="arrow-down-circle" label="Total Earned"   value={(data?.totalGiftReceived ?? 0) + (data?.totalTaskReward ?? 0)} color="#22c55e" />
            <StatCard icon="gift"              label="Gifts Received" value={data?.totalGiftReceived ?? 0} color="#e91e8c" />
            <StatCard icon="trophy"            label="Task Rewards"   value={data?.totalTaskReward ?? 0}   color="#f59e0b" />
          </View>

          {/* Transaction history */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: isDark ? '#fff' : '#222' }]}>Transaction History</ThemedText>

            {!data?.history?.filter(t => t.type === 'GIFT_RECEIVED' || t.type === 'TASK_REWARD').length ? (
              <View style={styles.empty}>
                <Ionicons name="receipt-outline" size={48} color={isDark ? '#444' : '#ccc'} />
                <ThemedText style={{ color: isDark ? '#666' : '#aaa', marginTop: 10 }}>No transactions yet</ThemedText>
              </View>
            ) : (
              data.history.filter(t => t.type === 'GIFT_RECEIVED' || t.type === 'TASK_REWARD').map(tx => {
                const meta = TYPE_META[tx.type] ?? { icon: 'ellipse', label: tx.type, color: '#888' };
                return (
                  <View key={tx.id} style={[styles.txRow, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}>
                    <View style={[styles.txIcon, { backgroundColor: meta.color + '22' }]}>
                      <Ionicons name={meta.icon as any} size={20} color={meta.color} />
                    </View>
                    <View style={styles.txInfo}>
                      <ThemedText style={[styles.txLabel, { color: isDark ? '#fff' : '#222' }]}>{meta.label}</ThemedText>
                      {!!tx.note && (
                        <ThemedText style={[styles.txNote, { color: isDark ? '#888' : '#999' }]} numberOfLines={1}>{tx.note}</ThemedText>
                      )}
                      {!!tx.createdAt && (
                        <ThemedText style={[styles.txDate, { color: isDark ? '#666' : '#bbb' }]}>{formatDate(tx.createdAt)}</ThemedText>
                      )}
                    </View>
                    <Text style={[styles.txAmount, { color: tx.credit ? '#22c55e' : '#ef4444' }]}>
                      {tx.credit ? '+' : '-'}{Math.round(tx.amount)}
                    </Text>
                  </View>
                );
              })
            )}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 25, height: 120,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', letterSpacing: 1 },
  placeholder: { width: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  balanceBanner: {
    margin: 16, borderRadius: 16, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  balanceValue: { color: '#FFD700', fontSize: 48, fontWeight: 'bold' },
  balanceSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  statCard: {
    width: '30%', flexGrow: 1, borderRadius: 14, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
  },
  statIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  statLabel: { fontSize: 11, textAlign: 'center' },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  txRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  txIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txLabel: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  txNote: { fontSize: 12, marginBottom: 2 },
  txDate: { fontSize: 11 },
  txAmount: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
