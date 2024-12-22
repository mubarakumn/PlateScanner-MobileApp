import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import axios from 'axios';

export default function Comments() {
  const [plateNumber, setPlateNumber] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [promptVisible, setPromptVisible] = useState(true);
  const [newComment, setNewComment] = useState('');

  // Fetch plate data and comments
  const fetchPlateData = async () => {
    if (!plateNumber.trim()) {
      Alert.alert('Error', 'Plate number cannot be empty.');
      return;
    }

    try {
      const response = await axios.get(
        `https://plate-scanner-back-end.vercel.app/plate/${plateNumber}`
      );
      const plate = response.data.data;
      if (plate) {
        setCommentList(plate.Comment || []);
        Alert.alert('Success', `Comments retrieved for plate: ${plateNumber}`);
      } else {
        Alert.alert('Error', 'Plate not found.');
      }
    } catch (error) {
      console.error('Error fetching plate:', error);
      Alert.alert('Error', 'Failed to retrieve plate data.');
    } finally {
      setPromptVisible(false); // Close the prompt after fetching data
    }
  };

  // Add a new comment
  const addComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(
        `https://plate-scanner-back-end.vercel.app/plate/comments/${plateNumber}`,
        {
           Comment: newComment.trim(),
           action: 'add'
         }
      );

      if (response.status === 200) {
        setCommentList((prev) => [...prev, newComment.trim()]);
        setNewComment('');
        Alert.alert('Success', 'Comment added successfully!');
      } else {
        Alert.alert('Error', 'Failed to add comment.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment.');
    }
  };

  // Remove a comment
  const removeComment = async (commentToRemove) => {
    try {
      const response = await axios.post(
        `https://plate-scanner-back-end.vercel.app/plate/comments/${plateNumber}`,
        {
          Comment: commentToRemove,
          action: 'remove',
        }
      );

      if (response.status === 200) {
        setCommentList((prev) =>
          prev.filter((comment) => comment !== commentToRemove)
        );
        Alert.alert('Success', 'Comment removed successfully!');
      } else {
        Alert.alert('Error', 'Failed to remove comment.');
      }
    } catch (error) {
      console.error('Error removing comment:', error);
      Alert.alert('Error', 'Failed to remove comment.');
    }
  };

  // Render the page
  return (
    <View style={styles.container}>
      <Modal visible={promptVisible} transparent={true} animationType="slide">
        <View style={styles.promptContainer}>
          <View style={styles.promptContent}>
            <Text style={styles.promptTitle}>Enter Plate Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Plate Number"
              value={plateNumber}
              onChangeText={setPlateNumber}
            />
            <View style={{display: 'flex', flexDirection: 'row', gap:10}}>
            <TouchableOpacity style={styles.closeButton} onPress={()=>setPromptVisible(false)} >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>  
            <TouchableOpacity style={styles.fetchButton} onPress={fetchPlateData}>
              <Text style={styles.buttonText}>Fetch Comments</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {!promptVisible && !plateNumber? (
        <View style={styles.container}>
          {plateNumber ? (
            <Text style={styles.commentTitle}>Plate Number: {plateNumber}</Text>
          ) : (
            <Text style={styles.errorText}>No Plate Number Entered</Text>
          )}
          <TouchableOpacity style={styles.addButton} onPress={()=> setPromptVisible(true)}>
            <Text style={styles.buttonText}>Enter plate Number</Text>
          </TouchableOpacity>
        </View>
      ) : (
      <View style={styles.container}>
        <Text style={styles.commentTitle}>Comments for Plate: {plateNumber}</Text>
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
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  promptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  promptContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  closeButton:{
    backgroundColor: '#20220230',
    padding: 10,
    borderRadius: 8,
  },
  fetchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  commentItem: {
    padding: 10,
    backgroundColor: '#F8F9FA',
    marginVertical: 5,
    borderRadius: 8,
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
});
