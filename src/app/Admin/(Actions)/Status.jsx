import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

export default function Status() {
  const [plateNumber, setPlateNumber] = useState('');  // To store input plate number
  const [statusList, setStatusList] = useState([]);    // List of statuses
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);  // Current plate statuses

  // Predefined statuses
  const availableStatuses = ['flagged', 'stolen', 'wanted', 'crime', 'clear'];

  // Function to open modal and enter plate number
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to fetch plate data based on the plate number
  const fetchPlateData = async () => {
    try {
      const response = await axios.get(`http://192.168.43.153:5000/plate/${plateNumber}`);
      const plate = response.data;
      if (plate) {
        setSelectedStatus(plate.Status);  // Set the current statuses
        Alert.alert('Success', `Statuses retrieved for plate: ${plateNumber}`);
      } else {
        Alert.alert('Error', 'Plate not found.');
      }
    } catch (error) {
      console.error('Error fetching plate:', error);
      Alert.alert('Error', 'Failed to retrieve plate data.');
    }
  };

  // Function to update status
  const updatePlateStatus = async () => {
    try {
      const response = await axios.put(`http://192.168.43.153:5000/plate/${plateNumber}/update-status`, {
        Status: selectedStatus,  // Send the updated status array
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Status updated successfully!');
        setModalVisible(false);  // Close the modal after successful update
      } else {
        Alert.alert('Error', 'Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  // Function to add or remove a status from the list
  const toggleStatus = (status) => {
    if (selectedStatus.includes(status)) {
      // Remove status if already selected
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    } else {
      // Add status if not already selected
      setSelectedStatus([...selectedStatus, status]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Update Status</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Plate Status</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Plate Number"
              value={plateNumber}
              onChangeText={setPlateNumber}
            />

            <TouchableOpacity style={styles.fetchButton} onPress={fetchPlateData}>
              <Text style={styles.buttonText}>Fetch Plate</Text>
            </TouchableOpacity>

            <Text style={styles.statusTitle}>Select Status:</Text>
            <FlatList
              data={availableStatuses}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.statusItem,
                    selectedStatus.includes(item) ? styles.statusSelected : {},
                  ]}
                  onPress={() =>{ toggleStatus(item), console.log(item)}}
                >
                  <Text style={styles.statusText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />

            <TouchableOpacity style={styles.updateButton} onPress={updatePlateStatus}>
              <Text style={styles.buttonText}>Update Status</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  fetchButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusItem: {
    padding: 10,
    backgroundColor: '#F8F9FA',
    marginVertical: 5,
    borderRadius: 8,
    width: '100%',
    textAlign: 'center',
  },
  statusSelected: {
    backgroundColor: '#007BFF',
  },
  statusText: {
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
});
