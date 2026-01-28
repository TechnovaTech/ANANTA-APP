import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function WalletScreen() {
  const { isDark } = useTheme();
  const [balance] = useState(2450);
  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'credit', amount: 600, description: 'Gold Plan Purchase', date: '2025-11-29', status: 'completed' },
    { id: '2', type: 'debit', amount: 50, description: 'Gift Sent', date: '2025-11-28', status: 'completed' },
    { id: '3', type: 'credit', amount: 250, description: 'Silver Plan Purchase', date: '2025-11-27', status: 'completed' },
    { id: '4', type: 'debit', amount: 100, description: 'Live Stream Boost', date: '2025-11-26', status: 'completed' },
    { id: '5', type: 'credit', amount: 1500, description: 'Platinum Plan Purchase', date: '2025-11-25', status: 'completed' },
    { id: '6', type: 'debit', amount: 25, description: 'Super Chat', date: '2025-11-24', status: 'completed' },
  ]);

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return 'time';
    if (status === 'failed') return 'close-circle';
    return type === 'credit' ? 'add-circle' : 'remove-circle';
  };

  const getTransactionColor = (type: string, status: string) => {
    if (status === 'pending') return '#FF9800';
    if (status === 'failed') return '#f44336';
    return type === 'credit' ? '#4CAF50' : '#f44336';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f9fa' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Modern Header */}
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isDark ? 'black' : 'white'} />
          </TouchableOpacity>
          
          <View style={styles.logoSection}>
            <Text style={[styles.appTitle, { color: isDark ? 'black' : 'white' }]}>My Wallet</Text>
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/recharge')}>
            <Ionicons name="add" size={24} color={isDark ? 'black' : 'white'} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <LinearGradient
          colors={isDark ? ['#F7C14D', '#E6B143', '#D4A03A'] : ['#127d96', '#0a5d75', '#083d4f']}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Ionicons name="diamond" size={32} color={isDark ? 'black' : 'white'} />
            <Text style={[styles.balanceLabel, { color: isDark ? 'rgba(0,0,0,0.8)' : 'white' }]}>Total Balance</Text>
          </View>
          <Text style={[styles.balanceAmount, { color: isDark ? 'black' : 'white' }]}>{balance.toLocaleString()} Coins</Text>
          <Text style={[styles.balanceSubtext, { color: isDark ? 'rgba(0,0,0,0.7)' : 'white' }]}>≈ ₹{(balance * 0.5).toLocaleString()}</Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
            onPress={() => router.push('/recharge')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={[styles.actionText, { color: isDark ? 'white' : '#333' }]}>Recharge</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="send" size={24} color="#2196F3" />
            </View>
            <Text style={[styles.actionText, { color: isDark ? 'white' : '#333' }]}>Send</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="card" size={24} color="#FF9800" />
            </View>
            <Text style={[styles.actionText, { color: isDark ? 'white' : '#333' }]}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: isDark ? '#F7C14D' : '#127d96' }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {transactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={[styles.transactionItem, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}>
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(transaction.type, transaction.status) + '20' }]}>
                  <Ionicons 
                    name={getTransactionIcon(transaction.type, transaction.status)} 
                    size={20} 
                    color={getTransactionColor(transaction.type, transaction.status)} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionDescription, { color: isDark ? 'white' : '#333' }]}>
                    {transaction.description}
                  </Text>
                  <Text style={[styles.transactionDate, { color: isDark ? '#888' : '#666' }]}>
                    {transaction.date}
                  </Text>
                </View>
              </View>
              
              <View style={styles.transactionRight}>
                <Text style={[
                  styles.transactionAmount,
                  { color: getTransactionColor(transaction.type, transaction.status) }
                ]}>
                  {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                </Text>
                <Text style={[styles.transactionStatus, { color: isDark ? '#888' : '#666' }]}>
                  {transaction.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Wallet Stats */}
        <View style={[styles.statsCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}>
          <Text style={[styles.statsTitle, { color: isDark ? 'white' : '#333' }]}>This Month</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>+1,850</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#888' : '#666' }]}>Earned</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#f44336' }]}>-175</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#888' : '#666' }]}>Spent</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#F7C14D' : '#127d96' }]}>12</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#888' : '#666' }]}>Transactions</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: height * 0.06,
    paddingBottom: height * 0.025,
    paddingHorizontal: width * 0.05,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  addButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: height * 0.1,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
    opacity: 0.9,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceSubtext: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(247,193,77,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F7C14D',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 10,
    textTransform: 'capitalize',
  },
  statsCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
});