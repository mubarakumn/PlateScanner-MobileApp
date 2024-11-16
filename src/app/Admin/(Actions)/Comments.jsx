import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

export default function Comments() {
  const [plateNumber, setPlateNumber] = useState('');  // To store input plate number
  const [commentList, setCommentList] = useState([]);  // List of comments
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');  // To store the new comment

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
        setCommentList(plate.Comment || []);  // Set the current comments
        Alert.alert('Success', `Comments retrieved for plate: ${plateNumber}`);
      } else {
        Alert.alert('Error', 'Plate not found.');
      }
    } catch (error) {
      console.error('Error fetching plate:', error);
      Alert.alert('Error', 'Failed to retrieve plate data.');
    }
  };

  // Function to add a new comment
  const addComment = () => {
    if (newComment.trim()) {
      setCommentList([...commentList, newComment.trim()]);  // Add the new comment to the list
      setNewComment('');  // Clear the input field
    }
  };

  // Function to remove a comment from the list
  const removeComment = (commentToRemove) => {
    setCommentList(commentList.filter((comment) => comment !== commentToRemove));
  };

  // Function to update comments on the backend
  const updatePlateComments = async () => {
    try {
      const response = await axios.put(`http://192.168.43.153:5000/plate/${plateNumber}/update-comments`, {
        Comment: commentList,  // Send the updated comments array
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Comments updated successfully!');
        setModalVisible(false);  // Close the modal after successful update
      } else {
        Alert.alert('Error', 'Failed to update comments.');
      }
    } catch (error) {
      console.error('Error updating comments:', error);
      Alert.alert('Error', 'Failed to update comments.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Update Comments</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Plate Comments</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Plate Number"
              value={plateNumber}
              onChangeText={setPlateNumber}
            />

            <TouchableOpacity style={styles.fetchButton} onPress={fetchPlateData}>
              <Text style={styles.buttonText}>Fetch Plate</Text>
            </TouchableOpacity>

            <Text style={styles.commentTitle}>Comments:</Text>
            <FlatList
              data={commentList}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeComment(item)}>
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

            <TextInput
              style={styles.input}
              placeholder="Add new comment"
              value={newComment}
              onChangeText={setNewComment}
            />

            <TouchableOpacity style={styles.addButton} onPress={addComment}>
              <Text style={styles.buttonText}>Add Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.updateButton} onPress={updatePlateComments}>
              <Text style={styles.buttonText}>Update Comments</Text>
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
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentItem: {
    padding: 10,
    backgroundColor: '#F8F9FA',
    marginVertical: 5,
    borderRadius: 8,
    width: '100%',
    textAlign: 'center',
  },
  commentText: {
    fontSize: 16,
  },
  removeButton: {
    color: 'red',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
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
