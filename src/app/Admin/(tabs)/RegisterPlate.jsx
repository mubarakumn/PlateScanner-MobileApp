import React, { useState} from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

const RegisterPlate = () => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    ownerName: '',
    phone: '',
    vehicleType: '',
    brand: '',
    chassis: '',
    color: ''
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle plate registration
  const handleRegisterPlate = async () => {
    if (!formData.plateNumber || !formData.ownerName || !formData.phone || !formData.vehicleType || !formData.brand || !formData.chassis || !formData.color) {
      return Alert.alert('Error', 'Please fill out all required fields.');
    }

    try {
      setLoading(true);  // Start loading
      const response = await axios.post('https://plate-scanner-back-end.vercel.app/plate/add', formData);
      setLoading(false);  // Stop loading

      if (response.status === 200) {
        Alert.alert('Success', 'Plate registered successfully!');
        setFormData({ plateNumber: '', ownerName: '', phone: '',  vehicleType: '',  brand: '', chassis: '', color: ''});  // Reset form
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* Title */}
          <Text style={styles.title}>Register Plate Number</Text>

          {/* PlateNumber Input */}
          <Text style={styles.label}>Plate Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Plate number"
            value={formData.plateNumber}
            onChangeText={(value) => handleChange('plateNumber', value)}
            autoCapitalize="none"
          />

          {/* OwnerName Input */}
          <Text style={styles.label}>Owner's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Owner's Name"
            value={formData.ownerName}
            onChangeText={(value) => handleChange('ownerName', value)}
            autoCapitalize="none"
          />

          {/* Phone No. Input */}
          <Text style={styles.label}>Owner's Phone No.</Text>
          <TextInput
            style={styles.input}
            placeholder="Owner's Phone No."
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            autoCapitalize="none"
            keyboardType="phone-pad"  // Ensure the correct keyboard for phone numbers
          />

          {/* Vehicle Type Input */}
          <Text style={styles.label}>Vehicle Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Vehicle Type"
            value={formData.vehicleType}
            onChangeText={(value) => handleChange('vehicleType', value)}
            autoCapitalize="words"
          />

          {/* Brand Input */}
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            placeholder="Brand"
            value={formData.brand}
            onChangeText={(value) => handleChange('brand', value)}
            autoCapitalize="words"
          />

          {/* Chassis Number (VIN) Input */}
          <Text style={styles.label}>Chassis Number (VIN)</Text>
          <TextInput
            style={styles.input}
            placeholder="Chassis Number (VIN)"
            value={formData.chassis}
            onChangeText={(value) => handleChange('chassis', value)}
            autoCapitalize="none"
          />

          {/* Color Input */}
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            placeholder="Color"
            value={formData.color}
            onChangeText={(value) => handleChange('color', value)}
            autoCapitalize="words"
          />

          {/* Register Plate Button */}
          <TouchableOpacity style={styles.button} onPress={() => { handleRegisterPlate(); Keyboard.dismiss(); }} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  formContainer: {
    padding: 16,
    borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 5,  // Add some elevation on Android for better appearance
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',  // Ensure the title is centered
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    marginBottom: 1,
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
