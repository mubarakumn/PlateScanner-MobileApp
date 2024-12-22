import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import logo from '../../assets/images/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';


const index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);  // New state to store user details
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
            Authorization: `Bearer ${token}`  // Send token in Authorization header
          }
        });

        if (response && response.data) {
          const user = response.data.user;  // Assuming your backend returns the user payload
          setUser(user);  // Store user details
          
          // Navigate based on user role
          if (user.role === 'admin') {
            router.replace('Admin/Admindash');
          }
          
          setIsAuthenticated(true);  // User is authenticated
        } else {
          throw new Error('Invalid token or user not found');
        }
        
      } catch (error) {
        if (error.status === 403) {
          router.replace('Auth/LoginScreen');
          setIsAuthenticated(false);
        }else{
          Alert.alert('Authentication Error', error.message || 'Failed to verify token.');
          console.error('Error during token verification:', error.message);
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



  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('Auth/LoginScreen');
    Alert.alert('Success', 'Log out Successfully.');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />
  }
  return (
    <View style={styles.container}>
      <>
        <View style={styles.content}>
          {!isAuthenticated ? (
            <Text>Please login to Access this Screen</Text>
          ) : (
            <>
            <Text>User: {user?.email}</Text>
            <Image source={logo} style={styles.logo} />
              <Text style={styles.welcomeText}>Welcome to PlateNumber Scanner!</Text>
              <Text style={styles.description}>
                Access the plate scanning feature, and explore more. Log out when you are done.
              </Text>
              <View style={{display: 'flex', flexDirection: 'row', gap: 20, alignItems: 'center'}}>
                  {
                  isAuthenticated ? (
                    <TouchableOpacity style={styles.btn} onPress={handleLogout}>
                      <Text>
                        <AntDesign name="logout" size={24} color="#F44336" />
                      </Text>
                      <Text>logout</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.btn} onPress={() => router.replace('Auth/LoginScreen')}>
                      <Text>
                        <AntDesign name="login" size={24} color="#F44336" />
                      </Text>
                      <Text>login</Text>
                    </TouchableOpacity>
                  )}
                <Button title="Get Started" onPress={() => router.push('PlateScan')} />
              </View>
            </>
          )}
        </View>

      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  content: {
    alignItems: 'center',
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  btn: {
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
});

export default index;
