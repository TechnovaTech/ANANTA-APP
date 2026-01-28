import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function EntriesFramesScreen() {
  const [selectedTab, setSelectedTab] = useState('entries');

  const entryEffects = [
    {
      id: 1,
      name: 'Golden Entry',
      price: '500 coins',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
      owned: true
    },
    {
      id: 2,
      name: 'Diamond Entry',
      price: '1000 coins',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop',
      owned: false
    },
    {
      id: 3,
      name: 'Fire Entry',
      price: '750 coins',
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=100&h=100&fit=crop',
      owned: true
    },
    {
      id: 4,
      name: 'Royal Entry',
      price: '1200 coins',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      owned: false
    }
  ];

  const frameEffects = [
    {
      id: 1,
      name: 'Golden Frame',
      price: '300 coins',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
      owned: true
    },
    {
      id: 2,
      name: 'Silver Frame',
      price: '200 coins',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop',
      owned: false
    },
    {
      id: 3,
      name: 'Rainbow Frame',
      price: '800 coins',
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=100&h=100&fit=crop',
      owned: false
    },
    {
      id: 4,
      name: 'VIP Frame',
      price: '1500 coins',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      owned: true
    }
  ];

  const renderItem = (item) => (
    <View key={item.id} style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <View style={styles.itemActions}>
        {item.owned ? (
          <View style={styles.ownedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.ownedText}>Owned</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Entries & Frames</Text>
          <View style={styles.titleUnderline} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'entries' && styles.activeTab]}
          onPress={() => setSelectedTab('entries')}
        >
          <Text style={[styles.tabText, selectedTab === 'entries' && styles.activeTabText]}>
            Entry Effects
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'frames' && styles.activeTab]}
          onPress={() => setSelectedTab('frames')}
        >
          <Text style={[styles.tabText, selectedTab === 'frames' && styles.activeTabText]}>
            Profile Frames
          </Text>
        </TouchableOpacity>
      </View>

      {/* Coin Balance */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceCard}>
          <Ionicons name="diamond" size={20} color="#FFD700" />
          <Text style={styles.balanceText}>Your Balance: 2,450 coins</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {selectedTab === 'entries' 
            ? entryEffects.map(renderItem)
            : frameEffects.map(renderItem)
          }
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            {selectedTab === 'entries' ? 'About Entry Effects' : 'About Profile Frames'}
          </Text>
          <Text style={styles.infoText}>
            {selectedTab === 'entries' 
              ? 'Entry effects are displayed when you join a live room. Show your style and make a grand entrance!'
              : 'Profile frames enhance your avatar appearance in live rooms and chat. Stand out from the crowd!'
            }
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  titleUnderline: {
    width: 60,
    height: 2,
    backgroundColor: '#127d96',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#127d96',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#127d96',
    fontWeight: 'bold',
  },
  balanceContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  grid: {
    paddingHorizontal: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#127d96',
    fontWeight: '500',
  },
  itemActions: {
    justifyContent: 'center',
  },
  ownedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  ownedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  buyButton: {
    backgroundColor: '#127d96',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});