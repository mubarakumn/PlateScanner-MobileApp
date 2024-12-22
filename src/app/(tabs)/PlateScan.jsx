import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { storage } from '../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
// import { visionEndPoint, visionKey } from '@env'



const visionKey = "5KMJR7QDFERFq4ynDAvo3fo7wH7xLFSyumJwzCp9l9nbpvgZf2TVJQQJ99ALACrIdLPXJ3w3AAAFACOGhHx3"
const visionEndPoint = "https://platescanner-ocr.cognitiveservices.azure.com/"

const PlateScan = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(true); // State to control camera visibility

  const cameraRef = useRef(null);
  const router = useRouter();


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  // Extract Plate Number From The Result
  const extractPlateNumber = (data) => {
    const alphaNumericPattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    let result = [];
    data.analyzeResult.readResults.forEach((page) => {
      page.lines.forEach((line) => {
        if (alphaNumericPattern.test(line.text)) {
          result.push(line.text);
        }
      });
    });
    return result[0]?.replace(/[-\s]/g, '');
  };

  //Recognizing Text Using Azure 
  const recognizeTextAzure = async (imageUrl) => {
    const key = visionKey; // Replace with your Azure Vision Key
    const endpoint = visionEndPoint; // Replace with your Azure Vision Endpoint
    const url = `${endpoint}/vision/v3.2/read/analyze`; // Adjust endpoint if needed
    console.log('Azure OCR URL:', url);

    const headers = {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json',
    };

    const body = {
      url: imageUrl, // Azure expects an image URL
    };

    try {
      // Step 1: Send image for processing
      const response = await axios.post(url, body, { headers });
      const operationLocation = response.headers['operation-location'];

      // console.log('Operation Location:', operationLocation);

      if (!operationLocation) {
        throw new Error('Operation Location not found in the response.');
      }

      // Step 2: Poll for results
      let result = null;
      while (!result || result.status === 'running' || result.status === 'notStarted') {
        // console.log('Polling Azure OCR results...');
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
        const pollResponse = await axios.get(operationLocation, { headers });
        result = pollResponse.data;
      }

      // Step 3: Check if OCR succeeded
      if (result.status === 'succeeded') {
        console.log('Azure OCR processing succeeded:', result);
        return extractPlateNumber(result);
      } else {
        throw new Error('Azure OCR processing failed.');
      }
    } catch (error) {
      console.error('Azure OCR Error:', error.response?.data || error.message || error);
      Alert.alert('OCR Error', error.message);
      return '';
    } finally {
      setLoading(false);
    }
  };


  // Uploading Image to firebase
  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${Date.now()}.jpg`);
      const snapshot = await uploadBytes(storageRef, blob);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      Alert.alert('Error uploading image:', error);
      throw error;
    }
  };

  const handleCameraStream = async () => {
    try {
      if (cameraRef.current) {
        const { uri } = await cameraRef.current.takePictureAsync({ quality: 1 });

        // Hide camera after taking the picture
        setCameraVisible(false); 

        const manipulatedUri = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1024 } }], {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        const uploadedUrl = await uploadImage(manipulatedUri.uri);
        if (uploadedUrl) {
          console.log("starting ocr");
          const plateNumber = await recognizeTextAzure(uploadedUrl);
          console.log(plateNumber, "result");

          if (plateNumber) {
            const num = plateNumber;
            // Navigate to details screen
            router.push({
              pathname: '/PlateDetailsScreen',
              params: { num },
            });
          } else {
            Alert.alert('Error', 'No plate number detected');
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during scanning.');
    } finally {
      setLoading(false);
    // Stop the camera after taking the picture
    cameraRef.current.stopPreview(); // Stops the camera preview
    }
  };

  if (hasPermission === null) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#000" /></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.errorContainer}><Text>No access to camera</Text></View>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{!loading ? "Welcome Officer" : "Waiting..."}</Text>
      {cameraVisible && (
      <CameraView ref={cameraRef} style={styles.camera}>
        <View style={styles.cameraOverlay}>
          <Text style={styles.cameraText}>{!loading ? "Align the plate within the box" : "Processing..."}</Text>
        </View>
      </CameraView>
     ) }
      {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}

      <TouchableOpacity style={styles.button} onPress={handleCameraStream}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'start',
    color: '#333',
  },
  camera: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cameraText: {
    color: '#FFF',
    fontSize: 18,
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
  },
  detailsContainer: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  detailsText: {
    color: '#FFF',
    fontSize: 16,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default PlateScan;