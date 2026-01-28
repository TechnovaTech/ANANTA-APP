import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function BackPackScreen() {
  const { isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('inventory');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isAudioCallActive, setIsAudioCallActive] = useState(false);

  const callFeatures = [
    {
      id: 1,
      name: 'Video Call',
      description: 'Start video call with viewers',
      icon: 'videocam',
      color: '#127d96',
      active: isVideoCallActive,
      onToggle: () => setIsVideoCallActive(!isVideoCallActive)
    },
    {
      id: 2,
      name: 'Audio Call',
      description: 'Start audio call with viewers',
      icon: 'call',
      color: '#4CAF50',
      active: isAudioCallActive,
      onToggle: () => setIsAudioCallActive(!isAudioCallActive)
    },
    {
      id: 3,
      name: 'Screen Share',
      description: 'Share your screen',
      icon: 'desktop',
      color: '#FF9800',
      active: false,
      onToggle: () => {}
    },
    {
      id: 4,
      name: 'Voice Effects',
      description: 'Apply voice filters',
      icon: 'mic',
      color: '#9C27B0',
      active: false,
      onToggle: () => {}
    }
  ];

  const renderCallFeature = (feature) => (
    <View key={feature.id} style={styles.callFeatureCard}>
      <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
        <Ionicons name={feature.icon} size={24} color="white" />
      </View>
      <View style={styles.featureInfo}>
        <Text style={styles.featureName}>{feature.name}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.toggleButton, feature.active && styles.activeToggle]}
        onPress={feature.onToggle}
      >
        <Text style={[styles.toggleText, feature.active && styles.activeToggleText]}>
          {feature.active ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const gifts = [
    {
      id: 1,
      name: 'Rose',
      quantity: 25,
      value: '10 coins',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=80&h=80&fit=crop'
    },
    {
      id: 2,
      name: 'Diamond',
      quantity: 5,
      value: '100 coins',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=80&h=80&fit=crop'
    },
    {
      id: 3,
      name: 'Crown',
      quantity: 2,
      value: '500 coins',
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=80&h=80&fit=crop'
    },
    {
      id: 4,
      name: 'Sports Car',
      quantity: 1,
      value: '1000 coins',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop'
    }
  ];

  const items = [
    {
      id: 1,
      name: 'Lucky Charm',
      quantity: 3,
      description: 'Increases gift chances',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=80&h=80&fit=crop'
    },
    {
      id: 2,
      name: 'VIP Pass',
      quantity: 1,
      description: '7 days remaining',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=80&h=80&fit=crop'
    },
    {
      id: 3,
      name: 'Boost Token',
      quantity: 10,
      description: 'Double XP for 1 hour',
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=80&h=80&fit=crop'
    }
  ];

  const renderGift = (gift) => (
    <View key={gift.id} style={[styles.itemCard, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
      <Image source={{ uri: gift.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: isDark ? 'white' : '#333' }]}>{gift.name}</Text>
        <Text style={[styles.itemValue, { color: isDark ? '#F7C14D' : '#127d96' }]}>{gift.value}</Text>
      </View>
      <View style={[styles.quantityBadge, { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]}>
        <Text style={styles.quantityText}>{gift.quantity}</Text>
      </View>
    </View>
  );

  const renderItem = (item) => (
    <View key={item.id} style={[styles.itemCard, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: isDark ? 'white' : '#333' }]}>{item.name}</Text>
        <Text style={[styles.itemDescription, { color: isDark ? '#ccc' : '#666' }]}>{item.description}</Text>
      </View>
      <View style={[styles.quantityBadge, { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]}>
        <Text style={styles.quantityText}>{item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? 'black' : 'white'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? 'black' : 'white' }]}>Back Pack</Text>
        <View style={styles.placeholder} />
      </LinearGradient>
      
      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'inventory' && styles.activeTab]}
          onPress={() => setSelectedTab('inventory')}
        >
          <Text style={[styles.tabText, { color: selectedTab === 'inventory' ? (isDark ? '#F7C14D' : '#127d96') : (isDark ? '#ccc' : '#666') }]}>
            Inventory
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'backpack' && styles.activeTab]}
          onPress={() => setSelectedTab('backpack')}
        >
          <Text style={[styles.tabText, { color: selectedTab === 'backpack' ? (isDark ? '#F7C14D' : '#127d96') : (isDark ? '#ccc' : '#666') }]}>
            Back Pack
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsList}>
          {selectedTab === 'inventory' 
            ? gifts.map(renderGift)
            : items.map(renderItem)
          }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    height: 120,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  placeholder: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: 'rgba(247, 193, 77, 0.1)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  itemsList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 14,
    color: '#127d96',
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
  },
  quantityBadge: {
    backgroundColor: '#127d96',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 30,
    alignItems: 'center',
  },
  quantityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});