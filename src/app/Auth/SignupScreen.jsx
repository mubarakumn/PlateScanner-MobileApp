import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';  // For making HTTP requests
import { router } from 'expo-router';  // For navigation
import logo from '../../../assets/images/logo.png';

const API_URL = 'http://localhost:5000'; // Replace with your actual backend URL

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Function to handle sign-up
  const handleSignUp = async () => {
    if (name === '' || email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);

    try {
      // Send email and password to your JWT-authentication backend for user registration
      const acct = await axios.post(`https://plate-scanner-back-end.vercel.app/user/register`, { name, email, password });

      // After successful signup, redirect to the Login screen
      Alert.alert('Success', 'Account created successfully! Please log in.');
      router.replace('Auth/LoginScreen');
    } catch (error) {
      console.error('Sign-Up Error:', error);
      setMessage(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo Section */}
      <Image source={logo} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>

      {/* Error or Success Message */}
      {message && (
        <View style={styles.message}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Name Input */}
        <Text style={styles.label}>Enter name</Text>
        <TextInput
          style={styles.input}
          placeholder="Ahmad ismail"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />

        {/* Email Input */}
        <Text style={styles.label}>Enter email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Text style={styles.label}>Enter password</Text>
        <TextInput
          style={styles.input}
          placeholder="password123"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      {/* Sign-Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={() => router.push('/Auth/LoginScreen')}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  message: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#FFCCCC',
    borderRadius: 8,
  },
  messageText: {
    color: 'red',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
    alignItems: 'stretch',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom:5,
    marginLeft:5,
    fontWeight: 'bold',  // Make label bold to differentiate from input text
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    width: '90%',  // Adjust button width
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
