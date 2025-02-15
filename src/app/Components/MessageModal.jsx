import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function MessageModal({ visible, comment, title, message, close, expiry }) {
  const isExpired = expiry && new Date(expiry) < new Date();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {
            comment && comment.length > 0 ? (
              <FlatList
                data={comment}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.commentText}>{item}</Text>}
              />
            ) : (
              <Text style={styles.modalMessage}>{message}</Text>
            )
          }
          {
            !isExpired && (
              <TouchableOpacity
                onPress={close}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  commentText: {
    padding: 10,
    backgroundColor: '#EEE',
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#20220230',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default MessageModal;