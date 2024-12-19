import { Alert, Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const  Admindash = ()=>{
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
            const user = response.data.user;  // Assuming your backend returns the user payload
            setUser(user);  // Store user details

            // Navigate based on user role
            if (user.role === 'user') {
              router.replace('Index');  // Navigate to user dashboard or home
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
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('Auth/LoginScreen');
    Alert.alert('Success', 'Logged out Successfully.');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
       {
        isAuthenticated ? (
          <Stack.Screen options={{ headerRight: () => <Button title="Logout" style={styles.btn} onPress={()=> handleLogout()} /> }} />
        ) : (
          <Stack.Screen options={{ headerRight: () => <Button title="Login" style={styles.btn} onPress={() => router.replace('Auth/LoginScreen')} /> }} />
        )
      }
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroText}>Welcome, { user?.name || 'Admin'}</Text>
      </View>

      {/* Main Functions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.functions}>
          <TouchableOpacity style={styles.functionsButton} onPress={() => router.push('PlateScan')}>
            <Text style={styles.functionsText}>Scan Plate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionsButton} onPress={() => router.push('PlateDetailsScreen')}>
            <Text style={styles.functionsText}>Enter Plate Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionsButton} onPress={() => router.push('Admin/RegisterPlate')}>
            <Text style={styles.functionsText}>Register Plate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionsButton} onPress={() => router.push('Admin/ViewPlate')}>
            <Text style={styles.functionsText}>View Plates</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comments</Text>
        <View style={styles.Actions}>
          <TouchableOpacity style={styles.ActionsButton} onPress={() => router.push('Admin/Status')}>
            <Text style={styles.ActionsButtonText}>Add Comments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ActionsButton} onPress={() => router.push('Admin/Comments')}>
            <Text style={styles.ActionsButtonText}>View Comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const sharedButtonStyles = {
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderRadius: 12,
  marginBottom: 15,
  width: '48%',
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',  // Light background for the whole page
    padding: 20,
  },
  hero: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#005f73',  // Darker blue background
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#FFFFFF',  // White card background
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,  // Elevation for Android
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
    backgroundColor: '#0A9396',  // Teal color for buttons
  },
  functionsText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  Actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ActionsButton: {
    ...sharedButtonStyles,
    backgroundColor: '#EE9B00',  // Orange for action buttons
  },
  ActionsButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});


export default Admindash;