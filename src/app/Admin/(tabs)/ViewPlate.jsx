import { StyleSheet, Text, View, FlatList, ActivityIndicator, BackHandler, Modal, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ViewPlate() {
  const [plates, setPlates] = useState([]);  // To store the plate numbers
  const [loading, setLoading] = useState(true);  // To show a loading spinner
  const [error, setError] = useState(null);  // To handle errors
  const [selectedPlate, setSelectedPlate] = useState(null); // State to hold the selected plate details
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [refreshing, setRefreshing] = useState(false); // State to manage refresh control

  // Fetch plate numbers from backend when component mounts
  const fetchPlates = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get('https://plate-scanner-back-end.vercel.app/plate');  // Replace with your API endpoint
      if (response.data.success) {
        setPlates(response.data.data);  // Access the 'data' array
      } else {
        setError(response.data.message);
      }
      setLoading(false);  // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching plates:', error);  // Log error details
      setError('Failed to fetch plate numbers.');
      setLoading(false);  // Stop loading if there's an error
    }
  };

  useEffect(() => {
    fetchPlates();
  }, []);

  // Back button handler
  useEffect(() => {
    const backAction = () => {
      router.back();
      return true; // Prevent the default back button behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Cleanup the event listener when unmounted
  }, []);

  // Function to open the modal with plate details
  const handlePlateClick = (plate) => {
    setSelectedPlate(plate);
    setModalVisible(true);
  };

  // Function to refresh plate data
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    await fetchPlates(); // Fetch plates
    setRefreshing(false); // Set refreshing state to false
  };

  // Render a plate item
  const renderPlate = ({ item }) => (
    <TouchableOpacity style={styles.plateItem} onPress={() => handlePlateClick(item)}>
      <Text style={styles.plateText}>Plate Number: {item.PlateNumber}</Text>
      <Text style={styles.plateText}>Owner: {item.ownerName}</Text>
    </TouchableOpacity>
  );

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <View>
        <AntDesign name="reload1" size={24} color="white" />
        </View>
      </View>
    );
  }

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlate(null); // Reset selected plate when closing the modal
  };

  // Render the plate numbers using FlatList
  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Plate Numbers</Text>
      <FlatList
        data={plates}
        renderItem={renderPlate}
        keyExtractor={(item) => item._id}  // Use unique ID as key
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {/* Modal to display full plate details */}
      {selectedPlate && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Plate Details</Text>
              <Text style={styles.modalText}>Plate Number: {selectedPlate.PlateNumber}</Text>
              <Text style={styles.modalText}>Owner: {selectedPlate.ownerName}</Text>
              <Text style={styles.modalText}>Car Model: {selectedPlate.carModel}</Text>
              <Text style={styles.modalText}>Comments: {selectedPlate.Comment.join(', ')}</Text>
              <Text style={styles.modalText}>Status: {selectedPlate.Status.join(', ')}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
  plateItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  plateText: {
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
