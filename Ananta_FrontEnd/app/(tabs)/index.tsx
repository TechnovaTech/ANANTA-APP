import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View, Animated, Text, StatusBar } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;
const scale = width / 375;

export default function HomeScreen() {
  const { isDark } = useTheme();
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  
  // Smooth animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleFollow = (userId: number) => {
    setFollowedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const bannerImages = [
    require('@/assets/images/xvv 1.png'),
    require('@/assets/images/h1.png.png'),
    require('@/assets/images/h2.png.png'),
    require('@/assets/images/h3.png.png'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
        bannerScrollRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const videos = [
    { id: 1, title: '#joy with life partner', user: 'Rachel James', location: 'India', views: '23K', image: require('@/assets/images/h1.png.png') },
    { id: 2, title: '#Alone Life', user: 'Micale Johans', location: 'India', views: '26B', image: require('@/assets/images/h2.png.png') },
    { id: 3, title: '#Smile can win', user: 'Dwayen jack', location: 'U.S.A', views: '23K', image: require('@/assets/images/h3.png.png') },
    { id: 4, title: '#Fashion adda', user: 'Jenny styler', location: 'Spain', views: '26B', image: require('@/assets/images/h4.png.png') },
    { id: 5, title: '#Dance vibes', user: 'Alex Chen', location: 'Canada', views: '18K', image: require('@/assets/images/h1.png.png') },
    { id: 6, title: '#Music session', user: 'Emma Davis', location: 'UK', views: '31K', image: require('@/assets/images/h2.png.png') },
    { id: 7, title: '#Art & Craft', user: 'Lisa Park', location: 'Korea', views: '15K', image: require('@/assets/images/h3.png.png') },
    { id: 8, title: '#Gaming Live', user: 'John Smith', location: 'Australia', views: '42K', image: require('@/assets/images/h4.png.png') },
    { id: 9, title: '#Cooking Show', user: 'Maria Garcia', location: 'Mexico', views: '28K', image: require('@/assets/images/h1.png.png') },
  ];

  const audioStreams = [
    { id: 1, title: 'Morning Meditation', user: 'Sarah Wilson', location: 'India', listeners: '1.2K', image: require('@/assets/images/h1.png.png') },
    { id: 2, title: 'Jazz Evening', user: 'Mike Johnson', location: 'USA', listeners: '850', image: require('@/assets/images/h2.png.png') },
    { id: 3, title: 'Podcast Talk', user: 'Emma Davis', location: 'UK', listeners: '2.1K', image: require('@/assets/images/h3.png.png') },
    { id: 4, title: 'Music Lounge', user: 'Alex Chen', location: 'Canada', listeners: '950', image: require('@/assets/images/h4.png.png') },
    { id: 5, title: 'Chill Beats', user: 'Lisa Park', location: 'Korea', listeners: '1.8K', image: require('@/assets/images/h1.png.png') },
    { id: 6, title: 'Night Stories', user: 'John Smith', location: 'Australia', listeners: '720', image: require('@/assets/images/h2.png.png') },
    { id: 7, title: 'Acoustic Session', user: 'Maria Garcia', location: 'Mexico', listeners: '1.5K', image: require('@/assets/images/h3.png.png') },
    { id: 8, title: 'Radio Show', user: 'David Lee', location: 'Singapore', listeners: '2.3K', image: require('@/assets/images/h4.png.png') },
    { id: 9, title: 'Meditation Hour', user: 'Anna Kim', location: 'Japan', listeners: '1.1K', image: require('@/assets/images/h1.png.png') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f8f9fa' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Modern Header */}
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoSection}>
            <Text style={[styles.appTitle, { color: isDark ? 'black' : 'white' }]}>ANANTA</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/search')}>
              <Ionicons name="search" size={22} color={isDark ? 'black' : 'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notification')}>
              <Ionicons name="notifications-outline" size={22} color={isDark ? 'black' : 'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={22} color={isDark ? 'black' : 'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/wallet')}>
              <Ionicons name="wallet-outline" size={22} color={isDark ? 'black' : 'white'} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
      
      {/* Modern Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          <TouchableOpacity 
            style={[styles.tab, { backgroundColor: isDark ? 'rgba(247,193,77,0.1)' : 'rgba(18,125,150,0.1)' }, activeTab === 'video' && { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]}
            onPress={() => setActiveTab('video')}
          >
            <Ionicons 
              name="videocam" 
              size={18} 
              color={activeTab === 'video' ? (isDark ? 'black' : 'white') : (isDark ? '#F7C14D' : '#127d96')} 
            />
            <Text style={[styles.tabText, activeTab === 'video' && styles.activeTabText, { color: activeTab === 'video' ? (isDark ? 'black' : 'white') : (isDark ? '#F7C14D' : '#127d96') }]}>Video Live</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, { backgroundColor: isDark ? 'rgba(247,193,77,0.1)' : 'rgba(18,125,150,0.1)' }, activeTab === 'audio' && { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]}
            onPress={() => setActiveTab('audio')}
          >
            <Ionicons 
              name="musical-notes" 
              size={18} 
              color={activeTab === 'audio' ? (isDark ? 'black' : 'white') : (isDark ? '#F7C14D' : '#127d96')} 
            />
            <Text style={[styles.tabText, activeTab === 'audio' && styles.activeTabText, { color: activeTab === 'audio' ? (isDark ? 'black' : 'white') : (isDark ? '#F7C14D' : '#127d96') }]}>Audio Live</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, { backgroundColor: isDark ? 'rgba(247,193,77,0.1)' : 'rgba(18,125,150,0.1)' }]}
            onPress={() => router.push('/followers')}
          >
            <Ionicons name="people" size={18} color={isDark ? '#F7C14D' : '#127d96'} />
            <Text style={[styles.tabText, { color: isDark ? '#F7C14D' : '#127d96' }]}>Followers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, { backgroundColor: isDark ? 'rgba(247,193,77,0.1)' : 'rgba(18,125,150,0.1)' }]}
            onPress={() => router.push('/following')}
          >
            <Ionicons name="person-add" size={18} color={isDark ? '#F7C14D' : '#127d96'} />
            <Text style={[styles.tabText, { color: isDark ? '#F7C14D' : '#127d96' }]}>Following</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Banner */}
        <Animated.View style={[styles.bannerSection, { opacity: fadeAnim }]}>
          <ScrollView 
            ref={bannerScrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            pagingEnabled 
            style={styles.bannerContainer}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentBannerIndex(newIndex);
            }}
          >
            {bannerImages.map((image, index) => (
              <View key={index} style={styles.featuredCard}>
                <Image source={image} style={styles.featuredImage} />
                <View style={[styles.playButton, { backgroundColor: isDark ? 'rgba(247,193,77,0.9)' : 'rgba(18,125,150,0.9)' }]}>
                  <Ionicons name="play" size={24} color="white" />
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Banner Indicators */}
          <View style={styles.bannerIndicators}>
            {bannerImages.map((_, index) => (
              <View 
                key={index} 
                style={[styles.indicator, { backgroundColor: isDark ? 'rgba(247,193,77,0.3)' : 'rgba(18,125,150,0.3)' }, currentBannerIndex === index && { backgroundColor: isDark ? '#F7C14D' : '#127d96' }]} 
              />
            ))}
          </View>
        </Animated.View>
        
        {/* Content Grid - Asymmetric Layout */}
        <Animated.View style={[styles.contentGrid, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.leftColumn}>
            {/* Large card on left */}
            <TouchableOpacity 
              style={[styles.largeCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
              onPress={() => {
                const item = (activeTab === 'video' ? videos : audioStreams)[0];
                if (activeTab === 'video') {
                  router.push({
                    pathname: '/live/video',
                    params: {
                      title: item.title,
                      user: item.user,
                      location: item.location,
                      views: (item as any).views,
                      image: JSON.stringify(item.image)
                    }
                  });
                } else {
                  router.push({
                    pathname: '/live/audio',
                    params: {
                      title: item.title,
                      user: item.user,
                      location: item.location,
                      listeners: (item as any).listeners,
                      image: JSON.stringify(item.image)
                    }
                  });
                }
              }}
            >
              <View style={styles.largeCardImageContainer}>
                <Image source={bannerImages[currentBannerIndex]} style={styles.largeCardImage} />
                {activeTab === 'audio' && (
                  <View style={[styles.audioIndicator, { backgroundColor: isDark ? 'rgba(247,193,77,0.9)' : 'rgba(18,125,150,0.9)' }]}>
                    <Ionicons name="musical-notes" size={24} color="white" />
                  </View>
                )}
                <View style={styles.liveTag}>
                  <Text style={styles.liveTagText}>LIVE</Text>
                </View>
                <View style={styles.viewerCount}>
                  <Ionicons 
                    name={activeTab === 'video' ? 'eye' : 'headset'} 
                    size={14} 
                    color="white" 
                  />
                  <Text style={styles.viewerText}>
                    {activeTab === 'video' ? (videos[0] as any).views : (audioStreams[0] as any).listeners}
                  </Text>
                </View>
              </View>
              
              <View style={styles.largeCardContent}>
                <Text style={[styles.largeCardTitle, { color: isDark ? 'white' : '#333' }]} numberOfLines={2}>
                  {(activeTab === 'video' ? videos : audioStreams)[0].title}
                </Text>
                
                <View style={styles.userSection}>
                  <Image source={(activeTab === 'video' ? videos : audioStreams)[0].image} style={styles.userAvatar} />
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: isDark ? '#ccc' : '#666' }]}>
                      {(activeTab === 'video' ? videos : audioStreams)[0].user}
                    </Text>
                    <Text style={[styles.userLocation, { color: isDark ? '#888' : '#999' }]}>
                      {(activeTab === 'video' ? videos : audioStreams)[0].location}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.followBtn,
                      { backgroundColor: isDark ? '#F7C14D' : '#127d96' },
                      followedUsers.includes((activeTab === 'video' ? videos : audioStreams)[0].id) && styles.followingBtn
                    ]}
                    onPress={() => handleFollow((activeTab === 'video' ? videos : audioStreams)[0].id)}
                  >
                    <Text style={[styles.followBtnText, { color: isDark ? 'black' : 'white' }]}>
                      {followedUsers.includes((activeTab === 'video' ? videos : audioStreams)[0].id) ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Two medium cards below large card */}
            <View style={styles.mediumCardsRow}>
              {(activeTab === 'video' ? videos : audioStreams).slice(5, 7).map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.mediumCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
                  onPress={() => {
                    if (activeTab === 'video') {
                      router.push({
                        pathname: '/live/video',
                        params: {
                          title: item.title,
                          user: item.user,
                          location: item.location,
                          views: (item as any).views,
                          image: JSON.stringify(item.image)
                        }
                      });
                    } else {
                      router.push({
                        pathname: '/live/audio',
                        params: {
                          title: item.title,
                          user: item.user,
                          location: item.location,
                          listeners: (item as any).listeners,
                          image: JSON.stringify(item.image)
                        }
                      });
                    }
                  }}
                >
                  <View style={styles.mediumCardImageContainer}>
                    <Image source={item.image} style={styles.mediumCardImage} />
                    {activeTab === 'audio' && (
                      <View style={[styles.smallAudioIndicator, { backgroundColor: isDark ? 'rgba(247,193,77,0.9)' : 'rgba(18,125,150,0.9)' }]}>
                        <Ionicons name="musical-notes" size={16} color="white" />
                      </View>
                    )}
                    <View style={styles.smallLiveTag}>
                      <Text style={styles.smallLiveTagText}>LIVE</Text>
                    </View>
                  </View>
                  
                  <View style={styles.mediumCardContent}>
                    <Text style={[styles.mediumCardTitle, { color: isDark ? 'white' : '#333' }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.smallUserName, { color: isDark ? '#ccc' : '#666' }]}>
                      {item.user}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Two additional medium cards below */}
            <View style={styles.mediumCardsRow}>
              {(activeTab === 'video' ? videos : audioStreams).slice(7, 9).map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.mediumCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
                  onPress={() => {
                    if (activeTab === 'video') {
                      router.push({
                        pathname: '/live/video',
                        params: {
                          title: item.title,
                          user: item.user,
                          location: item.location,
                          views: (item as any).views,
                          image: JSON.stringify(item.image)
                        }
                      });
                    } else {
                      router.push({
                        pathname: '/live/audio',
                        params: {
                          title: item.title,
                          user: item.user,
                          location: item.location,
                          listeners: (item as any).listeners,
                          image: JSON.stringify(item.image)
                        }
                      });
                    }
                  }}
                >
                  <View style={styles.mediumCardImageContainer}>
                    <Image source={item.image} style={styles.mediumCardImage} />
                    {activeTab === 'audio' && (
                      <View style={[styles.smallAudioIndicator, { backgroundColor: isDark ? 'rgba(247,193,77,0.9)' : 'rgba(18,125,150,0.9)' }]}>
                        <Ionicons name="musical-notes" size={16} color="white" />
                      </View>
                    )}
                    <View style={styles.smallLiveTag}>
                      <Text style={styles.smallLiveTagText}>LIVE</Text>
                    </View>
                  </View>
                  
                  <View style={styles.mediumCardContent}>
                    <Text style={[styles.mediumCardTitle, { color: isDark ? 'white' : '#333' }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.smallUserName, { color: isDark ? '#ccc' : '#666' }]}>
                      {item.user}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.rightColumn}>
            {/* Three smaller cards on right */}
            {(activeTab === 'video' ? videos : audioStreams).slice(1, 4).map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.smallCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
                onPress={() => {
                  if (activeTab === 'video') {
                    router.push({
                      pathname: '/live/video',
                      params: {
                        title: item.title,
                        user: item.user,
                        location: item.location,
                        views: (item as any).views,
                        image: JSON.stringify(item.image)
                      }
                    });
                  } else {
                    router.push({
                      pathname: '/live/audio',
                      params: {
                        title: item.title,
                        user: item.user,
                        location: item.location,
                        listeners: (item as any).listeners,
                        image: JSON.stringify(item.image)
                      }
                    });
                  }
                }}
              >
                <View style={styles.smallCardImageContainer}>
                  <Image source={item.image} style={styles.smallCardImage} />
                  {activeTab === 'audio' && (
                    <View style={[styles.smallAudioIndicator, { backgroundColor: isDark ? 'rgba(247,193,77,0.9)' : 'rgba(18,125,150,0.9)' }]}>
                      <Ionicons name="musical-notes" size={16} color="white" />
                    </View>
                  )}
                  <View style={styles.smallLiveTag}>
                    <Text style={styles.smallLiveTagText}>LIVE</Text>
                  </View>
                </View>
                
                <View style={styles.smallCardContent}>
                  <Text style={[styles.smallCardTitle, { color: isDark ? 'white' : '#333' }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.smallUserName, { color: isDark ? '#ccc' : '#666' }]}>
                    {item.user}
                  </Text>
                  <Text style={[styles.smallViewerText, { color: isDark ? '#888' : '#999' }]}>
                    {activeTab === 'video' ? `${(item as any).views} views` : `${(item as any).listeners} listening`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Music session card moved below */}
            <TouchableOpacity 
              style={[styles.smallCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
              onPress={() => {
                const item = (activeTab === 'video' ? videos : audioStreams)[5]; // Music session
                if (activeTab === 'video') {
                  router.push({
                    pathname: '/live/video',
                    params: {
                      title: item.title,
                      user: item.user,
                      location: item.location,
                      views: (item as any).views,
                      image: JSON.stringify(item.image)
                    }
                  });
                } else {
                  router.push({
                    pathname: '/live/audio',
                    params: {
                      title: item.title,
                      user: item.user,
                      location: item.location,
                      listeners: (item as any).listeners,
                      image: JSON.stringify(item.image)
                    }
                  });
                }
              }}
            >
              <View style={styles.smallCardImageContainer}>
                <Image source={(activeTab === 'video' ? videos : audioStreams)[5].image} style={styles.smallCardImage} />
                {activeTab === 'audio' && (
                  <View style={[styles.smallAudioIndicator, { backgroundColor: isDark ? 'rgba(247,193,77,0.9)' : 'rgba(18,125,150,0.9)' }]}>
                    <Ionicons name="musical-notes" size={16} color="white" />
                  </View>
                )}
                <View style={styles.smallLiveTag}>
                  <Text style={styles.smallLiveTagText}>LIVE</Text>
                </View>
              </View>
              
              <View style={styles.smallCardContent}>
                <Text style={[styles.smallCardTitle, { color: isDark ? 'white' : '#333' }]} numberOfLines={1}>
                  {(activeTab === 'video' ? videos : audioStreams)[5].title}
                </Text>
                <Text style={[styles.smallUserName, { color: isDark ? '#ccc' : '#666' }]}>
                  {(activeTab === 'video' ? videos : audioStreams)[5].user}
                </Text>
                <Text style={[styles.smallViewerText, { color: isDark ? '#888' : '#999' }]}>
                  {activeTab === 'video' ? `${((activeTab === 'video' ? videos : audioStreams)[5] as any).views} views` : `${((activeTab === 'video' ? videos : audioStreams)[5] as any).listeners} listening`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Bottom row - 1 card */}
        <Animated.View style={[styles.bottomRow, { opacity: fadeAnim }]}>
          {(activeTab === 'video' ? videos : audioStreams).slice(7, 8).map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.bottomCard, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}
              onPress={() => {
                if (activeTab === 'video') {
                  router.push({
                    pathname: '/live/video',
                    params: {
                      title: item.title,
                      user: item.user,
                      location: item.location,
                      views: (item as any).views,
                      image: JSON.stringify(item.image)
                    }
                  });
                } else {
                  router.push({
                    pathname: '/live/audio',
                    params: {
                      title: item.title,
                      user: item.user,
                      location: item.location,
                      listeners: (item as any).listeners,
                      image: JSON.stringify(item.image)
                    }
                  });
                }
              }}
            >
              <View style={styles.bottomCardImageContainer}>
                <Image source={item.image} style={styles.bottomCardImage} />
                {activeTab === 'audio' && (
                  <View style={[styles.audioIndicator, { backgroundColor: isDark ? 'rgba(247,193,77,0.9)' : 'rgba(18,125,150,0.9)' }]}>
                    <Ionicons name="musical-notes" size={20} color="white" />
                  </View>
                )}
                <View style={styles.liveTag}>
                  <Text style={styles.liveTagText}>LIVE</Text>
                </View>
                <View style={styles.viewerCount}>
                  <Ionicons 
                    name={activeTab === 'video' ? 'eye' : 'headset'} 
                    size={12} 
                    color="white" 
                  />
                  <Text style={styles.viewerText}>
                    {activeTab === 'video' ? (item as any).views : (item as any).listeners}
                  </Text>
                </View>
              </View>
              
              <View style={styles.bottomCardContent}>
                <Text style={[styles.bottomCardTitle, { color: isDark ? 'white' : '#333' }]} numberOfLines={2}>
                  {item.title}
                </Text>
                
                <View style={styles.userSection}>
                  <Image source={item.image} style={styles.userAvatar} />
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: isDark ? '#ccc' : '#666' }]}>
                      {item.user}
                    </Text>
                    <Text style={[styles.userLocation, { color: isDark ? '#888' : '#999' }]}>
                      {item.location}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.followBtn,
                      { backgroundColor: isDark ? '#F7C14D' : '#127d96' },
                      followedUsers.includes(item.id) && styles.followingBtn
                    ]}
                    onPress={() => handleFollow(item.id)}
                  >
                    <Text style={[styles.followBtnText, { color: isDark ? 'black' : 'white' }]}>
                      {followedUsers.includes(item.id) ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
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
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: width * 0.04,
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tabScrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(18,125,150,0.1)',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#127d96',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#127d96',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: height * 0.1,
  },
  bannerSection: {
    marginVertical: 20,
  },
  bannerContainer: {
    height: 200,
  },
  featuredCard: {
    width: width - 40,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 15,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(18,125,150,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(18,125,150,0.3)',
  },
  activeIndicator: {
    backgroundColor: '#127d96',
  },
  contentGrid: {
    flexDirection: 'row',
    gap: 15,
    paddingBottom: 20,
  },
  leftColumn: {
    flex: 1.2,
  },
  rightColumn: {
    flex: 0.8,
    gap: 10,
  },
  largeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  largeCardImageContainer: {
    position: 'relative',
    height: 220,
  },
  largeCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  largeCardContent: {
    padding: 16,
  },
  largeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 22,
  },
  smallCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  smallCardImageContainer: {
    position: 'relative',
    height: 85,
  },
  smallCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  smallCardContent: {
    padding: 8,
  },
  smallCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 16,
  },
  smallUserName: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  smallViewerText: {
    fontSize: 9,
  },
  smallAudioIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(18,125,150,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallLiveTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  smallLiveTagText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  mediumCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  mediumCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mediumCardImageContainer: {
    position: 'relative',
    height: 100,
  },
  mediumCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediumCardContent: {
    padding: 10,
  },
  mediumCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 16,
  },
  bottomRow: {
    justifyContent: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  bottomCard: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomCardImageContainer: {
    position: 'relative',
    height: 120,
  },
  bottomCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomCardContent: {
    padding: 12,
  },
  bottomCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  audioIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(18,125,150,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveTagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewerCount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  viewerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },

  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 10,
  },
  followBtn: {
    backgroundColor: '#127d96',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followingBtn: {
    backgroundColor: '#666',
  },
  followBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});