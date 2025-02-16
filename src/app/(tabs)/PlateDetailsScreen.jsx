import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import PopupModal from '../Components/PopupModal';
import MessageModal from '../Components/MessageModal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const PlateDetailsScreen = () => {
  const { num } = useLocalSearchParams(); // Access passed plate details
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchedPlateDetails, setFetchedPlateDetails] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false); // For comments modal
  const [number ,setNumber] = useState('')


  // Fetching Plate Details from Database
  const fetchPlateDetails = async (plateNum) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://plate-scanner-back-end.vercel.app/plate/${plateNum}`);
      if (response.status === 200) {
        setFetchedPlateDetails(response.data);
        setComments(response.data.data.Comment || []);
      } else {
        Alert.alert('Error', 'Plate Number not found');
      }
    } catch (error) {
      console.error('Error fetching plate details:', error.message);
      Alert.alert('Error', 'Could not fetch plate details');
    } finally {
      setLoading(false);
    }
  };

  // Check if num is valid and fetch details
  useEffect(() => {
    if (num) {
      fetchPlateDetails(num);
    } else {
      setModalVisible(true); // Open modal if num is not defined
    }
  }, []);

  // Get plate number From Input
  const handleSendPlateNumber = (plateNumber) => {
    // Close the modal and fetch details with the new plate number
    setNumber(plateNumber);
    fetchPlateDetails(plateNumber);
  };
  
  const numb = num || number
  // Handling Actions to Update Status
  const handleAction = async (actionType) => {
    setActionLoading(true);
    let apiUrl = '';
    switch (actionType) {
      case 'traffic':
        apiUrl = `https://plate-scanner-back-end.vercel.app/plate/${numb}/traffic?action=add`;
        break;
      case 'stolen':
        apiUrl = `https://plate-scanner-back-end.vercel.app/plate/${numb}/stolen?action=add`;
        break;
      case 'crime':
        apiUrl = `https://plate-scanner-back-end.vercel.app/plate/${numb}/crime?action=add`;
        break;
      case 'wanted':
        apiUrl = `https://plate-scanner-back-end.vercel.app/plate/${numb}/wanted?action=add`;
        break;
      case 'flagged':
        apiUrl = `https://plate-scanner-back-end.vercel.app/plate/${numb}/flagged?action=add`;
        break;
      default:
        Alert.alert('Unknown Action', 'No action selected');
        return;
    }

    try {
      const response = await axios.post(apiUrl);
      if (response.status === 200) {
        Alert.alert('Action Successful', response.data.message);
      } else {
        Alert.alert('Error', "Couldn't update status");
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', "Failled to update status");
    } finally {
      setActionLoading(false); // Re-enable actions after request completes
    }
  };

  // Function to show a custom alert message based on the already existing status
  const handleAlreadyAdded = (status) => {
    let message = '';

    switch (status) {
      case 'traffic':
        message = 'Traffic violation is already reported for this vehicle. Please contact admin if you need to update it.';
        break;
      case 'stolen':
        message = 'This vehicle is already reported as stolen. Please contact admin for further details.';
        break;
      case 'crime':
        message = 'This vehicle is already linked to a crime. Please contact admin for more information.';
        break;
      case 'wanted':
        message = 'This vehicle is already marked as wanted. Please contact admin for further action.';
        break;
      case 'flagged':
        message = 'This vehicle is already flagged for investigation. Please contact admin if necessary.';
        break;
      default:
        message = 'This action has already been taken. Please contact admin for further assistance.';
    }

    Alert.alert('Action Already Taken', message);
  };

// Handling Commenting on plate number
const handleAddComment = async () => {
  if (newComment.trim() !== '') {
      try {
          const response = await axios.post(
              `https://plate-scanner-back-end.vercel.app/plate/comments/${numb}`,
              {
                  Comment: newComment,
                  action: 'add', // Action can be 'add' or 'remove'
              }
          );
          console.log(response);
          if (response.status === 200) {
              Alert.alert('Success', 'Comment added successfully');
              setComments([...comments, newComment]);
              setNewComment(''); // Clear the input field
          }
      } catch (error) {
        console.log(error.response);
          console.log('Errors:', error.response?.data || error.message);
          Alert.alert('Error', error.response?.data?.message || 'Could not add comment');
      }
  } else {
      Alert.alert('Warning', 'Comment cannot be empty');
  }
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
        <Text style={styles.header}>Plate Details</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <View style={styles.detailsContainer}>
            {fetchedPlateDetails ? (
              <>
                <Text style={styles.detailsText}>Owner: {fetchedPlateDetails.data.ownerName || 'N/A'}</Text>
                <Text style={styles.detailsText}>Phone no: {fetchedPlateDetails.data.phone || 'N/A'}</Text>
                <Text style={styles.detailsText}>vehicleType: {fetchedPlateDetails.data.vehicleType || 'N/A'}</Text>
                <Text style={styles.detailsText}>Brand: {fetchedPlateDetails.data.brand || 'N/A'}</Text>
                <Text style={styles.detailsText}>Chassis no: {fetchedPlateDetails.data.chassis || 'N/A'}</Text>
                <Text style={styles.detailsText}>Color: {fetchedPlateDetails.data.color || 'N/A'}</Text>
                <Text style={styles.detailsText}>
                  Registration Date: {fetchedPlateDetails.data.createdAt ? 
                    new Date(fetchedPlateDetails.data.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      // hour: '2-digit',
                      // minute: '2-digit',
                      // hour12: true,
                    }) : 'N/A'}
                  </Text>
                <View style={styles.statusWrapper}>
                  <Text style={styles.status}>Status: </Text>
                  {fetchedPlateDetails.data.Status ? (
                    fetchedPlateDetails.data.Status.map((stat, index) => (
                      <View
                        key={index}
                        style={{
                          marginTop: 5,
                          marginRight: 5,
                          width: 10,
                          height: 10,
                          borderRadius: 50,
                          backgroundColor:
                            stat === "crime" ? "black" :
                              stat === "stolen" ? "purple" :
                                stat === "wanted" ? "red" :
                                  stat === "flagged" ? "orange" :
                                    stat === "traffic" ? "yellow" : "white",
                        }}
                      />
                    ))
                  ) : (
                    <View>
                      <Text>Clear</Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.detailsText}>No details available.</Text>
                <Text style={styles.detailsText}>{`You can comment for additional details: ${num}`}</Text>
              </>
            )}
          </View>
        )}

        <Text style={styles.header}>Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() =>
              fetchedPlateDetails?.data.Status?.includes('traffic')
                ? handleAlreadyAdded('traffic')
                : handleAction('traffic')}
            style={styles.actionButton}
            disabled={actionLoading}
          >
            <MaterialIcons name="traffic" size={24} color="yellow" />
            <Text style={styles.actionText}>Traffic Violation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              fetchedPlateDetails?.data.Status?.includes('stolen')
                ? handleAlreadyAdded('stolen')
                : handleAction('stolen')}
            style={styles.actionButton}
            disabled={actionLoading}
          >
            <FontAwesome5 name="car-crash" size={24} color="purple" />
            <Text style={styles.actionText}>Stolen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              fetchedPlateDetails?.data.Status?.includes('crime')
                ? handleAlreadyAdded('crime')
                : handleAction('crime')}
            style={styles.actionButton}
            disabled={actionLoading}
          >
            <FontAwesome6 name="gun" size={24} color="black" />
            <Text style={styles.actionText}>Crime</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              fetchedPlateDetails?.data.Status?.includes('wanted')
              ? handleAlreadyAdded('wanted')
              : handleAction('wanted')}
            style={styles.actionButton}
            disabled={actionLoading}
          >

            <MaterialIcons name="theater-comedy" size={24} color="red" />
            <Text style={styles.actionText}>Wanted</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              fetchedPlateDetails?.data.Status?.includes('flagged')
                ? handleAlreadyAdded('flagged')
                : handleAction('flagged')}
            style={styles.actionButton}
            disabled={actionLoading}
          >
            <AntDesign name="warning" size={24} color="orange" />
            <Text style={styles.actionText}>Flag</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}
            disabled={actionLoading}
          >
            <FontAwesome6 name="pen-to-square" size={24} color="black" />
            <Text style={styles.actionText}>Get Plate Details</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>Comments</Text>
        <View style={styles.commentSection}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
            <Text style={styles.addCommentText}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginBottom: 20,}}>
          <Text >{`Comments About the Plate Number`}</Text>

          {/*  Button to View Comments in a Modal */}
        <TouchableOpacity onPress={() => setCommentsModalVisible(true)} style={styles.viewCommentsButton}>
          <Text style={styles.viewCommentsButtonText}>View Comments</Text>
        </TouchableOpacity>

          {/* Comments Modal */}
          <MessageModal
          visible={commentsModalVisible}
          title={"Comments"}
          comment={comments}
          close={()=> setCommentsModalVisible(false)}
          />
        </View>

        {/* Popup Modal for Invalid Plate Numbers */}
        <PopupModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          sendPlateNumber={handleSendPlateNumber} // Pass the function to handle plate number
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  detailsContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  detailsText: {
    color:"#FFF",
    fontSize: 16,
    marginVertical: 4,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    width: '48%', // Flex for 2 buttons per line
    alignItems: 'center',
    borderColor: '#007BFF',
  },
  actionText: {
    color: '#007BFF',
    fontSize: 16,
  },
  commentSection: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom:10,
    alignItems: 'center',
  },
  comment: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
  },
  addCommentText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addCommentButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems:"center",
  },
  commentText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
  },
  comments: {
    marginBottom: 30,
  },
  viewCommentsButton: {
    width:150,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  viewCommentsButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default PlateDetailsScreen;
