import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const RegisterPlate = () => {
  const [formData, setFormData] = useState({
    PlateNumber: '',
    ownerName: '',
    carModel: '',
    Comment: ''
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle plate registration
  const handleRegisterPlate = async () => {
    if (!formData.PlateNumber || !formData.ownerName || !formData.carModel) {
      return Alert.alert('Error', 'Please fill out all required fields.');
    }

    try {
      setLoading(true);  // Start loading
      const response = await axios.post('http://192.168.43.153:5000/plate/add', formData);
      setLoading(false);  // Stop loading

      if (response.status === 200) {
        Alert.alert('Success', 'Plate registered successfully!');
        setFormData({ PlateNumber: '', ownerName: '', carModel: '', Comment: '' });  // Reset form
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setLoading(false);  // Stop loading on error
      console.error(error);
      Alert.alert('Error', 'Failed to register plate. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Register Plate Number</Text>

      {/* PlateNumber Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Plate number"
        value={formData.PlateNumber}
        onChangeText={(value) => handleChange('PlateNumber', value)}
        autoCapitalize="none"
      />

      {/* OwnerName Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Owner Name"
        value={formData.ownerName}
        onChangeText={(value) => handleChange('ownerName', value)}
        autoCapitalize="none"
      />

      {/* Car Model Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Car Model"
        value={formData.carModel}
        onChangeText={(value) => handleChange('carModel', value)}
        autoCapitalize="none"
      />

      {/* Comment Input */}
      <TextInput
        style={styles.input}
        placeholder="Leave a Comment (Optional)"
        value={formData.Comment}
        onChangeText={(value) => handleChange('Comment', value)}
        autoCapitalize="none"
      />

      {/* Register plate Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegisterPlate} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Register</Text>}
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
});

export default RegisterPlate;
