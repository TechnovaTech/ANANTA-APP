import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, StatusBar,
  ScrollView, Image, TextInput, Modal, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '@/config/env';

const resolveImage = (v: string | null | undefined) => {
  if (!v) return null;
  if (v.startsWith('http') || v.startsWith('data:')) return v;
  if (v.startsWith('/uploads/')) return `${ENV.API_BASE_URL}${v}`;
  if (v.length > 100) return `data:image/jpeg;base64,${v}`;
  return v;
};

export default function RoomAdminScreen() {
  const { isDark } = useTheme();
  const accent = isDark ? '#F7C14D' : '#127d96';
  const accentText = isDark ? 'black' : 'white';

  const [roomAdmins, setRoomAdmins] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [search, setSearch] = useState('');
  const [myUserId, setMyUserId] = useState('');

  useEffect(() => {
    const load = async () => {
      const uid = Platform.OS === 'web'
        ? window.localStorage.getItem('userId')
        : await SecureStore.getItemAsync('userId');
      if (!uid) return;
      setMyUserId(uid);

      // Load saved room admins from backend
      try {
        const res = await fetch(`${ENV.API_BASE_URL}/api/app/room-admins/${uid}`);
        if (res.ok) {
          const data = await res.json();
          setRoomAdmins(Array.isArray(data) ? data : []);
        }
      } catch {}

      // Load followers
      try {
        const res = await fetch(`${ENV.API_BASE_URL}/api/app/followers/${uid}`);
        if (res.ok) {
          const data = await res.json();
          setFollowers(Array.isArray(data) ? data : data.followers || []);
        }
      } catch {}
    };
    load();
  }, []);

  const filteredFollowers = search.trim()
    ? followers.filter(f =>
        (f.username || '').toLowerCase().includes(search.toLowerCase()) ||
        (f.userId || '').toLowerCase().includes(search.toLowerCase())
      )
    : followers;

  const isAlreadyAdmin = (userId: string) => roomAdmins.some(a => a.userId === userId);

  const addRoomAdmin = (follower: any) => {
    Alert.alert(
      'Make Room Admin',
      `Make @${follower.username || follower.userId} a room admin?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Add',
          onPress: async () => {
            const newAdmin = {
              userId: follower.userId,
              username: follower.username,
              profileImage: follower.profileImage,
            };
            const updated = [...roomAdmins, newAdmin];
            setRoomAdmins(updated);
            setShowFollowersModal(false);
            setSearch('');
            // Persist to backend
            try {
              await fetch(`${ENV.API_BASE_URL}/api/app/room-admins/${myUserId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminUserId: follower.userId }),
              });
            } catch {}
          },
        },
      ]
    );
  };

  const removeRoomAdmin = (admin: any) => {
    Alert.alert(
      'Remove Room Admin',
      `Remove @${admin.username || admin.userId} from room admins?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Remove',
          style: 'destructive',
          onPress: async () => {
            setRoomAdmins(prev => prev.filter(a => a.userId !== admin.userId));
            try {
              await fetch(`${ENV.API_BASE_URL}/api/app/room-admins/${myUserId}/${admin.userId}`, {
                method: 'DELETE',
              });
            } catch {}
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#F7C14D', '#F7C14D'] : ['#127d96', '#15a3c7']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={accentText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: accentText }]}>Room Admin</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Room Admins Section */}
        <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Room Admins</Text>
              <Text style={{ color: isDark ? '#888' : '#999', fontSize: 13, marginTop: 2 }}>
                {roomAdmins.length} admin{roomAdmins.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: accent }]}
              onPress={() => { setSearch(''); setShowFollowersModal(true); }}
            >
              <Ionicons name="add" size={20} color={accentText} />
            </TouchableOpacity>
          </View>

          {roomAdmins.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="shield-outline" size={48} color={isDark ? '#444' : '#ddd'} />
              <Text style={{ color: isDark ? '#666' : '#bbb', marginTop: 12, fontSize: 14, textAlign: 'center' }}>
                No room admins yet.{'\n'}Tap + to add from your followers.
              </Text>
            </View>
          ) : (
            roomAdmins.map(admin => {
              const img = resolveImage(admin.profileImage);
              return (
                <View key={admin.userId} style={[styles.adminRow, { backgroundColor: isDark ? '#333' : '#f8f9fa' }]}>
                  <View style={styles.adminLeft}>
                    {img ? (
                      <Image source={{ uri: img }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, { backgroundColor: accent, justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: accentText, fontWeight: 'bold', fontSize: 16 }}>
                          {(admin.username || '?')[0].toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={{ marginLeft: 12 }}>
                      <Text style={[styles.adminName, { color: isDark ? 'white' : '#333' }]}>
                        @{admin.username || admin.userId}
                      </Text>
                      <View style={styles.adminBadge}>
                        <Ionicons name="shield-checkmark" size={11} color={accent} />
                        <Text style={[styles.adminBadgeText, { color: accent }]}>Room Admin</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeRoomAdmin(admin)}
                  >
                    <Ionicons name="person-remove" size={16} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Followers Modal */}
      <Modal visible={showFollowersModal} transparent animationType="slide" onRequestClose={() => setShowFollowersModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1a1a1a' : 'white' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? 'white' : '#333' }]}>Add Room Admin</Text>
              <TouchableOpacity onPress={() => setShowFollowersModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? 'white' : '#333'} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={[styles.searchBar, { backgroundColor: isDark ? '#2a2a2a' : '#f1f3f5', borderColor: isDark ? '#444' : '#e0e0e0' }]}>
              <Ionicons name="search" size={16} color={isDark ? '#888' : '#999'} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.searchInput, { color: isDark ? 'white' : '#333' }]}
                placeholder="Search by username or ID..."
                placeholderTextColor={isDark ? '#666' : '#aaa'}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color={isDark ? '#888' : '#aaa'} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
              {filteredFollowers.length === 0 ? (
                <Text style={{ color: isDark ? '#666' : '#aaa', textAlign: 'center', paddingVertical: 30, fontSize: 14 }}>
                  {search ? 'No followers found' : 'No followers yet'}
                </Text>
              ) : (
                filteredFollowers.map(f => {
                  const img = resolveImage(f.profileImage);
                  const already = isAlreadyAdmin(f.userId);
                  return (
                    <View key={f.userId} style={[styles.followerRow, { borderBottomColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                      <View style={styles.adminLeft}>
                        {img ? (
                          <Image source={{ uri: img }} style={styles.avatar} />
                        ) : (
                          <View style={[styles.avatar, { backgroundColor: accent, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: accentText, fontWeight: 'bold', fontSize: 16 }}>
                              {(f.username || '?')[0].toUpperCase()}
                            </Text>
                          </View>
                        )}
                        <View style={{ marginLeft: 12 }}>
                          <Text style={[styles.adminName, { color: isDark ? 'white' : '#333' }]}>
                            @{f.username || f.userId}
                          </Text>
                          <Text style={{ color: isDark ? '#666' : '#aaa', fontSize: 12 }}>{f.userId}</Text>
                        </View>
                      </View>
                      {already ? (
                        <View style={[styles.alreadyBadge, { borderColor: accent }]}>
                          <Text style={{ color: accent, fontSize: 12, fontWeight: '600' }}>Admin</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[styles.addFollowerBtn, { backgroundColor: accent }]}
                          onPress={() => addRoomAdmin(f)}
                        >
                          <Ionicons name="add" size={16} color={accentText} />
                          <Text style={{ color: accentText, fontSize: 13, fontWeight: '600', marginLeft: 4 }}>Add</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 25, height: 120 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', letterSpacing: 1 },
  placeholder: { width: 24 },
  content: { flex: 1, paddingTop: 20 },
  section: { marginHorizontal: 20, borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  addBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  emptyState: { alignItems: 'center', paddingVertical: 30 },
  adminRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, marginBottom: 10 },
  adminLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  adminName: { fontSize: 15, fontWeight: '600' },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  adminBadgeText: { fontSize: 11, fontWeight: '600' },
  removeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fdecea', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { height: '80%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14 },
  followerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  addFollowerBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  alreadyBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
});
