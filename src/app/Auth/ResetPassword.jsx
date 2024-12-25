import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email || !otp || !newPassword) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post('https://plate-scanner-back-end.vercel.app/user/reset-password', {
        email,
        otp,
        newPassword,
      });
  
      if (response.status === 200) {
        Alert.alert('Success', response.data.message || 'Password reset successfully!');
        router.replace('/Auth/LoginScreen'); // Navigate to the login screen
      } else {
        throw new Error(response.data.message || 'Error resetting password');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOTP}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Text style={styles.linkText} onPress={() => router.replace('/Auth/LoginScreen')}>
        Back to Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
  message: {
    marginTop: 15,
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
  },
  linkText: {
    marginTop: 20,
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
