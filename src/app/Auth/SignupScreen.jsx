import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';  // For making HTTP requests
import { router } from 'expo-router';  // For navigation
import logo from '../../../assets/images/logo.png';

const API_URL = 'http://localhost:5000'; // Replace with your actual backend URL

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Function to handle sign-up
  const handleSignUp = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
    setLoading(true);

    try {
      // Send email and password to your JWT-authentication backend for user registration
      const acct = await axios.post(`https://plate-scanner-back-end.vercel.app/user/register`, { email, password });

      // After successful signup, redirect to the Login screen
      Alert.alert('Success', 'Account created successfully! Please log in.');
      router.replace('Auth/LoginScreen');
    } catch (error) {
      console.error('Sign-Up Error:', error);
      setMessage( error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image source={logo} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>

      {message && <View style={styles.message}>
        <Text style={styles.messageText}>{message}</Text>
        </View>}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Sign-Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={() => router.push('/Auth/LoginScreen')}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
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
  message:{
    marginBottom: 5,
  },
  messageText:{
    color: "red",
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
  linkText: {
    color: '#007BFF',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SignupScreen;
