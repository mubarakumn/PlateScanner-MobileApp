import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import logo from '../../../assets/images/logo.png';
import { useRouter } from 'expo-router';
import MessageModal from '../Components/MessageModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();


// To Check if user is Already logged in
useEffect(() => {
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
      console.log("the token:", token);
    if (token) {
      try {
        setLoading(true);

        // Make a request to the server with the token in the Authorization header
        const response = await axios.get('http://192.168.43.153:5000/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`  // Send token in Authorization header
          } 
        });

        if (response && response.data) {
          const user = response.data.user;  // Assuming your backend returns the user payload
          
          // Navigate based on user role
          if (user.role === 'admin') {
            router.replace('Admin/Admindash');
            
          } else {
            router.replace('Index');  // Navigate to user dashboard or home
          }

          setIsAuthenticated(true);  // User is authenticated
        } else {
          throw new Error('Invalid token or user not found');
        }

      } catch (error) {
        // console.log(error, "in login");
        if(error.status === 403 ){
         return console.log('Invalid Token or Expired')
        }
        console.error('Error during token verification:', error.message);

        setIsAuthenticated(false);
      } finally {
        setLoading(false);  // Ensure loading is stopped in all cases
      }

    } else {
      // No token found, redirect to login
      setLoading(false);
    }
  };

  checkAuth();
}, []);

  // Function to handle login
  const handleLogin = async () => {
    if (email === '' || password === '') {
      <MessageModal visible={true} heading={"Error"} message={'Please fill in both fields'} />;
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.43.153:5000/user/login', { email, password })

      const data = response.data;
      if (!response.status === 'success') {
        throw new Error(data.message || 'Login failed');
      }
      // console.log(data);

      // Save JWT token to AsyncStorage or state management
      await AsyncStorage.setItem('token', response.data.token);

      const token = data.token; // Adjust based on your response structure
      Alert.alert('Success', 'Login successful!');

      // Navigate based on user role
      if (data.role === 'admin') {
        router.replace('Admin/Admindash');
      } else {
        router.replace('Index'); // Change to user dashboard if needed
      }

    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle password reset
  const handleResetPassword = () => {
    // Your password reset logic here
    Alert.alert('Password Reset', 'This feature is not yet implemented.');
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>{resetLoading ? "Resetting Password" : "Login"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {!resetLoading && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword} disabled={resetLoading}>
        {resetLoading ? <ActivityIndicator color="#007BFF" /> : <Text style={styles.resetButtonText}>Forgot Password?</Text>}
      </TouchableOpacity>

      <Text style={styles.linkText} onPress={() => router.push('Auth/SignupScreen')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    marginVertical: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  linkText: {
    color: '#007BFF',
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginScreen;
