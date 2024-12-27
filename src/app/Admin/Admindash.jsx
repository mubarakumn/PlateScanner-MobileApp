import { Alert, Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Admindash = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);  // To store authenticated user details
  const router = useRouter();

  // To Check if user is Already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          setLoading(true);

          // Make a request to the server with the token in the Authorization header
          const response = await axios.get('https://plate-scanner-back-end.vercel.app/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 401) {
            // Token might be expired, handle accordingly
            Alert.alert('Session expired', 'Please log in again.');
            await AsyncStorage.removeItem('token');
            router.replace('Auth/LoginScreen');
          }

          if (response && response.data) {
            // console.log(response.data);
            const user = response.data.user;  // Assuming your backend returns the user payload
            setUser(user);  // Store user details

            // Navigate based on user role
            if (user.role === 'user') {
              router.replace('index');  // Navigate to user dashboard or home
            }

            setIsAuthenticated(true);  // User is authenticated
          } else {
            throw new Error('Invalid token or user not found');
          }
        } catch (error) {
          if (error.status === 403) {
            console.error('Error during token verification:', error.message);
            Alert.alert('Authentication Error', error.message || 'Failed to verify token.');
            setIsAuthenticated(false);
          }
        } finally {
          setLoading(false);  // Ensure loading is stopped in all cases
        }
      } else {
        // No token found, redirect to login
        router.replace('Auth/LoginScreen');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const handleLogout = () => {
    router.replace('Auth/LoginScreen');
    AsyncStorage.removeItem('token');
    Alert.alert('Success', 'Logged out Successfully.');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroHeading}>
          <Text style={styles.heroText}>Welcome, {user?.name || 'Admin'}</Text>
          {
            isAuthenticated ? (
              <TouchableOpacity style={styles.btn} onPress={handleLogout}>
                <Text>
                  <AntDesign name="logout" size={24} color="#F44336" />
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btn} onPress={() => router.replace('Auth/LoginScreen')}>
                <Text>
                  <AntDesign name="login" size={24} color="#F44336" />
                </Text>
              </TouchableOpacity>
            )}
        </View>
        <View>
          <Text style={styles.heroHint}>
            From this dashboard you can add update and register a new plate number
          </Text>
        </View>
      </View>

      {/* Main Functions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.functions}>
          <TouchableOpacity style={styles.functionsButton} onPress={() => router.push('PlateScan')}>
            <Text style={styles.functionsText}>
              <AntDesign name="scan1" size={24} color="black" />
            </Text>  
            <Text style={styles.functionsText}>Scan Plate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionsButton} onPress={() => router.push('PlateDetailsScreen')}>
            <Text style={styles.functionsText}>
            <FontAwesome name="pencil-square-o" size={24} color="black" />
            </Text>  
            <Text style={styles.functionsText}>Enter Plate Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionsButton} onPress={() => router.push('Admin/RegisterPlate')}>
            <Text style={styles.functionsText}>
            <MaterialIcons name="assignment-add" size={24} color="black" />
            </Text>  
            <Text style={styles.functionsText}>Register Plate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionsButton} onPress={() => router.push('Admin/ViewPlate')}>
            <Text style={styles.functionsText}>
            <MaterialCommunityIcons name="format-list-text" size={24} color="black" />
             </Text>  
            <Text style={styles.functionsText}>View Plates</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Updates</Text>
        <View style={styles.Actions}>
          <TouchableOpacity style={styles.ActionsButton} onPress={() => router.push('Admin/Status')}>
          <MaterialCommunityIcons name="traffic-cone" size={24} color="white" />
            <Text style={styles.updatesBtn}>Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ActionsButton} onPress={() => router.push('Admin/Comments')}>
          <MaterialIcons name="update" size={24} color="white" />
            <Text style={styles.updatesBtn}>View Comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const sharedButtonStyles = {
  paddingVertical: 10,
  paddingHorizontal: 10,
  marginBottom: 15,
  width: '48%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 50,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',  // Light background for the whole page
    padding: 10,
  },
  hero: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',  // White card background
    shadowOpacity: 0.1,
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,  
  },
  heroHeading: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroText: {
    fontSize: 18,
    fontWeight: 'medium',
    color: '007BFF',
  },
  heroHint:{
    fontSize: 14,
    fontWeight: 'meduim',
    color: '#696969',
    margin:5,
  },
  section: {
    marginBottom: 10,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',  // Darker color for text
  },
  functions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  functionsButton: {
    ...sharedButtonStyles,
    backgroundColor: '#20220230',  // Teal color for buttons
  },
  functionsText: {
    fontSize: 10,
    color: 'black',
    fontWeight: '600',
  },
  Actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'white'
  },
  ActionsButton: {
    ...sharedButtonStyles,
    backgroundColor: '#007BFF', 
  },
  updatesBtn: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
});


export default Admindash;