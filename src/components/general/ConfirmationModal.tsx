import React from "react";
import { Modal, View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";

const ConfirmationModal = ({ visible, onClose, onConfirm, messageType }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {/* <Text style={styles.modalText}>Voulez-vous vraiment supprimer cet animal ?</Text> */}
        <Text style={styles.modalText}>{messageType}</Text>
        <Text style={styles.modalInfo}>Cette action est définitive</Text>
        <View style={styles.btnChoice}>
        <TouchableOpacity
              onPress={onConfirm}
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonTextYes}>
                OUI
              </Text>
        </TouchableOpacity>
        <TouchableOpacity
              onPress={onClose}
              style={styles.buttonsPicker}
            >
              <Text style={styles.buttonTextNo}>
                NON
              </Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)", // demi-transparent
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 3,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      // elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontFamily: "WixMadeforDisplay-Bold",
      fontSize: 20
    },
    modalInfo: {
      marginBottom: 15,
      textAlign: "center",
      fontFamily: "WixMadeforDisplay-Bold",
      fontSize: 20
    },
    logo: {
      width: 200,
      height: 200,
      marginRight: 10,
    },
    buttonsPicker: {
      backgroundColor: "transparent",
      padding: 15,
      borderRadius: 3,
    },
    buttonText: {
      padding: 2,
      color: "white",
      fontFamily: "WixMadeforDisplay-Bold",
      fontSize: 15
    },
    buttonTextYes: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      color: "white",
      fontFamily: "WixMadeforDisplay-Bold",
      fontSize: 15,
      backgroundColor: 'red'
    },
    buttonTextNo: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      color: "white",
      fontFamily: "WixMadeforDisplay-Bold",
      fontSize: 15,
      backgroundColor: 'green'
    },
    btnChoice: {
      flexDirection: 'row',
      columnGap: 30
    }
  });

export default ConfirmationModal;
