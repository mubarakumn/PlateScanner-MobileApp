import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import MessageModal from '../Components/MessageModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../../assets/images/logo.png';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const API_BASE_URL = 'https://plate-scanner-back-end.vercel.app';

  // To Check if user is Already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("Token:", token);

      if (token) {
        try {
          setLoading(true);

          const response = await axios.get(`${API_BASE_URL}/verify-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response?.data?.user) {
            const user = response.data.user;

            if (user.role === 'admin') {
              router.replace('Admin/Admindash');
            } else {
              router.replace('/');
            }
            setIsAuthenticated(true);
          } else {
            throw new Error('Invalid token or user not found');
          }
        } catch (error) {
          console.error('Token verification error:', error.message);
          if (error.response?.status === 403) {
            console.log('Invalid Token or Expired');
          }
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please fill in both fields');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });

      const data = response.data;

      await AsyncStorage.setItem('token', data.token);
      Alert.alert('Success', 'Login successful!');

      if (data.role === 'admin') {
        router.replace('Admin/Admindash');
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      const status = error.response?.status;

      if (status === 504) {
        setMessage('Try again!');
      } else if (status === 400) {
        setMessage('Invalid credentials!');
      } else {
        setMessage(error.message || 'An error occurred. Please try again.');
      }
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address to reset your password.');
      return;
    }

    setResetLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/forgot-password`, { email });

      if (response.status === 200) {
        Alert.alert('Success', 'Password reset code has been sent to your email.');
        router.push('/Auth/ResetPassword');
      }
    } catch (error) {
      console.error('Password reset error:', error.message);
      Alert.alert('Error', 'Failed to send password reset code. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>{resetLoading ? "Resetting Password" : "Login"}</Text>

      {modalVisible && (
        <MessageModal
          visible={modalVisible}
          title="Error"
          message={message}
          close={() => setModalVisible(false)}
        />
      )}

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
