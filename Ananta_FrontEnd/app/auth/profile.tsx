import { StyleSheet, TextInput, TouchableOpacity, View, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, StatusBar, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { LevelBadge } from '@/components/level-badge';
import { Animated } from 'react-native';

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [birthday, setBirthday] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pinCode, setPinCode] = useState('');
  
  // User level data
  const [userLevel] = useState({
    currentLevel: 7,
    currentXP: 2450,
    nextLevelXP: 3000,
  });
  
  // Dropdown states
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  
  // KYC states
  const [kycProfileImage, setKycProfileImage] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [document1, setDocument1] = useState<string | null>(null);
  const [document2, setDocument2] = useState<string | null>(null);

  // Identity Proof states
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const documentTypes = ['Aadhaar Card', 'Passport', 'Driving License'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const getPlaceholder = () => {
    switch (documentType) {
      case 'Aadhaar Card': return 'XXXX XXXX XXXX';
      case 'Passport': return 'A1234567';
      case 'Driving License': return 'DL-XXXXXXXXXX';
      default: return 'Enter document number';
    }
  };

  const isBackImageRequired = documentType !== 'Passport';
  const isFormValid = documentType && documentNumber && frontImage && (isBackImageRequired ? backImage : true);

  // Sample data
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi'
  ];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep'
  ];
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Canada',
    'China', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Pakistan',
    'Philippines', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain',
    'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'UAE', 'United Kingdom', 'United States', 'Vietnam'
  ];

  const filteredCities = cities.filter(item => item.toLowerCase().includes(citySearch.toLowerCase()));
  const filteredStates = states.filter(item => item.toLowerCase().includes(stateSearch.toLowerCase()));
  const filteredCountries = countries.filter(item => item.toLowerCase().includes(countrySearch.toLowerCase()));

  const progressPercentage = ((userLevel.currentXP) / userLevel.nextLevelXP) * 100;
  const remainingXP = userLevel.nextLevelXP - userLevel.currentXP;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  const handleImagePicker = async () => {
    try {
      Alert.alert(
        'Select Photo',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera permission is required');
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
              }
            }
          },
          {
            text: 'Gallery',
            onPress: async () => {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission needed', 'Gallery permission is required');
                return;
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
              }
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need gallery permissions to select a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickKycImage = async (type: 'profile' | 'id' | 'doc1' | 'doc2' | 'front' | 'back') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      // Here you would call presigned URL API and upload to cloud storage
      // For now, we'll just store the local URI
      switch (type) {
        case 'profile':
          setProfileImage(uri);
          break;
        case 'id':
          setIdImage(uri);
          break;
        case 'doc1':
          setDocument1(uri);
          break;
        case 'doc2':
          setDocument2(uri);
          break;
        case 'front':
          setFrontImage(uri);
          break;
        case 'back':
          setBackImage(uri);
          break;
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : 'white', borderBottomColor: isDark ? '#333' : '#126996' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={isDark ? 'white' : '#333'} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: isDark ? 'white' : '#333' }]}>Profile</ThemedText>
        <View style={styles.placeholder} />
      </View>

    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
          <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePicker}>
            <View style={[styles.avatar, { borderColor: isDark ? '#555' : Colors.light.primary }]}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <ThemedText style={[styles.plusIcon, { color: isDark ? '#555' : Colors.light.primary }]}>+</ThemedText>
              )}
            </View>
            <ThemedText style={[styles.galleryText, { color: isDark ? '#555' : Colors.light.primary }]}>Tap to select photo</ThemedText>
          </TouchableOpacity>
      
      <View style={styles.formContainer}>
        {/* Personal Information */}
        <View style={styles.sectionContainer}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : Colors.light.primary }]}>Personal Information</ThemedText>
          
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/561/561127.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : '#333' }]}
              placeholder="Username"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={userName}
              onChangeText={setUserName}
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : '#333' }]}
              placeholder="Full Name"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}
            onPress={() => setShowGenderDropdown(true)}
          >
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <ThemedText style={[styles.dropdownText, { color: gender ? (isDark ? 'white' : '#333') : (isDark ? '#888' : '#666') }]}>
              {gender || 'Select Gender'}
            </ThemedText>
            <Ionicons name="chevron-down" size={20} color={isDark ? '#888' : '#666'} />
          </TouchableOpacity>
          
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : '#333' }]}
              placeholder="Birthday (DD/MM/YYYY)"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={birthday}
              onChangeText={setBirthday}
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3616/3616729.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : '#333' }]}
              placeholder="Bio / Hashtags"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={bio}
              onChangeText={setBio}
            />
          </View>
        </View>
        
        {/* Address Information */}
        <View style={styles.sectionContainer}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : Colors.light.primary }]}>Address Information</ThemedText>
          
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : '#333' }]}
              placeholder="Address Line 1"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={addressLine1}
              onChangeText={setAddressLine1}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}
            onPress={() => setShowCityDropdown(true)}
          >
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <ThemedText style={[styles.dropdownText, { color: city ? (isDark ? 'white' : '#333') : (isDark ? '#888' : '#666') }]}>
              {city || 'Select City'}
            </ThemedText>
            <Ionicons name="chevron-down" size={20} color={isDark ? '#888' : '#666'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}
            onPress={() => setShowStateDropdown(true)}
          >
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <ThemedText style={[styles.dropdownText, { color: state ? (isDark ? 'white' : '#333') : (isDark ? '#888' : '#666') }]}>
              {state || 'Select State'}
            </ThemedText>
            <Ionicons name="chevron-down" size={20} color={isDark ? '#888' : '#666'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}
            onPress={() => setShowCountryDropdown(true)}
          >
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <ThemedText style={[styles.dropdownText, { color: country ? (isDark ? 'white' : '#333') : (isDark ? '#888' : '#666') }]}>
              {country || 'Select Country'}
            </ThemedText>
            <Ionicons name="chevron-down" size={20} color={isDark ? '#888' : '#666'} />
          </TouchableOpacity>
          
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : '#333' }]}
              placeholder="Pin Code"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={pinCode}
              onChangeText={setPinCode}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Other Information */}
        <View style={styles.sectionContainer}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : Colors.light.primary }]}>Other Information</ThemedText>
          
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : '#333' }]}
              placeholder="Location"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>
        
        {/* Identity Proof Section */}
        <View style={styles.sectionContainer}>
          <ThemedText style={[styles.sectionTitle, { color: isDark ? 'white' : Colors.light.primary }]}>Identity Proof</ThemedText>
          
          {/* Document Type Dropdown */}
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}
            onPress={() => setShowDocumentDropdown(true)}
          >
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <ThemedText style={[styles.dropdownText, { color: documentType ? (isDark ? 'white' : '#333') : (isDark ? '#888' : '#666') }]}>
              {documentType || 'Select Document Type *'}
            </ThemedText>
            <Ionicons name="chevron-down" size={20} color={isDark ? '#888' : '#666'} />
          </TouchableOpacity>
          
          {/* Document Number */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png' }} 
              style={[styles.iconImage, { tintColor: isDark ? '#555' : Colors.light.primary }]} 
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : '#333' }]}
              placeholder={getPlaceholder() + ' *'}
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={documentNumber}
              onChangeText={setDocumentNumber}
            />
          </View>
          
          {/* Document Front Image */}
          <View style={[styles.imageSection, { backgroundColor: isDark ? '#333' : 'white', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <ThemedText style={[styles.imageSectionTitle, { color: isDark ? 'white' : '#333' }]}>Document Front Image *</ThemedText>
            <TouchableOpacity 
              style={[styles.imageUpload, { borderColor: isDark ? '#555' : '#ddd' }]}
              onPress={() => pickKycImage('front')}
            >
              {frontImage ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: frontImage }} style={styles.uploadedImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setFrontImage(null)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="camera" size={30} color={isDark ? '#666' : '#999'} />
                  <ThemedText style={[styles.uploadText, { color: isDark ? '#666' : '#999' }]}>Tap to upload front image</ThemedText>
                  <ThemedText style={[styles.uploadSubtext, { color: isDark ? '#666' : '#999' }]}>JPG, PNG • Max 5MB</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Document Back Image */}
          <View style={[styles.imageSection, { backgroundColor: isDark ? '#333' : 'white', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <ThemedText style={[styles.imageSectionTitle, { color: isDark ? 'white' : '#333' }]}>
              Document Back Image {isBackImageRequired ? '*' : '(Optional)'}
            </ThemedText>
            <TouchableOpacity 
              style={[styles.imageUpload, { borderColor: isDark ? '#555' : '#ddd', opacity: documentType === 'Passport' ? 0.5 : 1 }]}
              onPress={() => pickKycImage('back')}
              disabled={documentType === 'Passport'}
            >
              {backImage ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: backImage }} style={styles.uploadedImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setBackImage(null)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="camera" size={30} color={isDark ? '#666' : '#999'} />
                  <ThemedText style={[styles.uploadText, { color: isDark ? '#666' : '#999' }]}>
                    {documentType === 'Passport' ? 'Not required for Passport' : 'Tap to upload back image'}
                  </ThemedText>
                  <ThemedText style={[styles.uploadSubtext, { color: isDark ? '#666' : '#999' }]}>JPG, PNG • Max 5MB</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
          <TouchableOpacity 
            style={[styles.nextButtonContainer, { opacity: isFormValid ? 1 : 0.5 }]}
            onPress={() => router.push('/(tabs)')}
            disabled={!isFormValid}
          >
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.primaryDark]}
              style={styles.nextButton}
            >
              <ThemedText style={styles.buttonText}>Next</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
    </KeyboardAvoidingView>

    {/* City Dropdown Modal */}
    <Modal visible={showCityDropdown} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.dropdownModal, { backgroundColor: isDark ? '#333' : 'white' }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={[styles.modalTitle, { color: isDark ? 'white' : '#333' }]}>Select City</ThemedText>
            <TouchableOpacity onPress={() => { setShowCityDropdown(false); setCitySearch(''); }}>
              <Ionicons name="close" size={24} color={isDark ? 'white' : '#333'} />
            </TouchableOpacity>
          </View>
          <View style={[styles.searchContainer, { backgroundColor: isDark ? '#444' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Ionicons name="search" size={20} color={isDark ? '#888' : '#666'} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? 'white' : '#333' }]}
              placeholder="Search city..."
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={citySearch}
              onChangeText={setCitySearch}
              autoFocus
            />
            {citySearch.length > 0 && (
              <TouchableOpacity onPress={() => setCitySearch('')}>
                <Ionicons name="close-circle" size={20} color={isDark ? '#888' : '#666'} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dropdownItem, { backgroundColor: city === item ? (isDark ? '#127d96' : '#e6f3f7') : 'transparent' }]}
                onPress={() => {
                  setCity(item);
                  setShowCityDropdown(false);
                  setCitySearch('');
                }}
              >
                <ThemedText style={[styles.dropdownItemText, { color: city === item ? (isDark ? 'white' : '#127d96') : (isDark ? '#ccc' : '#333') }]}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>No cities found</ThemedText>
              </View>
            }
          />
        </View>
      </View>
    </Modal>

    {/* State Dropdown Modal */}
    <Modal visible={showStateDropdown} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.dropdownModal, { backgroundColor: isDark ? '#333' : 'white' }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={[styles.modalTitle, { color: isDark ? 'white' : '#333' }]}>Select State</ThemedText>
            <TouchableOpacity onPress={() => { setShowStateDropdown(false); setStateSearch(''); }}>
              <Ionicons name="close" size={24} color={isDark ? 'white' : '#333'} />
            </TouchableOpacity>
          </View>
          <View style={[styles.searchContainer, { backgroundColor: isDark ? '#444' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Ionicons name="search" size={20} color={isDark ? '#888' : '#666'} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? 'white' : '#333' }]}
              placeholder="Search state..."
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={stateSearch}
              onChangeText={setStateSearch}
              autoFocus
            />
            {stateSearch.length > 0 && (
              <TouchableOpacity onPress={() => setStateSearch('')}>
                <Ionicons name="close-circle" size={20} color={isDark ? '#888' : '#666'} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filteredStates}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dropdownItem, { backgroundColor: state === item ? (isDark ? '#127d96' : '#e6f3f7') : 'transparent' }]}
                onPress={() => {
                  setState(item);
                  setShowStateDropdown(false);
                  setStateSearch('');
                }}
              >
                <ThemedText style={[styles.dropdownItemText, { color: state === item ? (isDark ? 'white' : '#127d96') : (isDark ? '#ccc' : '#333') }]}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>No states found</ThemedText>
              </View>
            }
          />
        </View>
      </View>
    </Modal>

    {/* Country Dropdown Modal */}
    <Modal visible={showCountryDropdown} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.dropdownModal, { backgroundColor: isDark ? '#333' : 'white' }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={[styles.modalTitle, { color: isDark ? 'white' : '#333' }]}>Select Country</ThemedText>
            <TouchableOpacity onPress={() => { setShowCountryDropdown(false); setCountrySearch(''); }}>
              <Ionicons name="close" size={24} color={isDark ? 'white' : '#333'} />
            </TouchableOpacity>
          </View>
          <View style={[styles.searchContainer, { backgroundColor: isDark ? '#444' : '#f8f9fa', borderColor: isDark ? '#555' : '#e9ecef' }]}>
            <Ionicons name="search" size={20} color={isDark ? '#888' : '#666'} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? 'white' : '#333' }]}
              placeholder="Search country..."
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={countrySearch}
              onChangeText={setCountrySearch}
              autoFocus
            />
            {countrySearch.length > 0 && (
              <TouchableOpacity onPress={() => setCountrySearch('')}>
                <Ionicons name="close-circle" size={20} color={isDark ? '#888' : '#666'} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dropdownItem, { backgroundColor: country === item ? (isDark ? '#127d96' : '#e6f3f7') : 'transparent' }]}
                onPress={() => {
                  setCountry(item);
                  setShowCountryDropdown(false);
                  setCountrySearch('');
                }}
              >
                <ThemedText style={[styles.dropdownItemText, { color: country === item ? (isDark ? 'white' : '#127d96') : (isDark ? '#ccc' : '#333') }]}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>No countries found</ThemedText>
              </View>
            }
          />
        </View>
      </View>
    </Modal>

    {/* Document Type Dropdown Modal */}
    <Modal visible={showDocumentDropdown} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.dropdownModal, { backgroundColor: isDark ? '#333' : 'white' }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={[styles.modalTitle, { color: isDark ? 'white' : '#333' }]}>Select Document Type</ThemedText>
            <TouchableOpacity onPress={() => setShowDocumentDropdown(false)}>
              <Ionicons name="close" size={24} color={isDark ? 'white' : '#333'} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={documentTypes}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dropdownItem, { backgroundColor: documentType === item ? (isDark ? '#127d96' : '#e6f3f7') : 'transparent' }]}
                onPress={() => {
                  setDocumentType(item);
                  setDocumentNumber('');
                  setBackImage(null);
                  setShowDocumentDropdown(false);
                }}
              >
                <ThemedText style={[styles.dropdownItemText, { color: documentType === item ? (isDark ? 'white' : '#127d96') : (isDark ? '#ccc' : '#333') }]}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>

    {/* Gender Dropdown Modal */}
    <Modal visible={showGenderDropdown} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.dropdownModal, { backgroundColor: isDark ? '#333' : 'white' }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={[styles.modalTitle, { color: isDark ? 'white' : '#333' }]}>Select Gender</ThemedText>
            <TouchableOpacity onPress={() => setShowGenderDropdown(false)}>
              <Ionicons name="close" size={24} color={isDark ? 'white' : '#333'} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={genderOptions}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dropdownItem, { backgroundColor: gender === item ? (isDark ? '#127d96' : '#e6f3f7') : 'transparent' }]}
                onPress={() => {
                  setGender(item);
                  setShowGenderDropdown(false);
                }}
              >
                <ThemedText style={[styles.dropdownItemText, { color: gender === item ? (isDark ? 'white' : '#127d96') : (isDark ? '#ccc' : '#333') }]}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
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
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 150,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  plusIcon: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  galleryText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 55,
    marginBottom: 15,
    borderWidth: 1,
  },
  iconImage: {
    width: 22,
    height: 22,
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  nextButtonContainer: {
    marginTop: 30,
    marginBottom: 40,
    marginHorizontal: 20,
  },
  nextButton: {
    height: 55,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  kycSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  kycSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageUpload: {
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 5,
    fontSize: 12,
  },
  fileUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dropdownModal: {
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 2,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  imageSection: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  imageSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageUpload: {
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadSubtext: {
    marginTop: 4,
    fontSize: 12,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});