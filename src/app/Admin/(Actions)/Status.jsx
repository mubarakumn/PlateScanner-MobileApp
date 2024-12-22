import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const UpdateStatusScreen = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [status, setStatus] = useState('');
  const [details, setDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPlateData = async () => {
    if (!plateNumber.trim()) {
      Alert.alert('Error', 'Plate number cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://plate-scanner-back-end.vercel.app/plate/${plateNumber}`
      );
      const plate = response.data.data;

      if (plate) {
        setDetails(plate.Status || []);
        Alert.alert('Success', `Status retrieved for plate: ${plateNumber}`);
        setModalVisible(false); // Close modal only on success
      } else {
        Alert.alert('Error', 'Plate not found.');
      }
    } catch (error) {
      console.error('Error fetching plate:', error);
      Alert.alert('try Again!', 'Failed to retrieve plate data.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (statusAction) => {
    if (!status.trim()) {
      Alert.alert('Error', 'Status cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://plate-scanner-back-end.vercel.app/plate/${plateNumber}/${status}?action=${statusAction}`
      );
      Alert.alert('Success', response.data.message);
      fetchPlateData();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#4CAF50" />}
      { modalVisible && !details ? (
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Plate Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Plate Number"
                  value={plateNumber}
                  onChangeText={setPlateNumber}
                />
                <View style={{display: 'flex', flexDirection: 'row', gap:10}}>
                  <TouchableOpacity
                    style={[styles.button, styles.closeButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.fetchButton]}
                    onPress={fetchPlateData}
                  >
                    <Text style={styles.buttonText}>Fetch Status</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          !details && <View style={styles.closedModalContainer}>
            <Text style={styles.closedModalMessage}>
              Please enter a plate number to continue.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Enter Plate Number</Text>
            </TouchableOpacity>
          </View>
        )
      }
       {details && (
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>Plate Details</Text>
          <Text>Plate Number: {plateNumber}</Text>
          <Text>
            Current Statuses: {Array.isArray(details) && details.length > 0
              ? details.join(', ')
              : 'None'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter status (e.g., traffic, stolen)"
            value={status}
            onChangeText={setStatus}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.removeButton]}
              onPress={() => updateStatus('remove')}
            >
              <Text style={styles.buttonText}>Remove Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={() => updateStatus('add')}
            >
              <Text style={styles.buttonText}>Add Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '80%',
    borderRadius: 5,
  },
  detailsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  fetchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20220230',
    width: '45%',
  },
  addButton: {
    backgroundColor: '#007BFF',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closedModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedModalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
});

export default UpdateStatusScreen;
